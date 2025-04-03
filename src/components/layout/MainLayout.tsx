import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUserStore } from "../../store/userStore";
import {
  HomeIcon,
  CalendarIcon,
  ListBulletIcon,
  ClockIcon,
  BookOpenIcon,
  BoltIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
} from "@heroicons/react/24/outline";
import { HeaderTimer } from "../pomodoro/HeaderTimer";
import { FloatingTimer } from "../pomodoro/FloatingTimer";

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { profile, updatePreferences } = useUserStore();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const theme = profile?.preferences?.theme || "system";

  const toggleTheme = () => {
    if (!profile?.preferences) return;

    const newTheme =
      theme === "light" ? "dark" : theme === "dark" ? "system" : "light";

    updatePreferences({ theme: newTheme });

    // Update document theme
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (newTheme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      // System theme - check prefers-color-scheme
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  const NavLink = ({ to, icon, label, isActive, onClick }: NavLinkProps) => (
    <button
      onClick={() => {
        if (onClick) onClick();
        navigate(to);
      }}
      className={`flex items-center px-4 py-3 w-full rounded-lg ${
        isActive
          ? "bg-indigo-50 text-indigo-600 font-medium dark:bg-gray-800 dark:text-indigo-400"
          : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
      }`}
    >
      <div className="w-5 h-5 mr-3">{icon}</div>
      {label}
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Mobile Header */}
      <header className="bg-white dark:bg-gray-800 shadow lg:hidden px-1.5 py-3 fixed top-0 left-0 right-0 z-20">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link
              to="/"
              className="font-bold text-xl text-indigo-600 dark:text-indigo-400"
            >
              TrackYouStudy
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            {/* Header Timer for Mobile */}
            <HeaderTimer />
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {theme === "light" ? (
                <SunIcon className="h-5 w-5 text-amber-500" />
              ) : theme === "dark" ? (
                <MoonIcon className="h-5 w-5 text-indigo-400" />
              ) : (
                <ComputerDesktopIcon className="h-5 w-5 text-gray-500 dark:text-gray-300" />
              )}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              ) : (
                <Bars3Icon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-10 bg-gray-900 bg-opacity-50 lg:hidden">
          <div className="fixed top-14 right-0 bottom-0 w-64 bg-white dark:bg-gray-800 p-4 overflow-y-auto">
            <nav className="flex flex-col space-y-1">
              <NavLink
                to="/"
                icon={<HomeIcon />}
                label="Home"
                isActive={location.pathname === "/"}
              />
              <NavLink
                to="/dashboard"
                icon={<BookOpenIcon />}
                label="Dashboard"
                isActive={location.pathname === "/dashboard"}
              />
              <NavLink
                to="/planner"
                icon={<CalendarIcon />}
                label="Planner"
                isActive={location.pathname.startsWith("/planner")}
              />
              <NavLink
                to="/tasks"
                icon={<ListBulletIcon />}
                label="Tasks"
                isActive={location.pathname.startsWith("/tasks")}
              />
              <NavLink
                to="/pomodoro"
                icon={<ClockIcon />}
                label="Pomodoro"
                isActive={location.pathname === "/pomodoro"}
              />
              <NavLink
                to="/motivation"
                icon={<BoltIcon />}
                label="Motivation"
                isActive={location.pathname === "/motivation"}
              />
              <NavLink
                to="/profile"
                icon={<UserIcon />}
                label="Profile"
                isActive={location.pathname === "/profile"}
              />
              <hr className="my-3 border-gray-200 dark:border-gray-700" />
              {profile ? (
                <div className="px-4 py-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                      <UserIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">
                        {profile.username}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {profile.email}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 w-full text-left text-indigo-600 dark:text-indigo-400 font-medium"
                >
                  Sign In
                </button>
              )}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:dark:border-gray-700 lg:bg-white lg:dark:bg-gray-800">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 border-b border-gray-200 dark:border-gray-700 px-4">
            <Link
              to="/"
              className="font-bold text-xl text-indigo-600 dark:text-indigo-400"
            >
              TrackYouStudy
            </Link>
            {/* Header Timer for Desktop */}
            <HeaderTimer />
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <nav className="flex flex-col space-y-1">
              <NavLink
                to="/"
                icon={<HomeIcon />}
                label="Home"
                isActive={location.pathname === "/"}
              />
              <NavLink
                to="/dashboard"
                icon={<BookOpenIcon />}
                label="Dashboard"
                isActive={location.pathname === "/dashboard"}
              />
              <NavLink
                to="/planner"
                icon={<CalendarIcon />}
                label="Planner"
                isActive={location.pathname.startsWith("/planner")}
              />
              <NavLink
                to="/tasks"
                icon={<ListBulletIcon />}
                label="Tasks"
                isActive={location.pathname.startsWith("/tasks")}
              />
              <NavLink
                to="/pomodoro"
                icon={<ClockIcon />}
                label="Pomodoro"
                isActive={location.pathname === "/pomodoro"}
              />
              <NavLink
                to="/motivation"
                icon={<BoltIcon />}
                label="Motivation"
                isActive={location.pathname === "/motivation"}
              />
              <NavLink
                to="/profile"
                icon={<UserIcon />}
                label="Profile"
                isActive={location.pathname === "/profile"}
              />
            </nav>
          </div>
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {theme === "light" ? (
                  <SunIcon className="h-5 w-5 text-amber-500" />
                ) : theme === "dark" ? (
                  <MoonIcon className="h-5 w-5 text-indigo-400" />
                ) : (
                  <ComputerDesktopIcon className="h-5 w-5 text-gray-500 dark:text-gray-300" />
                )}
              </button>
              {profile ? (
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {profile.username}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {profile.email}
                    </p>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="text-indigo-600 dark:text-indigo-400 font-medium"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <main className="flex-1 pt-16 lg:pt-0 pb-6">
          <div className="px-1.5 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Floating Timer that shows on all pages */}
      <FloatingTimer />

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-10 flex justify-around items-center h-16">
        <Link
          to="/"
          className={`flex flex-col items-center px-3 py-2 ${
            location.pathname === "/"
              ? "text-indigo-600 dark:text-indigo-400"
              : "text-gray-600 dark:text-gray-300"
          }`}
        >
          <HomeIcon className="w-6 h-6" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link
          to="/dashboard"
          className={`flex flex-col items-center px-3 py-2 ${
            location.pathname === "/dashboard"
              ? "text-indigo-600 dark:text-indigo-400"
              : "text-gray-600 dark:text-gray-300"
          }`}
        >
          <BookOpenIcon className="w-6 h-6" />
          <span className="text-xs mt-1">Dashboard</span>
        </Link>
        <Link
          to="/tasks"
          className={`flex flex-col items-center px-3 py-2 ${
            location.pathname.startsWith("/tasks")
              ? "text-indigo-600 dark:text-indigo-400"
              : "text-gray-600 dark:text-gray-300"
          }`}
        >
          <ListBulletIcon className="w-6 h-6" />
          <span className="text-xs mt-1">Tasks</span>
        </Link>
        <Link
          to="/pomodoro"
          className={`flex flex-col items-center px-3 py-2 ${
            location.pathname === "/pomodoro"
              ? "text-indigo-600 dark:text-indigo-400"
              : "text-gray-600 dark:text-gray-300"
          }`}
        >
          <ClockIcon className="w-6 h-6" />
          <span className="text-xs mt-1">Pomodoro</span>
        </Link>
        <Link
          to="/profile"
          className={`flex flex-col items-center px-3 py-2 ${
            location.pathname === "/profile"
              ? "text-indigo-600 dark:text-indigo-400"
              : "text-gray-600 dark:text-gray-300"
          }`}
        >
          <UserIcon className="w-6 h-6" />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </nav>

      {/* Bottom padding for mobile to avoid content being hidden by bottom nav */}
      <div className="h-16 lg:h-0 pb-safe"></div>
    </div>
  );
};
