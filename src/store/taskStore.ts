import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Task } from "../types/task";

export type TaskPriority = "Low" | "Medium" | "High" | "Urgent";
export type TaskStatus = "Pending" | "In Progress" | "Completed";
export type TaskCategory =
  | "Homework"
  | "Exam"
  | "Project"
  | "Reading"
  | "Research"
  | "Other";

export interface Task {
  id: string;
  title: string;
  description: string;
  subject: string;
  priority: TaskPriority;
  dueDate: string;
  createdAt: string;
  status: TaskStatus;
  category: TaskCategory;
  completedAt?: string;
  notes: string;
  pomodoroSessions: number;
  estimatedTime: number; // in minutes
  actualTime: number; // in minutes
  tags: string[];
}

interface TaskState {
  tasks: Task[];
  filteredTasks: Task[];
  activeFilters: {
    status: TaskStatus | "All";
    priority: TaskPriority | "All";
    category: TaskCategory | "All";
    subject: string | "All";
    search: string;
    sortBy: "dueDate" | "priority" | "subject" | "status";
    sortOrder: "asc" | "desc";
  };

  // Task CRUD operations
  addTask: (
    task: Omit<Task, "id" | "createdAt" | "actualTime" | "completedAt">
  ) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  duplicateTask: (id: string) => void;

  // Status management
  setTaskStatus: (id: string, status: TaskStatus) => void;

  // Pomodoro tracking
  incrementPomodoroSession: (id: string) => void;
  addActualTime: (id: string, minutes: number) => void;

  // Filtering and sorting
  setActiveFilter: (filter: Partial<TaskState["activeFilters"]>) => void;
  applyFilters: (customFilters?: Partial<TaskState["activeFilters"]>) => Task[];

  // Notes management
  addTaskNote: (id: string, note: string) => void;

  getTaskSummary: () => {
    total: number;
    completed: number;
    pending: number;
    overdue: number;
  };
  getUpcomingTasks: () => Task[];
}

