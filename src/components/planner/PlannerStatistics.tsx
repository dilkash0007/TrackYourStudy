import { motion } from "framer-motion";
import {
  ClockIcon,
  CheckCircleIcon,
  FireIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";

interface PlannerStatisticsProps {
  totalStudyHours: number;
  completionRate: number;
  currentStreak: number;
  totalSessions: number;
}

export const PlannerStatistics = ({
  totalStudyHours,
  completionRate,
  currentStreak,
  totalSessions,
}: PlannerStatisticsProps) => {
  // Animation variants for staggered animation of stat cards
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  // Statistics data
  const stats = [
    {
      id: "study-hours",
      label: "Study Hours",
      value: totalStudyHours.toFixed(1),
      icon: ClockIcon,
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300",
    },
    {
      id: "completion",
      label: "Completion Rate",
      value: `${completionRate}%`,
      icon: CheckCircleIcon,
      color:
        "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300",
    },
    {
      id: "streak",
      label: "Current Streak",
      value: `${currentStreak} days`,
      icon: FireIcon,
      color:
        "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300",
    },
    {
      id: "sessions",
      label: "Total Sessions",
      value: totalSessions.toString(),
      icon: BookOpenIcon,
      color:
        "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300",
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {stats.map((stat) => (
        <motion.div
          key={stat.id}
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col justify-between"
        >
          <div className="flex items-center">
            <div className={`p-2 rounded-full ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <h3 className="ml-3 text-sm font-medium text-gray-500 dark:text-gray-400">
              {stat.label}
            </h3>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {stat.value}
            </p>
            {stat.id === "completion" && (
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-2">
                <div
                  className="bg-green-500 h-1.5 rounded-full"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};
