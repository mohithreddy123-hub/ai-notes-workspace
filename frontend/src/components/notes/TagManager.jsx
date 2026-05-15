import React, { useState } from 'react';
import { X, Plus, Trash2, Tag as TagIcon } from 'lucide-react';
import { useTags, useCreateTag, useDeleteTag } from '../../hooks/useNotes';
import { Skeleton } from '../ui/Feedback';
import Button from '../ui/Button';

const PRESET_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444',
  '#f97316', '#eab308', '#22c55e', '#14b8a6',
  '#3b82f6', '#64748b',
];

const TagManager = ({ onClose }) => {
  const { data: tags = [], isLoading } = useTags();
  const createTag = useCreateTag();
  const deleteTag = useDeleteTag();

  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('#6366f1');

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    await createTag.mutateAsync({ name: newName.trim(), color: newColor });
    setNewName('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <TagIcon className="w-5 h-5 text-brand-500" />
            <h3 className="text-lg font-display font-semibold text-slate-900 dark:text-white">
              Manage Tags
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Create new tag */}
        <form onSubmit={handleCreate} className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Create New Tag</p>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="Tag name..."
              maxLength={30}
              className="flex-1 px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:text-white placeholder:text-slate-400 transition-all"
            />
            <Button
              type="submit"
              variant="primary"
              size="sm"
              icon={Plus}
              isLoading={createTag.isPending}
              disabled={!newName.trim()}
            >
              Add
            </Button>
          </div>
          
          {/* Color picker */}
          <div className="mt-3 flex items-center gap-2">
            <p className="text-xs text-slate-400 mr-1">Color:</p>
            {PRESET_COLORS.map(color => (
              <button
                key={color}
                type="button"
                onClick={() => setNewColor(color)}
                className={`w-5 h-5 rounded-full transition-transform hover:scale-110 ${
                  newColor === color ? 'ring-2 ring-offset-1 ring-slate-400 dark:ring-slate-500 scale-110' : ''
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </form>

        {/* Tags list */}
        <div className="px-6 py-4 max-h-64 overflow-y-auto">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Existing Tags ({tags.length})
          </p>
          {isLoading ? (
            <div className="space-y-2">
              {[1,2,3].map(i => <Skeleton key={i} className="h-8" />)}
            </div>
          ) : tags.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">
              No tags yet. Create your first one above.
            </p>
          ) : (
            <div className="space-y-2">
              {tags.map(tag => (
                <div
                  key={tag.id}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 group"
                >
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: tag.color }}
                  />
                  <span className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                    {tag.name}
                  </span>
                  <span className="text-xs text-slate-400">
                    {tag.notes_count} notes
                  </span>
                  <button
                    onClick={() => deleteTag.mutate(tag.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TagManager;
