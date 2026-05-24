import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from './api/authService';

type RegisterField = 'username' | 'email' | 'password';
type RegisterErrors = Partial<Record<RegisterField, string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<RegisterErrors>({});
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const validateForm = (values = formData): RegisterErrors => {
    const errors: RegisterErrors = {};
    const username = values.username.trim();
    const email = values.email.trim();

    if (!username) {
      errors.username = 'Nhập tên người dùng để bạn bè dễ nhận ra bạn nhé.';
    } else if (username.length < 3) {
      errors.username = 'Tên người dùng cần ít nhất 3 ký tự.';
    }

    if (!email) {
      errors.email = 'Nhập email để tạo tài khoản Chatty nhé.';
    } else if (!emailPattern.test(email)) {
      errors.email = 'Email chưa đúng định dạng. Ví dụ: alice@example.com.';
    }

    if (!values.password) {
      errors.password = 'Nhập mật khẩu để bảo vệ tài khoản của bạn.';
    } else if (values.password.length < 8) {
      errors.password = 'Mật khẩu cần ít nhất 8 ký tự.';
    }

    return errors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const nextFormData = { ...formData, [name]: value };
    setFormData(nextFormData);
    if (error) setError(null);
    if (success) setSuccess(false);
    if (fieldErrors[name as RegisterField]) {
      setFieldErrors(validateForm(nextFormData));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const field = e.target.name as RegisterField;
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
      await authService.register({
        userName: formData.username,
        email: formData.email,
        password: formData.password,
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 1800);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="h-full overflow-y-auto bg-[#fff8fb] text-[#3b3340] dark:bg-[#211922] dark:text-[#fff4f8]">
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8 sm:px-6 lg:px-10">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#fff8fb_0%,#f1fbff_48%,#fff6de_100%)] dark:bg-[linear-gradient(135deg,#211922_0%,#182b32_52%,#2b2418_100%)]"></div>
        <div className="absolute inset-x-0 top-0 h-28 bg-[repeating-linear-gradient(90deg,rgba(255,192,203,0.32)_0_18px,rgba(255,255,255,0)_18px_36px)] dark:bg-[repeating-linear-gradient(90deg,rgba(255,143,176,0.18)_0_18px,rgba(255,255,255,0)_18px_36px)]"></div>
        <div className="absolute bottom-0 left-0 right-0 h-36 bg-[linear-gradient(180deg,rgba(255,255,255,0),rgba(255,238,246,0.72))] dark:bg-[linear-gradient(180deg,rgba(0,0,0,0),rgba(74,47,60,0.42))]"></div>

        <div className="relative grid w-full max-w-6xl overflow-hidden rounded-[32px] border border-white/80 bg-white/75 shadow-[0_24px_70px_rgba(238,128,166,0.22)] backdrop-blur-xl xl:grid-cols-[0.95fr_1.05fr] dark:border-[#5a3c4b] dark:bg-[#231c27]/86 dark:shadow-[0_24px_70px_rgba(0,0,0,0.36)]">
          <div className="p-6 sm:p-10 lg:p-12">
            <div className="mb-8 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ffd9e5] text-[#d94676] dark:bg-[#4a2f3c] dark:text-[#ffb3c9]">
                  <span className="material-symbols-outlined">forum</span>
                </div>
                <span className="font-h1 text-xl font-bold text-[#47313d] dark:text-[#fff4f8]">Chatty</span>
              </div>
              <Link
                className="rounded-full bg-[#f1fbff] px-4 py-2 text-sm font-semibold text-[#457086] transition hover:bg-[#dff5ff] dark:bg-[#1e3740] dark:text-[#b5e6ff] dark:hover:bg-[#244650]"
                to="/login"
              >
                Đăng nhập
              </Link>
            </div>

            <div className="mb-8">
              <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#fff1c7] px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-[#84621a]">
                <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                Rất vui được gặp bạn
              </p>
              <h1 className="font-h1 text-3xl font-bold leading-tight text-[#47313d] sm:text-4xl dark:text-[#fff4f8]">
                Tạo tài khoản mới
              </h1>
              <p className="mt-3 max-w-lg text-sm leading-6 text-[#776672] dark:text-[#d8bdca]">
                Chỉ cần vài thông tin nhỏ là bạn có thể bắt đầu nhắn tin cùng bạn bè trên Chatty.
              </p>
            </div>

            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-2xl border border-[#ffc2cf] bg-[#fff0f3] p-4 text-[#9f1239]">
                <span className="material-symbols-outlined text-[20px]">error</span>
                <p className="text-sm font-medium leading-5">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 flex items-start gap-3 rounded-2xl border border-[#bdeccf] bg-[#effcf4] p-4 text-[#166534]">
                <span className="material-symbols-outlined text-[20px]">check_circle</span>
                <p className="text-sm font-medium leading-5">Tạo tài khoản thành công. Đang đưa bạn về trang đăng nhập...</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-[#5b4653] dark:text-[#fff4f8]" htmlFor="username">
                  Tên người dùng
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-[#f08aaa]">
                    person
                  </span>
                  <input
                    className={`w-full rounded-2xl border bg-white px-12 py-4 text-base text-[#3b3340] shadow-sm outline-none transition placeholder:text-[#b9a6b1] focus:ring-4 dark:bg-[#211a25] dark:text-[#fff4f8] dark:placeholder:text-[#d8bdca]/70 ${
                      fieldErrors.username
                        ? 'border-[#fb7185] focus:border-[#fb7185] focus:ring-[#ffe4ea]'
                        : 'border-[#f5c9d7] focus:border-[#ff8fb0] focus:ring-[#ffd9e5] dark:border-[#5a3c4b] dark:focus:ring-[#4a2f3c]'
                    }`}
                    aria-describedby={fieldErrors.username ? 'username-error' : undefined}
                    aria-invalid={Boolean(fieldErrors.username)}
                    id="username"
                    name="username"
                    placeholder="alice"
                    required
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isLoading}
                    autoComplete="username"
                  />
                </div>
                {fieldErrors.username && (
                  <p className="flex items-center gap-2 text-xs font-semibold text-[#be123c]" id="username-error">
                    <span className="material-symbols-outlined text-[16px]">info</span>
                    {fieldErrors.username}
                  </p>
                )}
              </div>

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
                    aria-describedby={fieldErrors.password ? 'password-error password-help' : 'password-help'}
                    aria-invalid={Boolean(fieldErrors.password)}
                    id="password"
                    name="password"
                    placeholder="Tối thiểu 8 ký tự"
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isLoading}
                    autoComplete="new-password"
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
                {fieldErrors.password ? (
                  <p className="flex items-center gap-2 text-xs font-semibold text-[#be123c]" id="password-error">
                    <span className="material-symbols-outlined text-[16px]">info</span>
                    {fieldErrors.password}
                  </p>
                ) : (
                  <p className="text-xs font-medium text-[#8b7580] dark:text-[#d8bdca]" id="password-help">
                    Gợi ý: dùng chữ hoa, chữ thường, số và ký tự đặc biệt để tài khoản an toàn hơn.
                  </p>
                )}
              </div>

              <button
                className={`flex w-full items-center justify-center gap-2 rounded-2xl bg-[#ff7fa3] px-5 py-4 text-base font-bold text-white shadow-[0_16px_30px_rgba(255,127,163,0.32)] transition ${
                  isLoading ? 'cursor-not-allowed opacity-70' : 'hover:bg-[#f06593] active:scale-[0.99]'
                }`}
                type="submit"
                disabled={isLoading || success}
              >
                {isLoading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white"></span>
                    Đang tạo tài khoản...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]">person_add</span>
                    Tạo tài khoản
                  </>
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-[#806f79] dark:text-[#d8bdca]">
              Đã có tài khoản?{' '}
              <Link className="font-bold text-[#d94676] underline-offset-4 hover:underline" to="/login">
                Đăng nhập ngay
              </Link>
            </p>
          </div>

          <aside className="relative hidden min-h-[660px] overflow-hidden bg-[#e8f7ff] p-10 xl:block dark:bg-[#1e3740]">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.72)_0_12%,transparent_12%_100%),repeating-linear-gradient(150deg,rgba(255,255,255,0.24)_0_14px,transparent_14px_34px)]"></div>
            <div className="relative flex h-full flex-col justify-between">
              <div className="ml-auto w-fit rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-[#4c6f7f] shadow-sm">
                Một góc chat mới đang chờ
              </div>

              <div className="relative h-[420px]">
                <div className="absolute left-4 top-8 max-w-[290px] rounded-[30px] rounded-bl-md bg-white px-5 py-4 text-sm font-medium text-[#52616a] shadow-[0_18px_36px_rgba(96,155,184,0.18)]">
                  Xin chào, mình vừa tham gia Chatty!
                </div>
                <div className="absolute right-3 top-36 max-w-[250px] rounded-[30px] rounded-br-md bg-[#ffd9e5] px-5 py-4 text-sm font-semibold text-[#7b3650] shadow-[0_18px_36px_rgba(238,128,166,0.2)]">
                  Chào mừng bạn nha.
                </div>
                <div className="absolute bottom-16 left-8 w-[300px] rounded-[30px] bg-[#fff7cf] px-5 py-5 shadow-[0_18px_36px_rgba(221,181,87,0.22)]">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[30px] text-[#f59e0b]">celebration</span>
                    <div>
                      <p className="text-sm font-bold text-[#5b4a20]">Sẵn sàng trò chuyện</p>
                      <p className="mt-1 text-xs leading-5 text-[#806f43]">Tạo tài khoản xong là bạn có thể bắt đầu kết nối ngay.</p>
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="max-w-md font-h1 text-[42px] font-bold leading-[1.08] text-[#314554]">
                Vào Chatty nhẹ nhàng như mở cửa một căn phòng quen.
              </h2>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default Register;
