import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useTaskStore, Task } from "./taskStore";
import { updateGlobalStats } from "./dashboardStore";
import {
  playSound,
  playBackgroundSound,
  pauseBackgroundSound,
  resumeBackgroundSound,
  stopBackgroundSound,
  sendNotification,
  triggerStorageUpdate,
} from "../utils/pomodoroHelpers";
import { v4 as uuidv4 } from "uuid";

export enum TimerStatus {
  Ready = "ready",
  Running = "running",
  Paused = "paused",
  Completed = "completed",
}

export enum TimerType {
  Focus = "focus",
  ShortBreak = "shortBreak",
  LongBreak = "longBreak",
}

export interface PomodoroSession {
  id: string;
  taskId?: string;
  taskName?: string;
  type: TimerType;
  duration: number;
  completedAt?: Date;
  startedAt?: Date;
}

export interface PomodoroStats {
  totalCompletedSessions: number;
  totalFocusTime: number; // in minutes
  dailyStats: {
    [date: string]: {
      sessions: number;
      focusTime: number;
    };
  };
  streak: number;
  lastSessionDate?: string;
}

export interface PomodoroSettings {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  sound: string;
  volume: number;
}

export interface PomodoroInsights {
  totalFocusTime: number;
  weeklyFocusTime: number;
  dailyAverage: number;
  completionRate: number;
  mostProductiveDay: string;
  mostProductiveTime: string;
  focusScore: number;
}

export interface PomodoroStore {
  // Timer state
  currentSession: PomodoroSession | null;
  status: TimerStatus;
  timeRemaining: number;
  completedSessions: PomodoroSession[];
  completedSessionsCount: number;

  // Settings
  settings: PomodoroSettings;

  // Methods
  startSession: (type: TimerType, taskId?: string, taskName?: string) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  stopSession: () => void;
  completeSession: () => void;
  resetSession: () => void;
  updateTimeRemaining: (seconds: number) => void;
  updateSettings: (settings: Partial<PomodoroSettings>) => void;

  // Analytics methods
  getCompletedSessionsByDate: (date: Date) => PomodoroSession[];
  getTotalFocusTime: (period?: "day" | "week" | "month" | "all") => number;
  getPomodoroInsights: () => PomodoroInsights;
  getWeeklyFocusData: () => { currentWeek: number[]; previousWeek: number[] };

  // Add these new methods
  getFocusInsights: () => {
    currentStreak: number;
    longestStreak: number;
    totalFocusTime: number;
    todayFocusTime: number;
    weeklyFocusTime: number[];
    focusScore: number;
  };

  // Add a new function to track accurate time stats for every second spent
  trackRealTimeFocus: (elapsedSeconds: number) => void;
}

const defaultSettings: PomodoroSettings = {
  focusDuration: 25 * 60, // 25 minutes in seconds
  shortBreakDuration: 5 * 60, // 5 minutes in seconds
  longBreakDuration: 15 * 60, // 15 minutes in seconds
  sessionsBeforeLongBreak: 4,
  autoStartBreaks: true,
  autoStartPomodoros: false,
  sound: "bell",
  volume: 50,
};

// Add this helper function before the return statement in the store creation
// This function will update the global stats for every second spent in focus mode
const updateFocusTimeStats = (secondsToAdd: number) => {
  // Get the global unified stats
  try {
    // Convert seconds to minutes for storage
    const minutesToAdd = secondsToAdd / 60;

    // Update the global stats directly in localStorage
    const storageKey = "pomodoro-storage";
    const storageData = JSON.parse(localStorage.getItem(storageKey) || "{}");

    // Get the current date in YYYY-MM-DD format for daily stats
    const today = new Date().toISOString().split("T")[0];

    // Create or update daily stats
    if (!storageData.dailyStats) {
      storageData.dailyStats = {};
    }

    if (!storageData.dailyStats[today]) {
      storageData.dailyStats[today] = {
        sessions: 0,
        focusTime: 0,
      };
    }

    // Update total focus time (convert seconds to minutes)
    storageData.totalFocusTime =
      (storageData.totalFocusTime || 0) + minutesToAdd;

    // Update daily focus time
    storageData.dailyStats[today].focusTime =
      (storageData.dailyStats[today].focusTime || 0) + minutesToAdd;

    // Save back to localStorage
    localStorage.setItem(storageKey, JSON.stringify(storageData));

    // Update the global unified stats if that function exists
    if (typeof updateGlobalStats === "function") {
      updateGlobalStats();
    }
  } catch (error) {
    console.error("Error updating focus time stats:", error);
  }
};

