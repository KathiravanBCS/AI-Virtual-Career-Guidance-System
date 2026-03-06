export interface SettingsData {
  notifications: {
    email: boolean;
    push: boolean;
    dailyReminder: boolean;
  };
  theme: 'dark' | 'light';
  language: string;
  privacy: {
    profilePublic: boolean;
    showInLeaderboard: boolean;
  };
}
