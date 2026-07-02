import React from 'react';
import { CheckSquare, Clock, Pencil, Trash2 } from 'lucide-react';
import Button from './Button';

const TaskCard = ({ task, onEdit, onDelete, onToggleStatus }) => {
  const statusClasses = {
    'pending': 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    'completed': 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    'in-progress': 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-3 flex-1">
        <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
          <CheckSquare className="text-indigo-600" size={18} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{task.title}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{task.description || 'No description'}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`badge ${statusClasses[task.status.toLowerCase()]}`}>{task.status}</span>
            {task.completed_at && (
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Clock size={12} /> Completed: {new Date(task.completed_at).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-3 sm:mt-0">
        <Button variant="ghost" onClick={() => onToggleStatus(task.id, task.status === 'completed' ? 'pending' : 'completed')} className="p-2">
          <CheckSquare size={18} />
        </Button>
        <Button variant="ghost" onClick={() => onEdit(task)} className="p-2">
          <Pencil size={18} />
        </Button>
        <Button variant="ghost" onClick={() => onDelete(task.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30">
          <Trash2 size={18} />
        </Button>
      </div>
    </div>
  );
};

export default TaskCard;
