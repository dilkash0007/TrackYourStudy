import { useState, useEffect } from "react";
import {
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
} from "@heroicons/react/24/outline";
import { useUserStore } from "../../store/userStore";
import type { ThemeMode } from "../../store/userStore";

export const ThemeToggle = () => {
  // Get theme and updateTheme from store
  const theme = useUserStore((state) => state.theme) || "system";
  const updateTheme = useUserStore((state) => state.updateTheme);
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>(theme);

  const toggleTheme = () => {
    const nextTheme: ThemeMode =
      currentTheme === "light"
        ? "dark"
        : currentTheme === "dark"
        ? "system"
        : "light";

    setCurrentTheme(nextTheme);
    updateTheme(nextTheme);
    localStorage.setItem("theme", nextTheme); // Keep localStorage synced for backwards compatibility
    applyTheme(nextTheme);
  };

  const applyTheme = (themeValue: ThemeMode) => {
    const root = window.document.documentElement;

    if (themeValue === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.remove("light", "dark");
      root.classList.add(systemTheme);
    } else {
      root.classList.remove("light", "dark");
      root.classList.add(themeValue);
    }
  };

  // Sync component with store theme value
  useEffect(() => {
    setCurrentTheme(theme);
  }, [theme]);

  // Apply theme on initial load and when theme changes
  useEffect(() => {
    applyTheme(currentTheme);

    // Listen for system theme changes if using system theme
    if (currentTheme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyTheme("system");
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [currentTheme]);

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label="Toggle theme"
    >
      {currentTheme === "light" ? (
        <SunIcon className="h-5 w-5 text-yellow-500" />
      ) : currentTheme === "dark" ? (
        <MoonIcon className="h-5 w-5 text-blue-500" />
      ) : (
        <ComputerDesktopIcon className="h-5 w-5 text-gray-500 dark:text-gray-300" />
      )}
    </button>
  );
};
