export type StudyCategory =
  | "Lecture"
  | "Reading"
  | "Homework"
  | "Project"
  | "Exam Prep"
  | "Group Study"
  | "Other";

export interface StudySession {
  id: string;
  title: string;
  description?: string;
  subject: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  category: StudyCategory;
  location?: string;
  completed: boolean;
  completedAt?: string;
  pomodoroSessionIds?: string[];
  taskIds?: string[];
  notes?: string;
  tags?: string[];
}
