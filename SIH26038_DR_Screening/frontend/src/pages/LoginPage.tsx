import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, Lock, Mail, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('doctor@demo.com');
  const [password, setPassword] = useState('demo123');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo login redirect
    navigate('/dashboard');
  };

  const handleDemoAccount = () => {
    setEmail('doctor@demo.com');
    setPassword('demo123');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 selection:bg-medical-500 selection:text-white">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="p-8 bg-gradient-to-b from-slate-900 to-slate-850 text-white text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-medical-600 to-medical-400 flex items-center justify-center text-white mx-auto shadow-lg shadow-medical-500/30">
            <Eye className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">RetinaAI Portal Login</h2>
            <p className="text-xs text-slate-400 mt-1">SIH26038 Rural Ophthalmology Screening Workstation</p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleLogin} className="p-8 space-y-5">
          
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="doctor@demo.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-medical-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-medical-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-medical-600 hover:bg-medical-700 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleDemoAccount}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-sm border border-slate-200 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Continue with Demo Account</span>
            </button>
          </div>

          {/* Demo account hint box */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 text-center space-y-1">
            <div className="font-semibold text-slate-900">Preset Judge Credentials:</div>
            <div className="font-mono text-[11px] text-slate-500">Email: doctor@demo.com | Password: demo123</div>
          </div>

        </form>

        {/* Footer */}
        <div className="px-8 py-4 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-400">
          Smart India Hackathon Prototype — Local Client Mode
        </div>

      </div>
    </div>
  );
};
