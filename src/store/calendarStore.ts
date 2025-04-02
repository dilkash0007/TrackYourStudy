import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Task, useTaskStore } from "./taskStore";
import { PomodoroSession, usePomodoroStore } from "./pomodoroStore";

// Calendar event types
export type EventType = "task" | "studySession" | "pomodoro" | "exam";

// Calendar view modes
export type ViewMode = "day" | "week" | "month";

// Calendar event model
export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  start: string; // ISO date string
  end: string; // ISO date string
  allDay: boolean;
  type: EventType;
  color: string;
  linkedId?: string; // ID of linked task or pomodoro session
  completed?: boolean;
  recurring?: {
    frequency: "daily" | "weekly" | "monthly";
    interval: number; // every X days/weeks/months
    until: string; // ISO date string
  };
  reminders?: {
    time: number; // minutes before event
    sent: boolean;
  }[];
}

// Calendar state interface
interface CalendarState {
  // State
  events: CalendarEvent[];
  viewMode: ViewMode;
  selectedDate: string; // ISO date string

  // User preferences
  userPreferences: {
    defaultView: ViewMode;
    firstDayOfWeek: 0 | 1 | 6; // 0 for Sunday, 1 for Monday, 6 for Saturday
    workingHours: {
      start: number; // 0-23
      end: number; // 0-23
    };
    remindersEnabled: boolean;
    colorMap: Record<EventType, string>;
  };

