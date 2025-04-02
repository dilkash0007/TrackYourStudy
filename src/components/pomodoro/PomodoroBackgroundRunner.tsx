import React, { useEffect, useRef } from "react";
import {
  usePomodoroStore,
  TimerStatus,
  TimerType,
} from "../../store/pomodoroStore";
import {
  playSound,
  sendNotification,
  triggerStorageUpdate,
} from "../../utils/pomodoroHelpers";

type PomodoroBackgroundRunnerProps = {
  children: React.ReactNode;
};

export const PomodoroBackgroundRunner: React.FC<
  PomodoroBackgroundRunnerProps
> = ({ children }) => {
  const {
    currentSession,
    status,
    timeRemaining,
    updateTimeRemaining,
    completeSession,
    trackRealTimeFocus,
  } = usePomodoroStore();

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTickTimeRef = useRef<number | null>(null);

  // Global timer that works across all pages
  useEffect(() => {
    if (status === TimerStatus.Running) {
      // Initialize the last tick time
      lastTickTimeRef.current = Date.now();

      // Clear existing timer if any
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      // Set up new timer
      timerRef.current = setInterval(() => {
        const now = Date.now();
        const lastTickTime = lastTickTimeRef.current || now;
        const elapsedSeconds = Math.floor((now - lastTickTime) / 1000);

        if (elapsedSeconds > 0) {
          // Update last tick time
          lastTickTimeRef.current = now;

          // If this is a focus session, track real time
          if (currentSession?.type === TimerType.Focus) {
            trackRealTimeFocus(elapsedSeconds);
          }

          // Update timer display
          if (timeRemaining > elapsedSeconds) {
            updateTimeRemaining(Math.max(0, timeRemaining - elapsedSeconds));
          } else {
            // Make sure to track final seconds
            if (currentSession?.type === TimerType.Focus && timeRemaining > 0) {
              trackRealTimeFocus(timeRemaining);
            }

            // Clear timer
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }

            // Complete the session
            try {
              completeSession();

              // Play completion sound
              playSound("complete");

              // Send notification
              const sessionType = currentSession?.type || TimerType.Focus;
              const message =
                sessionType === TimerType.Focus
                  ? "Focus session completed! Take a break."
                  : "Break is over. Ready to focus again?";

              sendNotification("Pomodoro Timer", message);

              // Force UI update
              triggerStorageUpdate();
            } catch (error) {
              console.error("Error completing session:", error);
            }
          }
        }
      }, 1000);
    } else if (timerRef.current) {
      // Clear timer if not running
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Cleanup
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [
    status,
    timeRemaining,
    currentSession,
    updateTimeRemaining,
    completeSession,
    trackRealTimeFocus,
  ]);

  return <>{children}</>;
};