export const usePomodoroStore = create<PomodoroStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentSession: null,
      status: TimerStatus.Ready,
      timeRemaining: defaultSettings.focusDuration,
      completedSessions: [],
      completedSessionsCount: 0,
      settings: defaultSettings,

      // Session management methods
      startSession: (type: TimerType, taskId?: string, taskName?: string) => {
        const { settings } = get();
        let duration = 0;

        switch (type) {
          case TimerType.Focus:
            duration = settings.focusDuration;
            break;
          case TimerType.ShortBreak:
            duration = settings.shortBreakDuration;
            break;
          case TimerType.LongBreak:
            duration = settings.longBreakDuration;
            break;
        }

        const newSession: PomodoroSession = {
          id: uuidv4(),
          taskId,
          taskName,
          type,
          duration,
          startedAt: new Date(),
        };

        set({
          currentSession: newSession,
          status: TimerStatus.Running,
          timeRemaining: duration,
        });
      },

      pauseSession: () => {
        if (get().status === TimerStatus.Running) {
          set({ status: TimerStatus.Paused });
        }
      },

      resumeSession: () => {
        if (get().status === TimerStatus.Paused) {
          set({ status: TimerStatus.Running });
        }
      },

      stopSession: () => {
        set({
          currentSession: null,
          status: TimerStatus.Ready,
          timeRemaining: get().settings.focusDuration,
        });
      },

      completeSession: () => {
        const { currentSession, completedSessions, completedSessionsCount } =
          get();

        if (currentSession) {
          // Make sure we have the current time for completion
          const completedAt = new Date();

          // Create the completed session with final data
          const completedSession = {
            ...currentSession,
            completedAt,
          };

          // Update the store with new completed session
          set({
            completedSessions: [...completedSessions, completedSession],
            completedSessionsCount: completedSessionsCount + 1,
            currentSession: null,
            status: TimerStatus.Completed,
          });

          // If this was a focus session, update all stats
          if (currentSession.type === TimerType.Focus) {
            // Calculate the duration in minutes
            const durationInMinutes = Math.floor(currentSession.duration / 60);

            // Update the stats in localStorage directly
            try {
              // First try to get the existing data from storage
              const storageKey = "pomodoro-storage";
              let storageData;

              try {
                storageData = JSON.parse(
                  localStorage.getItem(storageKey) || "{}"
                );
              } catch (e) {
                // If there's an error parsing the JSON, start with an empty object
                storageData = {};
              }

              // Make sure we have the required properties
              if (!storageData.dailyStats) {
                storageData.dailyStats = {};
              }

              // Get the current date in YYYY-MM-DD format
              const today = completedAt.toISOString().split("T")[0];

              // Make sure we have today's stats
              if (!storageData.dailyStats[today]) {
                storageData.dailyStats[today] = {
                  sessions: 0,
                  focusTime: 0,
                };
              }

              // Increment the session count for today
              storageData.dailyStats[today].sessions =
                (storageData.dailyStats[today].sessions || 0) + 1;

              // Add the full duration to focus time
              storageData.dailyStats[today].focusTime =
                (storageData.dailyStats[today].focusTime || 0) +
                durationInMinutes;

              // Update total stats
              storageData.totalCompletedSessions =
                (storageData.totalCompletedSessions || 0) + 1;

              storageData.totalFocusTime =
                (storageData.totalFocusTime || 0) + durationInMinutes;

              // Save to localStorage
              localStorage.setItem(storageKey, JSON.stringify(storageData));

              // Force a reload of the timer component
              triggerStorageUpdate();

              // Update global stats
              if (typeof updateGlobalStats === "function") {
                updateGlobalStats();
              }

              // Log successful completion for debugging
              console.log("Successfully completed focus session:", {
                duration: durationInMinutes,
                totalFocusTime: storageData.totalFocusTime,
                todayFocusTime: storageData.dailyStats[today].focusTime,
              });
            } catch (error) {
              console.error("Error updating session stats:", error);
            }
          }

          // Auto-start next session if settings allow
          const { settings } = get();
          const isBreak = currentSession.type !== TimerType.Focus;
          const shouldAutoStart = isBreak
            ? settings.autoStartPomodoros
            : settings.autoStartBreaks;

          if (shouldAutoStart) {
            const nextSessionType = isBreak
              ? TimerType.Focus
              : completedSessionsCount % settings.sessionsBeforeLongBreak === 0
              ? TimerType.LongBreak
              : TimerType.ShortBreak;

            setTimeout(() => {
              get().startSession(
                nextSessionType,
                currentSession.taskId,
                currentSession.taskName
              );
            }, 1000);
          } else {
            set({
              status: TimerStatus.Ready,
              timeRemaining: settings.focusDuration,
            });
          }
        }
      },

      resetSession: () => {
        const { currentSession } = get();
        if (currentSession) {
          set({ timeRemaining: currentSession.duration });
        }
      },

      updateTimeRemaining: (seconds: number) => {
        set({ timeRemaining: seconds });

        // Update real-time stats for every second spent in focus mode
        const { currentSession, status } = get();
        if (
          currentSession &&
          currentSession.type === TimerType.Focus &&
          status === TimerStatus.Running
        ) {
          // Track every second in focus mode
          updateFocusTimeStats(1); // Track 1 second
        }
      },

      // Add a new function to track accurate time stats for every second spent
      trackRealTimeFocus: (elapsedSeconds: number) => {
        const { currentSession, status } = get();
        if (
          currentSession &&
          currentSession.type === TimerType.Focus &&
          status === TimerStatus.Running
        ) {
          // Track the actual elapsed seconds
          updateFocusTimeStats(elapsedSeconds);
        }
      },

      updateSettings: (settings: Partial<PomodoroSettings>) => {
        const currentSettings = get().settings;
        set({ settings: { ...currentSettings, ...settings } });
      },

      // Analytics methods
      getCompletedSessionsByDate: (date: Date) => {
        const { completedSessions } = get();
        const targetDate = new Date(date);
        targetDate.setHours(0, 0, 0, 0);

        return completedSessions.filter((session) => {
          if (!session.completedAt) return false;
          const sessionDate = new Date(session.completedAt);
          sessionDate.setHours(0, 0, 0, 0);
          return sessionDate.getTime() === targetDate.getTime();
        });
      },

      getTotalFocusTime: (period = "all") => {
        const { completedSessions } = get();
        const now = new Date();
        const focusSessions = completedSessions.filter(
          (session) => session.type === TimerType.Focus
        );

        // Filter sessions based on the specified period
        const filteredSessions = focusSessions.filter((session) => {
          if (!session.completedAt) return false;
          const completedAt = new Date(session.completedAt);

          switch (period) {
            case "day":
              return (
                completedAt.getDate() === now.getDate() &&
                completedAt.getMonth() === now.getMonth() &&
                completedAt.getFullYear() === now.getFullYear()
              );
            case "week":
              const oneWeekAgo = new Date(now);
              oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
              return completedAt >= oneWeekAgo;
            case "month":
              return (
                completedAt.getMonth() === now.getMonth() &&
                completedAt.getFullYear() === now.getFullYear()
              );
            case "all":
            default:
              return true;
          }
        });

        // Calculate total time in minutes
        const totalMinutes = filteredSessions.reduce(
          (total, session) => total + session.duration / 60,
          0
        );

        return totalMinutes;
      },

      getPomodoroInsights: () => {
        const { completedSessions } = get();

        // Calculate total focus time (in hours)
        const focusSessions = completedSessions.filter(
          (session) => session.type === TimerType.Focus
        );

        const totalFocusTime =
          focusSessions.reduce(
            (total, session) => total + session.duration,
            0
          ) / 3600;

        // Calculate weekly focus time
        const now = new Date();
        const startOfWeek = new Date();
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const weeklyFocusSessions = focusSessions.filter((session) => {
          const completedAt = new Date(session.completedAt!);
          return completedAt >= startOfWeek && completedAt <= now;
        });

        const weeklyFocusTime =
          weeklyFocusSessions.reduce(
            (total, session) => total + session.duration,
            0
          ) / 3600;

        // Calculate daily average for the past 7 days
        const last7Days = [...Array(7)].map((_, i) => {
          const day = new Date();
          day.setDate(day.getDate() - i);
          day.setHours(0, 0, 0, 0);
          return day;
        });

        const dailyTotals = last7Days.map((day) => {
          const sessionsForDay = get().getCompletedSessionsByDate(day);
          const focusSessionsForDay = sessionsForDay.filter(
            (session) => session.type === TimerType.Focus
          );
          return (
            focusSessionsForDay.reduce(
              (total, session) => total + session.duration,
              0
            ) / 3600
          );
        });

        const dailyAverage =
          dailyTotals.reduce((sum, hours) => sum + hours, 0) / 7;

        // Calculate completion rate
        const totalSessions = completedSessions.length;
        const completedFocusSessions = focusSessions.length;
        const completionRate =
          totalSessions > 0
            ? (completedFocusSessions / totalSessions) * 100
            : 0;

        // Find most productive day and time
        const dayMap = new Map<string, number>();
        const hourMap = new Map<number, number>();

        focusSessions.forEach((session) => {
          if (session.completedAt) {
            const date = new Date(session.completedAt);
            const day = date.toLocaleDateString("en-US", { weekday: "long" });
            const hour = date.getHours();

            dayMap.set(day, (dayMap.get(day) || 0) + session.duration);
            hourMap.set(hour, (hourMap.get(hour) || 0) + session.duration);
          }
        });

        let mostProductiveDay = "No data";
        let maxDayMinutes = 0;

        dayMap.forEach((minutes, day) => {
          if (minutes > maxDayMinutes) {
            mostProductiveDay = day;
            maxDayMinutes = minutes;
          }
        });

        let mostProductiveHour = -1;
        let maxHourMinutes = 0;

        hourMap.forEach((minutes, hour) => {
          if (minutes > maxHourMinutes) {
            mostProductiveHour = hour;
            maxHourMinutes = minutes;
          }
        });

        // Format the most productive time
        const mostProductiveTime =
          mostProductiveHour >= 0
            ? `${mostProductiveHour % 12 || 12}${
                mostProductiveHour >= 12 ? "PM" : "AM"
              }`
            : "No data";

        // Calculate focus score (0-100)
        // Based on weighted combination of weekly time, completion rate, and consistency
        const weeklyFocusScore = Math.min(100, (weeklyFocusTime / 15) * 100); // 15h/week is max
        const completionRateScore = completionRate;
        const consistencyScore = Math.min(100, (dailyAverage / 2) * 100); // 2h/day is max

        const focusScore =
          weeklyFocusScore * 0.4 +
          completionRateScore * 0.3 +
          consistencyScore * 0.3;

        return {
          totalFocusTime,
          weeklyFocusTime,
          dailyAverage,
          completionRate,
          mostProductiveDay,
          mostProductiveTime,
          focusScore,
        };
      },

      getWeeklyFocusData: () => {
        const { completedSessions } = get();

        // Get only focus sessions
        const focusSessions = completedSessions.filter(
          (session) => session.type === TimerType.Focus
        );

        // Get date ranges
        const now = new Date();
        const currentWeekDays: Date[] = [];
        const previousWeekDays: Date[] = [];

        // Calculate start of current week (Sunday)
        const dayOfWeek = now.getDay();
        const startOfCurrentWeek = new Date(now);
        startOfCurrentWeek.setDate(now.getDate() - dayOfWeek);
        startOfCurrentWeek.setHours(0, 0, 0, 0);

        // Calculate start of previous week
        const startOfPreviousWeek = new Date(startOfCurrentWeek);
        startOfPreviousWeek.setDate(startOfCurrentWeek.getDate() - 7);

        // Create array of days for current week
        for (let i = 0; i < 7; i++) {
          const day = new Date(startOfCurrentWeek);
          day.setDate(startOfCurrentWeek.getDate() + i);
          currentWeekDays.push(day);

          const prevDay = new Date(startOfPreviousWeek);
          prevDay.setDate(startOfPreviousWeek.getDate() + i);
          previousWeekDays.push(prevDay);
        }

        // Calculate hours for each day in current week
        const currentWeekHours = currentWeekDays.map((day) => {
          const startOfDay = new Date(day);
          startOfDay.setHours(0, 0, 0, 0);

          const endOfDay = new Date(day);
          endOfDay.setHours(23, 59, 59, 999);

          const sessionsForDay = focusSessions.filter((session) => {
            if (!session.completedAt) return false;
            const completedAt = new Date(session.completedAt);
            return completedAt >= startOfDay && completedAt <= endOfDay;
          });

          return sessionsForDay.reduce(
            (total, session) => total + session.duration / 3600,
            0
          );
        });

        // Calculate hours for each day in previous week
        const previousWeekHours = previousWeekDays.map((day) => {
          const startOfDay = new Date(day);
          startOfDay.setHours(0, 0, 0, 0);

          const endOfDay = new Date(day);
          endOfDay.setHours(23, 59, 59, 999);

          const sessionsForDay = focusSessions.filter((session) => {
            if (!session.completedAt) return false;
            const completedAt = new Date(session.completedAt);
            return completedAt >= startOfDay && completedAt <= endOfDay;
          });

          return sessionsForDay.reduce(
            (total, session) => total + session.duration / 3600,
            0
          );
        });

        return {
          currentWeek: currentWeekHours,
          previousWeek: previousWeekHours,
        };
      },

      // Add this new method
      getFocusInsights: () => {
        const sessions = get().completedSessions || [];
        const now = new Date();
        const today = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );

        // Calculate total focus time in minutes
        const totalFocusTime = sessions.reduce((total, session) => {
          return total + (session?.duration || 0);
        }, 0);

        // Calculate today's focus time
        const todayFocusTime = sessions
          .filter((session) => {
            if (!session?.completedAt) return false;
            const sessionDate = new Date(session.completedAt);
            return (
              sessionDate.getFullYear() === today.getFullYear() &&
              sessionDate.getMonth() === today.getMonth() &&
              sessionDate.getDate() === today.getDate()
            );
          })
          .reduce((total, session) => {
            return total + (session?.duration || 0);
          }, 0);

        // Calculate weekly focus time (last 7 days)
        const weeklyFocusTime = Array(7).fill(0);
        sessions.forEach((session) => {
          if (!session?.completedAt) return;
          const sessionDate = new Date(session.completedAt);
          const dayDiff = Math.floor(
            (now.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          if (dayDiff >= 0 && dayDiff < 7) {
            weeklyFocusTime[6 - dayDiff] += session?.duration || 0;
          }
        });

        // Calculate streak
        const dailySessionMap = new Map<string, boolean>();
        sessions.forEach((session) => {
          if (!session?.completedAt) return;
          const dateStr = new Date(session.completedAt)
            .toISOString()
            .split("T")[0];
          dailySessionMap.set(dateStr, true);
        });

        let currentStreak = 0;
        let checkDate = new Date(today);

        // Count backward from yesterday
        checkDate.setDate(checkDate.getDate() - 1);

        while (dailySessionMap.has(checkDate.toISOString().split("T")[0])) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        }

        // Add today if there were sessions
        if (dailySessionMap.has(today.toISOString().split("T")[0])) {
          currentStreak++;
        }

        // Calculate longest streak
        let longestStreak = currentStreak;
        const sortedDates = [...dailySessionMap.keys()]
          .map((dateStr) => new Date(dateStr))
          .sort((a, b) => a.getTime() - b.getTime());

        if (sortedDates.length > 0) {
          let tempStreak = 1;
          for (let i = 1; i < sortedDates.length; i++) {
            const prev = sortedDates[i - 1];
            const curr = sortedDates[i];
            const dayDiff = Math.floor(
              (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
            );

            if (dayDiff === 1) {
              tempStreak++;
              longestStreak = Math.max(longestStreak, tempStreak);
            } else {
              tempStreak = 1;
            }
          }
        }

        // Calculate focus score (algorithm could be adjusted)
        const focusScore = Math.min(
          100,
          Math.round(
            ((todayFocusTime / 60) * 10 || 0) + // Today's focus time (in hours) * 10
              (currentStreak * 5 || 0) + // Current streak * 5
              (totalFocusTime / (60 * 10) || 0) // Total focus time (in hours) / 10
          )
        );

        return {
          currentStreak,
          longestStreak,
          totalFocusTime,
          todayFocusTime,
          weeklyFocusTime,
          focusScore,
        };
      },
    }),
    {
      name: "pomodoro-storage",
      partialize: (state) => ({
        completedSessions: state.completedSessions,
        completedSessionsCount: state.completedSessionsCount,
        settings: state.settings,
      }),
    }
  )
);
