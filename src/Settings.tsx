import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from './contexts/ThemeContext';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { theme: currentTheme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: 'person' },
    { id: 'account', label: 'Account', icon: 'manage_accounts' },
    { id: 'appearance', label: 'Appearance', icon: 'palette' },
    { id: 'notifications', label: 'Notifications', icon: 'notifications' },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-surface-container overflow-hidden text-on-surface">
      {/* Header */}
      <header className="h-14 bg-primary-container flex items-center justify-between px-4 flex-shrink-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-1.5 rounded-lg text-on-primary/80 hover:text-on-primary hover:bg-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-on-primary outline-none"
            aria-label="Back to dashboard"
          >
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </button>
          <h1 className="font-h2 text-[18px] text-on-primary tracking-tight">Settings & Profile</h1>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden max-w-6xl w-full mx-auto">
        {/* Sidebar Tabs */}
        <aside className="w-64 border-r border-outline-variant bg-surface overflow-y-auto hidden md:block">
          <nav className="p-4 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all focus-visible:ring-2 focus-visible:ring-primary outline-none ${
                  activeTab === tab.id
                    ? 'bg-primary-container text-on-primary-container font-medium'
                    : 'text-on-surface-variant hover:bg-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-xl">{tab.icon}</span>
                <span className="font-body-md text-[14px]">{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-background p-6 md:p-8">
          <div className="max-w-2xl">
            {activeTab === 'profile' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <h2 className="text-2xl font-h2 text-on-surface mb-6">Profile Settings</h2>
                
                <form onSubmit={handleSave} className="space-y-8">
                  {/* Avatar Section */}
                  <div className="flex items-center gap-6 p-6 rounded-2xl bg-surface-container-low border border-outline-variant shadow-sm transition-all hover:shadow-md">
                    <div className="relative group">
                      <img
                        src="https://i.pravatar.cc/150?u=current"
                        alt=""
                        className="w-24 h-24 rounded-full object-cover ring-4 ring-primary-container"
                      />
                      <button
                        type="button"
                        className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity focus-visible:opacity-100 outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        aria-label="Change avatar"
                      >
                        <span className="material-symbols-outlined text-white">photo_camera</span>
                      </button>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-on-surface">Profile Picture</h3>
                      <p className="text-sm text-on-surface-variant mt-1 mb-3">JPG, GIF or PNG. Max size of 800K</p>
                      <button
                        type="button"
                        className="px-4 py-1.5 text-sm font-medium bg-secondary-container text-on-secondary-container rounded-full hover:bg-secondary-container/80 transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none"
                      >
                        Upload new
                      </button>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-5 bg-surface-container-low p-6 rounded-2xl border border-outline-variant shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label htmlFor="firstName" className="block text-sm font-medium text-on-surface">
                          First Name
                        </label>
                        <input
                          id="firstName"
                          name="firstName"
                          type="text"
                          defaultValue="John"
                          autoComplete="given-name"
                          className="w-full px-4 py-2.5 bg-surface border border-outline rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="lastName" className="block text-sm font-medium text-on-surface">
                          Last Name
                        </label>
                        <input
                          id="lastName"
                          name="lastName"
                          type="text"
                          defaultValue="Doe"
                          autoComplete="family-name"
                          className="w-full px-4 py-2.5 bg-surface border border-outline rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="email" className="block text-sm font-medium text-on-surface">
                        Email Address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        defaultValue="john.doe@example.com"
                        autoComplete="email"
                        spellCheck={false}
                        className="w-full px-4 py-2.5 bg-surface border border-outline rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="bio" className="block text-sm font-medium text-on-surface">
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        rows={4}
                        placeholder="Tell us a little about yourself…"
                        className="w-full px-4 py-2.5 bg-surface border border-outline rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-full font-medium hover:bg-primary/90 transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary outline-none disabled:opacity-70 disabled:cursor-not-allowed min-w-[120px]"
                    >
                      {isSaving ? (
                        <>
                          <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                          <span>Saving…</span>
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <h2 className="text-2xl font-h2 text-on-surface mb-6">Appearance</h2>
                <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant shadow-sm space-y-6">
                  <div>
                    <h3 className="text-base font-medium text-on-surface mb-4">Theme Preferences</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {(['Light', 'Dark', 'System'] as const).map((themeOption) => (
                        <button
                          key={themeOption}
                          type="button"
                          onClick={() => setTheme(themeOption)}
                          className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all group outline-none focus-visible:ring-2 focus-visible:ring-primary ${currentTheme === themeOption ? 'border-primary bg-primary/5' : 'border-outline-variant hover:border-primary/50'}`}
                        >
                          <div className={`w-full aspect-video rounded-lg ${themeOption === 'Light' ? 'bg-[#f5f5f5]' : themeOption === 'Dark' ? 'bg-[#1a1a1a]' : 'bg-gradient-to-r from-[#f5f5f5] to-[#1a1a1a]'} ring-1 ring-black/10 group-hover:shadow-md transition-shadow`}></div>
                          <span className={`font-medium text-sm transition-colors ${currentTheme === themeOption ? 'text-primary' : 'text-on-surface-variant group-hover:text-on-surface'}`}>{themeOption}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <h2 className="text-2xl font-h2 text-on-surface mb-6">Notifications</h2>
                <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant shadow-sm space-y-6">
                  {['Email Notifications', 'Push Notifications', 'Sound Effects'].map((setting, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-b border-outline-variant/50 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium text-on-surface">{setting}</p>
                        <p className="text-sm text-on-surface-variant mt-0.5">Manage your {setting.toLowerCase()} preferences.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked={idx !== 2} />
                        <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'account' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <h2 className="text-2xl font-h2 text-on-surface mb-6">Account Settings</h2>
                <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant shadow-sm space-y-6">
                  <div>
                    <h3 className="text-base font-medium text-on-surface mb-2">Change Password</h3>
                    <p className="text-sm text-on-surface-variant mb-4">Update your password associated with this account.</p>
                    <button type="button" className="px-4 py-2 bg-surface text-on-surface border border-outline rounded-lg hover:bg-surface-variant transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none">
                      Change Password
                    </button>
                  </div>
                  <div className="pt-6 border-t border-error/20">
                    <h3 className="text-base font-medium text-error mb-2">Danger Zone</h3>
                    <p className="text-sm text-error/80 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                    <button type="button" className="px-4 py-2 bg-error text-on-error rounded-lg hover:bg-error/90 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-error outline-none">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
