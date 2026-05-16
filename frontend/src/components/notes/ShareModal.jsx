import { useState } from 'react';
import { useShareNote, useUnshareNote } from '../../hooks/useShare';
import { Globe, Lock, Link, Copy, Check, X, Users, ChevronRight, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * Google Drive-style share modal with three visibility options:
 *  - Private   (default, only you)
 *  - Restricted (link works but not indexed — future use)
 *  - Public    (anyone with the link)
 */
const ShareModal = ({ note, onClose }) => {
  const shareNote = useShareNote(note.id);
  const unshareNote = useUnshareNote(note.id);
  const [copied, setCopied] = useState(false);

  const isPublic = !!note.share_id;
  const shareUrl = isPublic
    ? `${window.location.origin}/shared/${note.share_id}`
    : null;

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleMakePublic = async () => {
    await shareNote.mutateAsync();
    toast.success('Link created! Anyone with the link can view this note.');
  };

  const handleMakePrivate = async () => {
    await unshareNote.mutateAsync();
  };

  const handleCopyLink = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('Link copied!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenLink = () => {
    if (shareUrl) window.open(shareUrl, '_blank');
  };

  const isLoading = shareNote.isPending || unshareNote.isPending;

  // ── Visibility options ───────────────────────────────────────────────────────
  const visibilityOptions = [
    {
      id: 'private',
      icon: Lock,
      color: 'text-slate-500 dark:text-slate-400',
      bg: 'bg-slate-100 dark:bg-slate-800',
      label: 'Private',
      description: 'Only you can access this note',
      active: !isPublic,
      onClick: isPublic ? handleMakePrivate : null,
    },
    {
      id: 'public',
      icon: Globe,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
      label: 'Public',
      description: 'Anyone with the link can view',
      active: isPublic,
      onClick: !isPublic ? handleMakePublic : null,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-fade-in">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Share "{note.title || 'Untitled Note'}"
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-3">

          {/* Visibility options */}
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            General Access
          </p>

          {visibilityOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.id}
                onClick={option.onClick || undefined}
                disabled={isLoading || option.active}
                className={`w-full flex items-center gap-4 p-3.5 rounded-xl border-2 transition-all text-left
                  ${option.active
                    ? 'border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-500/10'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer'
                  } disabled:cursor-default`}
              >
                {/* Icon */}
                <div className={`w-10 h-10 rounded-full ${option.bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-5 h-5 ${option.color}`} />
                </div>

                {/* Label */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${
                    option.active
                      ? 'text-indigo-700 dark:text-indigo-300'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}>
                    {option.label}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {option.description}
                  </p>
                </div>

                {/* Active badge */}
                {option.active && (
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-500/20 px-2 py-0.5 rounded-full shrink-0">
                    Active
                  </span>
                )}

                {/* Switch indicator for inactive */}
                {!option.active && option.onClick && (
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>
            );
          })}

          {/* Loading state */}
          {isLoading && (
            <div className="text-center py-2">
              <p className="text-xs text-slate-400 animate-pulse">Updating access...</p>
            </div>
          )}

          {/* Share Link Section (only when public) */}
          {isPublic && shareUrl && (
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Share Link
              </p>
              <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <Link className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-xs text-slate-600 dark:text-slate-400 flex-1 truncate font-mono">
                  {shareUrl}
                </span>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={handleOpenLink}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    {copied ? (
                      <><Check className="w-3.5 h-3.5" /> Copied</>
                    ) : (
                      <><Copy className="w-3.5 h-3.5" /> Copy</>
                    )}
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                Anyone with this link can view (but not edit) this note.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold rounded-lg hover:bg-slate-700 dark:hover:bg-slate-100 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
