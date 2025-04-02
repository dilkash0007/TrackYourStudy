import { motion } from "framer-motion";
import {
  CheckCircleIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

interface TaskSummaryCardProps {
  totalCompleted: number;
  weeklyCompleted: number;
}

export const TaskSummaryCard = ({
  totalCompleted,
  weeklyCompleted,
}: TaskSummaryCardProps) => {
  // Sample data for today and pending tasks
  // In a real app, this would come from the task store
  const todayCompleted = 2;
  const pendingTasks = 5;

  // Calculate completion rate (completed / total tasks this week)
  const completionRate = Math.round(
    (weeklyCompleted / (weeklyCompleted + pendingTasks)) * 100
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Task Summary
        </h3>
        <ClipboardDocumentListIcon className="h-5 w-5 text-indigo-500" />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total Completed
          </p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {totalCompleted}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">This Week</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {weeklyCompleted}
          </p>
        </div>
      </div>

      {/* Completion Rate */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Weekly Completion Rate
          </p>
          <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
            {completionRate}%
          </p>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full transition-all duration-500 ease-out ${
              completionRate > 80
                ? "bg-green-500"
                : completionRate > 50
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>
      </div>

      {/* Additional Tasks Info */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <CheckCircleIcon className="h-4 w-4 text-green-500 inline mr-1.5" />
            Completed Today
          </p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {todayCompleted}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <ClipboardDocumentListIcon className="h-4 w-4 text-indigo-500 inline mr-1.5" />
            Pending Tasks
          </p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {pendingTasks}
          </p>
        </div>
      </div>

      {/* Link to Task Manager */}
      <Link
        to="/tasks"
        className="block text-center text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 mt-2"
      >
        View All Tasks
      </Link>
    </motion.div>
  );
};
