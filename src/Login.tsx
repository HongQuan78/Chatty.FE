import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from './api/authService';

type LoginField = 'email' | 'password';
type LoginErrors = Partial<Record<LoginField, string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<LoginErrors>({});

  const navigate = useNavigate();

  const validateForm = (values = formData): LoginErrors => {
    const errors: LoginErrors = {};
    const email = values.email.trim();

    if (!email) {
      errors.email = 'Nhập email để đăng nhập vào Chatty nhé.';
    } else if (!emailPattern.test(email)) {
      errors.email = 'Email chưa đúng định dạng. Ví dụ: alice@example.com.';
    }

    if (!values.password) {
      errors.password = 'Nhập mật khẩu của bạn để tiếp tục.';
    }

    return errors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const nextFormData = { ...formData, [name]: value };
    setFormData(nextFormData);
    if (error) setError(null);
    if (fieldErrors[name as LoginField]) {
      setFieldErrors(validateForm(nextFormData));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const field = e.target.name as LoginField;
    const nextErrors = validateForm();
    setFieldErrors((prev) => ({
      ...prev,
      [field]: nextErrors[field],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validateForm();

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      await authService.login({
        email: formData.email,
        password: formData.password,
      });
      navigate('/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed. Please check your credentials.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="h-full overflow-y-auto bg-[#fff8fb] text-[#3b3340] dark:bg-[#211922] dark:text-[#fff4f8]">
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8 sm:px-6 lg:px-10">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#fff8fb_0%,#f1fbff_46%,#fff6de_100%)] dark:bg-[linear-gradient(135deg,#211922_0%,#182b32_52%,#2b2418_100%)]"></div>
        <div className="absolute inset-x-0 top-0 h-28 bg-[repeating-linear-gradient(90deg,rgba(255,192,203,0.32)_0_18px,rgba(255,255,255,0)_18px_36px)] dark:bg-[repeating-linear-gradient(90deg,rgba(255,143,176,0.18)_0_18px,rgba(255,255,255,0)_18px_36px)]"></div>
        <div className="absolute bottom-0 left-0 right-0 h-36 bg-[linear-gradient(180deg,rgba(255,255,255,0),rgba(255,238,246,0.72))] dark:bg-[linear-gradient(180deg,rgba(0,0,0,0),rgba(74,47,60,0.42))]"></div>

        <div className="relative grid w-full max-w-6xl overflow-hidden rounded-[32px] border border-white/80 bg-white/75 shadow-[0_24px_70px_rgba(238,128,166,0.22)] backdrop-blur-xl xl:grid-cols-[1.05fr_0.95fr] dark:border-[#5a3c4b] dark:bg-[#231c27]/86 dark:shadow-[0_24px_70px_rgba(0,0,0,0.36)]">
          <aside className="relative hidden min-h-[620px] overflow-hidden bg-[#ffe8f0] p-10 xl:block dark:bg-[#2c2430]">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.68)_0_12%,transparent_12%_100%),repeating-linear-gradient(150deg,rgba(255,255,255,0.24)_0_14px,transparent_14px_34px)]"></div>
            <div className="relative flex h-full flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-[#7a5265] shadow-sm dark:bg-[#211a25]/80 dark:text-[#ffb3c9]">
                  <span className="material-symbols-outlined text-[18px] text-[#ff7fa3]">forum</span>
                  Chatty
                </div>
                <h1 className="mt-8 max-w-md font-h1 text-[44px] font-bold leading-[1.05] text-[#47313d] dark:text-[#fff4f8]">
                  Nơi những cuộc trò chuyện bắt đầu thật nhẹ nhàng.
                </h1>
                <p className="mt-4 max-w-sm text-base leading-7 text-[#755f6b] dark:text-[#d8bdca]">
                  Đăng nhập để nhắn tin, theo dõi trạng thái bạn bè và tiếp tục các cuộc hội thoại của bạn.
                </p>
              </div>

              <div className="relative h-[300px]">
                <div className="absolute left-4 top-4 max-w-[270px] rounded-[28px] rounded-bl-md bg-white px-5 py-4 text-sm font-medium text-[#614c58] shadow-[0_18px_36px_rgba(213,119,151,0.18)]">
                  Hôm nay mình chat tiếp nhé?
                </div>
                <div className="absolute right-0 top-28 max-w-[240px] rounded-[28px] rounded-br-md bg-[#8bd3ff] px-5 py-4 text-sm font-semibold text-[#1f4158] shadow-[0_18px_36px_rgba(89,170,216,0.25)]">
                  Có mặt rồi đây!
                </div>
                <div className="absolute bottom-5 left-12 flex w-[240px] items-center gap-3 rounded-[28px] bg-[#fff7cf] px-5 py-4 shadow-[0_18px_36px_rgba(221,181,87,0.22)]">
                  <span className="material-symbols-outlined text-[28px] text-[#f59e0b]">auto_awesome</span>
                  <div>
                    <p className="text-sm font-bold text-[#5b4a20]">Online êm ru</p>
                    <p className="text-xs text-[#806f43]">Tin nhắn luôn sẵn sàng</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <div className="p-6 sm:p-10 lg:p-12">
            <div className="mb-8 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 xl:hidden">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ffd9e5] text-[#d94676] dark:bg-[#4a2f3c] dark:text-[#ffb3c9]">
                  <span className="material-symbols-outlined">forum</span>
                </div>
                <span className="font-h1 text-xl font-bold text-[#47313d] dark:text-[#fff4f8]">Chatty</span>
              </div>
              <Link
                className="ml-auto rounded-full bg-[#f1fbff] px-4 py-2 text-sm font-semibold text-[#457086] transition hover:bg-[#dff5ff] dark:bg-[#1e3740] dark:text-[#b5e6ff] dark:hover:bg-[#244650]"
                to="/register"
              >
                Tạo tài khoản
              </Link>
            </div>

            <div className="mb-8">
              <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#fff1c7] px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-[#84621a]">
                <span className="material-symbols-outlined text-[16px]">favorite</span>
                Welcome back
              </p>
              <h2 className="font-h1 text-3xl font-bold leading-tight text-[#47313d] sm:text-4xl dark:text-[#fff4f8]">
                Đăng nhập vào Chatty
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#776672] dark:text-[#d8bdca]">
                Chào mừng bạn quay lại. Cùng tiếp tục những cuộc trò chuyện dễ thương hôm nay nhé.
              </p>
            </div>

            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-2xl border border-[#ffc2cf] bg-[#fff0f3] p-4 text-[#9f1239]">
                <span className="material-symbols-outlined text-[20px]">error</span>
                <p className="text-sm font-medium leading-5">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-[#5b4653] dark:text-[#fff4f8]" htmlFor="email">
                  Email
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-[#f08aaa]">
                    mail
                  </span>
                  <input
                    className={`w-full rounded-2xl border bg-white px-12 py-4 text-base text-[#3b3340] shadow-sm outline-none transition placeholder:text-[#b9a6b1] focus:ring-4 dark:bg-[#211a25] dark:text-[#fff4f8] dark:placeholder:text-[#d8bdca]/70 ${
                      fieldErrors.email
                        ? 'border-[#fb7185] focus:border-[#fb7185] focus:ring-[#ffe4ea]'
                        : 'border-[#f5c9d7] focus:border-[#ff8fb0] focus:ring-[#ffd9e5] dark:border-[#5a3c4b] dark:focus:ring-[#4a2f3c]'
                    }`}
                    aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                    aria-invalid={Boolean(fieldErrors.email)}
                    id="email"
                    name="email"
                    placeholder="alice@example.com"
                    required
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>
                {fieldErrors.email && (
                  <p className="flex items-center gap-2 text-xs font-semibold text-[#be123c]" id="email-error">
                    <span className="material-symbols-outlined text-[16px]">info</span>
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-[#5b4653] dark:text-[#fff4f8]" htmlFor="password">
                  Mật khẩu
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-[#f08aaa]">
                    lock
                  </span>
                  <input
                    className={`w-full rounded-2xl border bg-white px-12 py-4 text-base text-[#3b3340] shadow-sm outline-none transition placeholder:text-[#b9a6b1] focus:ring-4 dark:bg-[#211a25] dark:text-[#fff4f8] dark:placeholder:text-[#d8bdca]/70 ${
                      fieldErrors.password
                        ? 'border-[#fb7185] focus:border-[#fb7185] focus:ring-[#ffe4ea]'
                        : 'border-[#f5c9d7] focus:border-[#ff8fb0] focus:ring-[#ffd9e5] dark:border-[#5a3c4b] dark:focus:ring-[#4a2f3c]'
                    }`}
                    aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                    aria-invalid={Boolean(fieldErrors.password)}
                    id="password"
                    name="password"
                    placeholder="Password123!"
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#a68092] transition hover:bg-[#fff0f6] hover:text-[#d94676] focus:outline-none focus:ring-2 focus:ring-[#ffbad0] dark:text-[#d8bdca] dark:hover:bg-[#4a2f3c] dark:hover:text-[#ffb3c9]"
                    type="button"
                    aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="flex items-center gap-2 text-xs font-semibold text-[#be123c]" id="password-error">
                    <span className="material-symbols-outlined text-[16px]">info</span>
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              <button
                className={`flex w-full items-center justify-center gap-2 rounded-2xl bg-[#ff7fa3] px-5 py-4 text-base font-bold text-white shadow-[0_16px_30px_rgba(255,127,163,0.32)] transition ${
                  isLoading ? 'cursor-not-allowed opacity-70' : 'hover:bg-[#f06593] active:scale-[0.99]'
                }`}
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white"></span>
                    Đang đăng nhập...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]">login</span>
                    Đăng nhập
                  </>
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-[#806f79] dark:text-[#d8bdca]">
              Chưa có tài khoản?{' '}
              <Link className="font-bold text-[#d94676] underline-offset-4 hover:underline" to="/register">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Login;
