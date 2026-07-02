import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';
import { parseError, sleep } from '../utils/authHelpers';
import Input from '../components/Input';
import Button from '../components/Button';

const RegisterPage = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [displayName, setDisplayName] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [status, setStatus] = React.useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      setLoading(false);
      return;
    }

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        setStatus(attempt === 1 ? 'Creating account...' : `Backend starting up... retrying (${attempt}/3)`);
        // Step 1: create account
        await API.post('/auth/register', { email, hashed_password: password, display_name: displayName });

        // Step 2: immediately log in
        const loginRes = await API.post('/auth/login', { email, password });
        localStorage.setItem('token', loginRes.data.access_token);
        if (loginRes.data.display_name) localStorage.setItem('display_name', loginRes.data.display_name);
        if (loginRes.data.user_id) localStorage.setItem('user_id', String(loginRes.data.user_id));
        if (loginRes.data.email) localStorage.setItem('user_email', loginRes.data.email);
        navigate('/dashboard');
        return;
      } catch (err) {
        const msg = parseError(err);
        if (msg) { setError(msg); setLoading(false); return; }
        if (attempt < 3) { setStatus(`Backend starting up... retrying in 15s (${attempt}/3)`); await sleep(15000); }
      }
    }
    setError('Backend took too long. Wait 30 seconds then try again.');
    setLoading(false);
    setStatus('');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 mx-auto mb-3 flex items-center justify-center">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Join AppName</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Create your account to get started</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Display Name"
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Jane Doe"
              required
            />
            <Input
              label="Email"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
            <Input
              label="Password"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              hint="Must be at least 8 characters"
            />
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            {status && <p className="text-indigo-600 text-sm text-center">{status}</p>}
            <Button type="submit" loading={loading} disabled={loading || !email || !password || !displayName} className="w-full justify-center">
              Sign Up
            </Button>
          </form>
        </div>
        <p className="text-center text-sm text-slate-500 mt-4">
          Already have an account? <Link to="/login" className="text-indigo-600 font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
