import React, { useState } from 'react';
import { Pin, Archive, Trash2, MoreHorizontal, RotateCcw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useRestoreNote } from '../../hooks/useNotes';

const NoteCard = ({ note, isActive, onClick, onPin, onArchive, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const restoreNote = useRestoreNote();

  const handleAction = (e, action) => {
    e.stopPropagation();
    setMenuOpen(false);
    action();
  };

  const isArchived = note.status === 'archived';

  return (
    <div
      onClick={onClick}
      className={`
        group relative px-4 py-3.5 cursor-pointer transition-all duration-150
        ${isActive
          ? 'bg-brand-50 dark:bg-brand-500/10 border-r-2 border-brand-500'
          : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
        }
      `}
    >
      {/* Pin indicator */}
      {note.is_pinned && (
        <div className="absolute top-2 right-8">
          <Pin className="w-3 h-3 text-brand-400 fill-brand-400" />
        </div>
      )}

      <div className="pr-6">
        {/* Title */}
        <h3 className={`text-sm font-semibold truncate mb-1 ${
          isActive ? 'text-brand-700 dark:text-brand-400' : 'text-slate-800 dark:text-slate-200'
        }`}>
          {note.title || 'Untitled Note'}
        </h3>

        {/* Excerpt */}
        {note.excerpt && (
          <p className="text-xs text-slate-500 dark:text-slate-500 line-clamp-2 mb-2 leading-relaxed">
            {note.excerpt}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400 dark:text-slate-600">
            {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true })}
          </span>

          {/* Tags */}
          {note.tags && note.tags.slice(0, 2).map(tag => (
            <span
              key={tag.id}
              className="px-1.5 py-0.5 rounded text-xs font-medium"
              style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
            >
              {tag.name}
            </span>
          ))}
          {note.tags && note.tags.length > 2 && (
            <span className="text-xs text-slate-400">+{note.tags.length - 2}</span>
          )}

          {/* Word count */}
          {note.word_count > 0 && (
            <span className="text-xs text-slate-400 ml-auto">{note.word_count}w</span>
          )}
        </div>
      </div>

      {/* 3-dot context menu */}
      <div
        className="absolute top-3 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 transition-colors"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-20 animate-fade-in">
              {!isArchived ? (
                <>
                  <button
                    onClick={e => handleAction(e, onPin)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <Pin className="w-4 h-4" />
                    {note.is_pinned ? 'Unpin' : 'Pin'}
                  </button>
                  <button
                    onClick={e => handleAction(e, onArchive)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <Archive className="w-4 h-4" />
                    Archive
                  </button>
                </>
              ) : (
                <button
                  onClick={e => handleAction(e, () => restoreNote.mutate(note.id))}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Restore
                </button>
              )}
              <hr className="my-1 border-slate-100 dark:border-slate-700" />
              <button
                onClick={e => handleAction(e, onDelete)}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NoteCard;
