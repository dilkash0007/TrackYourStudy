import { motion } from "framer-motion";
import { ArrowUpIcon, FireIcon } from "@heroicons/react/24/outline";
import { usePlannerStore } from "../../store/plannerStore";

interface GoalProgressProps {
  showHeader?: boolean;
}

export const GoalProgress = ({ showHeader = true }: GoalProgressProps) => {
  const { goals = [] } = usePlannerStore() || {};

  // Filter to show only active goals
  const activeGoals =
    goals && Array.isArray(goals)
      ? goals.filter((goal) => goal && !goal.isCompleted).slice(0, 3)
      : [];

  // Calculate overall progress
  const calculateOverallProgress = () => {
    if (activeGoals.length === 0) return 0;

    const totalProgress = activeGoals.reduce((sum, goal) => {
      if (
        !goal ||
        typeof goal.currentHours === "undefined" ||
        typeof goal.targetHours === "undefined"
      ) {
        return sum;
      }
      // Calculate percentage for each goal
      const percentage = Math.min(
        100,
        (goal.currentHours / Math.max(1, goal.targetHours)) * 100
      );
      return sum + percentage;
    }, 0);

    return Math.round(totalProgress / activeGoals.length);
  };

  const overallProgress = calculateOverallProgress();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      {showHeader && (
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Goal Progress
          </h3>
          <div className="flex items-center text-green-600 dark:text-green-400 text-sm">
            <ArrowUpIcon className="h-4 w-4 mr-1" />
            <span>5% from last week</span>
          </div>
        </div>
      )}

      {/* Overall progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <FireIcon className="h-5 w-5 text-orange-500 mr-2" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Overall Progress
            </span>
          </div>
          <span className="text-sm font-bold text-gray-900 dark:text-white">
            {overallProgress}%
          </span>
        </div>
        <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full">
          <motion.div
            className="h-2 bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Individual goals */}
      <div className="space-y-4">
        {activeGoals.length > 0 ? (
          activeGoals.map((goal) => {
            if (!goal) return null;

            const percentage = Math.min(
              100,
              Math.round(
                (goal.currentHours / Math.max(1, goal.targetHours)) * 100
              )
            );

            return (
              <div key={goal.id}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {goal.title || "Unnamed Goal"}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {goal.currentHours || 0}/{goal.targetHours || 0} hours
                  </span>
                </div>
                <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-2 bg-blue-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No active goals. Create a goal to track your progress.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
