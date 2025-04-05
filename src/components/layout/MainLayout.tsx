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
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import { HeaderTimer } from "../pomodoro/HeaderTimer";
import { FloatingTimer } from "../pomodoro/FloatingTimer";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "../../hooks/useTheme";

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick?: () => void;
  requiresAuth?: boolean;
}

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { name, email, logout, isAuthenticated } = useUserStore();
  const { currentTheme } = useTheme();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const NavLink = ({
    to,
    icon,
    label,
    isActive,
    onClick,
    requiresAuth = true,
  }: NavLinkProps) => {
    const handleClick = () => {
      if (requiresAuth && !isAuthenticated) {
        navigate("/login");
      } else {
        if (onClick) onClick();
        navigate(to);
      }
    };

    return (
      <button
        onClick={handleClick}
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
  };

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
            <ThemeToggle />
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
                requiresAuth={false}
              />

              {isAuthenticated ? (
                <>
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
                </>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    icon={<UserIcon />}
                    label="Login"
                    isActive={location.pathname === "/login"}
                    requiresAuth={false}
                  />
                  <NavLink
                    to="/signup"
                    icon={<UserPlusIcon />}
                    label="Create Account"
                    isActive={location.pathname === "/signup"}
                    requiresAuth={false}
                  />
                </>
              )}

              <hr className="my-3 border-gray-200 dark:border-gray-700" />
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">
                          {name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {email}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-3 w-full rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                    Logout
                  </button>
                </>
              ) : (
                <div className="px-4 py-2 text-center text-sm text-gray-600 dark:text-gray-400">
                  Sign in to access all features
                </div>
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
                requiresAuth={false}
              />

              {isAuthenticated ? (
                <>
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
                </>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    icon={<UserIcon />}
                    label="Login"
                    isActive={location.pathname === "/login"}
                    requiresAuth={false}
                  />
                  <NavLink
                    to="/signup"
                    icon={<UserPlusIcon />}
                    label="Create Account"
                    isActive={location.pathname === "/signup"}
                    requiresAuth={false}
                  />
                  <div className="p-4 mt-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                    <p className="text-sm text-indigo-700 dark:text-indigo-300 mb-3">
                      Create an account to unlock all features and track your
                      study progress.
                    </p>
                    <button
                      onClick={() => navigate("/signup")}
                      className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md"
                    >
                      Sign up now
                    </button>
                  </div>
                </>
              )}
            </nav>
          </div>
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <ThemeToggle />
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {email}
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
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="mt-4 flex items-center px-4 py-2 w-full rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                Logout
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
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

        {isAuthenticated ? (
          <>
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
          </>
        ) : (
          <>
            <Link
              to="/login"
              className={`flex flex-col items-center px-3 py-2 ${
                location.pathname === "/login"
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-gray-600 dark:text-gray-300"
              }`}
            >
              <UserIcon className="w-6 h-6" />
              <span className="text-xs mt-1">Login</span>
            </Link>
            <Link
              to="/signup"
              className={`flex flex-col items-center px-3 py-2 ${
                location.pathname === "/signup"
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-gray-600 dark:text-gray-300"
              }`}
            >
              <UserPlusIcon className="w-6 h-6" />
              <span className="text-xs mt-1">Sign Up</span>
            </Link>
          </>
        )}
      </nav>

      {/* Bottom padding for mobile to avoid content being hidden by bottom nav */}
      <div className="h-16 lg:h-0 pb-safe"></div>
    </div>
  );
};