  // Actions
  addEvent: (event: Omit<CalendarEvent, "id">) => string;
  updateEvent: (id: string, event: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;

  // View actions
  setViewMode: (mode: ViewMode) => void;
  setSelectedDate: (date: string) => void;

  // User preference actions
  updateUserPreferences: (
    preferences: Partial<CalendarState["userPreferences"]>
  ) => void;

  // Sync methods
  syncWithTasks: () => void;
  syncWithPomodoro: () => void;

  // Calendar utilities
  getEventsForDate: (date: string) => CalendarEvent[];
  getEventsForRange: (start: string, end: string) => CalendarEvent[];

  // Export functions
  exportToICS: () => string;
  importFromGoogleCalendar: (data: any) => void;
}

// Default user preferences
const DEFAULT_PREFERENCES = {
  defaultView: "week" as ViewMode,
  firstDayOfWeek: 0 as 0 | 1 | 6, // Sunday
  workingHours: {
    start: 9, // 9 AM
    end: 17, // 5 PM
  },
  remindersEnabled: true,
  colorMap: {
    task: "#4f46e5", // indigo-600
    studySession: "#059669", // emerald-600
    pomodoro: "#dc2626", // red-600
    exam: "#9333ea", // purple-600
  },
};

// Date utilities
const isSameDay = (date1: string, date2: string): boolean => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

const isInRange = (date: string, start: string, end: string): boolean => {
  const d = new Date(date).getTime();
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  return d >= s && d <= e;
};

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set, get) => ({
      // Initial state
      events: [],
      viewMode: "week",
      selectedDate: new Date().toISOString(),
      userPreferences: DEFAULT_PREFERENCES,

      // Actions
      addEvent: (event) => {
        const id = crypto.randomUUID();
        const newEvent = { ...event, id };

        set((state) => ({
          events: [...state.events, newEvent],
        }));

        return id;
      },

      updateEvent: (id, event) => {
        set((state) => ({
          events: state.events.map((e) =>
            e.id === id ? { ...e, ...event } : e
          ),
        }));
      },

      deleteEvent: (id) => {
        set((state) => ({
          events: state.events.filter((e) => e.id !== id),
        }));
      },

      // View actions
      setViewMode: (mode) => {
        set({ viewMode: mode });
      },

      setSelectedDate: (date) => {
        set({ selectedDate: date });
      },

      // User preference actions
      updateUserPreferences: (preferences) => {
        set((state) => ({
          userPreferences: {
            ...state.userPreferences,
            ...preferences,
          },
        }));
      },

      // Sync methods
      syncWithTasks: () => {
        const { events } = get();
        const tasks = useTaskStore.getState().tasks;

        // Find all events linked to tasks
        const taskEvents = events.filter((event) => event.type === "task");
        const taskEventIds = new Set(taskEvents.map((e) => e.linkedId));

        // Create events for new tasks
        const newTaskEvents: CalendarEvent[] = [];

        tasks.forEach((task) => {
          // Skip if already has an event
          if (taskEventIds.has(task.id)) return;

          // Create a new event for the task
          const dueDate = new Date(task.dueDate);
          const taskEvent: Omit<CalendarEvent, "id"> = {
            title: task.title,
            description: task.description,
            start: task.dueDate, // Use due date for both start and end
            end: task.dueDate,
            allDay: true,
            type: "task",
            color: get().userPreferences.colorMap.task,
            linkedId: task.id,
            completed: task.status === "Completed",
          };

          get().addEvent(taskEvent);
        });

        // Update existing task events
        events
          .filter((event) => event.type === "task")
          .forEach((event) => {
            if (!event.linkedId) return;

            const task = tasks.find((t) => t.id === event.linkedId);
            if (!task) {
              // Task has been deleted, remove the event
              get().deleteEvent(event.id);
              return;
            }

            // Update event if task has changed
            if (
              event.title !== task.title ||
              event.description !== task.description ||
              event.start !== task.dueDate ||
              event.completed !== (task.status === "Completed")
            ) {
              get().updateEvent(event.id, {
                title: task.title,
                description: task.description,
                start: task.dueDate,
                end: task.dueDate,
                completed: task.status === "Completed",
              });
            }
          });
      },

      syncWithPomodoro: () => {
        const { events } = get();
        const sessions = usePomodoroStore.getState().sessions;

        // Find all events linked to pomodoro sessions
        const pomodoroEvents = events.filter(
          (event) => event.type === "pomodoro"
        );
        const pomodoroEventIds = new Set(pomodoroEvents.map((e) => e.linkedId));

        // Create events for new pomodoro sessions
        const newPomodoroEvents: CalendarEvent[] = [];

        sessions.forEach((session) => {
          // Skip if already has an event
          if (pomodoroEventIds.has(session.id)) return;

          // Get linked task if any
          const tasks = useTaskStore.getState().tasks;
          const linkedTask = session.taskId
            ? tasks.find((t) => t.id === session.taskId)
            : undefined;

          // Create start and end dates
          const startDate = new Date(session.startTime);
          let endDate: Date;

          if (session.endTime) {
            endDate = new Date(session.endTime);
          } else {
            // If no end time, use duration to calculate
            endDate = new Date(startDate);
            endDate.setMinutes(endDate.getMinutes() + session.duration);
          }

          // Create a new event for the pomodoro session
          const pomodoroEvent: Omit<CalendarEvent, "id"> = {
            title: linkedTask
              ? `Pomodoro: ${linkedTask.title}`
              : "Pomodoro Session",
            description: linkedTask
              ? `Pomodoro session for task: ${linkedTask.title}`
              : "Pomodoro study session",
            start: session.startTime,
            end: session.endTime || endDate.toISOString(),
            allDay: false,
            type: "pomodoro",
            color: get().userPreferences.colorMap.pomodoro,
            linkedId: session.id,
            completed: session.completed,
          };

          get().addEvent(pomodoroEvent);
        });
      },

      // Calendar utilities
      getEventsForDate: (date) => {
        return get().events.filter((event) => {
          // For all-day events, check if the date is the same
          if (event.allDay) {
            return isSameDay(event.start, date);
          }

          // For non-all-day events, check if the date is in range
          const startDay = new Date(event.start).setHours(0, 0, 0, 0);
          const endDay = new Date(event.end).setHours(23, 59, 59, 999);
          const targetDay = new Date(date).setHours(12, 0, 0, 0);

          return targetDay >= startDay && targetDay <= endDay;
        });
      },

      getEventsForRange: (start, end) => {
        return get().events.filter((event) => {
          const eventStart = new Date(event.start).getTime();
          const eventEnd = new Date(event.end).getTime();
          const rangeStart = new Date(start).getTime();
          const rangeEnd = new Date(end).getTime();

          // Event starts before range ends AND event ends after range starts
          return eventStart <= rangeEnd && eventEnd >= rangeStart;
        });
      },

      // Export functions
      exportToICS: () => {
        // Generate iCalendar format
        let icsContent =
          "BEGIN:VCALENDAR\r\n" +
          "VERSION:2.0\r\n" +
          "PRODID:-//TrackYouStudy//Calendar//EN\r\n";

        get().events.forEach((event) => {
          // Format dates for iCalendar (remove dashes, colons, and decimal points)
          const formatDate = (dateString: string) => {
            const date = new Date(dateString);
            return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
          };

          const startDate = formatDate(event.start);
          const endDate = formatDate(event.end);

          icsContent +=
            "BEGIN:VEVENT\r\n" +
            `UID:${event.id}\r\n` +
            `SUMMARY:${event.title}\r\n` +
            `DESCRIPTION:${event.description.replace(/\n/g, "\\n")}\r\n` +
            `DTSTART:${startDate}\r\n` +
            `DTEND:${endDate}\r\n` +
            `CATEGORIES:${event.type.toUpperCase()}\r\n` +
            "END:VEVENT\r\n";
        });

        icsContent += "END:VCALENDAR";
        return icsContent;
      },

      importFromGoogleCalendar: (data) => {
        // Parse Google Calendar API response and create events
        // This would be implemented based on the Google Calendar API format
        console.log("Import function not fully implemented");
      },
    }),
    {
      name: "calendar-storage",
      partialize: (state) => ({
        events: state.events,
        userPreferences: state.userPreferences,
      }),
    }
  )
);
