import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { differenceInHours } from "date-fns";
import { usePlannerStore } from "./plannerStore";
import { useTaskStore } from "./taskStore";
import { usePomodoroStore } from "./pomodoroStore";

// Types
export interface StudySession {
  id: string;
  date: string; // ISO string
  duration: number; // in minutes
  subject: string;
  completed: boolean;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string | null; // ISO string
}

export interface StudyTip {
  id: string;
  tip: string;
  category: "productivity" | "focus" | "memory" | "organization" | "wellbeing";
}

export interface StudyPlaylist {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  sourceUrl: string;
  category: "focus" | "ambient" | "classical" | "lofi" | "nature";
  duration: number; // in minutes
  favorite: boolean;
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  profilePicture: string | null;
  totalHours: number;
  streak: number;
  level: number;
}

export interface DashboardStats {
  totalStudyHours: number;
  weeklyStudyHours: number;
  monthlyStudyHours: number;
  totalTasksCompleted: number;
  weeklyTasksCompleted: number;
  monthlyTasksCompleted: number;
  totalPomodoroSessions: number;
  weeklyPomodoroSessions: number;
  monthlyPomodoroSessions: number;
  studySubjects: { [key: string]: number }; // subject: hours
  productiveHours: { [key: string]: number }; // hour of day: productivity score
  weekdayProductivity: { [key: string]: number }; // day of week: productivity score
}

interface DashboardStore {
  studySessions: StudySession[];
  streakData: StreakData;
  studyTips: StudyTip[];
  playlists: StudyPlaylist[];
  leaderboard: LeaderboardEntry[];
  dashboardStats: DashboardStats;
  dailyQuote: {
    quote: string;
    author: string;
    date: string; // ISO string
  };

  // Actions
  addStudySession: (session: Omit<StudySession, "id">) => void;
  updateStudySession: (
    id: string,
    updates: Partial<Omit<StudySession, "id">>
  ) => void;
  deleteStudySession: (id: string) => void;
  completeStudySession: (id: string) => void;

  addStudyTip: (tip: Omit<StudyTip, "id">) => void;
  deleteStudyTip: (id: string) => void;

  addPlaylist: (playlist: Omit<StudyPlaylist, "id">) => void;
  updatePlaylist: (
    id: string,
    updates: Partial<Omit<StudyPlaylist, "id">>
  ) => void;
  deletePlaylist: (id: string) => void;
  toggleFavoritePlaylist: (id: string) => void;

  updateDailyQuote: (quote: string, author: string) => void;

  calculateStats: () => void;
  updateStreak: () => void;
  refreshLeaderboard: () => void;
}

// Helper functions
const createDefaultStudySessions = (): StudySession[] => [];

const createDefaultStreakData = (): StreakData => ({
  currentStreak: 3,
  longestStreak: 5,
  lastStudyDate: new Date(Date.now() - 86400000).toISOString(), // yesterday
});

const createDefaultStudyTips = (): StudyTip[] => [
  {
    id: uuidv4(),
    tip: "Use the Pomodoro Technique: 25 minutes of focused study followed by a 5-minute break.",
    category: "productivity",
  },
  {
    id: uuidv4(),
    tip: "Stay hydrated! Drinking water improves brain function and concentration.",
    category: "wellbeing",
  },
  {
    id: uuidv4(),
    tip: "Create mind maps to connect related concepts and improve understanding.",
    category: "memory",
  },
];

const createDefaultPlaylists = (): StudyPlaylist[] => [
  {
    id: uuidv4(),
    title: "Lofi Study Beats",
    description: "Relaxing lofi hip hop beats to study and focus",
    imageUrl: "https://i.imgur.com/3vVGHWA.jpg",
    sourceUrl: "https://open.spotify.com/playlist/37i9dQZF1DX8Uebhn9wzrS",
    category: "lofi",
    duration: 120,
    favorite: true,
  },
  {
    id: uuidv4(),
    title: "Classical Focus",
    description: "Classical music to improve concentration and focus",
    imageUrl: "https://i.imgur.com/4Z1YLhG.jpg",
    sourceUrl: "https://open.spotify.com/playlist/37i9dQZF1DWWEJlAGA9gs0",
    category: "classical",
    duration: 180,
    favorite: false,
  },
  {
    id: uuidv4(),
    title: "Nature Sounds",
    description: "Ambient nature sounds for relaxation and focus",
    imageUrl: "https://i.imgur.com/2HG4Mcx.jpg",
    sourceUrl: "https://open.spotify.com/playlist/37i9dQZF1DX4aYNO8X5RpR",
    category: "nature",
    duration: 240,
    favorite: true,
  },
];

