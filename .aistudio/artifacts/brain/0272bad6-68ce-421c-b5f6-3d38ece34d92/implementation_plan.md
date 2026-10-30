# Комплексный план оптимизации производительности (Google Lighthouse / PageSpeed Insights)

## 1. Обзор и целевые метрики

На основе аудита Google Lighthouse для веб-сайта агентства `agency.milkyboss.de` сформирован план устранения всех 4-х выявленных критических узких мест:
1. **LCP & Image Optimization**: Снижение веса главного графического ассета `/assets/milkyboss-emblem-transparent.png` (свыше 148–1090 КиБ в зависимости от сборки) до **~12–18 КиБ** с помощью форматов **AVIF** и **WebP**, генерация разрешений 1x (307x168px) и 2x Retina (614x336px), внедрение тега `<picture>` и `<link rel="preload" as="image" fetchpriority="high">` в `<head>`.
2. **Устранение блокирующих отрисовку ресурсов (Render-blocking resources, экономия ~1070 мс)**: Замена внешней цепочки Google Fonts на **локальные шрифты WOFF2** в директории `/public/assets/fonts/` с `font-display: swap`, инлайнинг Critical CSS для базового каркаса страницы и фонового градиента `#090a0f`.
3. **Ликвидация принудительного Reflow (Layout Thrashing)**: Рефакторинг чтения геометрии (`window.scrollY`, `getBoundingClientRect`, `offsetHeight`) в компонентах интерфейса (`Navbar.tsx`, скролл-триггеры, прелоадер) с пакетированием (batching) и переносом вычислений в `requestAnimationFrame` или CSS transforms.
4. **Разрыв цепочки критических запросов (Critical Request Chains, 1284 мс)**: Исключение цепочки `fonts.googleapis.com` -> `fonts.gstatic.com`. Отдача локальных шрифтов и критического логотипа из того же ориджина с параллельной предзагрузкой.

---

## 2. Архитектура визуальной стабильности и LCP (Largest Contentful Paint)

```
[Пользователь / Браузер]
         │
         ▼ 1. Первый HTTP-ответ (HTML Document)
┌─────────────────────────────────────────────────────────────────┐
│ <head>                                                          │
│  ├── <style id="critical-css"> (фоновый цвет, контейнеры, nav)  │
│  ├── <link rel="preload" href="...emblem-2x.avif" as="image"   │
│  │     type="image/avif" fetchpriority="high">                  │
│  └── <link rel="preload" href="...font-sans.woff2" as="font"    │
│        type="font/woff2" crossorigin>                           │
└─────────────────────────────────────────────────────────────────┘
         │
         ▼ 2. Мгновенная первая отрисовка (First Contentful Paint < 400ms)
┌─────────────────────────────────────────────────────────────────┐
│ <header class="nav-container">                                  │
│   <picture>                                                     │
│     <source type="image/avif" srcset="1x.avif 1x, 2x.avif 2x"> │
│     <source type="image/webp" srcset="1x.webp 1x, 2x.webp 2x"> │
│     <img src="1x.webp" width="307" height="168"                 │
│          alt="Milky BOSS Agency" fetchpriority="high"           │
│          loading="eager" decoding="async" />                    │
│   </picture>                                                    │
└─────────────────────────────────────────────────────────────────┘
         │ (Габариты 307x168px зарезервированы в CSS -> CLS = 0.000)
```

---

## 3. Ключевые архитектурные решения

### Решение 1: Генерация многоуровневого адаптивного набора изображений (AVIF + WebP)
* Исходный файл эмблемы с талисманом-чихуахуа и стрелами роста масштабируется и оптимизируется через библиотеку `sharp`:
  - `milkyboss-emblem-1x.avif` (307x168 px, quality: 80) — целевой вес ~8–12 КиБ.
  - `milkyboss-emblem-2x.avif` (614x336 px, quality: 82) — целевой вес ~18–25 КиБ (для дисплеев Retina).
  - `milkyboss-emblem-1x.webp` (307x168 px, quality: 82) — fallback для браузеров без AVIF.
  - `milkyboss-emblem-2x.webp` (614x336 px, quality: 84) — Retina fallback.
* В разметке компонента `MilkyBossLogo.tsx`:
  - Используется семантический тег `<picture>` с `<source>` для AVIF и WebP.
  - Атрибуты `width="307"` и `height="168"` жестко фиксируют пропорции контейнера во избежание сдвигов макета (Cumulative Layout Shift = 0).
  - Атрибуты `fetchpriority="high"`, `loading="eager"`, `decoding="async"`.
  - Запрещен `loading="lazy"` для LCP-элемента первого экрана.