// Generate a default date 3 days from now
const getDefaultDueDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 3);
  return date.toISOString();
};

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      filteredTasks: [],
      activeFilters: {
        status: "All",
        priority: "All",
        category: "All",
        subject: "All",
        search: "",
        sortBy: "dueDate",
        sortOrder: "asc",
      },

      // Task CRUD operations
      addTask: (task) => {
        const newTask: Task = {
          ...task,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          actualTime: 0,
          pomodoroSessions: 0,
        };

        set((state) => {
          const tasks = [...state.tasks, newTask];
          const filteredTasks = get().applyFilters();
          return { tasks, filteredTasks };
        });
      },

      updateTask: (id, updatedTask) => {
        set((state) => {
          const tasks = state.tasks.map((task) =>
            task.id === id ? { ...task, ...updatedTask } : task
          );
          const filteredTasks = get().applyFilters();
          return { tasks, filteredTasks };
        });
      },

      deleteTask: (id) => {
        set((state) => {
          const tasks = state.tasks.filter((task) => task.id !== id);
          const filteredTasks = get().applyFilters();
          return { tasks, filteredTasks };
        });
      },

      duplicateTask: (id) => {
        const taskToDuplicate = get().tasks.find((task) => task.id === id);

        if (taskToDuplicate) {
          const duplicatedTask: Omit<
            Task,
            "id" | "createdAt" | "actualTime" | "completedAt"
          > = {
            title: `${taskToDuplicate.title} (Copy)`,
            description: taskToDuplicate.description,
            subject: taskToDuplicate.subject,
            priority: taskToDuplicate.priority,
            dueDate: taskToDuplicate.dueDate,
            status: "Pending",
            category: taskToDuplicate.category,
            notes: taskToDuplicate.notes,
            pomodoroSessions: 0,
            estimatedTime: taskToDuplicate.estimatedTime,
            tags: [...taskToDuplicate.tags],
          };

          get().addTask(duplicatedTask);
        }
      },

      // Status management
      setTaskStatus: (id, status) => {
        set((state) => {
          const tasks = state.tasks.map((task) => {
            if (task.id === id) {
              const updatedTask = {
                ...task,
                status,
                completedAt:
                  status === "Completed" ? new Date().toISOString() : undefined,
              };
              return updatedTask;
            }
            return task;
          });

          return { tasks, filteredTasks: get().applyFilters() };
        });
      },

      // Pomodoro tracking
      incrementPomodoroSession: (id) => {
        set((state) => {
          const tasks = state.tasks.map((task) => {
            if (task.id === id) {
              return {
                ...task,
                pomodoroSessions: task.pomodoroSessions + 1,
              };
            }
            return task;
          });

          return { tasks, filteredTasks: get().applyFilters() };
        });
      },

      addActualTime: (id, minutes) => {
        set((state) => {
          const tasks = state.tasks.map((task) => {
            if (task.id === id) {
              return {
                ...task,
                actualTime: task.actualTime + minutes,
              };
            }
            return task;
          });

          return { tasks, filteredTasks: get().applyFilters() };
        });
      },

      // Filtering and sorting
      setActiveFilter: (filter) => {
        set((state) => {
          const updatedFilters = {
            ...state.activeFilters,
            ...filter,
          };

          return {
            activeFilters: updatedFilters,
            filteredTasks: get().applyFilters(updatedFilters),
          };
        });
      },

      applyFilters: (customFilters) => {
        const { tasks, activeFilters } = get();
        const filters = customFilters || activeFilters;

        return tasks.filter((task) => {
          // Status filter
          if (
            filters.status !== "All" &&
            (filters.status === "Completed" 
              ? task.completedAt === undefined 
              : task.status !== filters.status)
          ) {
            return false;
          }

          // Other filters remain unchanged
          // Priority filter
          if (filters.priority !== "All" && task.priority !== filters.priority) {
            return false;
          }

          // Category filter
          if (filters.category !== "All" && task.category !== filters.category) {
            return false;
          }

          // Subject filter
          if (filters.subject !== "All" && task.subject !== filters.subject) {
            return false;
          }

          // Search filter
          if (filters.search && filters.search.trim() !== "") {
            const searchTerm = filters.search.toLowerCase().trim();
            return (
              task.title.toLowerCase().includes(searchTerm) ||
              task.description.toLowerCase().includes(searchTerm) ||
              task.subject.toLowerCase().includes(searchTerm) ||
              task.notes.toLowerCase().includes(searchTerm) ||
              task.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
            );
          }

          return true;
        }).sort((a, b) => {
          const aValue = a[filters.sortBy];
          const bValue = b[filters.sortBy];

          if (typeof aValue === "string" && typeof bValue === "string") {
            const comparison = aValue.localeCompare(bValue);
            return filters.sortOrder === "asc" ? comparison : -comparison;
          } else {
            // For numerical values or dates
            if (aValue > bValue) return filters.sortOrder === "asc" ? 1 : -1;
            if (aValue < bValue) return filters.sortOrder === "asc" ? -1 : 1;
            return 0;
          }
        });
      },

      // Notes management
      addTaskNote: (id, note) => {
        set((state) => {
          const tasks = state.tasks.map((task) => {
            if (task.id === id) {
              return {
                ...task,
                notes: note,
              };
            }
            return task;
          });

          return { tasks, filteredTasks: get().applyFilters() };
        });
      },

      // Get task summary with counts
      getTaskSummary: () => {
        const allTasks = get().tasks;
        const now = new Date();

        // Calculate total counts with proper completion check
        const total = allTasks.length;
        const completed = allTasks.filter(
          (task) => task.completedAt !== undefined
        ).length;
        const pending = allTasks.filter(
          (task) => task.completedAt === undefined
        ).length;
        const overdue = allTasks.filter(
          (task) =>
            task.completedAt === undefined && new Date(task.dueDate) < now
        ).length;

        return {
          total,
          completed,
          pending,
          overdue,
        };
      },

      // Get upcoming tasks sorted by due date
      getUpcomingTasks: () => {
        const now = new Date();

        return get()
          .tasks.filter(
            (task) =>
              task.completedAt === undefined && new Date(task.dueDate) >= now
          )
          .sort(
            (a, b) =>
              new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          )
          .slice(0, 5);
      },
    }),
    {
      name: "task-storage",
      partialize: (state) => ({ tasks: state.tasks }),
    }
  )
);
