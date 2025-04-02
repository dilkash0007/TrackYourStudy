import { motion } from "framer-motion";
import { ClockIcon, FireIcon, TrophyIcon } from "@heroicons/react/24/outline";

interface StudyProgressCardProps {
  totalHours: number;
  weeklyHours: number;
  streak: number;
  longestStreak: number;
}

export const StudyProgressCard = ({
  totalHours,
  weeklyHours,
  streak,
  longestStreak,
}: StudyProgressCardProps) => {
  // Format numbers
  const formatHours = (hours: number) => {
    return hours.toFixed(1);
  };

  // Calculate percentage of weekly goal (assuming 15 hour weekly goal)
  const weeklyGoal = 15;
  const weeklyProgress = Math.min(100, (weeklyHours / weeklyGoal) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Study Progress
        </h3>
        <ClockIcon className="h-5 w-5 text-indigo-500" />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total Hours
          </p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {formatHours(totalHours)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">This Week</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {formatHours(weeklyHours)}
          </p>
        </div>
      </div>

      {/* Weekly Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Weekly Goal: {weeklyHours}/{weeklyGoal} hours
          </p>
          <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
            {weeklyProgress.toFixed(0)}%
          </p>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div
            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${weeklyProgress}%` }}
          ></div>
        </div>
      </div>

      {/* Streak Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <FireIcon className="h-5 w-5 text-red-500 mr-2" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Current Streak
            </p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {streak} day{streak !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <TrophyIcon className="h-5 w-5 text-yellow-500 mr-2" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Best Streak
            </p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {longestStreak} day{longestStreak !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
