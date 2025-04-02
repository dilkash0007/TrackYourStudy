import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { XMarkIcon, ArrowsPointingOutIcon } from "@heroicons/react/24/outline";
import {
  usePomodoroStore,
  TimerStatus,
  TimerType,
} from "../../store/pomodoroStore";
import { formatTime } from "../../utils/pomodoroHelpers";

export const FloatingTimer: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const { currentSession, status, timeRemaining } = usePomodoroStore();
  const [displayTime, setDisplayTime] = useState("--:--");

  // Update display time when timeRemaining changes
  useEffect(() => {
    setDisplayTime(formatTime(timeRemaining));
  }, [timeRemaining]);

  // Only show when a session is active
  const shouldDisplay =
    status === TimerStatus.Running || status === TimerStatus.Paused;

  // Get color based on timer type
  const getTimerColor = () => {
    if (!currentSession) return "bg-gray-500";

    switch (currentSession.type) {
      case TimerType.Focus:
        return "bg-red-600";
      case TimerType.ShortBreak:
        return "bg-green-600";
      case TimerType.LongBreak:
        return "bg-blue-600";
      default:
        return "bg-gray-500";
    }
  };

  if (!shouldDisplay || !isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-4 right-4 z-50"
    >
      <div className="rounded-lg shadow-lg bg-white dark:bg-gray-800 overflow-hidden">
        <div className={`h-1 ${getTimerColor()}`} />
        <div className="p-3 flex items-center space-x-3">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {currentSession?.type === TimerType.Focus
                ? "Focus"
                : currentSession?.type === TimerType.ShortBreak
                ? "Short Break"
                : "Long Break"}
            </span>
            <span className="text-lg font-bold text-gray-800 dark:text-white">
              {displayTime}
            </span>
          </div>
          <div className="flex space-x-1">
            <Link
              to="/pomodoro"
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
            >
              <ArrowsPointingOutIcon className="h-4 w-4" />
            </Link>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
