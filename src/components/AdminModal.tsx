import React, { useEffect, useMemo, useState } from 'react';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import {
  X,
  LogIn,
  LogOut,
  ShieldAlert,
  ShieldCheck,
  Download,
  Trash2,
  Pencil,
  Save,
  Search,
  Inbox,
  Loader2,
  RotateCcw,
} from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';
import { useCms } from '../context/CmsContext';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { LeadRecord, LeadStatus } from '../types';
import { exportLeadsToCsv, LEAD_STATUSES } from '../utils/cmsUtils';

export const AdminModal: React.FC = () => {
  const { user, authReady, isAdmin, authError, isSigningIn, signInWithGoogle, logout } =
    useFirebase();
  const {
    adminModalOpen,
    adminTab,
    setAdminTab,
    closeAdminModal,
    editMode,
    setEditMode,
    draftOverrides,
    resetOverrideValue,
    hasUnsavedChanges,
    dirtyCount,
    isSaving,
    saveError,
    saveChanges,
    discardChanges,
  } = useCms();

  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [loadingLeads, setLoadingLeads] = useState<boolean>(false);
  const [leadsError, setLeadsError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'Все' | LeadStatus>('Все');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [savingLeadId, setSavingLeadId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!adminModalOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAdminModal();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [adminModalOpen, closeAdminModal]);

  useEffect(() => {
    if (!adminModalOpen || !authReady || !isAdmin) {
      setLeads([]);
      setLoadingLeads(false);
      return;
    }

    setLoadingLeads(true);
    setLeadsError(null);

    const leadsRef = collection(db, 'leads');
    const q = query(leadsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: LeadRecord[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            requestedService: String(data.requestedService ?? ''),
            budget: String(data.budget ?? ''),
            timeline: String(data.timeline ?? ''),
            name: String(data.name ?? ''),
            email: String(data.email ?? ''),
            phone: String(data.phone ?? ''),
            company: String(data.company ?? ''),
            message: String(data.message ?? ''),
            crmInterest: Boolean(data.crmInterest),
            language: data.language === 'en' ? 'en' : 'de',
            status: LEAD_STATUSES.includes(data.status) ? data.status : 'Новая',
            userId: String(data.userId ?? ''),
            adminNote: String(data.adminNote ?? ''),
            createdAt: data.createdAt ?? null,
            updatedAt: data.updatedAt ?? null,
          };
        });
        items.sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
        setLeads(items);
        setLoadingLeads(false);
      },
      (error) => {
        setLoadingLeads(false);
        setLeadsError(error.message);
        try {
          handleFirestoreError(error, OperationType.LIST, 'leads');
        } catch {
          // Structured error logged
        }
      }
    );

    return () => unsubscribe();
  }, [adminModalOpen, authReady, isAdmin]);

  const filteredLeads = useMemo(() => {
    const qLower = searchQuery.trim().toLowerCase();
    return leads.filter((lead) => {
      if (statusFilter !== 'Все' && lead.status !== statusFilter) return false;
      if (!qLower) return true;
      return (
        lead.name.toLowerCase().includes(qLower) ||
        lead.email.toLowerCase().includes(qLower) ||
        lead.phone.toLowerCase().includes(qLower) ||
        lead.company.toLowerCase().includes(qLower) ||
        lead.message.toLowerCase().includes(qLower) ||
        lead.requestedService.toLowerCase().includes(qLower)
      );
    });
  }, [leads, statusFilter, searchQuery]);

  if (!adminModalOpen) return null;

  const formatTimestamp = (ts?: { seconds: number } | null) => {
    if (!ts?.seconds) return 'Только что';
    return new Date(ts.seconds * 1000).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleStatusChange = async (leadId: string, nextStatus: LeadStatus) => {
    setLeadsError(null);
    setSavingLeadId(leadId);
    try {
      await updateDoc(doc(db, 'leads', leadId), {
        status: nextStatus,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      setLeadsError(error instanceof Error ? error.message : 'Ошибка обновления статуса');
      try {
        handleFirestoreError(error, OperationType.UPDATE, `leads/${leadId}`);
      } catch {
        // Structured error logged
      }
    } finally {
      setSavingLeadId(null);
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    setLeadsError(null);
    setSavingLeadId(leadId);
    try {
      await deleteDoc(doc(db, 'leads', leadId));
      setConfirmDeleteId(null);
    } catch (error) {
      setLeadsError(error instanceof Error ? error.message : 'Ошибка удаления заявки');
      try {
        handleFirestoreError(error, OperationType.DELETE, `leads/${leadId}`);
      } catch {
        // Structured error logged
      }
    } finally {
      setSavingLeadId(null);
    }
  };

  const handleDownloadCsv = () => {
    const csv = exportLeadsToCsv(filteredLeads);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStamp = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `milkyboss-leads-${dateStamp}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const statusBadgeClass = (status: LeadStatus) => {
    switch (status) {
      case 'Новая':
        return 'bg-[#c81e32]/20 text-[#ff5a6e] border-[#c81e32]/40';
      case 'В работе':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Закрыта':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
  };

  return (
    <div
      className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Панель администратора Milky BOSS"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAdminModal();
      }}
    >
      <div className="relative w-full max-w-6xl max-h-[90vh] flex flex-col rounded-2xl bg-[#0e1118] border border-white/10 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#121621]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#c81e32]/15 text-[#c81e32] flex items-center justify-center border border-[#c81e32]/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display text-white">
                Панель администратора (#admin)
              </h2>
              <p className="text-xs text-zinc-400">
                Управление контентом сайта и учет заявок · доступ: teams@milkyboss.de
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeAdminModal}
            aria-label="Закрыть панель администратора"
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!user ? (
            <div className="py-10 max-w-md mx-auto text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-[#c81e32]/10 border border-[#c81e32]/30 text-[#c81e32] flex items-center justify-center mx-auto">
                <LogIn className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold font-display text-white">
                  Вход для администратора
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Войдите через Google. Редактирование сайта и доступ к заявкам открыты только для email{' '}
                  <span className="text-white font-mono">teams@milkyboss.de</span>.
                </p>
              </div>

              {authError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-300">
                  {authError}
                </div>
              )}

              <button
                type="button"
                onClick={signInWithGoogle}
                disabled={isSigningIn}
                className="w-full inline-flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-lg text-sm font-semibold text-white bg-[#c81e32] hover:bg-[#b01829] transition-colors cursor-pointer shadow-lg shadow-[#c81e32]/25 disabled:opacity-60"
              >
                {isSigningIn ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <LogIn className="w-4 h-4" />
                )}
                <span>Войти через Google</span>
              </button>
            </div>
          ) : !isAdmin ? (
            <div className="py-10 max-w-md mx-auto text-center space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold font-display text-white">
                  Доступ запрещён
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Вы вошли как <span className="text-white font-mono">{user.email}</span>.{' '}
                  Редактирование контента и просмотр заявок разрешены только для{' '}
                  <span className="text-white font-mono">teams@milkyboss.de</span>.
                </p>
              </div>
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/15 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Выйти и сменить аккаунт</span>
              </button>
            </div>
          ) : (
            <>
              {/* Admin Tabs Navigation */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAdminTab('leads')}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      adminTab === 'leads'
                        ? 'bg-[#c81e32] text-white shadow-sm'
                        : 'bg-white/5 text-zinc-300 hover:bg-white/10'
                    }`}
                  >
                    <Inbox className="w-4 h-4" />
                    <span>Заявки ({leads.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdminTab('editor')}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      adminTab === 'editor'
                        ? 'bg-[#c81e32] text-white shadow-sm'
                        : 'bg-white/5 text-zinc-300 hover:bg-white/10'
                    }`}
                  >
                    <Pencil className="w-4 h-4" />
                    <span>Визуальный редактор</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {adminTab === 'leads' && (
                    <button
                      type="button"
                      onClick={handleDownloadCsv}
                      disabled={filteredLeads.length === 0}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer disabled:opacity-40"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Скачать CSV</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={logout}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Выйти</span>
                  </button>
                </div>
              </div>

              {adminTab === 'leads' ? (
                <div className="space-y-4">
                  {/* Filters & Search */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {(['Все', ...LEAD_STATUSES] as const).map((statusKey) => (
                        <button
                          key={statusKey}
                          type="button"
                          onClick={() => setStatusFilter(statusKey)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                            statusFilter === statusKey
                              ? 'bg-[#c81e32] text-white border-[#c81e32]'
                              : 'bg-[#141824] text-zinc-300 border-white/10 hover:border-white/25'
                          }`}
                        >
                          {statusKey}
                        </button>
                      ))}
                    </div>

                    <div className="relative w-full sm:w-64">
                      <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Поиск по имени, email, тексту..."
                        className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#141824] border border-white/10 text-xs text-white focus:outline-none focus:border-[#c81e32]"
                      />
                    </div>
                  </div>

                  {leadsError && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-300">
                      {leadsError}
                    </div>
                  )}

                  {loadingLeads ? (
                    <div className="py-12 flex items-center justify-center gap-2 text-sm text-zinc-400">
                      <Loader2 className="w-4 h-4 animate-spin text-[#c81e32]" />
                      <span>Загрузка заявок...</span>
                    </div>
                  ) : filteredLeads.length === 0 ? (
                    <div className="py-12 text-center rounded-xl border border-dashed border-white/10 bg-[#12151f] text-sm text-zinc-400">
                      Заявки по выбранному фильтру отсутствуют.
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#12151f]">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-white/10 bg-white/[0.03] text-zinc-400 uppercase tracking-wider text-[11px]">
                            <th className="py-3 px-4">Дата</th>
                            <th className="py-3 px-4">Клиент / Контакты</th>
                            <th className="py-3 px-4">Услуга / Бюджет</th>
                            <th className="py-3 px-4">Сообщение</th>
                            <th className="py-3 px-4">Статус</th>
                            <th className="py-3 px-4 text-right">Удаление</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {filteredLeads.map((lead) => (
                            <tr key={lead.id} className="hover:bg-white/[0.02] align-top">
                              <td className="py-3.5 px-4 whitespace-nowrap text-zinc-400 font-mono text-[11px]">
                                {formatTimestamp(lead.createdAt)}
                              </td>
                              <td className="py-3.5 px-4 space-y-0.5 min-w-[180px]">
                                <div className="font-semibold text-white">{lead.name}</div>
                                <div className="text-zinc-300">{lead.email}</div>
                                {lead.phone && <div className="text-zinc-400">{lead.phone}</div>}
                                {lead.company && (
                                  <div className="text-zinc-400 italic">{lead.company}</div>
                                )}
                              </td>
                              <td className="py-3.5 px-4 space-y-0.5 min-w-[160px]">
                                <div className="text-zinc-200 font-medium">
                                  {lead.requestedService}
                                </div>
                                <div className="text-zinc-400">{lead.budget}</div>
                                <div className="text-zinc-400">{lead.timeline}</div>
                              </td>
                              <td className="py-3.5 px-4 max-w-xs text-zinc-300 leading-relaxed whitespace-pre-line">
                                {lead.message}
                              </td>
                              <td className="py-3.5 px-4 whitespace-nowrap">
                                <select
                                  aria-label={`Статус заявки ${lead.name}`}
                                  value={lead.status}
                                  disabled={savingLeadId === lead.id}
                                  onChange={(e) =>
                                    handleStatusChange(lead.id, e.target.value as LeadStatus)
                                  }
                                  className={`px-2.5 py-1.5 rounded-md border text-xs font-semibold bg-[#181c28] focus:outline-none ${statusBadgeClass(
                                    lead.status
                                  )}`}
                                >
                                  {LEAD_STATUSES.map((st) => (
                                    <option key={st} value={st} className="bg-[#181c28] text-white">
                                      {st}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                {confirmDeleteId === lead.id ? (
                                  <div className="inline-flex items-center gap-1.5">
                                    <button
                                      type="button"
                                      disabled={savingLeadId === lead.id}
                                      onClick={() => handleDeleteLead(lead.id)}
                                      className="px-2 py-1 rounded bg-red-600 hover:bg-red-700 text-white font-semibold cursor-pointer"
                                    >
                                      Удалить
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setConfirmDeleteId(null)}
                                      className="px-2 py-1 rounded bg-white/10 text-zinc-300 cursor-pointer"
                                    >
                                      Нет
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => setConfirmDeleteId(lead.id)}
                                    aria-label={`Удалить заявку ${lead.name}`}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Спам</span>
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="p-5 rounded-xl bg-[#131722] border border-white/10 flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-1 max-w-xl">
                      <h3 className="text-sm font-bold text-white">
                        Визуальный редактор контента на странице
                      </h3>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Включите режим редактирования, закройте это окно и кликайте по любым заголовкам, текстам, ценам, контактам или изображениям прямо на сайте. После правок нажмите «Сохранить изменения» в верхней панели.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditMode(!editMode);
                          if (!editMode) closeAdminModal();
                        }}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                          editMode
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-[#c81e32] hover:bg-[#b01829] text-white'
                        }`}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>
                          {editMode
                            ? 'Режим редактирования: Вкл (выкл.)'
                            : 'Включить режим редактирования и перейти на сайт'}
                        </span>
                      </button>

                      {hasUnsavedChanges && (
                        <button
                          type="button"
                          onClick={saveChanges}
                          disabled={isSaving}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Сохранить изменения ({dirtyCount})</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {saveError && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-300">
                      {saveError}
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        Сохранённые и изменённые поля ({Object.keys(draftOverrides).length})
                      </h4>
                      {hasUnsavedChanges && (
                        <button
                          type="button"
                          onClick={discardChanges}
                          className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-white cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Отменить несохранённые</span>
                        </button>
                      )}
                    </div>

                    {Object.keys(draftOverrides).length === 0 ? (
                      <div className="p-8 rounded-xl border border-dashed border-white/10 text-center text-xs text-zinc-400">
                        Пока нет переопределённых полей — используются стандартные тексты и изображения.
                      </div>
                    ) : (
                      <div className="divide-y divide-white/5 rounded-xl border border-white/10 bg-[#12151f]">
                        {Object.entries(draftOverrides).map(([k, val]) => (
                          <div
                            key={k}
                            className="p-3.5 flex items-start justify-between gap-4 text-xs"
                          >
                            <div className="min-w-0 space-y-1">
                              <div className="font-mono text-[#ff5a6e] truncate">{k}</div>
                              <div className="text-zinc-300 break-words line-clamp-2">{val}</div>
                            </div>
                            <button
                              type="button"
                              onClick={() => resetOverrideValue(k, true)}
                              className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white cursor-pointer"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Сбросить</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
