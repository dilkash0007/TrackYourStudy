import { motion } from "framer-motion";
import { BookOpenIcon } from "@heroicons/react/24/outline";

interface SubjectBreakdownChartProps {
  subjectData: { [key: string]: number };
}

export const SubjectBreakdownChart = ({
  subjectData,
}: SubjectBreakdownChartProps) => {
  // Convert subject data to array for easier manipulation
  const subjects = Object.entries(subjectData)
    .map(([subject, hours]) => ({ subject, hours }))
    .sort((a, b) => b.hours - a.hours);

  // Calculate total hours
  const totalHours = subjects.reduce((total, { hours }) => total + hours, 0);

  // Define colors for the chart bars
  const colors = [
    "bg-indigo-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-red-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-gray-500",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Subject Breakdown
        </h3>
        <BookOpenIcon className="h-5 w-5 text-indigo-500" />
      </div>

      <div className="space-y-3 mb-4">
        {subjects.slice(0, 5).map(({ subject, hours }, index) => {
          const percentage = Math.round((hours / totalHours) * 100);

          return (
            <div key={subject}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {subject}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {hours.toFixed(1)} hrs ({percentage}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                  className={`${
                    colors[index % colors.length]
                  } h-2.5 rounded-full`}
                ></motion.div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Time Distribution Donut Chart */}
      <div className="relative h-48 w-48 mx-auto">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {subjects.map(({ subject, hours }, index) => {
            // Calculate stroke-dasharray and stroke-dashoffset
            const percentage = (hours / totalHours) * 100;
            const radius = 25;
            const circumference = 2 * Math.PI * radius;
            const dashArray = circumference;
            const dashOffset =
              circumference - (percentage / 100) * circumference;

            // Calculate start position
            const previousPercentages = subjects
              .slice(0, index)
              .reduce((sum, s) => sum + (s.hours / totalHours) * 100, 0);
            const rotation = (previousPercentages / 100) * 360;

            return (
              <motion.circle
                key={subject}
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke={colors[index % colors.length].replace("bg-", "fill-")}
                strokeWidth="15"
                strokeDasharray={dashArray}
                strokeDashoffset={dashOffset}
                transform={`rotate(${rotation} 50 50)`}
                initial={{ opacity: 0, strokeDashoffset: circumference }}
                animate={{ opacity: 1, strokeDashoffset: dashOffset }}
                transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                style={{ transformOrigin: "center" }}
                className="opacity-80 dark:opacity-90"
              />
            );
          })}
          <circle
            cx="50"
            cy="50"
            r="15"
            fill="white"
            className="dark:fill-gray-800"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-gray-800 dark:text-white">
            {totalHours.toFixed(0)}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Total Hours
          </span>
        </div>
      </div>
    </motion.div>
  );
};
