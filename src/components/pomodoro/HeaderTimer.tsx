import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ClockIcon } from "@heroicons/react/24/outline";
import {
  usePomodoroStore,
  TimerStatus,
  TimerType,
} from "../../store/pomodoroStore";
import { formatTime } from "../../utils/pomodoroHelpers";

export const HeaderTimer: React.FC = () => {
  const pomodoroState = usePomodoroStore();
  const currentSession = pomodoroState?.currentSession;
  const status = pomodoroState?.status || TimerStatus.Idle;
  const timeRemaining = pomodoroState?.timeRemaining || 0;
  const [displayTime, setDisplayTime] = useState("--:--");

  // Update display time when timeRemaining changes
  useEffect(() => {
    if (typeof timeRemaining === "number" && timeRemaining >= 0) {
      setDisplayTime(formatTime(timeRemaining));
    } else {
      setDisplayTime("--:--");
    }
  }, [timeRemaining]);

  // Only show when a session is active
  const shouldDisplay =
    status === TimerStatus.Running || status === TimerStatus.Paused;

  if (!shouldDisplay) return null;

  // Get color based on timer type and status
  const getTextColor = () => {
    if (status === TimerStatus.Paused)
      return "text-amber-500 dark:text-amber-400";

    if (!currentSession) return "text-gray-500 dark:text-gray-400";

    switch (currentSession.type) {
      case TimerType.Focus:
        return "text-red-500 dark:text-red-400";
      case TimerType.ShortBreak:
        return "text-green-500 dark:text-green-400";
      case TimerType.LongBreak:
        return "text-blue-500 dark:text-blue-400";
      default:
        return "text-gray-500 dark:text-gray-400";
    }
  };

  const sessionTypeLabel = currentSession?.type
    ? currentSession.type === TimerType.Focus
      ? "Focus"
      : currentSession.type === TimerType.ShortBreak
      ? "Break"
      : "Long Break"
    : "Timer";

  return (
    <Link
      to="/pomodoro"
      className="flex items-center space-x-1 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      <ClockIcon className={`h-4 w-4 ${getTextColor()}`} />
      <span className={`text-sm font-medium ${getTextColor()}`}>
        {sessionTypeLabel}: {displayTime}
      </span>
    </Link>
  );
};
