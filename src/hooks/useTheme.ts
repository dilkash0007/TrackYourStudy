import { useUserStore } from "../store/userStore";

export const useTheme = () => {
  const theme = useUserStore((state) => state.theme);
  const uiPreferences = useUserStore((state) => state.uiPreferences);

  // Determine if dark mode should be used
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches) ||
    (theme === undefined && // Fallback to uiPreferences if theme not directly set
      (uiPreferences?.theme === "dark" ||
        (uiPreferences?.theme === "system" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)));

  return { isDark };
};
