import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  usePomodoroStore,
  TimerStatus,
  TimerType,
} from "../../store/pomodoroStore";
import { Task, useTaskStore } from "../../store/taskStore";
import { useNotifications } from "../../context/NotificationContext";
import {
  PlayIcon,
  PauseIcon,
  ArrowPathIcon as RefreshIcon,
  ForwardIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { PomodoroSettings } from "../pomodoro/PomodoroSettings";
import { TaskSelection } from "../pomodoro/TaskSelection";
import {
  formatTime,
  formatMinutesToHuman,
  getTodayFocusTime,
  requestNotificationPermission,
  triggerStorageUpdate,
} from "../../utils/pomodoroHelpers";

export const PomodoroTimer = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [showTaskSelection, setShowTaskSelection] = useState(false);

  // Timer state from store
  const pomodoroStore = usePomodoroStore();
  const {
    currentSession,
    status,
    timeRemaining,
    settings,
    startSession,
    pauseSession,
    resumeSession,
    completeSession,
    resetSession,
    updateTimeRemaining,
    trackRealTimeFocus,
  } = pomodoroStore;

  // Task information
  const tasks = useTaskStore()?.tasks || [];
  const selectedTask = tasks.find((task) => task.id === currentSession?.taskId);

  // Notification system
  const { addNotification } = useNotifications();

  const [displayTime, setDisplayTime] = useState("25:00");

  // Session Progress
  const [todayFocusTime, setTodayFocusTime] = useState(getTodayFocusTime());

  // Update display time when timeRemaining changes
  useEffect(() => {
    setDisplayTime(formatTime(timeRemaining));
  }, [timeRemaining]);

  // Listen for localStorage changes to update focus time
  useEffect(() => {
    const handleStorageChange = () => {
      // Update the focus time display
      setTodayFocusTime(getTodayFocusTime());
    };

    // Add event listener for storage events
    window.addEventListener("storage", handleStorageChange);

    // Also refresh the focus time on mount and when status changes
    setTodayFocusTime(getTodayFocusTime());

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [status]);

  // Also update focus time when status changes, especially to "Completed"
  useEffect(() => {
    if (status === TimerStatus.Completed) {
      // Short delay to ensure localStorage is updated
      setTimeout(() => {
        setTodayFocusTime(getTodayFocusTime());
      }, 100);
    }
  }, [status]);

  // Request notification permission on component mount
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Get status text and colors
  const getStatusInfo = useCallback(() => {
    switch (status) {
      case TimerStatus.Running:
        return {
          text: "Focus Session",
          textColor: "text-red-600 dark:text-red-400",
          borderColor: "border-red-600 dark:border-red-400",
          bgColor: "bg-red-600 dark:bg-red-400",
        };
      case TimerStatus.Paused:
        return {
          text: "Paused",
          textColor: "text-amber-600 dark:text-amber-400",
          borderColor: "border-amber-600 dark:border-amber-400",
          bgColor: "bg-amber-600 dark:bg-amber-400",
        };
      case TimerStatus.Completed:
        return {
          text: "Completed",
          textColor: "text-green-600 dark:text-green-400",
          borderColor: "border-green-600 dark:border-green-400",
          bgColor: "bg-green-600 dark:bg-green-400",
        };
      default:
        return {
          text: "Ready",
          textColor: "text-blue-600 dark:text-blue-400",
          borderColor: "border-blue-600 dark:border-blue-400",
          bgColor: "bg-blue-600 dark:bg-blue-400",
        };
    }
  }, [status]);

  // Calculate progress for the timer display
  const calculateProgress = useCallback(() => {
    let totalTime = 0;

    if (currentSession) {
      totalTime = currentSession.duration;
    } else {
      // Default to focus duration if no session
      totalTime = settings.focusDuration;
    }

    const progress =
      totalTime > 0 ? ((totalTime - timeRemaining) / totalTime) * 100 : 0;
    return { totalTime, progress: Math.max(0, Math.min(100, progress)) };
  }, [status, timeRemaining, settings, currentSession]);

  const statusInfo = getStatusInfo();
  const { progress } = calculateProgress();

  // Handle starting different timer types
  const handleStartFocus = () => {
    startSession(TimerType.Focus);
  };

  const handleStartShortBreak = () => {
    startSession(TimerType.ShortBreak);
  };

  const handleStartLongBreak = () => {
    startSession(TimerType.LongBreak);
  };

  // Handle timer controls
  const handlePauseResume = () => {
    if (status === TimerStatus.Running) {
      pauseSession();
    } else if (status === TimerStatus.Paused) {
      resumeSession();
    } else {
      // Start a focus session if in Ready state
      startSession(TimerType.Focus);
    }
  };

  const handleReset = () => {
    resetSession();
  };

  // Toggle settings modal
  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  // Toggle task selection modal
  const toggleTaskSelection = () => {
    setShowTaskSelection(!showTaskSelection);
  };

  return (
    <div className="space-y-6">
      {/* Timer Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Pomodoro Timer
        </h1>
        <button
          onClick={toggleSettings}
          className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300"
        >
          <Cog6ToothIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Timer Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="overflow-hidden rounded-2xl bg-white shadow-md dark:bg-gray-800"
      >
        {/* Progress bar */}
        <div className="h-2 w-full bg-gray-200 dark:bg-gray-700">
          <motion.div
            className={`absolute left-0 top-0 h-full ${statusInfo.bgColor}`}
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="p-6">
          {/* Timer Status Text */}
          <div className="mb-4 text-center">
            <span className={`text-lg font-medium ${statusInfo.textColor}`}>
              {statusInfo.text}
            </span>
          </div>

          {/* Selected Task (if any) */}
          {selectedTask && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 rounded-lg bg-gray-50 p-3 text-center dark:bg-gray-700"
            >
              <span className="mb-1 block text-sm text-gray-500 dark:text-gray-400">
                Current Task:
              </span>
              <span className="font-medium text-gray-800 dark:text-white">
                {selectedTask.title}
              </span>
            </motion.div>
          )}

          {/* Timer Display */}
          <div className="mb-8 text-center">
            <motion.div
              key={timeRemaining}
              initial={{ scale: 1.1, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="text-7xl font-bold text-gray-800 dark:text-white"
            >
              {displayTime}
            </motion.div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-center space-x-4">
            {/* Reset Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              disabled={status === TimerStatus.Ready}
              className={`flex h-12 w-12 items-center justify-center rounded-full ${
                status === TimerStatus.Ready
                  ? "cursor-not-allowed bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              <RefreshIcon className="h-6 w-6" />
            </motion.button>

            {/* Play/Pause Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePauseResume}
              className={`flex h-16 w-16 items-center justify-center rounded-full ${
                status === TimerStatus.Running
                  ? "bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                  : "bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
              }`}
            >
              {status === TimerStatus.Running ? (
                <PauseIcon className="h-8 w-8" />
              ) : (
                <PlayIcon className="h-8 w-8" />
              )}
            </motion.button>
          </div>

          {/* Task Selection Button */}
          <div className="mt-6 text-center">
            <button
              onClick={toggleTaskSelection}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-200 dark:hover:bg-indigo-800"
            >
              {selectedTask ? "Change Task" : "Select a Task"}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Session Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-lg bg-white p-4 shadow-md dark:bg-gray-800"
      >
        <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
          Session Progress
        </h2>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Sessions
            </span>
            <div className="flex space-x-2">
              {Array.from({ length: settings.sessionsBeforeLongBreak }).map(
                (_, index) => (
                  <div
                    key={index}
                    className={`h-3 w-3 rounded-full ${
                      index < currentSession
                        ? "bg-indigo-500"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  />
                )
              )}
            </div>
          </div>

          <div className="text-right">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Focus Time Today
            </span>
            <p className="text-lg font-semibold text-gray-800 dark:text-white">
              {formatMinutesToHuman(todayFocusTime)}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && <PomodoroSettings onClose={toggleSettings} />}
      </AnimatePresence>

      {/* Task Selection Modal */}
      <AnimatePresence>
        {showTaskSelection && <TaskSelection onClose={toggleTaskSelection} />}
      </AnimatePresence>
    </div>
  );
};
