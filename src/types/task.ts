import { TaskCategory, TaskPriority, TaskStatus } from "../store/taskStore";

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
