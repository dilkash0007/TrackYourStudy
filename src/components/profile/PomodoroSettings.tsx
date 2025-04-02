import { useState } from "react";
import { useUserStore } from "../../store/userStore";
import { motion } from "framer-motion";
import {
  ClockIcon,
  BellIcon,
  MusicalNoteIcon,
  SpeakerWaveIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";

export const PomodoroSettings = () => {
  const pomodoroPreferences = useUserStore(
    (state) => state.pomodoroPreferences
  );
  const updatePomodoroPreferences = useUserStore(
    (state) => state.updatePomodoroPreferences
  );

  // Local state for input values
  const [focusTime, setFocusTime] = useState(pomodoroPreferences.focusTime);
  const [shortBreakTime, setShortBreakTime] = useState(
    pomodoroPreferences.shortBreakTime
  );
  const [longBreakTime, setLongBreakTime] = useState(
    pomodoroPreferences.longBreakTime
  );
  const [sessionsUntilLongBreak, setSessionsUntilLongBreak] = useState(
    pomodoroPreferences.sessionsUntilLongBreak
  );

  // Function to handle saving time settings
  const handleSaveTimeSettings = () => {
    updatePomodoroPreferences({
      focusTime,
      shortBreakTime,
      longBreakTime,
      sessionsUntilLongBreak,
    });
  };

  // Toggle handler for boolean preferences
  const handleToggle = (preference: keyof typeof pomodoroPreferences) => {
    if (typeof pomodoroPreferences[preference] === "boolean") {
      updatePomodoroPreferences({
        [preference]: !pomodoroPreferences[preference],
      });
    }
  };

  // Sound options
  const soundOptions = [
    { value: "bell", label: "Bell" },
    { value: "digital", label: "Digital" },
    { value: "zen", label: "Zen" },
    { value: "forest", label: "Forest" },
    { value: "ocean", label: "Ocean" },
  ];

  // Handle sound selection change
  const handleSoundChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updatePomodoroPreferences({
      timerCompleteSound: e.target.value,
    });
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updatePomodoroPreferences({
      soundVolume: parseInt(e.target.value),
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Pomodoro Timer Settings
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Customize your focus and break times to optimize your productivity.
        </p>
      </div>

      {/* Timer Durations */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm p-5 mb-6"
      >
        <div className="flex items-center mb-4">
          <ClockIcon className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mr-2" />
          <h3 className="text-lg font-medium text-gray-800 dark:text-white">
            Timer Durations
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="focusTime"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Focus Time (minutes)
            </label>
            <input
              id="focusTime"
              type="number"
              min="1"
              max="120"
              value={focusTime}
              onChange={(e) => setFocusTime(parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="shortBreakTime"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Short Break (minutes)
            </label>
            <input
              id="shortBreakTime"
              type="number"
              min="1"
              max="30"
              value={shortBreakTime}
              onChange={(e) => setShortBreakTime(parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="longBreakTime"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Long Break (minutes)
            </label>
            <input
              id="longBreakTime"
              type="number"
              min="1"
              max="60"
              value={longBreakTime}
              onChange={(e) => setLongBreakTime(parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="sessionsUntilLongBreak"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Sessions Until Long Break
            </label>
            <input
              id="sessionsUntilLongBreak"
              type="number"
              min="1"
              max="10"
              value={sessionsUntilLongBreak}
              onChange={(e) =>
                setSessionsUntilLongBreak(parseInt(e.target.value))
              }
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <button
          onClick={handleSaveTimeSettings}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <WrenchScrewdriverIcon className="h-4 w-4 mr-2" />
          Save Time Settings
        </button>
      </motion.div>

      {/* Sound Settings */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm p-5 mb-6"
      >
        <div className="flex items-center mb-4">
          <MusicalNoteIcon className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mr-2" />
          <h3 className="text-lg font-medium text-gray-800 dark:text-white">
            Sound Settings
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="timerSound"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Timer Complete Sound
            </label>
            <select
              id="timerSound"
              value={pomodoroPreferences.timerCompleteSound}
              onChange={handleSoundChange}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              {soundOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="soundVolume"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Sound Volume: {pomodoroPreferences.soundVolume}%
            </label>
            <input
              id="soundVolume"
              type="range"
              min="0"
              max="100"
              step="5"
              value={pomodoroPreferences.soundVolume}
              onChange={handleVolumeChange}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </motion.div>

      {/* Toggle Options */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm p-5"
      >
        <div className="flex items-center mb-4">
          <BellIcon className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mr-2" />
          <h3 className="text-lg font-medium text-gray-800 dark:text-white">
            Additional Options
          </h3>
        </div>

        <div className="space-y-4">
          {[
            {
              id: "autoStartBreaks",
              title: "Auto-start Breaks",
              description:
                "Automatically start break timer when focus session completes",
              value: pomodoroPreferences.autoStartBreaks,
            },
            {
              id: "autoStartFocus",
              title: "Auto-start Focus",
              description:
                "Automatically start next focus session when break completes",
              value: pomodoroPreferences.autoStartFocus,
            },
            {
              id: "showNotifications",
              title: "Show Notifications",
              description: "Display browser notifications when timer completes",
              value: pomodoroPreferences.showNotifications,
            },
            {
              id: "playSound",
              title: "Play Sound",
              description: "Play sound when timer completes",
              value: pomodoroPreferences.playSound,
            },
          ].map((option) => (
            <div
              key={option.id}
              className="flex items-center justify-between p-3 border border-gray-100 dark:border-gray-700 rounded-lg"
            >
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {option.title}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {option.description}
                </p>
              </div>
              <button
                onClick={() =>
                  handleToggle(option.id as keyof typeof pomodoroPreferences)
                }
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  option.value
                    ? "bg-indigo-600"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
                role="switch"
                aria-checked={option.value}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    option.value ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
