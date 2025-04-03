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

      applyFilters: (customFilters?) => {
        const filters = customFilters || get().activeFilters;
        const {
          status,
          priority,
          category,
          subject,
          search,
          sortBy,
          sortOrder,
        } = filters;

        let filtered = [...get().tasks];

        // Apply filters
        if (status !== "All") {
          filtered = filtered.filter((task) => task.status === status);
        }

        if (priority !== "All") {
          filtered = filtered.filter((task) => task.priority === priority);
        }

        if (category !== "All") {
          filtered = filtered.filter((task) => task.category === category);
        }

        if (subject !== "All") {
          filtered = filtered.filter((task) => task.subject === subject);
        }

        if (search) {
          const searchLower = search.toLowerCase();
          filtered = filtered.filter(
            (task) =>
              task.title.toLowerCase().includes(searchLower) ||
              task.description.toLowerCase().includes(searchLower) ||
              task.tags.some((tag) => tag.toLowerCase().includes(searchLower))
          );
        }

        // Sort tasks
        filtered.sort((a, b) => {
          let comparison = 0;

          switch (sortBy) {
            case "dueDate":
              comparison =
                new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
              break;
            case "priority":
              const priorityOrder = { Low: 0, Medium: 1, High: 2, Urgent: 3 };
              comparison =
                priorityOrder[a.priority] - priorityOrder[b.priority];
              break;
            case "subject":
              comparison = a.subject.localeCompare(b.subject);
              break;
            case "status":
              const statusOrder = {
                Pending: 0,
                "In Progress": 1,
                Completed: 2,
              };
              comparison = statusOrder[a.status] - statusOrder[b.status];
              break;
          }

          return sortOrder === "asc" ? comparison : -comparison;
        });

        return filtered;
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

        // Calculate total counts
        const total = allTasks.length;
        const completed = allTasks.filter(
          (task) => task.status === "Completed"
        ).length;
        const pending = allTasks.filter(
          (task) => task.status !== "Completed"
        ).length;
        const overdue = allTasks.filter(
          (task) => task.status !== "Completed" && new Date(task.dueDate) < now
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
              task.status !== "Completed" && new Date(task.dueDate) >= now
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
