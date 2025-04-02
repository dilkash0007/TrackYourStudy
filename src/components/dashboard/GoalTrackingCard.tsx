import { motion } from "framer-motion";
import { FlagIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

interface Goal {
  id: string;
  title: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  deadline?: Date;
  category: string;
}

interface GoalTrackingCardProps {
  goals: Goal[];
}

export const GoalTrackingCard = ({ goals }: GoalTrackingCardProps) => {
  // Calculate the goal progress
  const calculateProgress = (current: number, target: number): number => {
    const progress = (current / target) * 100;
    return Math.min(progress, 100); // Cap at 100%
  };

  // Format deadline to display date
  const formatDeadline = (date?: Date): string => {
    if (!date) return "No deadline";

    // Calculate days left
    const today = new Date();
    const diff = Math.ceil(
      (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diff < 0) return "Overdue";
    if (diff === 0) return "Today";
    if (diff === 1) return "Tomorrow";
    if (diff < 7) return `${diff} days left`;

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date);
  };

  // Get color based on progress
  const getProgressColor = (progress: number, deadline?: Date): string => {
    if (deadline && new Date() > deadline) {
      return "bg-red-500"; // Overdue
    }

    if (progress < 25) return "bg-red-500";
    if (progress < 50) return "bg-yellow-500";
    if (progress < 75) return "bg-blue-500";
    return "bg-green-500";
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
          Goal Tracking
        </h3>
        <FlagIcon className="h-5 w-5 text-indigo-500" />
      </div>

      {goals.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No active goals. Set goals to track your study progress.
          </p>
          <Link
            to="/profile?tab=goals"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Set New Goals
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map((goal, index) => {
            const progress = calculateProgress(
              goal.currentValue,
              goal.targetValue
            );

            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className="p-3 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      {goal.title}
                    </h4>
                    <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-xs px-2 py-0.5 rounded-full">
                        {goal.category}
                      </span>
                      {goal.deadline && (
                        <span className="ml-2">
                          {formatDeadline(goal.deadline)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {goal.currentValue}/{goal.targetValue} {goal.unit}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className={`${getProgressColor(
                      progress,
                      goal.deadline
                    )} h-2 rounded-full`}
                  ></motion.div>
                </div>
              </motion.div>
            );
          })}

          <Link
            to="/profile?tab=goals"
            className="flex items-center justify-center w-full mt-3 px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Add New Goal
          </Link>
        </div>
      )}
    </motion.div>
  );
};
