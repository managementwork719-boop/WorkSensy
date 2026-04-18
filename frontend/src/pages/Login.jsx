import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LayoutPanelLeft } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, error } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await login(email, password);
      
      // If server says password reset is required
      if (result?.status === 'password-reset-required' || result === 'password-reset-required') {
          navigate(`/setup-password?email=${email}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-inter antialiased selection:bg-brand-primary selection:text-white">
      {/* Left Panel - Dark Social Proof */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0f172a] p-16 flex-col justify-between text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-3xl -mr-32 -mt-32 transition-colors duration-500"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -ml-32 -mb-32"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center p-1.5 transition-colors duration-500 shadow-lg shadow-brand-shadow">
               <LayoutPanelLeft className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight">Work Management</span>
          </div>

          <div className="max-w-md mt-24">
            <h1 className="text-5xl font-bold leading-[1.1] mb-6 tracking-tight">
              Scale your <br />
              <span className="text-brand-primary transition-colors duration-500">Operation.</span>
            </h1>
            <p className="text-slate-400 text-lg font-medium leading-relaxed">
              Unified control for modern teams managing high-velocity leads, projects, and finance.
            </p>
          </div>
        </div>

        <div className="relative z-10 text-gray-500 text-sm">
          © {new Date().getFullYear()} Work Management Inc. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 bg-slate-50 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-sm space-y-8 bg-white p-10 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50">
          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Systems Authorization</h2>
            <p className="mt-1 text-slate-500 text-xs font-semibold uppercase tracking-widest">Secure Entry Portal</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 p-3 text-red-600 text-[11px] font-bold uppercase tracking-widest rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 mt-8">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-0.5">
                Identity Mail
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 text-slate-900 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition duration-200 placeholder-slate-400 text-sm font-semibold"
                placeholder="name@company.com"
              />
            </div>

            <div className="relative space-y-1.5">
              <div className="flex justify-between items-center px-0.5">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Access Key
                </label>
                <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-brand-primary hover:text-brand-hover transition-colors">
                  Recovery
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 text-slate-900 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition duration-200 placeholder-slate-400 text-sm font-semibold"
                  placeholder="Enter access key"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center px-0.5">
               <input
                id="remember"
                type="checkbox"
                className="h-3.5 w-3.5 text-brand-primary focus:ring-brand-primary border-slate-300 rounded-md cursor-pointer transition-colors"
              />
              <label htmlFor="remember" className="ml-2 block text-[11px] font-semibold text-slate-500 cursor-pointer">
                Maintain session persistency
              </label>
            </div>

              <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 px-6 bg-brand-primary text-white font-bold uppercase tracking-[0.2em] text-xs rounded-xl hover:bg-brand-hover transition duration-500 transform shadow-lg shadow-brand-shadow active:scale-[0.98] ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Authenticating...' : 'Sign in to Core'}
            </button>
          </form>

          
        </div>
      </div>
    </div>
  );
};

export default Login;
