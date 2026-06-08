import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Settings as SettingsIcon, Sun, Moon, Save, Loader2, User } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Settings = () => {
  const { user, updateProfile, isAuthenticated } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  
  const [username, setUsername] = useState(user?.username || '');
  const [isSaving, setIsSaving] = useState(false);

  // Sync initial state if user profile loaded late
  React.useEffect(() => {
    if (user?.username) {
      setUsername(user.username);
    }
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error('Username cannot be empty');
      return;
    }
    
    setIsSaving(true);
    const success = await updateProfile(username, user?.avatar || '');
    setIsSaving(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <SettingsIcon className="h-8 w-8 text-violet-500" />
          Settings
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize your gallery experience, theme, and collector preferences.
        </p>
      </div>

      <div className="space-y-6">
        
        {/* Card 1: Theme Settings */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/50 dark:border-slate-800/50 space-y-6">
          <div>
            <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100">
              Display Theme
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Select your preferred appearance mode.
            </p>
          </div>

          <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/40">
            <div className="flex items-center gap-3">
              {isDarkMode ? (
                <Moon className="h-5 w-5 text-violet-400" />
              ) : (
                <Sun className="h-5 w-5 text-amber-500" />
              )}
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Dark Mode
              </span>
            </div>
            
            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${
                isDarkMode ? 'bg-violet-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                  isDarkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Card 2: Profile Settings */}
        {isAuthenticated && (
          <form onSubmit={handleSaveProfile} className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/50 dark:border-slate-800/50 space-y-6">
            <div>
              <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <User className="h-5 w-5 text-violet-500" />
                Profile Preferences
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                Customize your public on-chain profile name.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Collector Name
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter collector nickname..."
                className="input-field font-semibold"
                maxLength={25}
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="btn-primary"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

export default Settings;
