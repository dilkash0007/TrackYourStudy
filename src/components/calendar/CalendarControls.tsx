import { useCallback } from "react";
import { ViewMode } from "../../store/calendarStore";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarDaysIcon,
  ViewColumnsIcon,
  ViewfinderCircleIcon,
} from "@heroicons/react/24/outline";
import { formatFriendlyDate } from "../../utils/calendarHelpers";

interface CalendarControlsProps {
  viewMode: ViewMode;
  selectedDate: Date;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewModeChange: (mode: ViewMode) => void;
}

export const CalendarControls = ({
  viewMode,
  selectedDate,
  onPrevious,
  onNext,
  onToday,
  onViewModeChange,
}: CalendarControlsProps) => {
  // Format header text based on view mode
  const formatHeaderText = useCallback(() => {
    switch (viewMode) {
      case "day":
        return selectedDate.toLocaleDateString("en-US", {
          weekday: "short",
          month: "long",
          day: "numeric",
          year: "numeric",
        });
      case "week":
        const endOfWeek = new Date(selectedDate);
        endOfWeek.setDate(selectedDate.getDate() + 6);

        // If same month
        if (selectedDate.getMonth() === endOfWeek.getMonth()) {
          return `${selectedDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })} · ${selectedDate.getDate()}-${endOfWeek.getDate()}`;
        }

        // If different months
        return `${selectedDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })} - ${endOfWeek.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}`;
      case "month":
        return selectedDate.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        });
      default:
        return "";
    }
  }, [viewMode, selectedDate]);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 pb-4 border-b dark:border-gray-700">
      {/* Date Controls */}
      <div className="flex items-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mr-4">
          {formatHeaderText()}
        </h2>
        <div className="flex space-x-1">
          <button
            onClick={onPrevious}
            className="p-1.5 rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            aria-label="Previous"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <button
            onClick={onToday}
            className="px-3 py-1.5 rounded-md text-xs font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Today
          </button>
          <button
            onClick={onNext}
            className="p-1.5 rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            aria-label="Next"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* View Mode Controls */}
      <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        <button
          onClick={() => onViewModeChange("day")}
          className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${
            viewMode === "day"
              ? "bg-white text-indigo-600 shadow-sm dark:bg-gray-700 dark:text-indigo-400"
              : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          }`}
        >
          <ViewfinderCircleIcon className="h-4 w-4 mr-1" />
          Day
        </button>
        <button
          onClick={() => onViewModeChange("week")}
          className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${
            viewMode === "week"
              ? "bg-white text-indigo-600 shadow-sm dark:bg-gray-700 dark:text-indigo-400"
              : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          }`}
        >
          <ViewColumnsIcon className="h-4 w-4 mr-1" />
          Week
        </button>
        <button
          onClick={() => onViewModeChange("month")}
          className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${
            viewMode === "month"
              ? "bg-white text-indigo-600 shadow-sm dark:bg-gray-700 dark:text-indigo-400"
              : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          }`}
        >
          <CalendarDaysIcon className="h-4 w-4 mr-1" />
          Month
        </button>
      </div>
    </div>
  );
};