const createDefaultLeaderboard = (): LeaderboardEntry[] => [
  {
    id: uuidv4(),
    username: "StudyMaster",
    profilePicture: null,
    totalHours: 120,
    streak: 10,
    level: 8,
  },
  {
    id: uuidv4(),
    username: "BrainPower",
    profilePicture: null,
    totalHours: 105,
    streak: 7,
    level: 7,
  },
  {
    id: uuidv4(),
    username: "FocusNinja",
    profilePicture: null,
    totalHours: 98,
    streak: 5,
    level: 6,
  },
  {
    id: uuidv4(),
    username: "Student",
    profilePicture: null,
    totalHours: 82,
    streak: 3,
    level: 5,
  },
  {
    id: uuidv4(),
    username: "AceMaster",
    profilePicture: null,
    totalHours: 75,
    streak: 4,
    level: 4,
  },
];

const createDefaultDashboardStats = (): DashboardStats => ({
  totalStudyHours: 0,
  weeklyStudyHours: 0,
  monthlyStudyHours: 0,
  totalTasksCompleted: 0,
  weeklyTasksCompleted: 0,
  monthlyTasksCompleted: 0,
  totalPomodoroSessions: 0,
  weeklyPomodoroSessions: 0,
  monthlyPomodoroSessions: 0,
  studySubjects: {},
  productiveHours: {},
  weekdayProductivity: {
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
    Saturday: 0,
    Sunday: 0,
  },
});

const createDefaultDailyQuote = (): {
  quote: string;
  author: string;
  date: string;
} => ({
  quote: "The secret of getting ahead is getting started.",
  author: "Mark Twain",
  date: new Date().toISOString(),
});

// Add a global variable to store the unified stats
let globalUnifiedStats: any = null;

// Add a function to get unified data for all pages
export const getUnifiedAppStats = () => {
  // If we already have the stats, return them
  if (globalUnifiedStats) {
    return globalUnifiedStats;
  }

  const dashboardStore = useDashboardStore.getState();
  const plannerStore = usePlannerStore.getState();
  const taskStore = useTaskStore.getState();
  const pomodoroStore = usePomodoroStore.getState();

  // Get session stats
  const sessionStats = plannerStore.getSessionStats();

  // Get task summary
  const taskSummary = taskStore.getTaskSummary();

  // Get pomodoro insights
  const pomodoroInsights = pomodoroStore.getFocusInsights();

  // Update streak info
  dashboardStore.updateStreak();

  // Create unified stats object
  const unifiedStats = {
    totalHours: sessionStats.totalHours || 0,
    completedTasks: taskSummary.completed || 0,
    currentStreak: sessionStats.currentStreak || 0,
    focusScore: pomodoroInsights.focusScore || 0,
    streakData: dashboardStore.streakData,
    taskStats: taskSummary,
    sessionStats: sessionStats,
    pomodoroStats: pomodoroInsights,
  };

  // Save stats globally
  globalUnifiedStats = unifiedStats;

  return unifiedStats;
};

// Function to update the global stats (call this when data changes)
export const updateGlobalStats = () => {
  // Clear the cached stats
  globalUnifiedStats = null;
  // Fetch fresh stats
  return getUnifiedAppStats();
};

