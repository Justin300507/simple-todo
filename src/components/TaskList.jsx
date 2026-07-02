import React from 'react';
import TaskCard from './TaskCard';
import { ListTodo } from 'lucide-react';

const TaskList = ({ tasks, onEdit, onDelete, onToggleStatus, loading }) => {
  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-24 bg-slate-200 dark:bg-slate-700 rounded-xl" />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500 dark:text-slate-400">
        <ListTodo size={48} className="mx-auto mb-4" />
        <p className="text-lg font-medium">No tasks found.</p>
        <p className="text-sm">Try adjusting your filters or adding a new task.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
        />
      ))}
    </div>
  );
};

export default TaskList;
