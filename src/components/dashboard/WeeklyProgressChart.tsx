import { motion } from "framer-motion";
import { ChartBarIcon } from "@heroicons/react/24/outline";

interface WeeklyProgressChartProps {
  dailyData: number[];
  previousWeekData?: number[];
}

export const WeeklyProgressChart = ({
  dailyData,
  previousWeekData,
}: WeeklyProgressChartProps) => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const maxValue = Math.max(
    ...(previousWeekData || []),
    ...dailyData,
    2 // Minimum value to prevent empty chart
  );

  // Calculate weekly totals
  const weeklyTotal = dailyData.reduce((sum, value) => sum + value, 0);
  const previousWeeklyTotal = previousWeekData
    ? previousWeekData.reduce((sum, value) => sum + value, 0)
    : 0;

  // Calculate percent change
  const percentChange = previousWeeklyTotal
    ? ((weeklyTotal - previousWeeklyTotal) / previousWeeklyTotal) * 100
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Weekly Progress
        </h3>
        <ChartBarIcon className="h-5 w-5 text-indigo-500" />
      </div>

      <div className="flex items-center mb-4">
        <div className="flex-1">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {weeklyTotal.toFixed(1)} hours
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            This week
          </div>
        </div>
        {previousWeeklyTotal > 0 && (
          <div
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              percentChange >= 0
                ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
            }`}
          >
            {percentChange >= 0 ? "+" : ""}
            {percentChange.toFixed(1)}% vs last week
          </div>
        )}
      </div>

      <div className="h-64 mt-4 relative">
        {/* Horizontal grid lines */}
        {[0.25, 0.5, 0.75, 1].map((ratio) => (
          <div
            key={ratio}
            className="absolute left-0 right-0 border-t border-gray-200 dark:border-gray-700"
            style={{ top: `${(1 - ratio) * 100}%` }}
          >
            <span className="absolute -top-2 -left-8 text-xs text-gray-500 dark:text-gray-400">
              {(maxValue * ratio).toFixed(1)}h
            </span>
          </div>
        ))}

        {/* Chart bars */}
        <div className="flex justify-between items-end h-full">
          {days.map((day, index) => (
            <div
              key={day}
              className="flex flex-col items-center justify-end w-10"
            >
              {/* Previous week bar (if available) */}
              {previousWeekData && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{
                    height: `${(previousWeekData[index] / maxValue) * 100}%`,
                  }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="w-4 bg-indigo-200 dark:bg-indigo-800 rounded-t opacity-50"
                  style={{
                    marginRight: "4px",
                    position: "absolute",
                    bottom: 0,
                    zIndex: 1,
                  }}
                />
              )}

              {/* Current week bar */}
              <motion.div
                initial={{ height: 0 }}
                animate={{
                  height: `${(dailyData[index] / maxValue) * 100}%`,
                }}
                transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                className="w-4 bg-indigo-500 rounded-t relative z-10"
              >
                {dailyData[index] > 0 && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700 dark:text-gray-300">
                    {dailyData[index].toFixed(1)}h
                  </div>
                )}
              </motion.div>

              <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                {day}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center mt-4 space-x-4">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-indigo-500 rounded mr-1"></div>
          <span className="text-xs text-gray-600 dark:text-gray-400">
            This Week
          </span>
        </div>
        {previousWeekData && (
          <div className="flex items-center">
            <div className="w-3 h-3 bg-indigo-200 dark:bg-indigo-800 rounded opacity-50 mr-1"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Last Week
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
