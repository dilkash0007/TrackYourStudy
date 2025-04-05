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
  sessionsUntilLongBreak: number; // Alias for longBreakInterval for backward compatibility
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  soundTheme: "default" | "nature" | "minimal" | "none";
  alarmVolume: number; // 0-100
  timerCompleteSound: string; // Sound file to play when timer completes
  soundVolume: number; // 0-100
  autoStartFocus: boolean; // Auto start focus session
  showNotifications: boolean; // Show notifications
  playSound: boolean; // Play sound when timer completes
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
  profilePicture: undefined,
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
  sessionsUntilLongBreak: 4,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  soundTheme: "default",
  alarmVolume: 80,
  timerCompleteSound: "",
  soundVolume: 80,
  autoStartFocus: false,
  showNotifications: true,
  playSound: true,
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
  isAuthenticated: boolean;
  password: string;
  bio: string;
  educationLevel: string;
  institution: string;
  studyField: string;
  birthday: string;
  phoneNumber: string;
  location: string;
  theme: ThemeMode;
  uiPreferences: UIPreferences;
  notificationPreferences: NotificationPreferences;
  pomodoroPreferences: PomodoroPreferences;
  securitySettings: SecuritySettings;
  userProfile: UserProfile;
  userGoals: UserGoal[];
  goals: UserGoal[];
  setUserProfile: (name: string, email: string) => void;
  setDetailedProfile: (profileData: {
    bio?: string;
    educationLevel?: string;
    institution?: string;
    studyField?: string;
    birthday?: string;
    phoneNumber?: string;
    location?: string;
  }) => void;
  setAvatar: (avatar: string) => void;
  randomizeAvatar: () => void;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string) => void;
  logout: () => void;
  updateTheme: (theme: ThemeMode) => void;
  updateUIPreferences: (preferences: Partial<UIPreferences>) => void;
  updateNotificationPreferences: (
    preferences: Partial<NotificationPreferences>
  ) => void;
  updatePomodoroPreferences: (
    preferences: Partial<PomodoroPreferences>
  ) => void;
  updateSecuritySettings: (settings: Partial<SecuritySettings>) => void;
  addGoal: (goal: Omit<UserGoal, "id">) => void;
  updateGoal: (id: string, goalData: Partial<UserGoal>) => void;
  deleteGoal: (id: string) => void;
  getNotes: () => UserNote[];
  getPlaylists: () => UserPlaylist[];
  getLeaderboard: () => LeaderboardEntry[];
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      name: "",
      email: "",
      avatar: getRandomAvatar(), // Set a random avatar by default
      isAuthenticated: false,
      password: "",
      bio: "",
      educationLevel: "",
      institution: "",
      studyField: "",
      birthday: "",
      phoneNumber: "",
      location: "",
      theme: "system" as ThemeMode,
      uiPreferences: createDefaultUIPreferences(),
      notificationPreferences: createDefaultNotificationPreferences(),
      pomodoroPreferences: createDefaultPomodoroPreferences(),
      securitySettings: createDefaultSecuritySettings(),
      userProfile: createDefaultProfile(),
      userGoals: createDefaultGoals(),
      goals: createDefaultGoals(),
      setUserProfile: (name: string, email: string) => set({ name, email }),
      setDetailedProfile: (profileData) => {
        // Extract all possible fields to ensure they're properly typed
        const {
          bio,
          educationLevel,
          institution,
          studyField,
          birthday,
          phoneNumber,
          location,
        } = profileData;

        // Create an update object that only includes defined values
        const updateObj: Partial<UserState> = {};

        // Only add properties that are defined
        if (bio !== undefined) updateObj.bio = bio;
        if (educationLevel !== undefined)
          updateObj.educationLevel = educationLevel;
        if (institution !== undefined) updateObj.institution = institution;
        if (studyField !== undefined) updateObj.studyField = studyField;
        if (birthday !== undefined) updateObj.birthday = birthday;
        if (phoneNumber !== undefined) updateObj.phoneNumber = phoneNumber;
        if (location !== undefined) updateObj.location = location;

        // Update the state with the filtered object
        set((state) => ({ ...state, ...updateObj }));
      },
      setAvatar: (avatar: string) => set({ avatar }),
      randomizeAvatar: () => set({ avatar: getRandomAvatar() }),
      login: (email: string, password: string) => {
        const state = get();

        // In a real app, this would validate against a backend
        if (state.email === email && state.password === password) {
          // Just set authentication status, preserve other user details
          set({ isAuthenticated: true });
          return true;
        }

        // If this is the first login and no account exists yet
        if (!state.email && !state.password) {
          // Create a basic account with the provided credentials
          const username = email.split("@")[0]; // Simple way to get a default username
          set({
            name: username, // Use email username part as default name
            email,
            password,
            isAuthenticated: true,
          });
          return true;
        }

        return false;
      },
      signup: (name: string, email: string, password: string) => {
        // Create a full account with the provided credentials
        set({
          name,
          email,
          password,
          isAuthenticated: true,
        });
      },
      logout: () => {
        // Only set authentication status to false, preserve user details
        set({ isAuthenticated: false });
      },
      updateTheme: (theme: ThemeMode) => {
        set({ theme });
        const uiPreferences = get().uiPreferences;
        set({ uiPreferences: { ...uiPreferences, theme } });
      },
      updateUIPreferences: (preferences: Partial<UIPreferences>) =>
        set((state) => ({
          uiPreferences: { ...state.uiPreferences, ...preferences },
        })),
      updateNotificationPreferences: (
        preferences: Partial<NotificationPreferences>
      ) =>
        set((state) => ({
          notificationPreferences: {
            ...state.notificationPreferences,
            ...preferences,
          },
        })),
      updatePomodoroPreferences: (preferences: Partial<PomodoroPreferences>) =>
        set((state) => ({
          pomodoroPreferences: { ...state.pomodoroPreferences, ...preferences },
        })),
      updateSecuritySettings: (settings: Partial<SecuritySettings>) =>
        set((state) => ({
          securitySettings: { ...state.securitySettings, ...settings },
        })),
      addGoal: (goal: Omit<UserGoal, "id">) =>
        set((state) => ({
          goals: [...state.goals, { ...goal, id: uuidv4() }],
          userGoals: [...state.userGoals, { ...goal, id: uuidv4() }],
        })),
      updateGoal: (id: string, goalData: Partial<UserGoal>) =>
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === id ? { ...goal, ...goalData } : goal
          ),
          userGoals: state.userGoals.map((goal) =>
            goal.id === id ? { ...goal, ...goalData } : goal
          ),
        })),
      deleteGoal: (id: string) =>
        set((state) => ({
          goals: state.goals.filter((goal) => goal.id !== id),
          userGoals: state.userGoals.filter((goal) => goal.id !== id),
        })),
      getNotes: () => {
        // Return mock notes
        return [
          {
            id: "note1",
            title: "Study Notes",
            content: "Important study material",
            subject: "Computer Science",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            tags: ["Study", "CS"],
          },
        ];
      },
      getPlaylists: () => {
        // Return mock playlists
        return [
          {
            id: "playlist1",
            name: "Study Music",
            url: "https://example.com/playlist",
            category: "Focus",
          },
        ];
      },
      getLeaderboard: () => {
        // Return mock leaderboard
        return [
          {
            id: "user1",
            username: "TopStudent",
            avatar: getRandomAvatar(),
            score: 1000,
            rank: 1,
            rankChange: 0,
          },
        ];
      },
    }),
    {
      name: "user-storage",
    }
  )
);
