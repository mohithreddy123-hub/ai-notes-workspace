import React from 'react';

const NotesList = () => {
  return (
    <div className="p-6 h-full">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
          Notes
        </h1>
        <button className="btn-primary">
          New Note
        </button>
      </div>
      <div className="glass-card p-12 rounded-2xl text-center">
        <p className="text-slate-500 dark:text-slate-400">
          Notes Workspace will be fully implemented in Phase 2.
        </p>
      </div>
    </div>
  );
};

export default NotesList;
