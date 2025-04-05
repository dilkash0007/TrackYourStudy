import { useState, useEffect } from "react";
import {
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
} from "@heroicons/react/24/outline";
import { useUserStore } from "../../store/userStore";
import type { ThemeMode } from "../../store/userStore";
import { useTheme } from "../../hooks/useTheme";

export const ThemeToggle = () => {
  // Get theme and updateTheme from store with fallbacks
  const theme = useUserStore((state) => state.theme) || "system";
  const updateTheme = useUserStore((state) => state.updateTheme);
  const updateUIPreferences = useUserStore(
    (state) => state.updateUIPreferences
  );
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>(theme);
  const { isDark } = useTheme();

  const toggleTheme = () => {
    const nextTheme: ThemeMode =
      currentTheme === "light"
        ? "dark"
        : currentTheme === "dark"
        ? "system"
        : "light";

    setCurrentTheme(nextTheme);

    // Update store if functions exist
    if (typeof updateTheme === "function") {
      updateTheme(nextTheme);
    }

    // Update both theme and uiPreferences.theme to stay in sync
    if (typeof updateUIPreferences === "function") {
      updateUIPreferences({ theme: nextTheme });
    }

    // Always save to localStorage as fallback
    localStorage.setItem("theme", nextTheme);
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
    if (theme !== currentTheme) {
      setCurrentTheme(theme);
      applyTheme(theme);
    }
  }, [theme, currentTheme]);

  // Apply theme on initial load and when theme changes
  useEffect(() => {
    // First check localStorage (as fallback)
    const savedTheme = localStorage.getItem("theme") as ThemeMode | null;
    if (savedTheme && savedTheme !== currentTheme) {
      setCurrentTheme(savedTheme as ThemeMode);
      applyTheme(savedTheme as ThemeMode);
      return;
    }

    applyTheme(currentTheme);

    // Listen for system theme changes if using system theme
    if (currentTheme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyTheme("system");

      // Use the correct event listener based on browser support
      try {
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
      } catch (e) {
        // Fallback for older browsers
        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
      }
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
