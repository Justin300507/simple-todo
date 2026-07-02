import React from 'react';
import Input from './Input';
import Button from './Button';
import { CheckSquare, X } from 'lucide-react';

const TaskForm = ({ initialData = {}, onSubmit, onCancel, loading }) => {
  const [title, setTitle] = React.useState(initialData.title || '');
  const [description, setDescription] = React.useState(initialData.description || '');
  const [status, setStatus] = React.useState(initialData.status || 'pending');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, description, status });
  };

  const isFormValid = title.trim() !== '';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Title"
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g. Launch Q3 marketing campaign"
        required
      />
      <div className="space-y-1">
        <label htmlFor="description" className="text-xs font-medium text-slate-700 dark:text-slate-300">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. Prepare slides, coordinate with sales team, finalize budget..."
          rows="4"
          className="input block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-indigo-500"
        ></textarea>
      </div>
      <div className="space-y-1">
        <label htmlFor="status" className="text-xs font-medium text-slate-700 dark:text-slate-300">Status</label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="input block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
          <X size={16} /> Cancel
        </Button>
        <Button type="submit" loading={loading} disabled={!isFormValid || loading}>
          <CheckSquare size={16} /> {initialData.id ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
