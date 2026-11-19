import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Image as ImageIcon, Check, RotateCcw, X, AlertCircle } from 'lucide-react';
import { useCms } from '../context/CmsContext';
import { useFirebase } from '../context/FirebaseContext';
import { resolveAssetUrl } from '../utils/assets';
import { isValidImageUrlInput } from '../utils/cmsUtils';

interface EditableImageProps {
  contentKey: string;
  defaultSrc: string;
  alt: string;
  shared?: boolean;
  className?: string;
  wrapperClassName?: string;
  width?: number | string;
  height?: number | string;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
  decoding?: 'async' | 'sync' | 'auto';
  label?: string;
  children?: (effectiveSrc: string) => React.ReactNode;
}

export const EditableImage: React.FC<EditableImageProps> = ({
  contentKey,
  defaultSrc,
  alt,
  shared = true,
  className = '',
  wrapperClassName = '',
  width,
  height,
  loading = 'lazy',
  fetchPriority,
  decoding = 'async',
  label,
  children,
}) => {
  const { isAdmin } = useFirebase();
  const {
    editMode,
    getText,
    setOverrideValue,
    resetOverrideValue,
    draftOverrides,
    resolveContentKey,
  } = useCms();

  const fullKey = resolveContentKey(contentKey, shared);
  const overrideValue = getText(contentKey, '', shared);
  const hasOverride = Object.prototype.hasOwnProperty.call(draftOverrides, fullKey) && Boolean(overrideValue);
  const effectiveRawSrc = hasOverride ? overrideValue : defaultSrc;
  const resolvedSrc = resolveAssetUrl(effectiveRawSrc);

  const [isEditing, setIsEditing] = useState(false);
  const [urlInput, setUrlInput] = useState(effectiveRawSrc);
  const [urlError, setUrlError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditing) {
      setUrlInput(effectiveRawSrc);
      setUrlError(null);
    }
  }, [isEditing, effectiveRawSrc]);

  const canEdit = isAdmin && editMode;

  const handleOpenEditor = (e: React.MouseEvent) => {
    if (!canEdit) return;
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleApply = () => {
    const trimmed = urlInput.trim();
    if (!isValidImageUrlInput(trimmed)) {
      setUrlError('Введите корректный URL (https://... или /assets/...)');
      return;
    }
    setOverrideValue(contentKey, trimmed, shared);
    setIsEditing(false);
  };

  const handleReset = () => {
    resetOverrideValue(contentKey, shared);
    setIsEditing(false);
  };

  const imageNode =
    !hasOverride && children ? (
      children(resolvedSrc)
    ) : (
      <img
        src={resolvedSrc}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding={decoding}
        className={className}
      />
    );

  return (
    <>
      <div
        onClick={canEdit ? handleOpenEditor : undefined}
        className={`relative ${wrapperClassName} ${
          canEdit
            ? 'cursor-pointer ring-2 ring-dashed ring-[#c81e32]/75 hover:ring-[#ff4d64] rounded-lg group/cmsimg'
            : ''
        }`.trim()}
      >
        {imageNode}
        {canEdit && (
          <span className="absolute bottom-2 right-2 z-20 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#0e1118]/90 text-white border border-[#c81e32] shadow-lg opacity-90 group-hover/cmsimg:opacity-100 hover:bg-[#c81e32] transition-colors pointer-events-none">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>URL фото</span>
          </span>
        )}
      </div>

      {isEditing &&
        createPortal(
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label="Редактирование URL изображения"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsEditing(false);
            }}
          >
            <div
              className="w-full max-w-lg rounded-2xl bg-[#11141c] border border-[#c81e32]/50 shadow-2xl p-6 space-y-4 text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-[#ff5a6e]">
                    Изображение (URL)
                  </div>
                  <div className="text-xs text-zinc-400 truncate max-w-sm mt-0.5">
                    {label || alt || fullKey}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  aria-label="Закрыть редактор изображения"
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-medium text-zinc-300">
                  Новый URL изображения (https:// или /assets/...)
                </label>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => {
                    setUrlInput(e.target.value);
                    setUrlError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setIsEditing(false);
                    if (e.key === 'Enter') handleApply();
                  }}
                  placeholder="https://example.com/image.webp"
                  className="w-full rounded-lg bg-[#181c26] border border-white/15 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#c81e32]"
                  autoFocus
                />

                {urlError && (
                  <div className="flex items-center gap-1.5 text-xs text-red-400">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{urlError}</span>
                  </div>
                )}

                {isValidImageUrlInput(urlInput) && (
                  <div className="rounded-xl overflow-hidden border border-white/10 bg-black/40 h-40 flex items-center justify-center">
                    <img
                      src={resolveAssetUrl(urlInput.trim())}
                      alt="Предпросмотр"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                {hasOverride ? (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Сбросить</span>
                  </button>
                ) : (
                  <span />
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-3.5 py-2 rounded-lg text-xs font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 cursor-pointer"
                  >
                    Отмена
                  </button>
                  <button
                    type="button"
                    onClick={handleApply}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#c81e32] hover:bg-[#b01829] cursor-pointer shadow-lg shadow-[#c81e32]/25"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Применить</span>
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
