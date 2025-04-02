import { motion } from "framer-motion";
import {
  ClockIcon,
  CheckCircleIcon,
  FireIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

interface StatsOverviewCardProps {
  totalHours: number;
  completedTasks: number;
  currentStreak: number;
  focusScore: number;
}

export const StatsOverviewCard = ({
  totalHours,
  completedTasks,
  currentStreak,
  focusScore,
}: StatsOverviewCardProps) => {
  // Format the focus score to have one decimal place
  const formattedFocusScore = focusScore.toFixed(1);

  // Define the stats items
  const stats = [
    {
      label: "Total Hours",
      value: totalHours.toFixed(1),
      icon: <ClockIcon className="h-5 w-5 text-blue-500" />,
      color: "blue",
    },
    {
      label: "Completed Tasks",
      value: completedTasks.toString(),
      icon: <CheckCircleIcon className="h-5 w-5 text-green-500" />,
      color: "green",
    },
    {
      label: "Current Streak",
      value: `${currentStreak} days`,
      icon: <FireIcon className="h-5 w-5 text-orange-500" />,
      color: "orange",
    },
    {
      label: "Focus Score",
      value: formattedFocusScore,
      icon: <StarIcon className="h-5 w-5 text-purple-500" />,
      color: "purple",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="grid grid-cols-2 sm:grid-cols-4 gap-4"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 * index }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col items-center"
        >
          <div
            className={`mb-2 p-2 rounded-full bg-${stat.color}-100 dark:bg-${stat.color}-900/30`}
          >
            {stat.icon}
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {stat.value}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {stat.label}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};
