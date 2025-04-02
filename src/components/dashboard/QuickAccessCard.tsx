import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  DocumentTextIcon,
  PlusIcon,
  ArrowRightIcon,
  BookOpenIcon,
  ClockIcon,
  CalendarIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

interface QuickAccessCardProps {
  recentNotes: Array<{
    id: string;
    title: string;
    updatedAt: Date;
    subject: string;
  }>;
}

export const QuickAccessCard = ({ recentNotes }: QuickAccessCardProps) => {
  // Format date as relative time (e.g., "2 days ago", "just now")
  const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Quick Access
        </h3>
        <DocumentTextIcon className="h-5 w-5 text-indigo-500" />
      </div>

      {/* Recent Notes Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Recent Notes
          </h4>
          <Link
            to="/notes"
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
          >
            View All
          </Link>
        </div>

        <div className="space-y-2">
          {recentNotes.length > 0 ? (
            recentNotes.slice(0, 3).map((note) => (
              <Link
                key={note.id}
                to={`/notes/${note.id}`}
                className="flex items-center p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex-shrink-0 mr-3">
                  <div className="h-8 w-8 rounded-md bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                    <BookOpenIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {note.title}
                  </p>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded px-1.5 py-0.5 mr-1.5">
                      {note.subject}
                    </span>
                    <ClockIcon className="h-3 w-3 mr-1" />
                    <span>{formatRelativeTime(note.updatedAt)}</span>
                  </div>
                </div>
                <ArrowRightIcon className="h-4 w-4 text-gray-400" />
              </Link>
            ))
          ) : (
            <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
              No recent notes. Start creating!
            </div>
          )}
        </div>

        <Link
          to="/notes/new"
          className="flex items-center justify-center w-full mt-3 px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none"
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          New Note
        </Link>
      </div>

      {/* Quick Actions Section */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Quick Actions
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <Link
            to="/task-manager/new"
            className="flex flex-col items-center justify-center p-3 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-2">
              <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Add Task
            </span>
          </Link>

          <Link
            to="/pomodoro"
            className="flex flex-col items-center justify-center p-3 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mb-2">
              <ClockIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Start Timer
            </span>
          </Link>

          <Link
            to="/calendar"
            className="flex flex-col items-center justify-center p-3 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-2">
              <CalendarIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Schedule
            </span>
          </Link>

          <Link
            to="/flashcards"
            className="flex flex-col items-center justify-center p-3 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-2">
              <DocumentTextIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Flashcards
            </span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
