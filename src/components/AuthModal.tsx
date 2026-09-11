import React, { useState } from 'react';
import { Shield, UserCheck, Key, Lock, LogOut } from 'lucide-react';
import { useAuth, UserRole } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { user, login, logout, switchRole } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const rolesList: { role: UserRole; title: string; desc: string }[] = [
    { role: 'SUPER_ADMIN', title: 'Super Admin', desc: 'Full system control & user management' },
    { role: 'CITY_ADMIN', title: 'City Admin', desc: 'Manage crossings, nodes & city policies' },
    { role: 'TRAFFIC_OPERATOR', title: 'Traffic Operator', desc: 'Live signal override & congestion control' },
    { role: 'EMERGENCY_OPERATOR', title: 'EMS Operator', desc: 'Emergency dispatches & corridor green wave' },
    { role: 'ANALYST', title: 'Traffic Analyst', desc: 'Analytics reporting & performance metrics' },
    { role: 'VIEWER', title: 'Viewer', desc: 'Read-only operational monitoring' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-slate-100">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-600/20 p-2.5 border border-indigo-500/30 text-indigo-400">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Role-Based Access Control</h3>
              <p className="text-xs text-slate-400">OmniCross Authentication & Permission Matrix</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Current User Status & Quick Role Switcher */}
        <div className="my-5 rounded-xl bg-slate-950/60 p-4 border border-slate-800/80">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400">Active Identity</div>
              <div className="font-bold text-white flex items-center gap-2">
                {user ? user.name : 'Unauthenticated'}
                {user && (
                  <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-[10px] font-semibold text-indigo-300 border border-indigo-500/30">
                    {user.role}
                  </span>
                )}
              </div>
            </div>
            {user && (
              <button
                onClick={logout}
                className="flex items-center gap-1.5 rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition-all border border-red-500/20"
              >
                <LogOut className="h-3.5 w-3.5" /> Logout
              </button>
            )}
          </div>

          <div className="mt-4">
            <label className="text-xs font-semibold text-slate-300">Quick Role Switcher (Simulator Mode):</label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {rolesList.map((item) => (
                <button
                  key={item.role}
                  onClick={() => switchRole(item.role)}
                  className={`flex flex-col text-left p-2.5 rounded-xl border transition-all ${
                    user?.role === item.role
                      ? 'border-indigo-500 bg-indigo-600/20 text-white'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <span className="text-xs font-bold flex items-center justify-between">
                    {item.title}
                    {user?.role === item.role && <UserCheck className="h-3.5 w-3.5 text-emerald-400" />}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-0.5">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Standard JWT Auth Login Form */}
        <form onSubmit={handleLogin} className="space-y-3 pt-2">
          <div className="text-xs font-bold text-slate-300 flex items-center gap-1">
            <Key className="h-3.5 w-3.5 text-indigo-400" /> Standard API Login (JWT)
          </div>

          {error && (
            <div className="rounded-lg bg-red-500/10 p-2.5 text-xs text-red-400 border border-red-500/20">
              {error}
            </div>
          )}

          <div>
            <input
              type="email"
              placeholder="operator@omnicross.city"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
          >
            <Lock className="h-3.5 w-3.5" />
            {loading ? 'Authenticating...' : 'Login with JWT Token'}
          </button>
        </form>
      </div>
    </div>
  );
};
