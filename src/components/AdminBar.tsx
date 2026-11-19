import React from 'react';
import {
  Pencil,
  Save,
  Inbox,
  LogOut,
  RotateCcw,
  Loader2,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';
import { useCms } from '../context/CmsContext';

export const AdminBar: React.FC = () => {
  const { user, isAdmin, logout } = useFirebase();
  const {
    editMode,
    toggleEditMode,
    hasUnsavedChanges,
    dirtyCount,
    isSaving,
    saveError,
    saveSuccess,
    saveChanges,
    discardChanges,
    openAdminModal,
  } = useCms();

  if (!isAdmin || !user) return null;

  return (
    <div
      className="sticky top-0 z-[105] w-full bg-[#121622]/95 backdrop-blur-md border-b border-[#c81e32]/50 text-white shadow-lg"
      role="region"
      aria-label="Панель администратора"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-2.5">
        {/* Left: Admin Identity */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-md bg-[#c81e32]/20 border border-[#c81e32]/40 text-[#ff5a6e] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold tracking-wide text-white hidden sm:inline">
            Админ-панель
          </span>
          <span className="text-[11px] font-mono text-zinc-400 truncate max-w-[160px] sm:max-w-none">
            {user.email}
          </span>
          {editMode && (
            <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-semibold">
              Кликните текст или фото
            </span>
          )}
        </div>

        {/* Right: Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Edit Mode Toggle */}
          <button
            type="button"
            onClick={toggleEditMode}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer border ${
              editMode
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 hover:bg-emerald-500/30'
                : 'bg-white/5 text-zinc-200 border-white/15 hover:bg-white/10'
            }`}
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Режим редактирования: {editMode ? 'Вкл' : 'Выкл'}</span>
          </button>

          {/* Discard pending changes */}
          {hasUnsavedChanges && !isSaving && (
            <button
              type="button"
              onClick={discardChanges}
              title="Отменить несохраненные правки"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Сброс</span>
            </button>
          )}

          {/* Save Changes Button */}
          <button
            type="button"
            onClick={saveChanges}
            disabled={!hasUnsavedChanges || isSaving}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              saveSuccess
                ? 'bg-emerald-600 text-white'
                : hasUnsavedChanges
                ? 'bg-[#c81e32] hover:bg-[#b01829] text-white shadow-md shadow-[#c81e32]/30'
                : 'bg-white/5 text-zinc-400 border border-white/10 cursor-not-allowed'
            }`}
          >
            {isSaving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : saveSuccess ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>
              {isSaving
                ? 'Сохранение...'
                : saveSuccess
                ? 'Сохранено'
                : `Сохранить изменения${dirtyCount > 0 ? ` (${dirtyCount})` : ''}`}
            </span>
          </button>

          {/* Leads Tab Trigger */}
          <button
            type="button"
            onClick={() => openAdminModal('leads')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-colors cursor-pointer"
          >
            <Inbox className="w-3.5 h-3.5 text-[#ff5a6e]" />
            <span>Заявки</span>
          </button>

          {/* Logout */}
          <button
            type="button"
            onClick={logout}
            aria-label="Выйти из админ-панели"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Выйти</span>
          </button>
        </div>
      </div>

      {saveError && (
        <div className="bg-red-950/90 border-t border-red-500/40 px-4 py-1.5 text-center text-xs text-red-200">
          Ошибка сохранения: {saveError}
        </div>
      )}
    </div>
  );
};
