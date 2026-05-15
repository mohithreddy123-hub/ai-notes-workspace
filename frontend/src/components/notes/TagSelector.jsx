import React, { useState } from 'react';
import { Check } from 'lucide-react';

const TagSelector = ({ allTags, selectedTagIds, onSave, onClose }) => {
  const [selected, setSelected] = useState(new Set(selectedTagIds));

  const toggle = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <>
      <div className="fixed inset-0 z-20" onClick={onClose} />
      <div className="absolute right-0 top-full mt-2 w-60 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-30 overflow-hidden animate-fade-in">
        <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Select Tags</p>
        </div>

        <div className="max-h-52 overflow-y-auto py-1">
          {allTags.length === 0 ? (
            <p className="text-xs text-slate-400 px-3 py-4 text-center">
              No tags yet. Create some in the tag manager.
            </p>
          ) : (
            allTags.map(tag => (
              <button
                key={tag.id}
                onClick={() => toggle(tag.id)}
                className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: tag.color }}
                />
                <span className="flex-1 text-sm text-left text-slate-700 dark:text-slate-300">
                  {tag.name}
                </span>
                {selected.has(tag.id) && (
                  <Check className="w-4 h-4 text-brand-500 shrink-0" />
                )}
              </button>
            ))
          )}
        </div>

        <div className="px-3 py-2 border-t border-slate-100 dark:border-slate-700 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 text-xs py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave([...selected])}
            className="flex-1 text-xs py-1.5 rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </>
  );
};

export default TagSelector;
