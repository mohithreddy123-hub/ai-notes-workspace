import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePublicNote } from '../../hooks/useShare';
import { format } from 'date-fns';
import {
  FileText, Clock, Tag as TagIcon, Copy, Check,
  AlertCircle, Brain, ListChecks, User, Lock, ArrowLeft
} from 'lucide-react';

// ── Skeleton ────────────────────────────────────────────────────────────────
const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-slate-200 dark:bg-slate-700 rounded-lg ${className}`} />
);

// ── Main Shared Note Page ───────────────────────────────────────────────────
const SharedNotePage = () => {
  const { shareId } = useParams();
  const { data: note, isLoading, isError } = usePublicNote(shareId);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Loading ─────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 flex items-center gap-3">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-4 w-1/4 mb-8" />
          <Skeleton className="h-4 w-full mb-3" />
          <Skeleton className="h-4 w-full mb-3" />
          <Skeleton className="h-4 w-5/6 mb-3" />
          <Skeleton className="h-4 w-full mb-3" />
          <Skeleton className="h-4 w-3/4 mb-3" />
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Note Not Found</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
            This note is not publicly available. It may have been unpublished or the link is incorrect.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go to AI Notes
          </Link>
        </div>
      </div>
    );
  }

  // ── Success ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* SEO Meta would be set here in a proper SSR context */}

      {/* Top Bar */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link
            to="/login"
            className="flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          >
            <Brain className="w-5 h-5" />
            <span>AI Notes Workspace</span>
          </Link>

          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            {copied ? (
              <><Check className="w-4 h-4 text-emerald-500" /><span className="text-emerald-600 dark:text-emerald-400">Copied!</span></>
            ) : (
              <><Copy className="w-4 h-4" /><span>Copy Link</span></>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">

        {/* Tags */}
        {note.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {note.tags.map(tag => (
              <span
                key={tag.id}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border"
                style={{ color: tag.color, borderColor: `${tag.color}40`, backgroundColor: `${tag.color}15` }}
              >
                <TagIcon className="w-3 h-3" />
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight mb-6">
          {note.title || 'Untitled Note'}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-10 pb-8 border-b border-slate-200 dark:border-slate-800">
          <span className="flex items-center gap-1.5">
            <User className="w-4 h-4" />
            {note.author_name}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {format(new Date(note.updated_at), 'MMMM d, yyyy')}
          </span>
          <span className="flex items-center gap-1.5">
            <FileText className="w-4 h-4" />
            {note.word_count} words
          </span>
        </div>

        {/* AI Summary */}
        {note.ai_summary && (
          <div className="mb-8 p-5 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">AI Summary</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
              {note.ai_summary}
            </p>
          </div>
        )}

        {/* AI Action Items */}
        {note.ai_action_items?.length > 0 && (
          <div className="mb-8 p-5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl">
            <div className="flex items-center gap-2 mb-3">
              <ListChecks className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">Action Items</span>
            </div>
            <ul className="space-y-2">
              {note.ai_action_items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Note Content */}
        <div className="prose prose-slate dark:prose-invert max-w-none">
          {note.content ? (
            <div className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap text-base">
              {note.content}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 italic">
              <AlertCircle className="w-4 h-4" />
              <span>This note has no content.</span>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 mt-20 py-8">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-sm text-slate-400 dark:text-slate-500">
            Shared via{' '}
            <Link to="/login" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              AI Notes Workspace
            </Link>
            {' '}· Built for productivity
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SharedNotePage;
