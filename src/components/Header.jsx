import React from 'react';
import { Sun, Moon, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = ({ dark, setDark }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    ['token', 'display_name', 'user_id', 'user_email'].forEach(k => localStorage.removeItem(k));
    navigate('/login');
  };

  const displayName = localStorage.getItem('display_name') || 'User';

  return (
    <header className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">
      <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Hello, {displayName}!</h1>
      <div className="flex items-center gap-3">
        <button onClick={() => setDark(d => !d)} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button onClick={handleLogout} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};

export default Header;
