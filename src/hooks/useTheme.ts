import { useUserStore } from "../store/userStore";

export const useTheme = () => {
  const uiPreferences = useUserStore((state) => state.uiPreferences);

  const isDark =
    uiPreferences?.theme === "dark" ||
    (uiPreferences?.theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  return { isDark };
};
