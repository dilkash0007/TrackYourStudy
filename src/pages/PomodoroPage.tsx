import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { usePomodoroStore, PomodoroSession } from "../store/pomodoroStore";
import { useTaskStore } from "../store/taskStore";
import { PomodoroTimer } from "../components/pomodoro/PomodoroTimer";
import {
  ChartBarIcon,
  ClockIcon,
  FireIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

export const PomodoroPage = () => {
  const [activeTab, setActiveTab] = useState<"today" | "all">("today");

  // Get stats and sessions from store
  const pomodoroStore = usePomodoroStore();
  const completedSessions = pomodoroStore?.completedSessions || [];

  // Add local state to ensure sessions persist in UI
  const [sessions, setSessions] = useState<PomodoroSession[]>([]);

  // Sync sessions from store
  useEffect(() => {
    const store = usePomodoroStore.getState();
    if (store) {
      setSessions(store.completedSessions || []);
    }

    // Subscribe to store changes
    const unsubscribe = usePomodoroStore.subscribe((state) => {
      if (state.completedSessions) {
        setSessions(state.completedSessions);
      }
    });

    return () => unsubscribe();
  }, []);

  const stats = pomodoroStore?.stats || {
    totalFocusTime: 0,
    totalCompletedSessions: 0,
    streak: 0,
    dailyStats: {},
  };

  // Get tasks safely
  const taskStore = useTaskStore();
  const tasks = taskStore?.tasks || [];

  // Filter sessions for today
  const today = new Date().toISOString().split("T")[0];
  const todaySessions = Array.isArray(sessions)
    ? sessions.filter(
        (session) =>
          session &&
          session.startedAt &&
          new Date(session.startedAt).toISOString().split("T")[0] === today
      )
    : [];

  // Display sessions based on active tab
  const displaySessions =
    activeTab === "today"
      ? todaySessions
      : Array.isArray(sessions)
      ? sessions
      : [];

  // Sort sessions by start time (newest first)
  const sortedSessions = Array.isArray(displaySessions)
    ? [...displaySessions].sort((a, b) => {
        const dateA = a?.startedAt ? new Date(a.startedAt).getTime() : 0;
        const dateB = b?.startedAt ? new Date(b.startedAt).getTime() : 0;
        return dateB - dateA;
      })
    : [];

  // Format time function (mm:ss)
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }

    return `${mins}m`;
  };

  // Format date for session history
  const formatSessionDate = (dateStr?: Date | string) => {
    if (!dateStr) return "Unknown";

    const date = dateStr instanceof Date ? dateStr : new Date(dateStr);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Pomodoro Timer
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Focus on your studies with timed intervals
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Focus Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800"
        >
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
              <ClockIcon className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Focus Time
              </h2>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {formatTime(stats.totalFocusTime || 0)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Sessions Completed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800"
        >
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
              <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Sessions Completed
              </h2>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {stats.totalCompletedSessions || 0}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Current Streak */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800"
        >
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900">
              <FireIcon className="h-6 w-6 text-orange-600 dark:text-orange-300" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Current Streak
              </h2>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {stats.streak || 0} {(stats.streak || 0) === 1 ? "day" : "days"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Today's Focus */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800"
        >
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900">
              <ChartBarIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-300" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Today's Focus
              </h2>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {formatTime(
                  (stats.dailyStats && stats.dailyStats[today]?.focusTime) || 0
                )}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Timer Component */}
      <PomodoroTimer />

      {/* Session History */}
      <div className="rounded-lg bg-white shadow-md dark:bg-gray-800">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex">
            <button
              onClick={() => setActiveTab("today")}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === "today"
                  ? "border-b-2 border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-300"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Today's Sessions
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === "all"
                  ? "border-b-2 border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-300"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              All Sessions
            </button>
          </div>
        </div>

        <div className="p-4">
          <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
            Session History
          </h2>

          {sortedSessions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                      Date & Time
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                      Duration
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                      Task
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                  {sortedSessions.map((session) => {
                    const relatedTask = session.taskId
                      ? tasks.find((t) => t.id === session.taskId)
                      : undefined;

                    return (
                      <tr key={session.id}>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                          {formatSessionDate(session.startedAt)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                          {formatTime(session.duration || 0)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                          {relatedTask ? relatedTask.title : "No task"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                          {session.completedAt ? (
                            <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800 dark:bg-green-900 dark:text-green-200">
                              Completed
                            </span>
                          ) : session.interrupted ? (
                            <span className="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-800 dark:bg-red-900 dark:text-red-200">
                              Interrupted
                            </span>
                          ) : (
                            <span className="inline-flex rounded-full bg-yellow-100 px-2 text-xs font-semibold leading-5 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                              In Progress
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500 dark:text-gray-400">
              No sessions recorded yet. Start a Pomodoro timer to track your
              study sessions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
