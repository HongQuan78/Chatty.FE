import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from './api/authService';
import { userService } from './api/userService';
import { useTheme } from './contexts/ThemeContext';
import { DEFAULT_AVATAR_URL, getAvatarUrl } from './utils/avatar';

type SettingsTab = 'profile' | 'account' | 'appearance' | 'notifications';

type ProfileForm = {
  displayName: string;
  email: string;
  bio: string;
  avatarUrl: string;
};

type Palette = {
  page: string;
  panel: string;
  card: string;
  soft: string;
  input: string;
  border: string;
  text: string;
  muted: string;
  accent: string;
  accentStrong: string;
  accentSoft: string;
  blueSoft: string;
  blueText: string;
  warningSoft: string;
  warningText: string;
  dangerSoft: string;
  dangerText: string;
  shadow: string;
};

const tabs: Array<{ id: SettingsTab; label: string; icon: string; helper: string }> = [
  { id: 'profile', label: 'Hồ sơ', icon: 'person', helper: 'Tên, ảnh và lời giới thiệu' },
  { id: 'account', label: 'Tài khoản', icon: 'manage_accounts', helper: 'Mật khẩu và phiên đăng nhập' },
  { id: 'appearance', label: 'Giao diện', icon: 'palette', helper: 'Màu sắc Chatty' },
  { id: 'notifications', label: 'Thông báo', icon: 'notifications', helper: 'Tin nhắn và âm thanh' },
];

const themeOptions = [
  { value: 'Light', label: 'Sáng', icon: 'light_mode', preview: 'linear-gradient(135deg,#fff8fb,#f1fbff,#fff6de)' },
  { value: 'Dark', label: 'Tối', icon: 'dark_mode', preview: 'linear-gradient(135deg,#211922,#2b2230,#182b32)' },
  { value: 'System', label: 'Theo máy', icon: 'contrast', preview: 'linear-gradient(90deg,#fff8fb 0 50%,#211922 50% 100%)' },
] as const;

const lightPalette: Palette = {
  page: 'linear-gradient(135deg,#fff8fb 0%,#f1fbff 48%,#fff6de 100%)',
  panel: 'rgba(255,255,255,0.82)',
  card: '#ffffff',
  soft: '#fff8fb',
  input: '#fff8fb',
  border: '#ffd9e5',
  text: '#47313d',
  muted: '#806f79',
  accent: '#ff7fa3',
  accentStrong: '#d94676',
  accentSoft: '#ffd9e5',
  blueSoft: '#f1fbff',
  blueText: '#457086',
  warningSoft: '#fff1c7',
  warningText: '#84621a',
  dangerSoft: '#fff0f3',
  dangerText: '#be123c',
  shadow: '0 18px 50px rgba(238,128,166,0.14)',
};

