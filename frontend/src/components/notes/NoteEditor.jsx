import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNote, useUpdateNote, usePinNote, useArchiveNote, useDeleteNote } from '../../hooks/useNotes';
import { useAutoSave } from '../../hooks/useAutoSave';
import { Skeleton } from '../ui/Feedback';
import { 
  X, Pin, Archive, Trash2, Tag as TagIcon,
  CheckCircle2, Clock
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import TagSelector from './TagSelector';

const NoteEditor = ({ noteId, onClose, tags: allTags }) => {
  const { data: note, isLoading } = useNote(noteId);
  const updateNote = useUpdateNote();
  const pinNote = usePinNote();
  const archiveNote = useArchiveNote();
  const deleteNote = useDeleteNote();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showTagSelector, setShowTagSelector] = useState(false);
  const titleRef = useRef(null);

  // Sync from server data
  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
    }
  }, [note]); // Sync when note object changes

  // Auto-save title
  const saveTitle = useCallback(async (val) => {
    if (!note) return;
    await updateNote.mutateAsync({ id: note.id, data: { title: val } });
  }, [note, updateNote]);

  // Auto-save content
  const saveContent = useCallback(async (val) => {
    if (!note) return;
    await updateNote.mutateAsync({ id: note.id, data: { content: val } });
  }, [note, updateNote]);

  const { isSaving: isSavingTitle } = useAutoSave(title, saveTitle, 1500);
  const { isSaving: isSavingContent, lastSaved } = useAutoSave(content, saveContent, 1500);

  const isSaving = isSavingTitle || isSavingContent;

  const handleTagUpdate = async (tagIds) => {
    await updateNote.mutateAsync({ id: note.id, data: { tag_ids: tagIds } });
    setShowTagSelector(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this note? This cannot be undone.')) {
      await deleteNote.mutateAsync(note.id);
      onClose();
    }
  };

  const handleArchive = async () => {
    await archiveNote.mutateAsync(note.id);
    onClose();
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col p-8 max-w-4xl mx-auto w-full">
        <Skeleton className="h-10 w-3/4 mb-6" />
        <Skeleton className="h-4 w-full mb-3" />
        <Skeleton className="h-4 w-full mb-3" />
        <Skeleton className="h-4 w-2/3 mb-3" />
      </div>
    );
  }

  if (!note) return null;

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-slate-900 min-w-0">
      {/* Editor Toolbar */}
      <div className="flex items-center gap-2 px-4 md:px-6 py-3 border-b border-slate-200 dark:border-slate-800 shrink-0 bg-white dark:bg-slate-900 sticky top-0 z-10">
        {/* Back button (mobile) */}
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors md:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Save status */}
        <div className="flex items-center gap-2 text-xs text-slate-400 min-w-0">
          {isSaving ? (
            <>
              <Clock className="w-3.5 h-3.5 animate-pulse text-brand-400 shrink-0" />
              <span>Saving...</span>
            </>
          ) : lastSaved ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="truncate">Saved {formatDistanceToNow(lastSaved, { addSuffix: true })}</span>
            </>
          ) : null}
        </div>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-1">
          {/* Tag button */}
          <div className="relative">
            <button
              onClick={() => setShowTagSelector(!showTagSelector)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                showTagSelector 
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <TagIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tags</span>
              {note.tags?.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-brand-500 text-white text-xs flex items-center justify-center">
                  {note.tags.length}
                </span>
              )}
            </button>

            {showTagSelector && (
              <TagSelector
                allTags={allTags}
                selectedTagIds={(note.tags || []).map(t => t.id)}
                onSave={handleTagUpdate}
                onClose={() => setShowTagSelector(false)}
              />
            )}
          </div>

          {/* Pin */}
          <button
            onClick={() => pinNote.mutate(note.id)}
            className={`p-1.5 rounded-lg transition-colors ${
              note.is_pinned
                ? 'text-brand-600 bg-brand-50 dark:bg-brand-500/10'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={note.is_pinned ? 'Unpin' : 'Pin'}
          >
            <Pin className={`w-4 h-4 ${note.is_pinned ? 'fill-brand-500' : ''}`} />
          </button>

          {/* Archive */}
          <button
            onClick={handleArchive}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Archive"
          >
            <Archive className="w-4 h-4" />
          </button>

          {/* Delete */}
          <button
            onClick={handleDelete}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {/* Close (desktop) */}
          <button
            onClick={onClose}
            className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 md:px-10 py-8">
          {/* Tags display */}
          {note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {note.tags.map(tag => (
                <span
                  key={tag.id}
                  className="px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <textarea
            ref={titleRef}
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Note title..."
            className="w-full text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white bg-transparent border-none outline-none resize-none leading-tight placeholder:text-slate-300 dark:placeholder:text-slate-700 mb-6"
            rows={1}
            onInput={e => {
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
          />

          {/* Content */}
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Start writing your note..."
            className="w-full text-base text-slate-700 dark:text-slate-300 bg-transparent border-none outline-none resize-none leading-relaxed placeholder:text-slate-300 dark:placeholder:text-slate-700 min-h-[60vh]"
          />
        </div>
      </div>

      {/* Editor Footer */}
      <div className="px-4 md:px-6 py-2 border-t border-slate-100 dark:border-slate-800 shrink-0 flex items-center gap-4">
        <span className="text-xs text-slate-400">
          {note.word_count} words
        </span>
        <span className="text-xs text-slate-400">
          Created {format(new Date(note.created_at), 'MMM d, yyyy')}
        </span>
        <span className="text-xs text-slate-400 ml-auto">
          Updated {format(new Date(note.updated_at), 'MMM d, h:mm a')}
        </span>
      </div>
    </div>
  );
};

export default NoteEditor;
