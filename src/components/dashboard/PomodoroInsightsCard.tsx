import { motion } from "framer-motion";
import { ClockIcon, PlayCircleIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

interface PomodoroInsightsCardProps {
  totalSessions: number;
  weeklySessions: number;
}

export const PomodoroInsightsCard = ({
  totalSessions,
  weeklySessions,
}: PomodoroInsightsCardProps) => {
  // Sample data
  // In a real app, this would come from the Pomodoro store
  const todaySessions = 3;
  const totalFocusTime = Math.round((totalSessions * 25) / 60); // assuming 25 min sessions
  const weeklyFocusTime = Math.round((weeklySessions * 25) / 60);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Pomodoro Insights
        </h3>
        <ClockIcon className="h-5 w-5 text-indigo-500" />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total Sessions
          </p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {totalSessions}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">This Week</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {weeklySessions}
          </p>
        </div>
      </div>

      {/* Focus Time */}
      <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3 mb-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-indigo-600 dark:text-indigo-300">
              Total Focus Time
            </p>
            <p className="text-lg font-semibold text-indigo-700 dark:text-indigo-200">
              {totalFocusTime} hours
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-indigo-600 dark:text-indigo-300">
              Weekly Focus
            </p>
            <p className="text-lg font-semibold text-indigo-700 dark:text-indigo-200">
              {weeklyFocusTime} hours
            </p>
          </div>
        </div>
      </div>

      {/* Today's Sessions */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Today's Sessions: {todaySessions}
        </p>
        <div className="flex space-x-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full ${
                i < todaySessions
                  ? "bg-indigo-500"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
          Goal: 8 sessions
        </p>
      </div>

      {/* Quick Start Button */}
      <Link
        to="/pomodoro"
        className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <PlayCircleIcon className="h-5 w-5 mr-2" />
        Start Pomodoro Session
      </Link>
    </motion.div>
  );
};
