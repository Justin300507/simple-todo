import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ListTodo, User, Star } from 'lucide-react';
import Header from './Header';

const Layout = ({ children }) => {
  const [dark, setDark] = React.useState(false);

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  const navClass = ({ isActive }) =>
    isActive
      ? 'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-indigo-600 text-white'
      : 'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-slate-400 hover:bg-slate-800 hover:text-white';

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Sidebar */}
      <aside className="w-56 bg-slate-900 text-slate-200 flex flex-col px-3 py-4 fixed h-full">
        <div className="flex items-center gap-2 px-2 mb-6">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
            <span className="text-white text-sm font-bold">A</span>
          </div>
          <span className="font-bold text-white text-sm">ForgeTasks</span>
        </div>
        <nav className="flex-1 space-y-0.5">
          <NavLink to="/dashboard" className={navClass}>
            <LayoutDashboard size={16} /> Dashboard
          </NavLink>
          <NavLink to="/tasks" className={navClass}>
            <ListTodo size={16} /> Tasks
          </NavLink>
          <NavLink to="/profile" className={navClass}>
            <User size={16} /> Profile
          </NavLink>
        </nav>
      </aside>
      {/* Main */}
      <main className="ml-56 flex-1 overflow-auto">
        <Header dark={dark} setDark={setDark} />
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