### Решение 2: Локальные шрифты WOFF2 (Self-hosting) и ликвидация внешней цепочки
* Скачивание оптимизированных субсетов латиницы и кириллицы для шрифтов `Plus Jakarta Sans` (400, 500, 600, 700) и `Space Grotesk` (600, 700) в `/public/assets/fonts/`.
* Декларация `@font-face` в начале глобального CSS с директивой `font-display: swap`:
  ```css
  @font-face {
    font-family: 'Plus Jakarta Sans';
    font-style: normal;
    font-weight: 400 700;
    font-display: swap;
    src: url('/assets/fonts/plus-jakarta-sans.woff2') format('woff2');
  }
  ```
* Удаление внешних тегов `<link rel="stylesheet" href="https://fonts.googleapis.com/css2...">` из `index.html`.
* Добавление предзагрузки основного шрифта `<link rel="preload" href="/assets/fonts/plus-jakarta-sans.woff2" as="font" type="font/woff2" crossorigin>`.

### Решение 3: Инлайнинг Critical CSS и асинхронная загрузка некритических стилей
* В `index.html` инлайнится минимальный критический CSS для фонового градиента `#090a0f`, скелета навигационной панели и базовых сбросов (normalize), чтобы убрать блокировку отрисовки до того, как загрузится основной бандл.
* На сервере Nginx/Apache или хостинге (Netlify/Vercel/Node) настраиваются заголовки `Cache-Control: public, max-age=31536000, immutable` для статических хэшированных файлов и картинок.

### Решение 4: Предотвращение Layout Thrashing (Reflow) в JavaScript
* Анализ проблемных участков кода в компонентах (`Navbar.tsx`, хуки отслеживания прокрутки):
  - Причина проблемы в аудите: одновременное чередование операций `read` (например `window.scrollY`, `element.offsetHeight`) и `write` (например `element.style.transform = ...` или изменение состояния React, вызывающее ре-рендер DOM).
  - **Паттерн решения**:
    1. Изоляция чтения и записи: Сначала считываются все метрики, затем в рамках следующего тика `requestAnimationFrame` применяются стили или класс.
    2. Пассивные слушатели: `window.addEventListener('scroll', handleScroll, { passive: true })`.
    3. Использование `IntersectionObserver` вместо постоянного поллинга координат в цикле скролла.
    4. Анимации исключительно через свойства `transform` и `opacity` на GPU-слое (compositing only), без изменения `top`, `left`, `width`, `height`.

---

## 4. Пошаговый план внедрения

1. **Генерация оптимизированных ассетов (Node.js + Sharp)**:
   - Создать скрипт конвертации исходной эмблемы в 4 файла: `1x.avif`, `2x.avif`, `1x.webp`, `2x.webp` с точными размерами 307x168px и 614x336px.
   - Проверить артефакты в `/public/assets/`.

2. **Загрузка и настройка локальных WOFF2 шрифтов**:
   - Разместить `.woff2` файлы шрифтов в `/public/assets/fonts/`.
   - Заменить Google Fonts импорты на локальные `@font-face` в `src/index.css`.

3. **Оптимизация `index.html` (Head & Preloads)**:
   - Внедрить `<link rel="preload" href="/assets/milkyboss-emblem-2x.avif" as="image" type="image/avif" fetchpriority="high">`.
   - Внедрить `<link rel="preload" href="/assets/fonts/..." as="font" type="font/woff2" crossorigin>`.
   - Удалить блокирующие теги Google Fonts.
   - Добавить критические инлайн-стили для первоначального экрана.

4. **Рефакторинг `src/components/MilkyBossLogo.tsx`**:
   - Заменить обычный `<img>` на `<picture>` с поддержкой AVIF/WebP srcset, явными `width/height`, `fetchpriority="high"` и отсутствием `loading="lazy"`.

5. **Рефакторинг `src/components/Navbar.tsx` и слушателей скролла (Zero Reflow)**:
   - Обеспечить `{ passive: true }` для скролл-слушателей.
   - Батчить операции чтения координат через `requestAnimationFrame` или перевести переключение состояний хедера на легкие CSS-классы без прямого замера DOM-узлов.

6. **Конфигурация заголовков кеширования (Nginx / Netlify / Production)**:
   - Создать/обновить файл `public/_headers` (для Netlify) и подготовить блок конфигурации Nginx с правильным сжатием gzip/brotli и заголовками `immutable`.

7. **Верификация и тестирование**:
   - `lint_applet` и `compile_applet`.
   - Проверка ответов сервера через HTTP заголовки и размеры файлов (`curl -I`).
   - Финальная сводка с примерами "Было / Стало" для отчета.
