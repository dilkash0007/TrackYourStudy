import { useUserStore } from "../store/userStore";
import { useEffect, useState } from "react";
import type { ThemeMode } from "../store/userStore";

export const useTheme = () => {
  const theme = useUserStore((state) => state.theme);
  const uiPreferences = useUserStore((state) => state.uiPreferences);
  const updateTheme = useUserStore((state) => state.updateTheme);
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">(
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  );

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? "dark" : "light");
    };

    // Use the correct event listener based on browser support
    try {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } catch (e) {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  // Ensure theme and uiPreferences.theme are in sync
  useEffect(() => {
    // Only attempt to sync if all required values are present
    if (
      theme !== uiPreferences?.theme &&
      uiPreferences?.theme &&
      typeof updateTheme === 'function'
    ) {
      try {
        updateTheme(uiPreferences.theme);
      } catch (error) {
        console.error("Failed to update theme:", error);
        // Fallback: Save to localStorage
        localStorage.setItem("theme", uiPreferences.theme);
      }
    }
  }, [theme, uiPreferences?.theme, updateTheme]);

  // Get effective theme from either store, localStorage, or system preference
  const getEffectiveTheme = (): ThemeMode => {
    // First check store
    if (theme) return theme;
    
    // Then check localStorage
    const savedTheme = localStorage.getItem("theme") as ThemeMode | null;
    if (savedTheme) return savedTheme;
    
    // Default to system
    return "system";
  };

  // Determine if dark mode should be used
  const effectiveTheme = getEffectiveTheme();
  const isDark =
    effectiveTheme === "dark" ||
    (effectiveTheme === "system" && systemTheme === "dark");

  return { 
    isDark, 
    currentTheme: effectiveTheme,
    systemTheme
  };
};
