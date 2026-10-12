import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flame, 
  Mail, 
  Lock, 
  User as UserIcon, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Database
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AuthPage: React.FC = () => {
  const { login, signUp } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    if (mode === 'signup' && (!fullName.trim() || fullName.trim().length < 2)) {
      setErrorMessage('Please enter your full name or professional title.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'signin') {
        const { error } = await login(email, password);
        if (error) {
          setErrorMessage(error.message || 'Invalid email or password.');
        }
      } else {
        const { error, needsEmailConfirmation } = await signUp(email, password, fullName);
        if (error) {
          setErrorMessage(error.message || 'Registration could not be completed.');
        } else if (needsEmailConfirmation) {
          setSuccessMessage(
            'Account registered! Please check your email inbox to verify your address before signing in.'
          );
        } else {
          setSuccessMessage('Account created successfully! Redirecting to dashboard...');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#050814] text-slate-100 flex flex-col justify-center items-center px-4 py-12 overflow-hidden selection:bg-wildfire-blue/30 selection:text-wildfire-cyan">
      {/* Background Ambient Glows & Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,229,255,0.15),rgba(255,255,255,0))]" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Cyber Grid Lines Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }}
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500/20 via-wildfire-blue/15 to-violet-500/20 border border-wildfire-blue/40 shadow-[0_0_30px_rgba(0,229,255,0.25)] mb-4">
            <Flame className="w-8 h-8 text-wildfire-blue animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2 font-mono">
            <span>Student Analytics</span>
            <span className="text-[10px] font-mono uppercase bg-wildfire-blue/20 text-wildfire-blue border border-wildfire-blue/40 px-2 py-0.5 rounded-full font-semibold">
              AI
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1.5 font-medium">
            Academic Success & Talent Intelligence Platform
          </p>
        </div>

        {/* Auth Glass Card */}
        <div className="bg-slate-900/70 backdrop-blur-2xl border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 bg-slate-950/80 rounded-2xl border border-slate-800/80 mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`py-2 text-xs font-semibold rounded-xl transition-all duration-200 cursor-pointer ${
                mode === 'signin'
                  ? 'bg-wildfire-blue/20 text-wildfire-cyan shadow-[0_0_12px_rgba(0,229,255,0.25)] border border-wildfire-blue/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`py-2 text-xs font-semibold rounded-xl transition-all duration-200 cursor-pointer ${
                mode === 'signup'
                  ? 'bg-wildfire-blue/20 text-wildfire-cyan shadow-[0_0_12px_rgba(0,229,255,0.25)] border border-wildfire-blue/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Error Message Box */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-5 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300 flex items-start gap-2.5 overflow-hidden"
              >
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="leading-relaxed">{errorMessage}</div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success Message Box */}
          <AnimatePresence>
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-5 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 flex items-start gap-2.5 overflow-hidden"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="leading-relaxed">{successMessage}</div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-1.5"
              >
                <label className="block text-[11px] font-mono text-slate-300 font-medium">
                  FULL NAME / TITLE
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Professor Alex Rivera"
                    className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-wildfire-blue focus:ring-1 focus:ring-wildfire-blue transition-all"
                  />
                </div>
              </motion.div>
            )}

            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono text-slate-300 font-medium">
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="educator@institution.edu"
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-wildfire-blue focus:ring-1 focus:ring-wildfire-blue transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-mono text-slate-300 font-medium">
                  PASSWORD
                </label>
                <span className="text-[10px] text-slate-500">
                  Min. 6 characters
                </span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-wildfire-blue focus:ring-1 focus:ring-wildfire-blue transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-wildfire-blue hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold text-xs transition-all duration-200 shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed group cursor-pointer"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{mode === 'signin' ? 'Sign In to Student Analytics' : 'Create Educator Account'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Security & RLS Note */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span className="flex items-center gap-1.5 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Row Level Security (RLS) Active</span>
            </span>
            <span className="flex items-center gap-1">
              <Database className="w-3.5 h-3.5 text-wildfire-blue" />
              <span>Encrypted Storage</span>
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
