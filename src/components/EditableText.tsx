import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Pencil, Check, RotateCcw, X } from 'lucide-react';
import { useCms } from '../context/CmsContext';
import { useFirebase } from '../context/FirebaseContext';
import { CMS_BOUNDS } from '../utils/cmsUtils';

interface EditableTextProps {
  contentKey: string;
  defaultValue: string;
  shared?: boolean;
  as?: 'span' | 'p' | 'div' | 'h1' | 'h2' | 'h3' | 'h4';
  multiline?: boolean;
  className?: string;
  label?: string;
}

export const EditableText: React.FC<EditableTextProps> = ({
  contentKey,
  defaultValue,
  shared = false,
  as = 'span',
  multiline,
  className = '',
  label,
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

  const currentValue = getText(contentKey, defaultValue, shared);
  const fullKey = resolveContentKey(contentKey, shared);
  const isOverridden = Object.prototype.hasOwnProperty.call(draftOverrides, fullKey);

  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(currentValue);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (isEditing) {
      setInputValue(currentValue);
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 20);
    }
  }, [isEditing, currentValue]);

  const canEdit = isAdmin && editMode;
  const useTextarea = multiline ?? (defaultValue.length > 75 || currentValue.includes('\n'));

  const handleTriggerEdit = (e: React.MouseEvent) => {
    if (!canEdit) return;
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleApply = () => {
    setOverrideValue(contentKey, inputValue.slice(0, CMS_BOUNDS.maxValueLength), shared);
    setIsEditing(false);
  };

  const handleReset = () => {
    resetOverrideValue(contentKey, shared);
    setIsEditing(false);
  };

  const Tag = as;

  const rendered = (
    <Tag
      onClick={canEdit ? handleTriggerEdit : undefined}
      title={canEdit ? `Редактировать: ${label || contentKey}` : undefined}
      className={`${className} ${
        canEdit
          ? `outline-1 outline-dashed ${
              isOverridden
                ? 'outline-amber-400/80 bg-amber-500/10'
                : 'outline-[#c81e32]/55 hover:outline-[#ff4d64] hover:bg-[#c81e32]/15'
            } rounded-sm px-0.5 cursor-text transition-all relative group/cms`
          : ''
      }`.trim()}
    >
      {currentValue}
      {canEdit && (
        <Pencil
          className="inline-block w-3 h-3 ml-1.5 text-[#ff5a6e] opacity-0 group-hover/cms:opacity-100 transition-opacity align-baseline"
          aria-hidden="true"
        />
      )}
    </Tag>
  );

  if (!isEditing) return rendered;

  return (
    <>
      {rendered}
      {createPortal(
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Редактирование текста"
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
                  Редактор текста
                </div>
                <div className="text-xs text-zinc-400 truncate max-w-sm mt-0.5">
                  {label || fullKey}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                aria-label="Закрыть редактор"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              {useTextarea ? (
                <textarea
                  ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                  rows={5}
                  maxLength={CMS_BOUNDS.maxValueLength}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setIsEditing(false);
                    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') handleApply();
                  }}
                  className="w-full rounded-lg bg-[#181c26] border border-white/15 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#c81e32] leading-relaxed"
                />
              ) : (
                <input
                  ref={inputRef as React.RefObject<HTMLInputElement>}
                  type="text"
                  maxLength={CMS_BOUNDS.maxValueLength}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setIsEditing(false);
                    if (e.key === 'Enter') handleApply();
                  }}
                  className="w-full rounded-lg bg-[#181c26] border border-white/15 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#c81e32]"
                />
              )}
              <div className="mt-1.5 flex items-center justify-between text-[11px] text-zinc-400">
                <span>{inputValue.length} / {CMS_BOUNDS.maxValueLength}</span>
                <span>{useTextarea ? 'Ctrl/Cmd + Enter — применить' : 'Enter — применить'}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
              {isOverridden ? (
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
