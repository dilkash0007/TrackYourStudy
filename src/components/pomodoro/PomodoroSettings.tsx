import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { usePomodoroStore } from "../../store/pomodoroStore";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { requestNotificationPermission } from "../../utils/pomodoroHelpers";

interface PomodoroSettingsProps {
  onClose: () => void;
}

export const PomodoroSettings = ({ onClose }: PomodoroSettingsProps) => {
  const settings = usePomodoroStore((state) => state.settings);
  const updateSettings = usePomodoroStore((state) => state.updateSettings);

  // Local state to track form values
  const [formData, setFormData] = useState({
    focusDuration: settings.focusDuration,
    shortBreakDuration: settings.shortBreakDuration,
    longBreakDuration: settings.longBreakDuration,
    sessionsBeforeLongBreak: settings.sessionsBeforeLongBreak,
    autoStartBreaks: settings.autoStartBreaks,
    autoStartPomodoros: settings.autoStartPomodoros,
    soundEnabled: settings.soundEnabled,
    backgroundSoundEnabled: settings.backgroundSoundEnabled,
    backgroundSoundType: settings.backgroundSoundType,
    notificationsEnabled: settings.notificationsEnabled,
  });

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
          ? parseInt(value, 10)
          : value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    onClose();
  };

  // Request notification permission when enabling notifications
  useEffect(() => {
    if (formData.notificationsEnabled) {
      requestNotificationPermission();
    }
  }, [formData.notificationsEnabled]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Timer Settings
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-md font-medium text-gray-800 dark:text-white">
              Time (Minutes)
            </h3>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="focusDuration"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Focus
                </label>
                <input
                  type="number"
                  id="focusDuration"
                  name="focusDuration"
                  min="1"
                  max="120"
                  value={formData.focusDuration}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="shortBreakDuration"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Short Break
                </label>
                <input
                  type="number"
                  id="shortBreakDuration"
                  name="shortBreakDuration"
                  min="1"
                  max="30"
                  value={formData.shortBreakDuration}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="longBreakDuration"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Long Break
                </label>
                <input
                  type="number"
                  id="longBreakDuration"
                  name="longBreakDuration"
                  min="1"
                  max="60"
                  value={formData.longBreakDuration}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="sessionsBeforeLongBreak"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Sessions before long break
              </label>
              <input
                type="number"
                id="sessionsBeforeLongBreak"
                name="sessionsBeforeLongBreak"
                min="1"
                max="10"
                value={formData.sessionsBeforeLongBreak}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-md font-medium text-gray-800 dark:text-white">
              Autostart
            </h3>

            <div className="flex items-start space-x-3">
              <div className="flex h-5 items-center">
                <input
                  type="checkbox"
                  id="autoStartBreaks"
                  name="autoStartBreaks"
                  checked={formData.autoStartBreaks}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                />
              </div>
              <div className="text-sm">
                <label
                  htmlFor="autoStartBreaks"
                  className="font-medium text-gray-700 dark:text-gray-300"
                >
                  Auto-start breaks
                </label>
                <p className="text-gray-500 dark:text-gray-400">
                  Automatically start breaks when a focus session ends
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex h-5 items-center">
                <input
                  type="checkbox"
                  id="autoStartPomodoros"
                  name="autoStartPomodoros"
                  checked={formData.autoStartPomodoros}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                />
              </div>
              <div className="text-sm">
                <label
                  htmlFor="autoStartPomodoros"
                  className="font-medium text-gray-700 dark:text-gray-300"
                >
                  Auto-start focus sessions
                </label>
                <p className="text-gray-500 dark:text-gray-400">
                  Automatically start the next focus session when a break ends
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-md font-medium text-gray-800 dark:text-white">
              Sound
            </h3>

            <div className="flex items-start space-x-3">
              <div className="flex h-5 items-center">
                <input
                  type="checkbox"
                  id="soundEnabled"
                  name="soundEnabled"
                  checked={formData.soundEnabled}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                />
              </div>
              <div className="text-sm">
                <label
                  htmlFor="soundEnabled"
                  className="font-medium text-gray-700 dark:text-gray-300"
                >
                  Sound notifications
                </label>
                <p className="text-gray-500 dark:text-gray-400">
                  Play sound when timer starts, ends, and breaks end
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex h-5 items-center">
                <input
                  type="checkbox"
                  id="backgroundSoundEnabled"
                  name="backgroundSoundEnabled"
                  checked={formData.backgroundSoundEnabled}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                />
              </div>
              <div className="text-sm">
                <label
                  htmlFor="backgroundSoundEnabled"
                  className="font-medium text-gray-700 dark:text-gray-300"
                >
                  Background sound
                </label>
                <p className="text-gray-500 dark:text-gray-400">
                  Play ambient sound during focus and break sessions
                </p>
              </div>
            </div>

            {formData.backgroundSoundEnabled && (
              <div>
                <label
                  htmlFor="backgroundSoundType"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Background Sound Type
                </label>
                <select
                  id="backgroundSoundType"
                  name="backgroundSoundType"
                  value={formData.backgroundSoundType}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                >
                  <option value="none">None</option>
                  <option value="whitenoise">White Noise</option>
                  <option value="rain">Rain</option>
                  <option value="coffee">Coffee Shop</option>
                  <option value="forest">Forest</option>
                </select>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-md font-medium text-gray-800 dark:text-white">
              Notifications
            </h3>

            <div className="flex items-start space-x-3">
              <div className="flex h-5 items-center">
                <input
                  type="checkbox"
                  id="notificationsEnabled"
                  name="notificationsEnabled"
                  checked={formData.notificationsEnabled}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                />
              </div>
              <div className="text-sm">
                <label
                  htmlFor="notificationsEnabled"
                  className="font-medium text-gray-700 dark:text-gray-300"
                >
                  Desktop notifications
                </label>
                <p className="text-gray-500 dark:text-gray-400">
                  Show desktop notifications when sessions start and end
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};
