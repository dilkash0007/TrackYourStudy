import { Routes, Route, Navigate, useLocation } from "react-router-dom";
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
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import LoadingScreen from "./components/ui/LoadingScreen";
import { PomodoroBackgroundRunner } from "./components/pomodoro/PomodoroBackgroundRunner";
import "./App.css";

// Auth-required route component that redirects to login
const AuthRequiredRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useUserStore();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login page but save the attempted URL
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};

function App() {
  const { isAuthenticated, name, email } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);

  // Log current user info for debugging
  useEffect(() => {
    console.log("Current user state:", { isAuthenticated, name, email });
  }, [isAuthenticated, name, email]);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Show loading screen for 3 seconds

    return () => clearTimeout(timer);
  }, []);

  // Apply theme based on user preference or system default
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as
      | "light"
      | "dark"
      | "system"
      | null;

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (savedTheme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      // System theme - check prefers-color-scheme
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
    if (savedTheme === "system" && window.matchMedia) {
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
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <PomodoroBackgroundRunner>
      <Routes>
        {/* Home is accessible to everyone */}
        <Route
          path="/"
          element={
            <MainLayout>
              <HomePage />
            </MainLayout>
          }
        />

        {/* Authentication Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <AuthRequiredRoute>
              <MainLayout>
                <DashboardPage />
              </MainLayout>
            </AuthRequiredRoute>
          }
        />
        <Route
          path="/planner"
          element={
            <AuthRequiredRoute>
              <MainLayout>
                <PlannerPage />
              </MainLayout>
            </AuthRequiredRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <AuthRequiredRoute>
              <MainLayout>
                <TaskPage />
              </MainLayout>
            </AuthRequiredRoute>
          }
        />
        <Route
          path="/pomodoro"
          element={
            <AuthRequiredRoute>
              <MainLayout>
                <PomodoroPage />
              </MainLayout>
            </AuthRequiredRoute>
          }
        />
        <Route
          path="/motivation"
          element={
            <AuthRequiredRoute>
              <MainLayout>
                <MotivationPage />
              </MainLayout>
            </AuthRequiredRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <AuthRequiredRoute>
              <MainLayout>
                <ProfilePage />
              </MainLayout>
            </AuthRequiredRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PomodoroBackgroundRunner>
  );
}

export default App;
