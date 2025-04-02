import { useState, useEffect } from "react";
import {
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
} from "@heroicons/react/24/outline";
import { useUserStore } from "../../store/userStore";

export const ThemeToggle = () => {
  const { uiPreferences, updateUIPreferences } = useUserStore();
  const [theme, setTheme] = useState(uiPreferences.theme);

  const toggleTheme = () => {
    const nextTheme =
      theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
    setTheme(nextTheme);
    updateUIPreferences({ theme: nextTheme });
  };

  useEffect(() => {
    // Update the document class when theme changes
    const root = window.document.documentElement;

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.remove("light", "dark");
      root.classList.add(systemTheme);
    } else {
      root.classList.remove("light", "dark");
      root.classList.add(theme);
    }
  }, [theme]);

  // Update component if store changes
  useEffect(() => {
    setTheme(uiPreferences.theme);
  }, [uiPreferences.theme]);

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <SunIcon className="h-5 w-5 text-yellow-500" />
      ) : theme === "dark" ? (
        <MoonIcon className="h-5 w-5 text-blue-500" />
      ) : (
        <ComputerDesktopIcon className="h-5 w-5 text-gray-500 dark:text-gray-300" />
      )}
    </button>
  );
};
