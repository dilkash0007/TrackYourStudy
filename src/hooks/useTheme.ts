import { useUserStore } from "../store/userStore";
import { useEffect } from "react";

export const useTheme = () => {
  const theme = useUserStore((state) => state.theme);
  const uiPreferences = useUserStore((state) => state.uiPreferences);
  const updateTheme = useUserStore((state) => state.updateTheme);

  // Ensure theme and uiPreferences.theme are in sync
  useEffect(() => {
    if (theme !== uiPreferences?.theme && uiPreferences?.theme) {
      updateTheme(uiPreferences.theme);
    }
  }, [theme, uiPreferences?.theme, updateTheme]);

  // Determine if dark mode should be used
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  return { isDark, currentTheme: theme };
};
