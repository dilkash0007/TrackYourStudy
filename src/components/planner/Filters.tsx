import { useState } from "react";
import { motion } from "framer-motion";
import {
  AdjustmentsHorizontalIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface FiltersProps {
  categories: string[];
  onFilterChange: (filters: {
    categories: string[];
    dateRange: { start: Date | null; end: Date | null };
    completed: boolean | null;
  }) => void;
}

export function Filters({ categories, onFilterChange }: FiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({
    start: null,
    end: null,
  });
  const [showCompleted, setShowCompleted] = useState<boolean | null>(null);

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleDateChange = (type: "start" | "end", value: string) => {
    if (value === "") {
      setDateRange({ ...dateRange, [type]: null });
      return;
    }

    const date = new Date(value);
    setDateRange({ ...dateRange, [type]: date });
  };

  const applyFilters = () => {
    onFilterChange({
      categories: selectedCategories,
      dateRange,
      completed: showCompleted,
    });
    setIsOpen(false);
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setDateRange({ start: null, end: null });
    setShowCompleted(null);
    onFilterChange({
      categories: [],
      dateRange: { start: null, end: null },
      completed: null,
    });
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          <AdjustmentsHorizontalIcon className="w-5 h-5" />
          <span>Filter Sessions</span>
          {(selectedCategories.length > 0 ||
            dateRange.start ||
            dateRange.end ||
            showCompleted !== null) && (
            <span className="ml-2 px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900 rounded-full text-xs text-indigo-800 dark:text-indigo-200">
              Active
            </span>
          )}
        </motion.button>

        {(selectedCategories.length > 0 ||
          dateRange.start ||
          dateRange.end ||
          showCompleted !== null) && (
          <button
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            onClick={resetFilters}
          >
            Reset filters
          </button>
        )}
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Category filters */}
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                Categories
              </h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center">
                    <input
                      id={`category-${category}`}
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                      checked={selectedCategories.includes(category)}
                      onChange={() => toggleCategory(category)}
                    />
                    <label
                      htmlFor={`category-${category}`}
                      className="ml-3 text-sm text-gray-700 dark:text-gray-300"
                    >
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Date range filters */}
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                Date Range
              </h3>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="start-date"
                    className="block text-sm text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="start-date"
                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={
                      dateRange.start
                        ? dateRange.start.toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) => handleDateChange("start", e.target.value)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="end-date"
                    className="block text-sm text-gray-700 dark:text-gray-300 mb-1"
                  >
                    End Date
                  </label>
                  <input
                    type="date"
                    id="end-date"
                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={
                      dateRange.end
                        ? dateRange.end.toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) => handleDateChange("end", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Status filters */}
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                Status
              </h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    id="show-all"
                    name="completion-status"
                    type="radio"
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                    checked={showCompleted === null}
                    onChange={() => setShowCompleted(null)}
                  />
                  <label
                    htmlFor="show-all"
                    className="ml-3 text-sm text-gray-700 dark:text-gray-300"
                  >
                    All sessions
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="show-completed"
                    name="completion-status"
                    type="radio"
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                    checked={showCompleted === true}
                    onChange={() => setShowCompleted(true)}
                  />
                  <label
                    htmlFor="show-completed"
                    className="ml-3 text-sm text-gray-700 dark:text-gray-300"
                  >
                    Completed only
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="show-pending"
                    name="completion-status"
                    type="radio"
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                    checked={showCompleted === false}
                    onChange={() => setShowCompleted(false)}
                  />
                  <label
                    htmlFor="show-pending"
                    className="ml-3 text-sm text-gray-700 dark:text-gray-300"
                  >
                    Pending only
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => setIsOpen(false)}
            >
              <XMarkIcon className="h-4 w-4 mr-2" />
              Cancel
            </button>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={applyFilters}
            >
              <CheckIcon className="h-4 w-4 mr-2" />
              Apply Filters
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
