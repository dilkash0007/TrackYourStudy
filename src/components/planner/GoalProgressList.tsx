import { useState } from "react";
import { motion } from "framer-motion";
import { PlusIcon } from "@heroicons/react/24/outline";
import { StudyGoal } from "../../store/plannerStore";

interface GoalProgressListProps {
  goals: StudyGoal[];
  onAddGoal: () => void;
}

export const GoalProgressList = ({
  goals,
  onAddGoal,
}: GoalProgressListProps) => {
  const [expandedGoalId, setExpandedGoalId] = useState<string | null>(null);

  // Toggle goal expansion
  const toggleGoalExpansion = (goalId: string) => {
    setExpandedGoalId(expandedGoalId === goalId ? null : goalId);
  };

  // Format date range
  const formatDateRange = (startDate: string, deadline: string) => {
    const start = new Date(startDate);
    const end = new Date(deadline);

    const formatOptions: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
    };

    return `${start.toLocaleDateString(
      "en-US",
      formatOptions
    )} - ${end.toLocaleDateString("en-US", formatOptions)}`;
  };

  // Calculate days remaining
  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);

    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  // Get progress status color
  const getProgressStatusColor = (goal: StudyGoal) => {
    const daysRemaining = getDaysRemaining(goal.deadline);
    const progress = (goal.currentAmount / goal.targetAmount) * 100;

    if (daysRemaining < 0) {
      return {
        bg: "bg-red-100 dark:bg-red-900/20",
        text: "text-red-800 dark:text-red-300",
        border: "border-red-200 dark:border-red-900/30",
        progressBar: "bg-red-500",
      };
    }

    if (progress >= 100) {
      return {
        bg: "bg-green-100 dark:bg-green-900/20",
        text: "text-green-800 dark:text-green-300",
        border: "border-green-200 dark:border-green-900/30",
        progressBar: "bg-green-500",
      };
    }

    // Calculate if on track based on time passed vs progress made
    const startDate = new Date(goal.startDate);
    const deadline = new Date(goal.deadline);
    const today = new Date();

    const totalDays = Math.ceil(
      (deadline.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const daysPassed = Math.ceil(
      (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Expected progress based on time passed
    const expectedProgress = (daysPassed / totalDays) * 100;

    if (progress >= expectedProgress - 10) {
      // Within 10% of expected progress
      return {
        bg: "bg-blue-100 dark:bg-blue-900/20",
        text: "text-blue-800 dark:text-blue-300",
        border: "border-blue-200 dark:border-blue-900/30",
        progressBar: "bg-blue-500",
      };
    } else {
      return {
        bg: "bg-yellow-100 dark:bg-yellow-900/20",
        text: "text-yellow-800 dark:text-yellow-300",
        border: "border-yellow-200 dark:border-yellow-900/30",
        progressBar: "bg-yellow-500",
      };
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          Current Goals
        </h2>
        <button
          onClick={onAddGoal}
          className="flex items-center text-sm px-3 py-1.5 rounded-md bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-800/50"
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          Add Goal
        </button>
      </div>

      {goals.length === 0 ? (
        <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">
            No study goals set yet. Create your first goal to track your
            progress!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {goals.map((goal) => {
            const progress = Math.min(
              100,
              Math.round((goal.currentAmount / goal.targetAmount) * 100)
            );
            const daysRemaining = getDaysRemaining(goal.deadline);
            const statusColors = getProgressStatusColor(goal);

            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-lg border ${statusColors.border} bg-white dark:bg-gray-800 overflow-hidden`}
              >
                {/* Goal Header */}
                <div
                  className="px-4 py-3 cursor-pointer"
                  onClick={() => toggleGoalExpansion(goal.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {goal.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {formatDateRange(goal.startDate, goal.deadline)}
                        {daysRemaining > 0 ? (
                          <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700">
                            {daysRemaining} days left
                          </span>
                        ) : daysRemaining === 0 ? (
                          <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                            Due today
                          </span>
                        ) : (
                          <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                            Overdue
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="text-right">
                      <div
                        className={`text-sm font-medium ${statusColors.text}`}
                      >
                        {progress}%
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {goal.currentAmount} of {goal.targetAmount} {goal.unit}
                      </div>
                    </div>
                  </div>

                  <div className="mt-2">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`${statusColors.progressBar} h-2 rounded-full`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Expanded Goal Details */}
                {expandedGoalId === goal.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className={`px-4 py-3 border-t ${statusColors.border} ${statusColors.bg}`}
                  >
                    {goal.description && (
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Description
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {goal.description}
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Target
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {goal.targetAmount} {goal.unit}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Current Progress
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {goal.currentAmount} {goal.unit} ({progress}%)
                        </p>
                      </div>

                      {goal.milestones && goal.milestones.length > 0 && (
                        <div className="col-span-2 mt-2">
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Milestones
                          </h4>
                          <div className="space-y-2">
                            {goal.milestones.map((milestone, index) => {
                              const milestoneProgress =
                                (goal.currentAmount / milestone.target) * 100;
                              const isCompleted =
                                goal.currentAmount >= milestone.target;

                              return (
                                <div
                                  key={index}
                                  className={`px-3 py-2 rounded-md text-sm ${
                                    isCompleted
                                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                      : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                  }`}
                                >
                                  <div className="flex justify-between items-center">
                                    <span>{milestone.description}</span>
                                    <span>
                                      {milestone.target} {goal.unit}
                                    </span>
                                  </div>
                                  {!isCompleted && (
                                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 mt-2">
                                      <div
                                        className="bg-blue-500 dark:bg-blue-400 h-1.5 rounded-full"
                                        style={{
                                          width: `${Math.min(
                                            100,
                                            milestoneProgress
                                          )}%`,
                                        }}
                                      ></div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
