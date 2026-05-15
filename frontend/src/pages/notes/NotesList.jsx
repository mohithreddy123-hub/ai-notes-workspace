import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Plus, Tag as TagIcon, Pin, Archive, X } from 'lucide-react';
import { useNotes, useTags, useCreateNote, useDeleteNote, useArchiveNote, usePinNote } from '../../hooks/useNotes';
import { useSearch } from '../../hooks/useAutoSave';
import { Skeleton, EmptyState } from '../../components/ui/Feedback';
import Button from '../../components/ui/Button';
import NoteCard from '../../components/notes/NoteCard';
import NoteEditor from '../../components/notes/NoteEditor';
import TagManager from '../../components/notes/TagManager';

const NotesList = () => {
  const [searchParams] = useSearchParams();
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isTagManagerOpen, setIsTagManagerOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState(searchParams.get('tag') || '');
  const [sortBy, setSortBy] = useState('-updated_at');
  const [showArchived, setShowArchived] = useState(false);

  const { query, setQuery, debouncedQuery } = useSearch(400);

  // Build query params for the API
  const noteParams = {
    ...(debouncedQuery && { search: debouncedQuery }),
    ...(selectedTag && { tags: selectedTag }),
    ...(showArchived && { status: 'archived' }),
    ordering: sortBy,
  };

  const { data: notes = [], isLoading } = useNotes(noteParams);
  const { data: tags = [] } = useTags();
  const createNote = useCreateNote();
  const deleteNote = useDeleteNote();
  const archiveNote = useArchiveNote();
  const pinNote = usePinNote();

  const handleCreateNote = async () => {
    const note = await createNote.mutateAsync({ title: '', content: '' });
    setActiveNoteId(note.id);
    setIsEditorOpen(true);
  };

  const handleOpenNote = (id) => {
    setActiveNoteId(id);
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setActiveNoteId(null);
  };

  const handleTagFilter = (tagId) => {
    if (selectedTag === tagId) {
      setSelectedTag('');
    } else {
      setSelectedTag(tagId);
    }
  };

  const pinnedNotes = notes.filter(n => n.is_pinned);
  const regularNotes = notes.filter(n => !n.is_pinned);

  return (
    <div className="flex h-full min-h-screen">
      {/* Notes Explorer Sidebar */}
      <div className={`
        flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800
        transition-all duration-300
        ${isEditorOpen ? 'w-0 overflow-hidden md:w-72 lg:w-80' : 'w-full md:w-72 lg:w-80'}
        shrink-0
      `}>
        {/* Explorer Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-display font-bold text-slate-900 dark:text-white">
              {showArchived ? 'Archived' : 'My Notes'}
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsTagManagerOpen(true)}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Manage Tags"
              >
                <TagIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowArchived(!showArchived)}
                className={`p-2 rounded-lg transition-colors ${
                  showArchived 
                    ? 'text-brand-600 bg-brand-50 dark:bg-brand-500/10' 
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title="Toggle Archived"
              >
                <Archive className="w-4 h-4" />
              </button>
              <Button
                variant="primary"
                size="sm"
                icon={Plus}
                isLoading={createNote.isPending}
                onClick={handleCreateNote}
              >
                New
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search notes..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:text-white placeholder:text-slate-400 transition-all"
            />
            {query && (
              <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-3 h-3 text-slate-400" />
              </button>
            )}
          </div>
        </div>

        {/* Tag Filters */}
        {tags.length > 0 && (
          <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 shrink-0">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Filter by tag</p>
            <div className="flex flex-wrap gap-1.5">
              {tags.map(tag => (
                <button
                  key={tag.id}
                  onClick={() => handleTagFilter(tag.id)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                    selectedTag === tag.id
                      ? 'text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                  style={selectedTag === tag.id ? { backgroundColor: tag.color } : {}}
                >
                  {tag.name}
                  {selectedTag === tag.id && (
                    <span className="ml-1 opacity-70">×</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sort Control */}
        <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="w-full text-xs bg-transparent text-slate-500 dark:text-slate-400 border-none outline-none cursor-pointer py-1"
          >
            <option value="-updated_at">Recently Updated</option>
            <option value="-created_at">Newest First</option>
            <option value="created_at">Oldest First</option>
            <option value="title">A → Z</option>
          </select>
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="space-y-2 p-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          ) : notes.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon={debouncedQuery ? Search : Plus}
                title={debouncedQuery ? 'No results found' : 'No notes yet'}
                description={debouncedQuery ? `No notes match "${debouncedQuery}"` : 'Create your first note to get started.'}
                actionLabel={!debouncedQuery ? 'Create Note' : undefined}
                onAction={!debouncedQuery ? handleCreateNote : undefined}
              />
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {/* Pinned section */}
              {pinnedNotes.length > 0 && (
                <>
                  <div className="px-4 py-2">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Pin className="w-3 h-3" /> Pinned
                    </p>
                  </div>
                  {pinnedNotes.map(note => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      isActive={activeNoteId === note.id}
                      onClick={() => handleOpenNote(note.id)}
                      onPin={() => pinNote.mutate(note.id)}
                      onArchive={() => archiveNote.mutate(note.id)}
                      onDelete={() => deleteNote.mutate(note.id)}
                    />
                  ))}
                  {regularNotes.length > 0 && (
                    <div className="px-4 py-2">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Other Notes</p>
                    </div>
                  )}
                </>
              )}

              {/* Regular notes */}
              {regularNotes.map(note => (
                <NoteCard
                  key={note.id}
                  note={note}
                  isActive={activeNoteId === note.id}
                  onClick={() => handleOpenNote(note.id)}
                  onPin={() => pinNote.mutate(note.id)}
                  onArchive={() => archiveNote.mutate(note.id)}
                  onDelete={() => deleteNote.mutate(note.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Note Editor Panel */}
      <div className={`
        flex-1 flex flex-col min-w-0 transition-all duration-300
        ${isEditorOpen ? 'block' : 'hidden md:flex items-center justify-center'}
      `}>
        {isEditorOpen && activeNoteId ? (
          <NoteEditor
            noteId={activeNoteId}
            onClose={handleCloseEditor}
            tags={tags}
          />
        ) : (
          <div className="hidden md:flex flex-col items-center justify-center h-full text-center p-12">
            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center mb-6 text-slate-300 dark:text-slate-600">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-display font-semibold text-slate-400 dark:text-slate-500 mb-2">
              Select a note to edit
            </h3>
            <p className="text-sm text-slate-400 dark:text-slate-600 mb-6 max-w-xs">
              Choose a note from the sidebar or create a new one to get started.
            </p>
            <Button variant="primary" icon={Plus} onClick={handleCreateNote} isLoading={createNote.isPending}>
              Create New Note
            </Button>
          </div>
        )}
      </div>

      {/* Tag Manager Modal */}
      {isTagManagerOpen && (
        <TagManager onClose={() => setIsTagManagerOpen(false)} />
      )}
    </div>
  );
};

export default NotesList;
