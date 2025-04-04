import { useState, useEffect } from "react";
import {
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
} from "@heroicons/react/24/outline";
import { useUserStore } from "../../store/userStore";

export const ThemeToggle = () => {
  // Use a local theme state since theme is not in the user store
  const [theme, setTheme] = useState(() => {
    // Try to get the saved theme from localStorage
    const savedTheme = localStorage.getItem("theme") as
      | "light"
      | "dark"
      | "system"
      | null;
    return savedTheme || "system";
  });

  const toggleTheme = () => {
    const nextTheme =
      theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
    setTheme(nextTheme);

    // Save the theme to localStorage
    localStorage.setItem("theme", nextTheme);

    // Apply the theme directly
    applyTheme(nextTheme);
  };

  const applyTheme = (themeValue: string) => {
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

  // Apply theme on initial load
  useEffect(() => {
    applyTheme(theme);

    // Listen for system theme changes if using system theme
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyTheme("system");
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

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
