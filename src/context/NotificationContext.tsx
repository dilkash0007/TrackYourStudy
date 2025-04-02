import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import toast from "react-hot-toast";
import { useTaskStore } from "../store/taskStore";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  createdAt: string;
  read: boolean;
  taskId?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (
    notification: Omit<Notification, "id" | "createdAt" | "read">
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const tasks = useTaskStore((state) => state.tasks);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Check for upcoming deadlines
  useEffect(() => {
    // Run once a day
    const checkUpcomingDeadlines = () => {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Filter tasks with deadlines tomorrow
      const upcomingTasks = tasks.filter((task) => {
        if (task.status === "Completed") return false;

        const dueDate = new Date(task.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        tomorrow.setHours(0, 0, 0, 0);

        return dueDate.getTime() === tomorrow.getTime();
      });

      // Create notifications for each upcoming task
      upcomingTasks.forEach((task) => {
        const existingNotification = notifications.find(
          (n) => n.taskId === task.id && n.type === "warning"
        );

        if (!existingNotification) {
          addNotification({
            title: "Upcoming Deadline",
            message: `Task "${task.title}" is due tomorrow!`,
            type: "warning",
            taskId: task.id,
          });
        }
      });

      // Check for overdue tasks
      const overdueTasks = tasks.filter((task) => {
        if (task.status === "Completed") return false;

        const dueDate = new Date(task.dueDate);
        dueDate.setHours(23, 59, 59, 999);

        return dueDate.getTime() < today.getTime();
      });

      // Create notifications for each overdue task
      overdueTasks.forEach((task) => {
        const existingNotification = notifications.find(
          (n) => n.taskId === task.id && n.type === "error"
        );

        if (!existingNotification) {
          addNotification({
            title: "Overdue Task",
            message: `Task "${task.title}" is overdue!`,
            type: "error",
            taskId: task.id,
          });
        }
      });
    };

    // Check immediately and then set interval
    checkUpcomingDeadlines();

    // Check every day
    const interval = setInterval(checkUpcomingDeadlines, 86400000);

    return () => clearInterval(interval);
  }, [tasks, notifications]);

  const addNotification = (
    notification: Omit<Notification, "id" | "createdAt" | "read">
  ) => {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      read: false,
    };

    setNotifications((prev) => [newNotification, ...prev]);

    // Show toast notification based on notification type
    if (notification.type === "info") {
      toast.success(notification.message, {
        duration: 4000,
        position: "top-right",
      });
    } else if (notification.type === "success") {
      toast.success(notification.message, {
        duration: 4000,
        position: "top-right",
      });
    } else if (notification.type === "warning") {
      toast.error(notification.message, {
        duration: 4000,
        position: "top-right",
      });
    } else if (notification.type === "error") {
      toast.error(notification.message, {
        duration: 4000,
        position: "top-right",
      });
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const value = {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    unreadCount,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
