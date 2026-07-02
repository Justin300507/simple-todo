import React from 'react';
import { CheckSquare, Clock, Target, ListTodo } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import API from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import { parseError } from '../utils/authHelpers';

const DashboardPage = () => {
  const [summary, setSummary] = React.useState(null);
  const [recentTasks, setRecentTasks] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const summaryRes = await API.get('/stats/summary');
        setSummary(summaryRes.data);

        const tasksRes = await API.get('/tasks?limit=5&sort_by=created_at&sort_order=desc');
        setRecentTasks(tasksRes.data.items || []);
      } catch (err) {
        setError(parseError(err) || 'Failed to fetch dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const chartData = summary?.monthly_tasks_summary?.map(item => ({
    month: item.month,
    total: item.total_tasks,
  })) || [];

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
        <LoadingSpinner size={48} />
        <p className="text-slate-500 dark:text-slate-400 mt-4">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        <p className="text-lg font-medium">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{today}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Tasks</p>
            <div className="bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded-lg">
              <ListTodo size={18} className="text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{summary?.total_tasks || 0}</p>
          <p className="text-xs text-slate-500 mt-1">All tasks created</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Completed Tasks</p>
            <div className="bg-emerald-50 dark:bg-emerald-900/30 p-2 rounded-lg">
              <CheckSquare size={18} className="text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{summary?.completed_tasks || 0}</p>
          <p className="text-xs text-emerald-600 mt-1">{summary?.completion_rate ? `${summary.completion_rate}% completion` : 'No tasks completed'}</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Pending Tasks</p>
            <div className="bg-amber-50 dark:bg-amber-900/30 p-2 rounded-lg">
              <Clock size={18} className="text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{summary?.pending_tasks || 0}</p>
          <p className="text-xs text-amber-600 mt-1">Still in progress</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Tasks This Week</p>
            <div className="bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded-lg">
              <Target size={18} className="text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{summary?.tasks_this_week || 0}</p>
          <p className="text-xs text-indigo-600 mt-1">New tasks created</p>
        </div>
      </div>

      {/* Monthly Overview Chart */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-5">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Monthly Task Overview</h3>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#f1f5f9' }} />
            <Area type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={2} fill="url(#colorTotal)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Tasks */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-5">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Recent Tasks</h3>
        {recentTasks.length > 0 ? (
          <div className="space-y-3">
            {recentTasks.map(task => (
              <div key={task.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-md bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                    <CheckSquare className="text-indigo-600" size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{task.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(task.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`badge ${task.status === 'completed' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-slate-500 dark:text-slate-400">
            <p>No recent tasks.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
