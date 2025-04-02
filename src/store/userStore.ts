import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { getRandomAvatar } from "../utils/avatarUtils";

// Types
export type ThemeMode = "light" | "dark" | "system";
export type UIColor =
  | "indigo"
  | "blue"
  | "purple"
  | "teal"
  | "green"
  | "pink"
  | "red"
  | "orange";

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  bio?: string;
  subjects?: string[];
  preferences: {
    theme: "light" | "dark" | "system";
    notifications: boolean;
    focusMode: boolean;
  };
}

export interface UserNote {
  id: string;
  title: string;
  content: string;
  subject: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface UserPlaylist {
  id: string;
  name: string;
  url: string;
  category: string;
  duration?: number;
  tracks?: number;
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  avatar?: string;
  score: number;
  rank: number;
  rankChange: number;
}

export interface UserGoal {
  id: string;
  title: string;
  description?: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  startDate: string;
  endDate: string;
  isCompleted: boolean;
  category: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  dateEarned: string; // ISO string
  isDisplayed: boolean;
}

export interface UIPreferences {
  theme: ThemeMode;
  primaryColor: UIColor;
  fontStyle: "default" | "readable" | "compact";
  reducedMotion: boolean;
  showCompletedTasks: boolean;
  showTimeInPomodoro: boolean;
  defaultView: "week" | "day" | "month";
  enableConfetti: boolean;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  studyReminders: boolean;
  goalAlerts: boolean;
  achievementAlerts: boolean;
  breakReminders: boolean;
  dailySummaries: boolean;
  soundAlerts: boolean;
  vibration: boolean;
}

export interface PomodoroPreferences {
  focusTime: number; // in minutes
  shortBreakTime: number; // in minutes
  longBreakTime: number; // in minutes
  longBreakInterval: number; // after how many sessions
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  soundTheme: "default" | "nature" | "minimal" | "none";
  alarmVolume: number; // 0-100
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  lastPasswordChange: string | null; // ISO string
  activeDevices: number;
  dataRetention: "forever" | "1year" | "6months" | "3months";
  allowDataAnalytics: boolean;
  allowCookies: boolean;
}

export interface UserData {
  profile: UserProfile;
  personalGoals: UserGoal[];
  achievements: Achievement[];
  uiPreferences: UIPreferences;
  notificationPreferences: NotificationPreferences;
  pomodoroPreferences: PomodoroPreferences;
  securitySettings: SecuritySettings;
  userNotes: UserNote[];
  userPlaylists: UserPlaylist[];
  leaderboard: LeaderboardEntry[];
}

// Helper functions
const createDefaultProfile = (): UserProfile => ({
  id: uuidv4(),
  username: "Student",
  email: "student@example.com",
  firstName: "",
  lastName: "",
  profilePicture: null,
  bio: "I am using TrackYouStudy to improve my academic performance.",
  subjects: ["General"],
  preferences: {
    theme: "system",
    notifications: true,
    focusMode: false,
  },
});

const createDefaultGoals = (): UserGoal[] => [
  {
    id: uuidv4(),
    title: "Study time",
    description: "Daily study goal",
    currentValue: 0,
    targetValue: 2,
    unit: "hours",
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    isCompleted: false,
    category: "Education",
  },
  {
    id: uuidv4(),
    title: "Complete assignments",
    description: "Weekly assignment completion",
    currentValue: 0,
    targetValue: 5,
    unit: "tasks",
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    isCompleted: false,
    category: "Education",
  },
];

const createDefaultUIPreferences = (): UIPreferences => ({
  theme: "system",
  primaryColor: "indigo",
  fontStyle: "default",
  reducedMotion: false,
  showCompletedTasks: true,
  showTimeInPomodoro: true,
  defaultView: "week",
  enableConfetti: true,
});

const createDefaultNotificationPreferences = (): NotificationPreferences => ({
  emailNotifications: true,
  pushNotifications: true,
  studyReminders: true,
  goalAlerts: true,
  achievementAlerts: true,
  breakReminders: true,
  dailySummaries: true,
  soundAlerts: true,
  vibration: true,
});

const createDefaultPomodoroPreferences = (): PomodoroPreferences => ({
  focusTime: 25,
  shortBreakTime: 5,
  longBreakTime: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  soundTheme: "default",
  alarmVolume: 80,
});

const createDefaultSecuritySettings = (): SecuritySettings => ({
  twoFactorEnabled: false,
  lastPasswordChange: new Date().toISOString(),
  activeDevices: 1,
  dataRetention: "forever",
  allowDataAnalytics: true,
  allowCookies: true,
});

// Default achievements
const createDefaultAchievements = (): Achievement[] => [
  {
    id: uuidv4(),
    title: "First Steps",
    description: "Created your account and set up your profile",
    icon: "🎓",
    dateEarned: new Date().toISOString(),
    isDisplayed: true,
  },
];

// Create the store
interface UserState {
  name: string;
  email: string;
  avatar: string;
  setUserProfile: (name: string, email: string) => void;
  setAvatar: (avatar: string) => void;
  randomizeAvatar: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      name: "",
      email: "",
      avatar: getRandomAvatar(), // Set a random avatar by default
      setUserProfile: (name: string, email: string) => set({ name, email }),
      setAvatar: (avatar: string) => set({ avatar }),
      randomizeAvatar: () => set({ avatar: getRandomAvatar() }),
    }),
    {
      name: "user-storage",
    }
  )
);
