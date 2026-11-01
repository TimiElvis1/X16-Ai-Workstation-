import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (userData: { email: string; name: string; role: 'admin' | 'user' }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('admin@vox.network');
  const [password, setPassword] = useState<string>('••••••••••••');
  const [name, setName] = useState<string>('VOX Network Operator');
  const [role, setRole] = useState<'admin' | 'user'>('admin');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({
      email: email || 'operator@vox.network',
      name: name || (email.split('@')[0] || 'VOX User'),
      role
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-6 text-zinc-100 font-sans">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all border border-zinc-800"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 text-xs font-mono font-bold">
            <Lock className="h-3.5 w-3.5 text-cyan-400" />
            <span>VOX Network Security Portal</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {isSignUp ? 'Create VOX Account' : 'Sign In to VOX Network'}
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed font-mono">
            {isSignUp
              ? 'Join the VOX Network ecosystem to access decentralized tools, VOX AI, and hosted pages.'
              : 'Enter your credentials to access your VOX Network workspace and admin controls.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          {isSignUp && (
            <div className="space-y-1">
              <label className="text-zinc-400 font-bold block">Full Name</label>
              <div className="flex items-center space-x-2 bg-black border border-zinc-800 rounded-xl px-3 py-2.5">
                <User className="h-4 w-4 text-zinc-500 shrink-0" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Rivera"
                  className="flex-1 bg-transparent text-white focus:outline-none"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-zinc-400 font-bold block">Email Address</label>
            <div className="flex items-center space-x-2 bg-black border border-zinc-800 rounded-xl px-3 py-2.5">
              <Mail className="h-4 w-4 text-zinc-500 shrink-0" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@vox.network"
                className="flex-1 bg-transparent text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-zinc-400 font-bold block">Password</label>
            <div className="flex items-center space-x-2 bg-black border border-zinc-800 rounded-xl px-3 py-2.5">
              <Lock className="h-4 w-4 text-zinc-500 shrink-0" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="flex-1 bg-transparent text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Account Role Selector */}
          <div className="space-y-1 pt-2">
            <label className="text-zinc-400 font-bold block">Select Workspace Access Level</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('user')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  role === 'user'
                    ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200'
                    : 'bg-black border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <span className="font-bold block text-xs">Standard User</span>
                <span className="text-[10px] text-zinc-400 block font-sans">Applicable end-user tools</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  role === 'admin'
                    ? 'bg-amber-950/80 border-amber-500 text-amber-200'
                    : 'bg-black border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
                  <span className="font-bold text-xs">Administrator</span>
                </div>
                <span className="text-[10px] text-zinc-400 block font-sans">Full inclusive admin mode</span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center space-x-2 mt-4"
          >
            <span>{isSignUp ? 'Register VOX Account' : 'Authenticate & Sign In'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs font-mono">
          <span className="text-zinc-500">
            {isSignUp ? 'Already have an account?' : "Don't have a VOX account?"}
          </span>
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-cyan-400 font-bold hover:underline"
          >
            {isSignUp ? 'Sign In' : 'Create Account'}
          </button>
        </div>

      </div>
    </div>
  );
};
