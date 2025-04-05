import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useTaskStore } from "./taskStore";
import { usePomodoroStore } from "./pomodoroStore";
import { useMotivationStore } from "./motivationStore";

// Types for Study Planner
export interface StudySession {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  category: string;
  priority: "low" | "medium" | "high";
  isCompleted: boolean;
  associatedTaskIds: string[];
  notesContent?: string;
  pomodoroCount: number;
  completedPomodoros: number;
}

export interface StudyCategory {
  id: string;
  name: string;
  color: string;
}

export interface StudyGoal {
  id: string;
  title: string;
  targetHours: number;
  currentHours: number;
  category: string;
  startDate: string;
  endDate: string;
  isCompleted: boolean;
}

export interface Filter {
  categories: string[];
  priority: ("low" | "medium" | "high")[];
  showCompleted: boolean;
  dateRange: {
    startDate: string | null;
    endDate: string | null;
  };
}

export interface PlannerStore {
  // Study Sessions
  sessions: StudySession[];
  addSession: (session: Omit<StudySession, "id">) => string;
  updateSession: (
    id: string,
    updates: Partial<Omit<StudySession, "id">>
  ) => void;
  deleteSession: (id: string) => void;
  completeSession: (id: string) => void;
  getSessions: (startDate: string, endDate: string) => StudySession[];

  // Added getSessionStats function
  getSessionStats: () => {
    totalHours: number;
    thisWeekHours: number;
    completedSessions: number;
    pendingSessions: number;
    currentStreak: number;
  };

  // Categories
  categories: StudyCategory[];
  addCategory: (category: Omit<StudyCategory, "id">) => void;
  updateCategory: (
    id: string,
    updates: Partial<Omit<StudyCategory, "id">>
  ) => void;
  deleteCategory: (id: string) => void;

  // Goals
  goals: StudyGoal[];
  addGoal: (goal: Omit<StudyGoal, "id">) => void;
  updateGoal: (id: string, updates: Partial<Omit<StudyGoal, "id">>) => void;
  deleteGoal: (id: string) => void;
  completeGoal: (id: string) => void;

  // Filters
  activeFilters: Filter;
  updateFilters: (filters: Partial<Filter>) => void;
  resetFilters: () => void;

  // Stats
  getTotalStudyHours: (startDate: string, endDate: string) => number;
  getCategoryBreakdown: (
    startDate: string,
    endDate: string
  ) => { category: string; hours: number }[];
  getCompletionRate: (startDate: string, endDate: string) => number;
  getCurrentStreak: () => number;

  // Integration
  suggestStudyTimes: (
    duration: number,
    preferredDates?: string[]
  ) => { startTime: string; endTime: string }[];
  getSuggestedSessions: () => Partial<StudySession>[];
  syncWithTasks: () => void;
  linkSessionToPomodoro: (sessionId: string, pomodoroId: string) => void;

  // Add these new centralized functions for data retrieval
  getUpcomingSessions: () => StudySession[];
  getSessionsForToday: () => StudySession[];
}

// Helper function to calculate hours between two ISO strings
const getHoursBetween = (startTimeISO: string, endTimeISO: string): number => {
  const start = new Date(startTimeISO);
  const end = new Date(endTimeISO);
  const diffMs = end.getTime() - start.getTime();
  return diffMs / (1000 * 60 * 60);
};

