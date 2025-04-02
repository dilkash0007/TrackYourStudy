import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MainLayout } from "./components/layout/MainLayout";
import { HomePage } from "./pages/HomePage";
import { DashboardPage } from "./pages/DashboardPage";
import { PlannerPage } from "./pages/PlannerPage";
import { useUserStore } from "./store/userStore";
import { TaskPage } from "./pages/TaskPage";
import { PomodoroPage } from "./pages/PomodoroPage";
import { MotivationPage } from "./pages/MotivationPage";
import { ProfilePage } from "./pages/ProfilePage";
import LoadingScreen from "./components/ui/LoadingScreen";
import { PomodoroBackgroundRunner } from "./components/pomodoro/PomodoroBackgroundRunner";
import "./App.css";

function App() {
  const { profile, uiPreferences } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Show loading screen for 3 seconds

    return () => clearTimeout(timer);
  }, []);

  // Apply theme based on preferences
  useEffect(() => {
    const theme =
      profile?.preferences?.theme || uiPreferences?.theme || "system";

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (theme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      // System theme
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }

    // Listen for changes in system preference
    if (theme === "system" && window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

      const handleChange = (e: MediaQueryListEvent) => {
        if (e.matches) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      };

      mediaQuery.addEventListener("change", handleChange);

      return () => {
        mediaQuery.removeEventListener("change", handleChange);
      };
    }
  }, [profile?.preferences?.theme, uiPreferences?.theme]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <PomodoroBackgroundRunner>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              <HomePage />
            </MainLayout>
          }
        />
        <Route
          path="/dashboard"
          element={
            <MainLayout>
              <DashboardPage />
            </MainLayout>
          }
        />
        <Route
          path="/planner"
          element={
            <MainLayout>
              <PlannerPage />
            </MainLayout>
          }
        />
        <Route
          path="/tasks"
          element={
            <MainLayout>
              <TaskPage />
            </MainLayout>
          }
        />
        <Route
          path="/pomodoro"
          element={
            <MainLayout>
              <PomodoroPage />
            </MainLayout>
          }
        />
        <Route
          path="/motivation"
          element={
            <MainLayout>
              <MotivationPage />
            </MainLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <MainLayout>
              <ProfilePage />
            </MainLayout>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PomodoroBackgroundRunner>
  );
}

export default App;