const darkPalette: Palette = {
  page: 'linear-gradient(135deg,#211922 0%,#182b32 48%,#2b2418 100%)',
  panel: 'rgba(35,28,39,0.86)',
  card: '#2c2430',
  soft: '#241d28',
  input: '#211a25',
  border: '#5a3c4b',
  text: '#fff4f8',
  muted: '#d8bdca',
  accent: '#ff8fb0',
  accentStrong: '#ffb3c9',
  accentSoft: '#4a2f3c',
  blueSoft: '#1e3740',
  blueText: '#b5e6ff',
  warningSoft: '#4a3a1b',
  warningText: '#ffe39a',
  dangerSoft: '#4a202b',
  dangerText: '#ffc2cf',
  shadow: '0 18px 50px rgba(0,0,0,0.28)',
};

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { theme: currentTheme, resolvedTheme, setTheme } = useTheme();
  const palette = resolvedTheme === 'Dark' ? darkPalette : lightPalette;
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileForm, setProfileForm] = useState<ProfileForm>({
    displayName: localStorage.getItem('userName') || 'Bạn',
    email: '',
    bio: '',
    avatarUrl: '',
  });

  const avatarSrc = useMemo(() => {
    return getAvatarUrl(profileForm.avatarUrl);
  }, [profileForm.avatarUrl]);

  useEffect(() => {
    const fetchProfile = async () => {
      const userId = authService.getCurrentUserId();
      if (!userId) {
        navigate('/login');
        return;
      }

      setIsProfileLoading(true);
      setProfileError(null);

      try {
        const user = await userService.getUserById(userId);
        setProfileForm({
          displayName: user.displayName || user.userName || 'Bạn',
          email: user.email || '',
          bio: user.bio || '',
          avatarUrl: user.avatarUrl || '',
        });
        if (user.userName) localStorage.setItem('userName', user.userName);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Không thể tải hồ sơ.';
        setProfileError(message);
      } finally {
        setIsProfileLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleProfileChange = (field: keyof ProfileForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProfileForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 900);
  };

  const panelStyle: React.CSSProperties = {
    background: palette.panel,
    borderColor: palette.border,
    boxShadow: palette.shadow,
    color: palette.text,
  };

  const cardStyle: React.CSSProperties = {
    background: palette.card,
    borderColor: palette.border,
    color: palette.text,
  };

  const inputStyle: React.CSSProperties = {
    background: palette.input,
    borderColor: palette.border,
    color: palette.text,
  };

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden" style={{ background: palette.page, color: palette.text }}>
      <header className="h-16 flex items-center justify-between px-4 sm:px-5 flex-shrink-0 z-30 border-b backdrop-blur-xl" style={panelStyle}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-2xl transition-colors focus-visible:ring-4 outline-none"
            style={{ color: palette.accentStrong }}
            aria-label="Quay lại dashboard"
          >
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </button>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl" style={{ background: palette.accentSoft, color: palette.accentStrong }}>
            <span className="material-symbols-outlined text-xl">forum</span>
          </div>
          <div>
            <h1 className="font-h2 text-[19px] tracking-tight" style={{ color: palette.text }}>Cài đặt Chatty</h1>
            <p className="hidden text-xs sm:block" style={{ color: palette.muted }}>Chỉnh lại góc trò chuyện cho thật hợp bạn.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="hidden sm:flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-bold text-white shadow-[0_12px_24px_rgba(255,127,163,0.28)] transition disabled:cursor-not-allowed disabled:opacity-70"
          style={{ background: palette.accent }}
        >
          <span className="material-symbols-outlined text-[18px]">{isSaving ? 'progress_activity' : 'check'}</span>
          {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-4 overflow-hidden p-0 md:p-4">
        <aside className="hidden w-[300px] flex-shrink-0 overflow-hidden rounded-[28px] border backdrop-blur-xl md:flex md:flex-col" style={panelStyle}>
          <div className="border-b p-5" style={{ background: palette.soft, borderColor: palette.border }}>
            <p className="text-xs font-bold uppercase tracking-[0.08em]" style={{ color: palette.accentStrong }}>Settings</p>
            <h2 className="mt-1 font-h2 text-xl" style={{ color: palette.text }}>Không gian của bạn</h2>
          </div>
          <nav className="flex-1 space-y-2 overflow-y-auto p-3">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="w-full rounded-3xl p-3 text-left transition-all focus-visible:ring-4 outline-none"
                  style={{ background: isActive ? palette.accentSoft : 'transparent' }}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className="flex h-11 w-11 items-center justify-center rounded-2xl"
                      style={{ background: isActive ? palette.accent : palette.accentSoft, color: isActive ? '#fff' : palette.accentStrong }}
                    >
                      <span className="material-symbols-outlined text-[21px]">{tab.icon}</span>
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-bold" style={{ color: isActive ? palette.accentStrong : palette.text }}>{tab.label}</span>
                      <span className="block truncate text-xs" style={{ color: palette.muted }}>{tab.helper}</span>
                    </span>
                  </span>
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto p-4 backdrop-blur-xl md:rounded-[28px] md:border md:p-6" style={panelStyle}>
          <div className="mb-5 flex gap-2 overflow-x-auto pb-1 md:hidden">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2 text-sm font-bold transition"
                style={{ background: activeTab === tab.id ? palette.accent : palette.card, color: activeTab === tab.id ? '#fff' : palette.muted }}
              >
                <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'profile' && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="mb-6">
                <p className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.08em]" style={{ background: palette.warningSoft, color: palette.warningText }}>
                  <span className="material-symbols-outlined text-[16px]">favorite</span>
                  Hồ sơ
                </p>
                <h2 className="mt-3 font-h1 text-3xl font-bold" style={{ color: palette.text }}>Thông tin cá nhân</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6" style={{ color: palette.muted }}>
                  Avatar được lấy từ hồ sơ API. Nếu bạn chưa có avatar, Chatty sẽ dùng ảnh mặc định dễ thương.
                </p>
              </div>

              {profileError && (
                <div className="mb-5 flex items-center gap-2 rounded-2xl border p-3 text-sm font-semibold" style={{ background: palette.dangerSoft, borderColor: palette.dangerText, color: palette.dangerText }}>
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  {profileError}
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-5">
                <div className="rounded-[28px] border p-5 shadow-sm" style={cardStyle}>
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                    <div className="relative w-fit">
                      {isProfileLoading ? (
                        <div className="flex h-24 w-24 items-center justify-center rounded-[30px] ring-4" style={{ background: palette.accentSoft, borderColor: palette.border }}>
                          <span className="h-8 w-8 animate-spin rounded-full border-4 border-white/60" style={{ borderTopColor: palette.accent }}></span>
                        </div>
                      ) : (
                        <img
                          src={avatarSrc}
                          alt="Ảnh đại diện"
                          className="h-24 w-24 rounded-[30px] object-cover ring-4"
                          style={{ borderColor: palette.border }}
                          onError={(e) => {
                            e.currentTarget.src = DEFAULT_AVATAR_URL;
                          }}
                        />
                      )}
                      <button
                        type="button"
                        className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-2xl text-white shadow-[0_10px_20px_rgba(255,127,163,0.28)] transition focus-visible:ring-4 outline-none"
                        style={{ background: palette.accent }}
                        aria-label="Đổi ảnh đại diện"
                      >
                        <span className="material-symbols-outlined text-[20px]">photo_camera</span>
                      </button>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold" style={{ color: palette.text }}>Ảnh đại diện</h3>
                      <p className="mt-1 text-sm" style={{ color: palette.muted }}>
                        {profileForm.avatarUrl ? 'Đang dùng avatar từ hồ sơ của bạn.' : 'Bạn chưa có avatar, Chatty đang dùng ảnh mặc định.'}
                      </p>
                      <button
                        type="button"
                        className="mt-3 rounded-2xl px-4 py-2 text-sm font-bold transition"
                        style={{ background: palette.blueSoft, color: palette.blueText }}
                      >
                        Tải ảnh mới
                      </button>
                    </div>
                  </div>
                </div>

                <div className="rounded-[28px] border p-5 shadow-sm" style={cardStyle}>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <label className="space-y-2">
                      <span className="block text-sm font-bold" style={{ color: palette.text }}>Tên hiển thị</span>
                      <input
                        name="displayName"
                        type="text"
                        value={profileForm.displayName}
                        onChange={handleProfileChange('displayName')}
                        autoComplete="name"
                        className="w-full rounded-2xl border px-4 py-3 outline-none transition focus:ring-4"
                        style={inputStyle}
                      />
                    </label>
                    <label className="space-y-2">
                      <span className="block text-sm font-bold" style={{ color: palette.text }}>Email</span>
                      <input
                        name="email"
                        type="email"
                        value={profileForm.email}
                        onChange={handleProfileChange('email')}
                        autoComplete="email"
                        spellCheck={false}
                        className="w-full rounded-2xl border px-4 py-3 outline-none transition focus:ring-4"
                        style={inputStyle}
                      />
                    </label>
                  </div>
                  <label className="mt-4 block space-y-2">
                    <span className="block text-sm font-bold" style={{ color: palette.text }}>Giới thiệu</span>
                    <textarea
                      name="bio"
                      rows={4}
                      value={profileForm.bio}
                      onChange={handleProfileChange('bio')}
                      placeholder="Viết một dòng nhỏ về bạn..."
                      className="w-full resize-none rounded-2xl border px-4 py-3 outline-none transition focus:ring-4"
                      style={inputStyle}
                    />
                  </label>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex min-w-[140px] items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold text-white shadow-[0_14px_30px_rgba(255,127,163,0.28)] transition disabled:cursor-not-allowed disabled:opacity-70"
                    style={{ background: palette.accent }}
                  >
                    <span className="material-symbols-outlined text-[18px]">{isSaving ? 'progress_activity' : 'check'}</span>
                    {isSaving ? 'Đang lưu...' : 'Lưu hồ sơ'}
                  </button>
                </div>
              </form>
            </section>
          )}

          {activeTab === 'appearance' && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="mb-6">
                <p className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.08em]" style={{ background: palette.blueSoft, color: palette.blueText }}>
                  <span className="material-symbols-outlined text-[16px]">palette</span>
                  Giao diện
                </p>
                <h2 className="mt-3 font-h1 text-3xl font-bold" style={{ color: palette.text }}>Chọn mood cho Chatty</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6" style={{ color: palette.muted }}>
                  Chế độ hiện tại: <span className="font-bold" style={{ color: palette.accentStrong }}>{resolvedTheme === 'Dark' ? 'Tối' : 'Sáng'}</span>
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {themeOptions.map((option) => {
                  const isSelected = currentTheme === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setTheme(option.value)}
                      className="rounded-[28px] border p-4 text-left shadow-sm transition focus-visible:ring-4 outline-none"
                      style={{ ...cardStyle, borderColor: isSelected ? palette.accent : palette.border }}
                    >
                      <div className="mb-4 h-28 rounded-[24px] border" style={{ background: option.preview, borderColor: palette.border }}></div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 font-bold" style={{ color: palette.text }}>
                          <span className="material-symbols-outlined" style={{ color: palette.accentStrong }}>{option.icon}</span>
                          {option.label}
                        </span>
                        {isSelected && (
                          <span className="material-symbols-outlined" style={{ color: palette.accent }}>check_circle</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {activeTab === 'notifications' && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="mb-6">
                <p className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.08em]" style={{ background: palette.warningSoft, color: palette.warningText }}>
                  <span className="material-symbols-outlined text-[16px]">notifications</span>
                  Thông báo
                </p>
                <h2 className="mt-3 font-h1 text-3xl font-bold" style={{ color: palette.text }}>Nhận tin theo cách bạn thích</h2>
              </div>

              <div className="space-y-3 rounded-[28px] border p-4 shadow-sm" style={cardStyle}>
                {[
                  ['Tin nhắn mới', 'Nhắc bạn khi có người gửi tin nhắn.', true],
                  ['Âm thanh dễ thương', 'Bật âm báo nhẹ khi có tin mới.', true],
                  ['Email tổng hợp', 'Nhận bản tóm tắt khi bạn vắng mặt.', false],
                ].map(([title, description, checked]) => (
                  <label key={String(title)} className="flex cursor-pointer items-center justify-between gap-4 rounded-3xl p-3 transition" style={{ background: 'transparent' }}>
                    <span>
                      <span className="block font-bold" style={{ color: palette.text }}>{title}</span>
                      <span className="mt-0.5 block text-sm" style={{ color: palette.muted }}>{description}</span>
                    </span>
                    <span className="relative inline-flex items-center">
                      <input type="checkbox" className="peer sr-only" defaultChecked={Boolean(checked)} />
                      <span className="h-7 w-12 rounded-full transition peer-checked:bg-[#ff7fa3] peer-focus:ring-4" style={{ background: palette.accentSoft }}></span>
                      <span className="absolute left-1 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5"></span>
                    </span>
                  </label>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'account' && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="mb-6">
                <p className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.08em]" style={{ background: palette.blueSoft, color: palette.blueText }}>
                  <span className="material-symbols-outlined text-[16px]">manage_accounts</span>
                  Tài khoản
                </p>
                <h2 className="mt-3 font-h1 text-3xl font-bold" style={{ color: palette.text }}>Bảo vệ tài khoản</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6" style={{ color: palette.muted }}>Quản lý mật khẩu, phiên đăng nhập và các hành động quan trọng.</p>
              </div>

              <div className="space-y-4">
                <div className="rounded-[28px] border p-5 shadow-sm" style={cardStyle}>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-bold" style={{ color: palette.text }}>Đổi mật khẩu</h3>
                      <p className="mt-1 text-sm" style={{ color: palette.muted }}>Nên đổi mật khẩu định kỳ để tài khoản luôn an toàn.</p>
                    </div>
                    <button type="button" className="rounded-2xl px-4 py-2 text-sm font-bold transition" style={{ background: palette.blueSoft, color: palette.blueText }}>
                      Đổi mật khẩu
                    </button>
                  </div>
                </div>

                <div className="rounded-[28px] border p-5 shadow-sm" style={{ ...cardStyle, background: palette.dangerSoft, borderColor: palette.dangerText }}>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-bold" style={{ color: palette.dangerText }}>Xóa tài khoản</h3>
                      <p className="mt-1 text-sm" style={{ color: palette.muted }}>Hành động này sẽ xóa dữ liệu cá nhân khỏi Chatty.</p>
                    </div>
                    <button type="button" className="rounded-2xl border px-4 py-2 text-sm font-bold transition" style={{ background: palette.card, borderColor: palette.dangerText, color: palette.dangerText }}>
                      Xóa tài khoản
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default Settings;