// Helper to check if a date is today
const isToday = (dateString: string): boolean => {
  const today = new Date();
  const date = new Date(dateString);
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

// Default categories
const defaultCategories: StudyCategory[] = [
  { id: "1", name: "Mathematics", color: "#4F46E5" },
  { id: "2", name: "Science", color: "#10B981" },
  { id: "3", name: "Languages", color: "#F59E0B" },
  { id: "4", name: "Humanities", color: "#EC4899" },
  { id: "5", name: "Computer Science", color: "#06B6D4" },
];

// Default filters
const defaultFilters: Filter = {
  categories: [],
  priority: ["low", "medium", "high"],
  showCompleted: false,
  dateRange: {
    startDate: null,
    endDate: null,
  },
};

// Create the store with persistence
export const usePlannerStore = create<PlannerStore>()(
  persist(
    (set, get) => ({
      // Initial state
      sessions: [],
      categories: defaultCategories,
      goals: [],
      activeFilters: defaultFilters,

      // Session functions
      addSession: (sessionData) => {
        const id = Date.now().toString();
        const newSession = {
          ...sessionData,
          id,
        };

        set((state) => ({
          sessions: [...state.sessions, newSession],
        }));

        // Update goal progress if applicable
        const { startTime, endTime, category } = newSession;
        const hours = getHoursBetween(startTime, endTime);
        const relevantGoals = get().goals.filter(
          (goal) => goal.category === category && !goal.isCompleted
        );

        if (relevantGoals.length > 0) {
          relevantGoals.forEach((goal) => {
            get().updateGoal(goal.id, {
              currentHours: goal.currentHours + hours,
            });

            // Check if goal should be completed
            const updatedGoal = get().goals.find((g) => g.id === goal.id);
            if (
              updatedGoal &&
              updatedGoal.currentHours >= updatedGoal.targetHours
            ) {
              get().completeGoal(goal.id);

              // Unlock corresponding achievement if applicable
              try {
                const { updateAchievementProgress } =
                  useMotivationStore.getState();
                updateAchievementProgress("3", 100); // Update the 'Consistency King' achievement
              } catch (e) {
                console.log("Could not update motivation achievement", e);
              }
            }
          });
        }

        // Update motivation streak if applicable
        if (isToday(startTime)) {
          try {
            const { incrementStreak } = useMotivationStore.getState();
            incrementStreak();
          } catch (e) {
            console.log("Could not update motivation streak", e);
          }
        }

        return id;
      },

      updateSession: (id, updates) => {
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === id ? { ...session, ...updates } : session
          ),
        }));
      },

      deleteSession: (id) => {
        set((state) => ({
          sessions: state.sessions.filter((session) => session.id !== id),
        }));
      },

      completeSession: (id) => {
        const session = get().sessions.find((s) => s.id === id);
        if (!session) return;

        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === id ? { ...s, isCompleted: true } : s
          ),
        }));

        // Update associated tasks to completed
        if (session.associatedTaskIds.length > 0) {
          try {
            const { completeTask } = useTaskStore.getState();
            session.associatedTaskIds.forEach((taskId) => {
              completeTask(taskId);
            });
          } catch (e) {
            console.log("Could not update associated tasks", e);
          }
        }
      },

      getSessions: (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);

        return get().sessions.filter((session) => {
          const sessionStart = new Date(session.startTime);
          return sessionStart >= start && sessionStart <= end;
        });
      },

      // Added getSessionStats implementation
      getSessionStats: () => {
        const sessions = get().sessions;
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        // Calculate total hours
        const totalHours = sessions.reduce((total, session) => {
          return total + getHoursBetween(session.startTime, session.endTime);
        }, 0);

        // Calculate hours this week
        const thisWeekHours = sessions.reduce((total, session) => {
          const sessionDate = new Date(session.startTime);
          if (sessionDate >= startOfWeek && sessionDate <= now) {
            return total + getHoursBetween(session.startTime, session.endTime);
          }
          return total;
        }, 0);

        // Count completed and pending sessions
        const completedSessions = sessions.filter(
          (session) => session.isCompleted
        ).length;
        const pendingSessions = sessions.filter(
          (session) => !session.isCompleted
        ).length;

        // Get current streak
        const currentStreak = get().getCurrentStreak();

        return {
          totalHours: Math.round(totalHours * 10) / 10, // Round to 1 decimal place
          thisWeekHours: Math.round(thisWeekHours * 10) / 10,
          completedSessions,
          pendingSessions,
          currentStreak,
        };
      },

      // Category functions
      addCategory: (categoryData) => {
        const newCategory = {
          ...categoryData,
          id: Date.now().toString(),
        };

        set((state) => ({
          categories: [...state.categories, newCategory],
        }));
      },

      updateCategory: (id, updates) => {
        set((state) => ({
          categories: state.categories.map((category) =>
            category.id === id ? { ...category, ...updates } : category
          ),
        }));
      },

      deleteCategory: (id) => {
        // Don't delete if it has associated sessions
        const hasAssociatedSessions = get().sessions.some(
          (session) => session.category === id
        );

        if (hasAssociatedSessions) {
          console.error("Cannot delete category with associated sessions");
          return;
        }

        set((state) => ({
          categories: state.categories.filter((category) => category.id !== id),
        }));
      },

      // Goal functions
      addGoal: (goalData) => {
        const newGoal = {
          ...goalData,
          id: Date.now().toString(),
          currentHours: 0,
        };

        set((state) => ({
          goals: [...state.goals, newGoal],
        }));
      },

      updateGoal: (id, updates) => {
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === id ? { ...goal, ...updates } : goal
          ),
        }));

        // Check if goal should be marked as completed
        const updatedGoal = get().goals.find((g) => g.id === id);
        if (
          updatedGoal &&
          updates.currentHours &&
          updates.currentHours >= updatedGoal.targetHours &&
          !updatedGoal.isCompleted
        ) {
          get().completeGoal(id);
        }
      },

      deleteGoal: (id) => {
        set((state) => ({
          goals: state.goals.filter((goal) => goal.id !== id),
        }));
      },

      completeGoal: (id) => {
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === id ? { ...goal, isCompleted: true } : goal
          ),
        }));

        // Update achievements in motivation store
        try {
          const { unlockAchievement } = useMotivationStore.getState();
          unlockAchievement("3"); // Assuming '3' is the consistency achievement
        } catch (e) {
          console.log("Could not update achievement", e);
        }
      },

      // Filter functions
      updateFilters: (filters) => {
        set((state) => ({
          activeFilters: { ...state.activeFilters, ...filters },
        }));
      },

      resetFilters: () => {
        set({
          activeFilters: defaultFilters,
        });
      },

      // Stats functions
      getTotalStudyHours: (startDate, endDate) => {
        try {
          const filteredSessions = get().getSessions(startDate, endDate);
          // Only count completed sessions
          return filteredSessions.reduce((total, session) => {
            // Check if session is completed and has valid start and end times
            if (!session.isCompleted || !session.startTime || !session.endTime)
              return total;

            return total + getHoursBetween(session.startTime, session.endTime);
          }, 0);
        } catch (error) {
          console.error("Error calculating total study hours:", error);
          return 0;
        }
      },

      getCategoryBreakdown: (startDate, endDate) => {
        const filteredSessions = get().getSessions(startDate, endDate);
        const breakdown: Record<string, number> = {};

        filteredSessions.forEach((session) => {
          if (!session.isCompleted) return;

          const hours = getHoursBetween(session.startTime, session.endTime);
          if (!breakdown[session.category]) {
            breakdown[session.category] = 0;
          }
          breakdown[session.category] += hours;
        });

        return Object.entries(breakdown).map(([category, hours]) => ({
          category,
          hours,
        }));
      },

      getCompletionRate: (startDate, endDate) => {
        const filteredSessions = get().getSessions(startDate, endDate);
        if (filteredSessions.length === 0) return 0;

        const completedCount = filteredSessions.filter(
          (s) => s.isCompleted
        ).length;
        return (completedCount / filteredSessions.length) * 100;
      },

      getCurrentStreak: () => {
        try {
          // Get sessions sorted by date
          const sortedSessions = [...get().sessions]
            .filter((s) => s.isCompleted)
            .sort(
              (a, b) =>
                new Date(b.startTime).getTime() -
                new Date(a.startTime).getTime()
            );

          // If no completed sessions, return 0
          if (sortedSessions.length === 0) return 0;

          // Check if there's a session today
          const today = new Date().toISOString().split("T")[0];
          const hasTodaySession = sortedSessions.some(
            (session) =>
              new Date(session.startTime).toISOString().split("T")[0] === today
          );

          // Return 0 if no session today
          if (!hasTodaySession) return 0;

          // Count streak
          let streak = 1;
          let currentDate = new Date(today);

          while (true) {
            // Move to previous day
            currentDate.setDate(currentDate.getDate() - 1);
            const dateStr = currentDate.toISOString().split("T")[0];

            // Check if there's a session on this date
            const hasSession = sortedSessions.some(
              (session) =>
                new Date(session.startTime).toISOString().split("T")[0] ===
                dateStr
            );

            if (hasSession) {
              streak++;
            } else {
              break;
            }
          }

          return streak;
        } catch (error) {
          console.error("Error calculating current streak:", error);
          return 0; // Return 0 on error
        }
      },

      // Integration functions
      suggestStudyTimes: (duration, preferredDates = []) => {
        const suggestions: { startTime: string; endTime: string }[] = [];

        // Get existing sessions to avoid overlaps
        const existingSessions = get().sessions;

        // If preferred dates are provided, use them, otherwise use the next 3 days
        const datesToCheck =
          preferredDates.length > 0
            ? preferredDates
            : Array.from({ length: 3 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() + i);
                return date.toISOString().split("T")[0];
              });

        datesToCheck.forEach((dateStr) => {
          // Check for free times between 9 AM and 9 PM
          const startHour = 9;
          const endHour = 21;

          // Create time slots
          for (
            let hour = startHour;
            hour <= endHour - duration / 60;
            hour += 2
          ) {
            const slotStart = new Date(
              `${dateStr}T${hour.toString().padStart(2, "0")}:00:00`
            );
            const slotEnd = new Date(slotStart);
            slotEnd.setMinutes(slotEnd.getMinutes() + duration);

            // Check if this slot overlaps with any existing session
            const hasOverlap = existingSessions.some((session) => {
              const sessionStart = new Date(session.startTime);
              const sessionEnd = new Date(session.endTime);

              return (
                (slotStart >= sessionStart && slotStart < sessionEnd) ||
                (slotEnd > sessionStart && slotEnd <= sessionEnd) ||
                (slotStart <= sessionStart && slotEnd >= sessionEnd)
              );
            });

            if (!hasOverlap) {
              suggestions.push({
                startTime: slotStart.toISOString(),
                endTime: slotEnd.toISOString(),
              });

              // Only add up to 2 suggestions per day
              if (
                suggestions.filter((s) => s.startTime.includes(dateStr))
                  .length >= 2
              ) {
                break;
              }
            }
          }
        });

        return suggestions;
      },

      getSuggestedSessions: () => {
        const suggestions: Partial<StudySession>[] = [];

        // Get pending tasks
        try {
          const tasks = useTaskStore.getState().tasks;
          const pendingTasks = tasks.filter((task) => !task.completedAt);

          // Generate study sessions for high priority tasks
          pendingTasks
            .filter((task) => task.priority === "High")
            .forEach((task) => {
              // Estimate duration based on task complexity (simple example)
              const durationMinutes = 60; // 1 hour for high priority

              // Find a suitable time slot
              const suggestedTimes = get().suggestStudyTimes(durationMinutes);

              if (suggestedTimes.length > 0) {
                suggestions.push({
                  title: `Study for: ${task.title}`,
                  description: task.description,
                  startTime: suggestedTimes[0].startTime,
                  endTime: suggestedTimes[0].endTime,
                  category: defaultCategories[0].id, // Default to first category
                  priority: "high",
                  isCompleted: false,
                  associatedTaskIds: [task.id],
                  pomodoroCount: Math.ceil(durationMinutes / 25), // Assuming 25-min pomodoros
                  completedPomodoros: 0,
                });
              }
            });
        } catch (e) {
          console.log("Could not fetch tasks", e);
        }

        return suggestions;
      },

      syncWithTasks: () => {
        try {
          const { tasks } = useTaskStore.getState();
          const pendingTasks = tasks.filter(
            (task) => !task.completed && task.dueDate
          );

          // Find tasks that don't have associated study sessions yet
          pendingTasks.forEach((task) => {
            const hasAssociatedSession = get().sessions.some((session) =>
              session.associatedTaskIds.includes(task.id)
            );

            if (!hasAssociatedSession && task.dueDate) {
              // Create a study session a day before the due date
              const dueDate = new Date(task.dueDate);
              const studyDate = new Date(dueDate);
              studyDate.setDate(dueDate.getDate() - 1);

              // Set study time to 2PM
              studyDate.setHours(14, 0, 0, 0);

              const studyEndTime = new Date(studyDate);
              studyEndTime.setHours(studyEndTime.getHours() + 2); // 2 hour session

              get().addSession({
                title: `Prepare for: ${task.title}`,
                description:
                  task.description || "Study session for upcoming task",
                startTime: studyDate.toISOString(),
                endTime: studyEndTime.toISOString(),
                category: defaultCategories[0].id, // Default to first category
                priority: task.priority as "low" | "medium" | "high",
                isCompleted: false,
                associatedTaskIds: [task.id],
                pomodoroCount: 4,
                completedPomodoros: 0,
              });
            }
          });
        } catch (e) {
          console.log("Could not sync with tasks", e);
        }
      },

      linkSessionToPomodoro: (sessionId, pomodoroId) => {
        // This would update the session's completedPomodoros count
        // And possibly mark the session as completed if all pomodoros are done
        const session = get().sessions.find((s) => s.id === sessionId);
        if (!session) return;

        const updatedPomodoros = session.completedPomodoros + 1;
        get().updateSession(sessionId, {
          completedPomodoros: updatedPomodoros,
        });

        // Mark as completed if all pomodoros are done
        if (updatedPomodoros >= session.pomodoroCount) {
          get().completeSession(sessionId);
        }
      },

      // Add these new centralized functions for data retrieval
      getUpcomingSessions: () => {
        const now = new Date();
        return get()
          .sessions.filter((session) => {
            // Filter sessions with future start times and not completed
            return new Date(session.startTime) > now && !session.isCompleted;
          })
          .sort(
            (a, b) =>
              new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
          )
          .slice(0, 5); // Return only the next 5 upcoming sessions
      },

      getSessionsForToday: () => {
        const today = new Date().toISOString().split("T")[0];
        return get().sessions.filter(
          (session) =>
            new Date(session.startTime).toISOString().split("T")[0] === today
        );
      },
    }),
    {
      name: "planner-storage",
    }
  )
);
