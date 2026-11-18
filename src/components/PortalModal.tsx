import React, { useEffect, useState } from 'react';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  X,
  LogIn,
  LogOut,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Archive,
  Trash2,
  FileText,
  Save,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';
import { useLanguage } from '../context/LanguageContext';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { InquiryStatus, ProjectInquiryRecord } from '../types';
import { clampAdminNote } from '../utils/inquiryValidation';

interface PortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewInquiry: () => void;
}

const STATUS_ORDER: InquiryStatus[] = ['new', 'in_review', 'contacted', 'archived'];

export const PortalModal: React.FC<PortalModalProps> = ({
  isOpen,
  onClose,
  onNewInquiry,
}) => {
  const { user, authReady, isAdmin, authError, isSigningIn, signInWithGoogle, logout } =
    useFirebase();
  const { dict, language } = useLanguage();
  const p = dict.portal;

  const [inquiries, setInquiries] = useState<ProjectInquiryRecord[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<'all' | InquiryStatus>('all');
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [portalError, setPortalError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !authReady || !user) {
      setInquiries([]);
      setLoadingInquiries(false);
      return;
    }

    setLoadingInquiries(true);
    setPortalError(null);

    const inquiriesRef = collection(db, 'inquiries');
    const q = isAdmin
      ? query(inquiriesRef, orderBy('createdAt', 'desc'))
      : query(inquiriesRef, where('userId', '==', user.uid));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const rows: ProjectInquiryRecord[] = snapshot.docs.map((d) => {
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
            status: STATUS_ORDER.includes(data.status) ? data.status : 'new',
            userId: String(data.userId ?? ''),
            adminNote: String(data.adminNote ?? ''),
            createdAt: data.createdAt ?? null,
            updatedAt: data.updatedAt ?? null,
          };
        });

        rows.sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
        setInquiries(rows);
        setLoadingInquiries(false);
      },
      (error) => {
        setLoadingInquiries(false);
        setPortalError(error.message);
        handleFirestoreError(error, OperationType.LIST, 'inquiries');
      }
    );

    return () => unsubscribe();
  }, [isOpen, authReady, user, isAdmin]);

  if (!isOpen) return null;

  const formatTimestamp = (ts?: { seconds: number } | null) => {
    if (!ts?.seconds) return language === 'de' ? 'Gerade eben' : 'Just now';
    return new Date(ts.seconds * 1000).toLocaleDateString(
      language === 'de' ? 'de-DE' : 'en-US',
      { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }
    );
  };

  const getStatusBadge = (status: InquiryStatus) => {
    const labels: Record<InquiryStatus, string> = {
      new: p.status_new,
      in_review: p.status_in_review,
      contacted: p.status_contacted,
      archived: p.status_archived,
    };
    const styles: Record<InquiryStatus, string> = {
      new: 'bg-[#c81e32]/15 text-[#ff5a6e] border-[#c81e32]/40',
      in_review: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
      contacted: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
      archived: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30',
    };
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${styles[status]}`}
      >
        {status === 'new' && <Clock className="w-3 h-3" />}
        {status === 'in_review' && <FileText className="w-3 h-3" />}
        {status === 'contacted' && <CheckCircle2 className="w-3 h-3" />}
        {status === 'archived' && <Archive className="w-3 h-3" />}
        {labels[status]}
      </span>
    );
  };

  const handleStatusChange = async (inquiryId: string, nextStatus: InquiryStatus) => {
    setActionError(null);
    setSavingId(inquiryId);
    try {
      await updateDoc(doc(db, 'inquiries', inquiryId), {
        status: nextStatus,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      setActionError(p.update_error);
      handleFirestoreError(error, OperationType.UPDATE, `inquiries/${inquiryId}`);
    } finally {
      setSavingId(null);
    }
  };

  const handleSaveNote = async (inquiry: ProjectInquiryRecord) => {
    setActionError(null);
    setSavingId(inquiry.id);
    const note = clampAdminNote(editingNotes[inquiry.id] ?? inquiry.adminNote);
    try {
      await updateDoc(doc(db, 'inquiries', inquiry.id), {
        adminNote: note,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      setActionError(p.update_error);
      handleFirestoreError(error, OperationType.UPDATE, `inquiries/${inquiry.id}`);
    } finally {
      setSavingId(null);
    }
  };

  const handleDeleteInquiry = async (inquiryId: string) => {
    setActionError(null);
    setSavingId(inquiryId);
    try {
      await deleteDoc(doc(db, 'inquiries', inquiryId));
      setConfirmDeleteId(null);
    } catch (error) {
      setActionError(p.update_error);
      handleFirestoreError(error, OperationType.DELETE, `inquiries/${inquiryId}`);
    } finally {
      setSavingId(null);
    }
  };

  const filteredInquiries =
    statusFilter === 'all'
      ? inquiries
      : inquiries.filter((item) => item.status === statusFilter);

  return (
    <div
      className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label={p.title}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-4xl max-h-[88vh] flex flex-col rounded-2xl bg-[#0e1118] border border-white/10 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-[#121621]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#c81e32]/15 text-[#c81e32] flex items-center justify-center border border-[#c81e32]/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display text-white">{p.title}</h2>
              <p className="text-xs text-zinc-400">
                {isAdmin ? p.admin_subtitle : p.client_subtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={p.close_label}
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
                  {p.login_heading}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {p.login_desc}
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
                <span>{p.google_signin_btn}</span>
              </button>
            </div>
          ) : (
            <>
              {/* Account Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#141824] border border-white/10">
                <div className="flex items-center gap-3 min-w-0">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-10 h-10 rounded-full border border-white/20 object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#c81e32]/20 text-white font-bold flex items-center justify-center text-sm">
                      {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white truncate">
                        {user.displayName || 'Client'}
                      </span>
                      {isAdmin && (
                        <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded bg-[#c81e32] text-white">
                          Admin
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-zinc-400 truncate">{user.email}</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{p.logout_btn}</span>
                </button>
              </div>

              {/* Filter Bar (Admin & Client) */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  {(['all', ...STATUS_ORDER] as const).map((statusKey) => {
                    const labelMap: Record<'all' | InquiryStatus, string> = {
                      all: p.filter_all,
                      new: p.status_new,
                      in_review: p.status_in_review,
                      contacted: p.status_contacted,
                      archived: p.status_archived,
                    };
                    const active = statusFilter === statusKey;
                    return (
                      <button
                        key={statusKey}
                        type="button"
                        onClick={() => setStatusFilter(statusKey)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
                          active
                            ? 'bg-[#c81e32] text-white border-[#c81e32]'
                            : 'bg-[#141824] text-zinc-300 border-white/10 hover:border-white/25'
                        }`}
                      >
                        {labelMap[statusKey]}
                      </button>
                    );
                  })}
                </div>

                <div className="text-xs text-zinc-400">
                  {filteredInquiries.length} {p.inquiries_count}
                </div>
              </div>

              {(actionError || portalError) && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-300">
                  {actionError || portalError}
                </div>
              )}

              {/* Inquiries List */}
              {loadingInquiries ? (
                <div className="py-12 flex items-center justify-center gap-2 text-sm text-zinc-400">
                  <Loader2 className="w-4 h-4 animate-spin text-[#c81e32]" />
                  <span>{p.loading_inquiries}</span>
                </div>
              ) : filteredInquiries.length === 0 ? (
                <div className="py-12 text-center rounded-xl border border-dashed border-white/10 bg-[#12151f] px-6 space-y-4">
                  <p className="text-sm text-zinc-400">{p.empty_inquiries}</p>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onNewInquiry();
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs uppercase tracking-wider font-semibold text-white bg-[#c81e32] hover:bg-[#b01829] transition-colors cursor-pointer"
                  >
                    <span>{p.create_inquiry_cta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredInquiries.map((inquiry) => {
                    const noteValue =
                      editingNotes[inquiry.id] !== undefined
                        ? editingNotes[inquiry.id]
                        : inquiry.adminNote;
                    const noteDirty =
                      editingNotes[inquiry.id] !== undefined &&
                      editingNotes[inquiry.id] !== inquiry.adminNote;

                    return (
                      <div
                        key={inquiry.id}
                        className="rounded-xl border border-white/10 bg-[#131722] p-5 space-y-4"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2.5">
                              <h4 className="text-sm font-bold text-white">
                                {inquiry.requestedService}
                              </h4>
                              {getStatusBadge(inquiry.status)}
                            </div>
                            <div className="text-xs text-zinc-400 flex flex-wrap gap-x-3 gap-y-1">
                              <span>{inquiry.name}</span>
                              <span>·</span>
                              <span>{inquiry.email}</span>
                              {inquiry.company && (
                                <>
                                  <span>·</span>
                                  <span>{inquiry.company}</span>
                                </>
                              )}
                              <span>·</span>
                              <span>{formatTimestamp(inquiry.createdAt)}</span>
                            </div>
                          </div>

                          <div className="text-right text-xs text-zinc-300 space-y-0.5">
                            <div className="font-semibold text-white">{inquiry.budget}</div>
                            <div className="text-zinc-400">{inquiry.timeline}</div>
                          </div>
                        </div>

                        <p className="text-xs text-zinc-300 leading-relaxed bg-black/25 p-3.5 rounded-lg border border-white/5 whitespace-pre-line">
                          {inquiry.message}
                        </p>

                        {!isAdmin && inquiry.adminNote && (
                          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200">
                            <span className="font-semibold block mb-1">
                              {p.agency_note_label}
                            </span>
                            {inquiry.adminNote}
                          </div>
                        )}

                        {isAdmin && (
                          <div className="pt-3 border-t border-white/10 space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div className="flex items-center gap-2">
                                <label
                                  htmlFor={`status-${inquiry.id}`}
                                  className="text-xs text-zinc-400"
                                >
                                  Status:
                                </label>
                                <select
                                  id={`status-${inquiry.id}`}
                                  value={inquiry.status}
                                  disabled={savingId === inquiry.id}
                                  onChange={(e) =>
                                    handleStatusChange(
                                      inquiry.id,
                                      e.target.value as InquiryStatus
                                    )
                                  }
                                  className="bg-[#1b202f] border border-white/15 rounded-md px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#c81e32]"
                                >
                                  <option value="new">{p.status_new}</option>
                                  <option value="in_review">{p.status_in_review}</option>
                                  <option value="contacted">{p.status_contacted}</option>
                                  <option value="archived">{p.status_archived}</option>
                                </select>
                              </div>

                              {confirmDeleteId === inquiry.id ? (
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    disabled={savingId === inquiry.id}
                                    onClick={() => handleDeleteInquiry(inquiry.id)}
                                    className="px-2.5 py-1 rounded text-xs font-semibold bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                                  >
                                    {p.confirm_delete}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setConfirmDeleteId(null)}
                                    className="px-2.5 py-1 rounded text-xs text-zinc-300 bg-white/5 hover:bg-white/10 cursor-pointer"
                                  >
                                    {p.cancel_label}
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeleteId(inquiry.id)}
                                  aria-label={`Delete inquiry ${inquiry.name}`}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>{p.delete_label}</span>
                                </button>
                              )}
                            </div>

                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={noteValue}
                                onChange={(e) =>
                                  setEditingNotes((prev) => ({
                                    ...prev,
                                    [inquiry.id]: e.target.value,
                                  }))
                                }
                                placeholder={p.admin_note_placeholder}
                                maxLength={2000}
                                className="flex-1 bg-[#1b202f] border border-white/10 rounded-md px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#c81e32]"
                              />
                              <button
                                type="button"
                                disabled={!noteDirty || savingId === inquiry.id}
                                onClick={() => handleSaveNote(inquiry)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-white/10 hover:bg-[#c81e32] text-white transition-colors cursor-pointer disabled:opacity-40"
                              >
                                <Save className="w-3.5 h-3.5" />
                                <span>{p.save_note}</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
