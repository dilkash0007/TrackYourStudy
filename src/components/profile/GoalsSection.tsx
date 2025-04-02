import { useState } from "react";
import { useUserStore } from "../../store/userStore";
import { motion } from "framer-motion";
import {
  FlagIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  CheckCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export const GoalsSection = () => {
  const { goals, addGoal, updateGoal, deleteGoal } = useUserStore((state) => ({
    goals: state.goals,
    addGoal: state.addGoal,
    updateGoal: state.updateGoal,
    deleteGoal: state.deleteGoal,
  }));

  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    description: "",
    timeframe: "daily" as "daily" | "weekly" | "monthly",
    target: 1,
  });

  // Function to handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "target" ? parseInt(value) : value,
    });
  };

  // Handle add/edit goal form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingGoalId) {
      updateGoal(editingGoalId, formData);
      setEditingGoalId(null);
    } else {
      addGoal(formData);
    }

    setFormData({
      description: "",
      timeframe: "daily",
      target: 1,
    });
    setIsAddingGoal(false);
  };

  // Start editing a goal
  const handleEditGoal = (goalId: string) => {
    const goal = goals.find((g) => g.id === goalId);
    if (goal) {
      setFormData({
        description: goal.description,
        timeframe: goal.timeframe,
        target: goal.target,
      });
      setEditingGoalId(goalId);
      setIsAddingGoal(true);
    }
  };

  // Cancel adding/editing goal
  const handleCancel = () => {
    setFormData({
      description: "",
      timeframe: "daily",
      target: 1,
    });
    setIsAddingGoal(false);
    setEditingGoalId(null);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Goals & Targets
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Set and manage your study goals to track your progress effectively.
        </p>
      </div>

      {/* Goals List */}
      <div className="mb-6">
        {goals.length === 0 && !isAddingGoal ? (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
            <FlagIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Goals Set
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Create goals to track your study progress and achievements.
            </p>
            <button
              onClick={() => setIsAddingGoal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Your First Goal
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map((goal, index) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm p-4 flex items-center justify-between"
              >
                <div className="flex items-start">
                  <div className="p-2 rounded-md bg-indigo-50 dark:bg-indigo-900/20 mr-4">
                    <FlagIcon className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {goal.description}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Target: {goal.target} per {goal.timeframe}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditGoal(goal.id)}
                    className="p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <PencilSquareIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Add Goal Button (only show if not adding/editing and there are already goals) */}
      {!isAddingGoal && goals.length > 0 && (
        <button
          onClick={() => setIsAddingGoal(true)}
          className="mb-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add New Goal
        </button>
      )}

      {/* Add/Edit Goal Form */}
      {isAddingGoal && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm p-5 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white">
              {editingGoalId ? "Edit Goal" : "Add New Goal"}
            </h3>
            <button
              onClick={handleCancel}
              className="p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Goal Description
              </label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="e.g., Complete study sessions"
                required
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="target"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Target Number
                </label>
                <input
                  type="number"
                  id="target"
                  name="target"
                  min="1"
                  value={formData.target}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label
                  htmlFor="timeframe"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Timeframe
                </label>
                <select
                  id="timeframe"
                  name="timeframe"
                  value={formData.timeframe}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <CheckCircleIcon className="inline-block h-4 w-4 mr-2 -mt-1" />
                {editingGoalId ? "Update Goal" : "Add Goal"}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Goal Recommendations */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-indigo-900/20 p-5 rounded-lg border border-blue-100 dark:border-blue-900/20">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">
          Goal Recommendations
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Here are some suggested goals to help you maintain consistency in your
          studies:
        </p>
        <ul className="space-y-2">
          {[
            "Complete 3 study sessions daily",
            "Reach 10 hours of focused study weekly",
            "Read 2 chapters of material daily",
            "Solve 20 practice problems weekly",
            "Review notes for 30 minutes daily",
          ].map((suggestion, index) => (
            <li key={index} className="flex items-start">
              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {suggestion}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
