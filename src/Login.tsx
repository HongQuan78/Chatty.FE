import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <>
      <main className="min-h-screen flex items-center justify-center px-gutter py-stack-lg relative overflow-hidden bg-gradient-to-br from-indigo-50 via-slate-50 to-purple-50">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-fuchsia-300/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        
        <div className="relative w-full max-w-[480px] bg-surface-container-lowest/80 backdrop-blur-xl border border-surface-variant/50 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="relative h-48 bg-primary-container overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-container to-secondary-container opacity-90"></div>
            <img
              className="w-full h-full object-cover"
              alt="Abstract deep indigo and blue fluid gradient with subtle noise texture and professional geometric overlays"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDr6mPBoZvHxcicedibSWbMv7AKsl_SUsGl0phm6T3IFttIe-HqfA1suGCKWUyNHoqXPfaDmyjpMNdBk2fNQuvbOgoAJVbseMC5fp6ROxsgdYScyDO_k0iNXvYo9zZo686Gd2hFUve0voNGzJSNZ2i_eN7qyHJnj9zQvf73otVYJsdds_7urmK9w2Wp8PhAawm9s7X2OouvNLEFobJkOgU0HHMt7FFGbvhw_KutWlwryo0LIQp2YunFyVOKx4mI16CmBTgByheBmg"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-on-primary">
              <span className="material-symbols-outlined text-4xl mb-2">hub</span>
              <h1 className="font-h1 text-h1 tracking-tight">ChatStream</h1>
              <p className="font-body-md text-body-md text-on-primary-container/80">Corporate Modern Workspace</p>
            </div>
          </div>
          <div className="p-8 md:p-10">
            <div className="mb-8">
              <h2 className="font-h2 text-h2 text-on-surface mb-1">Welcome Back</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">Log in to access your dashboard.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="font-label-sm text-label-sm text-on-surface-variant block" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                    mail
                  </span>
                  <input
                    className="w-full pl-10 pr-4 py-3 bg-surface border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container transition-all"
                    id="email"
                    name="email"
                    placeholder="name@company.com"
                    required
                    type="email"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="font-label-sm text-label-sm text-on-surface-variant block" htmlFor="password">
                    Password
                  </label>
                  <Link to="/forgot-password" className="font-meta text-meta text-primary-container hover:underline decoration-2 underline-offset-4 font-medium">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                    lock
                  </span>
                  <input
                    className="w-full pl-10 pr-12 py-3 bg-surface border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container transition-all"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    required
                    type={showPassword ? 'text' : 'password'}
                  />
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface-variant transition-colors"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>
              <button
                className="w-full py-3.5 bg-primary-container text-on-primary font-body-lg text-body-lg rounded-lg hover:opacity-90 active:scale-[0.98] transition-all duration-200 shadow-sm"
                type="submit"
              >
                Log In
              </button>
            </form>
            <div className="mt-8 pt-8 border-t border-outline-variant text-center">
              <p className="font-body-md text-body-md text-on-surface-variant">
                Don't have an account?{' '}
                <Link className="text-primary-container font-semibold hover:underline decoration-2 underline-offset-4" to="/register">
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-slate-50 border-t border-slate-200 py-6 px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 font-manrope">ChatCorp</span>
          </div>
          <div className="flex gap-6">
            <a className="font-manrope text-xs text-slate-500 hover:text-indigo-700 transition-colors cursor-pointer" href="#">
              Privacy Policy
            </a>
            <a className="font-manrope text-xs text-slate-500 hover:text-indigo-700 transition-colors cursor-pointer" href="#">
              Terms of Service
            </a>
            <a className="font-manrope text-xs text-slate-500 hover:text-indigo-700 transition-colors cursor-pointer" href="#">
              Security Whitepaper
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Login;
