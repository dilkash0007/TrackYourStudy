import { useState } from "react";
import { motion } from "framer-motion";
import { useMotivationStore, Goal } from "../../store/motivationStore";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface CreateGoalFormProps {
  onClose: () => void;
}

export const CreateGoalForm = ({ onClose }: CreateGoalFormProps) => {
  const motivationStore = useMotivationStore();
  const addGoal = motivationStore?.addGoal;
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    targetValue: 0,
    currentValue: 0,
    unit: "hours",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(new Date().setDate(new Date().getDate() + 7))
      .toISOString()
      .split("T")[0],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    try {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]:
          name === "targetValue" || name === "currentValue"
            ? Number(value)
            : value,
      }));

      // Clear any previous errors
      if (error) setError(null);
    } catch (err) {
      console.error("Error updating form data:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate form data
      if (!formData.title.trim()) {
        setError("Please enter a goal title.");
        setIsSubmitting(false);
        return;
      }

      if (formData.targetValue <= 0) {
        setError("Target amount must be greater than zero.");
        setIsSubmitting(false);
        return;
      }

      // Validate dates
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);

      if (endDate < startDate) {
        setError("End date cannot be earlier than start date.");
        setIsSubmitting(false);
        return;
      }

      // Check if addGoal function exists
      if (typeof addGoal !== "function") {
        setError("Could not save goal. Please try again later.");
        setIsSubmitting(false);
        return;
      }

      // Save goal
      addGoal(formData);

      // Close form on success
      onClose();
    } catch (err) {
      console.error("Failed to save goal:", err);
      setError("An error occurred while saving your goal. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Create New Study Goal
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Goal Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="e.g., Complete Calculus Course"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="targetValue"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Target Amount
              </label>
              <input
                type="number"
                id="targetValue"
                name="targetValue"
                value={formData.targetValue}
                onChange={handleChange}
                min="1"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="unit"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Unit
              </label>
              <select
                id="unit"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="hours">Hours</option>
                <option value="sessions">Sessions</option>
                <option value="pages">Pages</option>
                <option value="problems">Problems</option>
                <option value="chapters">Chapters</option>
                <option value="days">Days</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                min={formData.startDate}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Creating..." : "Create Goal"}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};
