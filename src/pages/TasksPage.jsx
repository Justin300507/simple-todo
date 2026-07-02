import React from 'react';
import { Plus, Search, ListTodo } from 'lucide-react';
import API from '../api';
import TaskList from '../components/TaskList';
import Button from '../components/Button';
import Input from '../components/Input';
import FilterDropdown from '../components/FilterDropdown';
import Modal from '../components/Modal';
import TaskForm from '../components/TaskForm';
import Pagination from '../components/Pagination';
import { parseError } from '../utils/authHelpers';

const TasksPage = () => {
  const [tasks, setTasks] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('all');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState(null);
  const [formLoading, setFormLoading] = React.useState(false);
  const [toast, setToast] = React.useState(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const tasksPerPage = 10;

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const toastColorClass = toast && toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600';

  const fetchTasks = React.useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page: currentPage,
        limit: tasksPerPage,
      };
      if (searchTerm) {
        params.search = searchTerm;
      }
      if (filterStatus !== 'all') {
        params.status = filterStatus;
      }
      const res = await API.get('/tasks', { params });
      setTasks(res.data.items || []);
      setTotalPages(Math.ceil(res.data.total / tasksPerPage));
    } catch (err) {
      setError(parseError(err) || 'Failed to fetch tasks.');
      showToast(parseError(err) || 'Failed to fetch tasks.', 'error');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, filterStatus]);

  React.useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAddTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await API.delete(`/tasks/${id}`);
      showToast('Task deleted successfully!');
      fetchTasks();
    } catch (err) {
      showToast(parseError(err) || 'Failed to delete task.', 'error');
    }
  };

  const handleToggleStatus = async (id, newStatus) => {
    try {
      await API.patch(`/tasks/${id}/status`, { status: newStatus });
      showToast('Task status updated successfully!');
      fetchTasks();
    } catch (err) {
      showToast(parseError(err) || 'Failed to update task status.', 'error');
    }
  };

  const handleFormSubmit = async (formData) => {
    setFormLoading(true);
    try {
      if (editingTask) {
        await API.put(`/tasks/${editingTask.id}`, formData);
        showToast('Task updated successfully!');
      } else {
        await API.post('/tasks', formData);
        showToast('Task created successfully!');
      }
      setIsModalOpen(false);
      fetchTasks();
    } catch (err) {
      showToast(parseError(err) || 'Failed to save task.', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const statusOptions = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Completed', value: 'completed' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Tasks</h1>
        <Button onClick={handleAddTask}>
          <Plus size={16} /> Add Task
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          id="search"
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search tasks by title or description..."
          className="flex-1"
          icon={<Search size={18} className="text-slate-400" />}
        />
        <FilterDropdown
          options={statusOptions}
          selected={filterStatus}
          onSelect={(value) => {
            setFilterStatus(value);
            setCurrentPage(1);
          }}
          label="Status"
        />
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <TaskList
        tasks={tasks}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
        onToggleStatus={handleToggleStatus}
        loading={loading}
      />

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTask ? 'Edit Task' : 'Create New Task'}
      >
        <TaskForm
          initialData={editingTask}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
          loading={formLoading}
        />
      </Modal>

      {toast && (
        <div className={`fixed bottom-4 right-4 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white z-50 ${toastColorClass}`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
};

export default TasksPage;
