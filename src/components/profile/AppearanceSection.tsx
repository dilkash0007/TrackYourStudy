import { useUserStore, ThemeMode, UIColor } from "../../store/userStore";
import { motion } from "framer-motion";
import {
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
} from "@heroicons/react/24/outline";

export const AppearanceSection = () => {
  const uiPreferences = useUserStore((state) => state.uiPreferences);
  const updateUIPreferences = useUserStore(
    (state) => state.updateUIPreferences
  );

  // Theme options
  const themeOptions: {
    value: ThemeMode;
    label: string;
    icon: React.ElementType;
  }[] = [
    { value: "light", label: "Light", icon: SunIcon },
    { value: "dark", label: "Dark", icon: MoonIcon },
    { value: "system", label: "System", icon: ComputerDesktopIcon },
  ];

  // Color options
  const colorOptions: { value: UIColor; label: string; bgClass: string }[] = [
    { value: "indigo", label: "Indigo", bgClass: "bg-indigo-500" },
    { value: "blue", label: "Blue", bgClass: "bg-blue-500" },
    { value: "purple", label: "Purple", bgClass: "bg-purple-500" },
    { value: "teal", label: "Teal", bgClass: "bg-teal-500" },
    { value: "green", label: "Green", bgClass: "bg-green-500" },
    { value: "pink", label: "Pink", bgClass: "bg-pink-500" },
    { value: "red", label: "Red", bgClass: "bg-red-500" },
    { value: "orange", label: "Orange", bgClass: "bg-orange-500" },
  ];

  // Font style options
  const fontStyleOptions = [
    { value: "default", label: "Default" },
    { value: "readable", label: "Readable" },
    { value: "compact", label: "Compact" },
  ];

  // Update handler for theme preference
  const handleThemeChange = (theme: ThemeMode) => {
    updateUIPreferences({ theme });

    // Optionally, implement immediate theme change in the app
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (theme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      // System preference - check user's system preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      if (prefersDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  // Update handler for color preference
  const handleColorChange = (color: UIColor) => {
    updateUIPreferences({ primaryColor: color });
  };

  // Update handler for font style
  const handleFontStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateUIPreferences({
      fontStyle: e.target.value as "default" | "readable" | "compact",
    });
  };

  // Toggle handlers for boolean preferences
  const handleToggle = (preference: keyof typeof uiPreferences) => {
    updateUIPreferences({ [preference]: !uiPreferences[preference] });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Appearance Settings
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Customize how TrackYouStudy looks and feels to improve your study
          experience.
        </p>
      </div>

      {/* Theme Selection */}
      <section>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
          Theme
        </h3>
        <div className="grid grid-cols-3 gap-4 sm:w-3/4">
          {themeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleThemeChange(option.value)}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all
              ${
                uiPreferences.theme === option.value
                  ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700"
              }`}
            >
              <option.icon
                className={`w-8 h-8 mb-2 ${
                  uiPreferences.theme === option.value
                    ? "text-indigo-500 dark:text-indigo-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  uiPreferences.theme === option.value
                    ? "text-indigo-700 dark:text-indigo-300"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Color Selection */}
      <section>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
          Accent Color
        </h3>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-3"
        >
          {colorOptions.map((color) => (
            <button
              key={color.value}
              onClick={() => handleColorChange(color.value)}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                color.bgClass
              } transition-transform ${
                uiPreferences.primaryColor === color.value
                  ? "ring-2 ring-offset-2 ring-gray-400 dark:ring-gray-600 scale-110"
                  : "hover:scale-105"
              }`}
              title={color.label}
            >
              {uiPreferences.primaryColor === color.value && (
                <motion.svg
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-5 h-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </motion.svg>
              )}
            </button>
          ))}
        </motion.div>
      </section>

      {/* Font Style */}
      <section>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
          Font Style
        </h3>
        <div className="sm:w-1/2">
          <select
            value={uiPreferences.fontStyle}
            onChange={handleFontStyleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          >
            {fontStyleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Toggle Options */}
      <section className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
          Display Options
        </h3>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Show Completed Tasks
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Display completed tasks in your task list
            </p>
          </div>
          <button
            onClick={() => handleToggle("showCompletedTasks")}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              uiPreferences.showCompletedTasks
                ? "bg-indigo-600"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
            role="switch"
            aria-checked={uiPreferences.showCompletedTasks}
          >
            <span
              aria-hidden="true"
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                uiPreferences.showCompletedTasks
                  ? "translate-x-5"
                  : "translate-x-0"
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Show Timer in Pomodoro
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Display the countdown timer during Pomodoro sessions
            </p>
          </div>
          <button
            onClick={() => handleToggle("showTimeInPomodoro")}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              uiPreferences.showTimeInPomodoro
                ? "bg-indigo-600"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
            role="switch"
            aria-checked={uiPreferences.showTimeInPomodoro}
          >
            <span
              aria-hidden="true"
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                uiPreferences.showTimeInPomodoro
                  ? "translate-x-5"
                  : "translate-x-0"
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Reduced Motion
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Minimize animations throughout the app
            </p>
          </div>
          <button
            onClick={() => handleToggle("reducedMotion")}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              uiPreferences.reducedMotion
                ? "bg-indigo-600"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
            role="switch"
            aria-checked={uiPreferences.reducedMotion}
          >
            <span
              aria-hidden="true"
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                uiPreferences.reducedMotion ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Enable Celebration Effects
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Show confetti when completing goals and achievements
            </p>
          </div>
          <button
            onClick={() => handleToggle("enableConfetti")}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              uiPreferences.enableConfetti
                ? "bg-indigo-600"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
            role="switch"
            aria-checked={uiPreferences.enableConfetti}
          >
            <span
              aria-hidden="true"
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                uiPreferences.enableConfetti ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </section>

      {/* Calendar Default View */}
      <section>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
          Default Calendar View
        </h3>
        <div className="sm:w-1/2">
          <select
            value={uiPreferences.defaultView}
            onChange={(e) =>
              updateUIPreferences({
                defaultView: e.target.value as "week" | "day" | "month",
              })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
        </div>
      </section>
    </div>
  );
};