// Create the store
export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set, get) => ({
      studySessions: createDefaultStudySessions(),
      streakData: createDefaultStreakData(),
      studyTips: createDefaultStudyTips(),
      playlists: createDefaultPlaylists(),
      leaderboard: createDefaultLeaderboard(),
      dashboardStats: createDefaultDashboardStats(),
      dailyQuote: createDefaultDailyQuote(),

      addStudySession: (session) =>
        set((state) => ({
          studySessions: [...state.studySessions, { id: uuidv4(), ...session }],
        })),

      updateStudySession: (id, updates) =>
        set((state) => ({
          studySessions: state.studySessions.map((session) =>
            session.id === id ? { ...session, ...updates } : session
          ),
        })),

      deleteStudySession: (id) =>
        set((state) => ({
          studySessions: state.studySessions.filter(
            (session) => session.id !== id
          ),
        })),

      completeStudySession: (id) =>
        set((state) => ({
          studySessions: state.studySessions.map((session) =>
            session.id === id ? { ...session, completed: true } : session
          ),
        })),

      addStudyTip: (tip) =>
        set((state) => ({
          studyTips: [...state.studyTips, { id: uuidv4(), ...tip }],
        })),

      deleteStudyTip: (id) =>
        set((state) => ({
          studyTips: state.studyTips.filter((tip) => tip.id !== id),
        })),

      addPlaylist: (playlist) =>
        set((state) => ({
          playlists: [...state.playlists, { id: uuidv4(), ...playlist }],
        })),

      updatePlaylist: (id, updates) =>
        set((state) => ({
          playlists: state.playlists.map((playlist) =>
            playlist.id === id ? { ...playlist, ...updates } : playlist
          ),
        })),

      deletePlaylist: (id) =>
        set((state) => ({
          playlists: state.playlists.filter((playlist) => playlist.id !== id),
        })),

      toggleFavoritePlaylist: (id) =>
        set((state) => ({
          playlists: state.playlists.map((playlist) =>
            playlist.id === id
              ? { ...playlist, favorite: !playlist.favorite }
              : playlist
          ),
        })),

      updateDailyQuote: (quote, author) =>
        set({
          dailyQuote: {
            quote,
            author,
            date: new Date().toISOString(),
          },
        }),

      calculateStats: () => {
        const { studySessions } = get();
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        // Calculate study hours
        const totalStudyHours = studySessions.reduce(
          (total, session) => total + session.duration / 60,
          0
        );

        const weeklyStudyHours = studySessions
          .filter((session) => new Date(session.date) >= weekAgo)
          .reduce((total, session) => total + session.duration / 60, 0);

        const monthlyStudyHours = studySessions
          .filter((session) => new Date(session.date) >= monthAgo)
          .reduce((total, session) => total + session.duration / 60, 0);

        // Calculate subject breakdown
        const studySubjects: { [key: string]: number } = {};
        studySessions.forEach((session) => {
          const subject = session.subject;
          const hours = session.duration / 60;
          studySubjects[subject] = (studySubjects[subject] || 0) + hours;
        });

        // Update stats
        set((state) => ({
          dashboardStats: {
            ...state.dashboardStats,
            totalStudyHours,
            weeklyStudyHours,
            monthlyStudyHours,
            studySubjects,
          },
        }));
      },

      updateStreak: () => {
        const { studySessions, streakData } = get();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Sort sessions by date
        const sortedSessions = [...studySessions].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        if (sortedSessions.length === 0) {
          set({
            streakData: {
              currentStreak: 0,
              longestStreak: 0,
              lastStudyDate: null,
            },
          });
          return;
        }

        const lastSession = sortedSessions[0];
        const lastStudyDate = new Date(lastSession.date);
        lastStudyDate.setHours(0, 0, 0, 0);

        // Check if studied today
        const studiedToday = lastStudyDate.getTime() === today.getTime();

        // Check if studied yesterday
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const studiedYesterday =
          lastStudyDate.getTime() === yesterday.getTime();

        let { currentStreak, longestStreak } = streakData;

        // If studied today, keep streak
        if (studiedToday) {
          // No change to current streak
        }
        // If studied yesterday, continue streak
        else if (studiedYesterday) {
          // No change to current streak
        }
        // If more than 1 day gap, reset streak
        else {
          const daysSinceLastSession =
            differenceInHours(today, lastStudyDate) / 24;
          if (daysSinceLastSession > 1) {
            currentStreak = 0;
          }
        }

        // Update longest streak if needed
        if (currentStreak > longestStreak) {
          longestStreak = currentStreak;
        }

        set({
          streakData: {
            currentStreak,
            longestStreak,
            lastStudyDate: lastSession.date,
          },
        });
      },

      refreshLeaderboard: () => {
        // In a real app, this would fetch from an API
        // For now, we'll just randomize the existing leaderboard a bit
        set((state) => {
          const updatedLeaderboard = state.leaderboard.map((entry) => ({
            ...entry,
            totalHours: entry.totalHours + Math.floor(Math.random() * 5),
            streak: Math.max(1, entry.streak + (Math.random() > 0.5 ? 1 : -1)),
          }));

          // Sort by totalHours
          updatedLeaderboard.sort((a, b) => b.totalHours - a.totalHours);

          return { leaderboard: updatedLeaderboard };
        });
      },
    }),
    {
      name: "dashboard-store",
    }
  )
);
