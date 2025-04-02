import { useState } from "react";
import { motion } from "framer-motion";
import { XMarkIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/outline";
import { usePlannerStore } from "../../store/plannerStore";
import { v4 as uuidv4 } from "uuid";

interface CreateGoalModalProps {
  onClose: () => void;
}

interface MilestoneInput {
  id: string;
  description: string;
  target: number;
}

export const CreateGoalModal = ({ onClose }: CreateGoalModalProps) => {
  const { addGoal } = usePlannerStore();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetAmount, setTargetAmount] = useState<number>(0);
  const [unit, setUnit] = useState("hours");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [deadline, setDeadline] = useState("");
  const [milestones, setMilestones] = useState<MilestoneInput[]>([]);

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Add a new milestone
  const addMilestone = () => {
    const newMilestone: MilestoneInput = {
      id: uuidv4(),
      description: "",
      target: Math.round(targetAmount / 4), // Default to 1/4 of the target
    };

    setMilestones([...milestones, newMilestone]);
  };

  // Remove a milestone
  const removeMilestone = (id: string) => {
    setMilestones(milestones.filter((m) => m.id !== id));
  };

  // Update milestone
  const updateMilestone = (
    id: string,
    field: "description" | "target",
    value: string | number
  ) => {
    setMilestones(
      milestones.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  // Set a default deadline if not provided (2 weeks from now)
  const generateDefaultDeadline = () => {
    const date = new Date();
    date.setDate(date.getDate() + 14);
    return date.toISOString().split("T")[0];
  };

  // Initialize the deadline if not set
  if (!deadline) {
    setDeadline(generateDefaultDeadline());
  }

  // Validate form before submission
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    if (targetAmount <= 0) {
      newErrors.targetAmount = "Target must be greater than 0";
    }

    if (!unit.trim()) {
      newErrors.unit = "Unit is required";
    }

    if (!startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!deadline) {
      newErrors.deadline = "Deadline is required";
    } else if (new Date(deadline) <= new Date(startDate)) {
      newErrors.deadline = "Deadline must be after start date";
    }

    // Validate milestones if any
    milestones.forEach((milestone, index) => {
      if (!milestone.description.trim()) {
        newErrors[`milestone_${index}_description`] = "Description is required";
      }

      if (milestone.target <= 0) {
        newErrors[`milestone_${index}_target`] =
          "Target must be greater than 0";
      } else if (milestone.target > targetAmount) {
        newErrors[
          `milestone_${index}_target`
        ] = `Target cannot exceed the goal target (${targetAmount})`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Create the goal object
    const newGoal = {
      id: uuidv4(),
      title,
      description,
      targetAmount,
      currentAmount: 0,
      unit,
      startDate,
      deadline,
      milestones: milestones.map((m) => ({
        description: m.description,
        target: m.target,
      })),
    };

    // Add the goal to the store
    addGoal(newGoal);

    // Close the modal
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Create New Study Goal
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Goal Title*
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., Complete Data Science Course"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.title}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="Describe your goal and why it's important..."
              ></textarea>
            </div>

            {/* Target Amount and Unit */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="targetAmount"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Target Amount*
                </label>
                <input
                  type="number"
                  id="targetAmount"
                  value={targetAmount || ""}
                  onChange={(e) => setTargetAmount(Number(e.target.value))}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., 40"
                />
                {errors.targetAmount && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.targetAmount}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="unit"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Unit*
                </label>
                <select
                  id="unit"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="hours">Hours</option>
                  <option value="pages">Pages</option>
                  <option value="chapters">Chapters</option>
                  <option value="lessons">Lessons</option>
                  <option value="sessions">Sessions</option>
                  <option value="problems">Problems</option>
                  <option value="projects">Projects</option>
                  <option value="assignments">Assignments</option>
                </select>
                {errors.unit && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.unit}
                  </p>
                )}
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Start Date*
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.startDate}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="deadline"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Deadline*
                </label>
                <input
                  type="date"
                  id="deadline"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
                {errors.deadline && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.deadline}
                  </p>
                )}
              </div>
            </div>

            {/* Milestones */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Milestones
                </label>
                <button
                  type="button"
                  onClick={addMilestone}
                  className="flex items-center text-xs px-2 py-1 rounded-md bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-800/50"
                >
                  <PlusIcon className="h-3 w-3 mr-1" />
                  Add Milestone
                </button>
              </div>

              {milestones.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  Add milestones to track incremental progress towards your
                  goal.
                </p>
              ) : (
                <div className="space-y-3">
                  {milestones.map((milestone, index) => (
                    <div
                      key={milestone.id}
                      className="flex items-start gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-md"
                    >
                      <div className="flex-1">
                        <div className="mb-2">
                          <input
                            type="text"
                            value={milestone.description}
                            onChange={(e) =>
                              updateMilestone(
                                milestone.id,
                                "description",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-600 dark:text-white"
                            placeholder="Milestone description"
                          />
                          {errors[`milestone_${index}_description`] && (
                            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                              {errors[`milestone_${index}_description`]}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Target:
                          </span>
                          <input
                            type="number"
                            value={milestone.target || ""}
                            onChange={(e) =>
                              updateMilestone(
                                milestone.id,
                                "target",
                                Number(e.target.value)
                              )
                            }
                            min="1"
                            max={targetAmount}
                            className="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-600 dark:text-white"
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {unit}
                          </span>

                          {errors[`milestone_${index}_target`] && (
                            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                              {errors[`milestone_${index}_target`]}
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeMilestone(milestone.id)}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                      >
                        <MinusIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Form buttons */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
            >
              Create Goal
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};
