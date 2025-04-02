import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useCalendarStore,
  CalendarEvent,
  ViewMode,
} from "../store/calendarStore";
import { useTaskStore } from "../store/taskStore";
import { usePomodoroStore } from "../store/pomodoroStore";
import { CalendarControls } from "../components/calendar/CalendarControls";
import { MonthView } from "../components/calendar/MonthView";
import { WeekView } from "../components/calendar/WeekView";
import { DayView } from "../components/calendar/DayView";
import { CalendarEventForm } from "../components/calendar/CalendarEventForm";
import { CalendarEventItem } from "../components/calendar/CalendarEventItem";
import {
  PlusIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon,
  BellIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { formatFriendlyDate } from "../utils/calendarHelpers";
import { useNotifications } from "../context/NotificationContext";

export const CalendarPage = () => {
  // Get state from calendar store
  const events = useCalendarStore((state) => state.events);
  const viewMode = useCalendarStore((state) => state.viewMode);
  const selectedDateStr = useCalendarStore((state) => state.selectedDate);
  const selectedDate = new Date(selectedDateStr);
  const userPreferences = useCalendarStore((state) => state.userPreferences);

  // Get actions from calendar store
  const setViewMode = useCalendarStore((state) => state.setViewMode);
  const setSelectedDate = useCalendarStore((state) => state.setSelectedDate);
  const addEvent = useCalendarStore((state) => state.addEvent);
  const updateEvent = useCalendarStore((state) => state.updateEvent);
  const deleteEvent = useCalendarStore((state) => state.deleteEvent);
  const syncWithTasks = useCalendarStore((state) => state.syncWithTasks);
  const syncWithPomodoro = useCalendarStore((state) => state.syncWithPomodoro);
  const exportToICS = useCalendarStore((state) => state.exportToICS);

  // Local state
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>(
    undefined
  );
  const [formDate, setFormDate] = useState<Date | null>(null);
  const { addNotification } = useNotifications();

  // Sync with tasks and pomodoro sessions on mount and when they change
  useEffect(() => {
    syncWithTasks();
    syncWithPomodoro();
  }, [
    syncWithTasks,
    syncWithPomodoro,
    useTaskStore((state) => state.tasks),
    usePomodoroStore((state) => state.sessions),
  ]);

  // Navigation handlers
  const handlePrevious = useCallback(() => {
    const newDate = new Date(selectedDate);

    switch (viewMode) {
      case "day":
        newDate.setDate(newDate.getDate() - 1);
        break;
      case "week":
        newDate.setDate(newDate.getDate() - 7);
        break;
      case "month":
        newDate.setMonth(newDate.getMonth() - 1);
        break;
    }

    setSelectedDate(newDate.toISOString());
  }, [viewMode, selectedDate, setSelectedDate]);

  const handleNext = useCallback(() => {
    const newDate = new Date(selectedDate);

    switch (viewMode) {
      case "day":
        newDate.setDate(newDate.getDate() + 1);
        break;
      case "week":
        newDate.setDate(newDate.getDate() + 7);
        break;
      case "month":
        newDate.setMonth(newDate.getMonth() + 1);
        break;
    }

    setSelectedDate(newDate.toISOString());
  }, [viewMode, selectedDate, setSelectedDate]);

  const handleToday = useCallback(() => {
    setSelectedDate(new Date().toISOString());
  }, [setSelectedDate]);

  // Event handlers
  const handleEventClick = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowEventForm(true);
  }, []);

  const handleTimeSlotClick = useCallback((date: Date) => {
    setFormDate(date);
    setShowEventForm(true);
  }, []);

  const handleAddEvent = useCallback(() => {
    setSelectedEvent(undefined);
    setFormDate(null);
    setShowEventForm(true);
  }, []);

  const handleSaveEvent = useCallback(
    (event: Omit<CalendarEvent, "id">) => {
      if (selectedEvent) {
        // Update existing event
        updateEvent(selectedEvent.id, event);
        addNotification({
          title: "Event Updated",
          message: `"${event.title}" has been updated.`,
          type: "success",
        });
      } else {
        // Add new event
        const id = addEvent(event);
        addNotification({
          title: "Event Added",
          message: `"${event.title}" has been added to your calendar.`,
          type: "success",
        });
      }
    },
    [selectedEvent, updateEvent, addEvent, addNotification]
  );

  const handleDeleteEvent = useCallback(
    (eventId: string) => {
      const eventToDelete = events.find((e) => e.id === eventId);
      if (!eventToDelete) return;

      deleteEvent(eventId);
      addNotification({
        title: "Event Deleted",
        message: `"${eventToDelete.title}" has been removed from your calendar.`,
        type: "info",
      });
    },
    [events, deleteEvent, addNotification]
  );

  const handleExportCalendar = useCallback(() => {
    const icsContent = exportToICS();
    const blob = new Blob([icsContent], {
      type: "text/calendar;charset=utf-8",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "trackyoustudy-calendar.ics";
    link.click();

    addNotification({
      title: "Calendar Exported",
      message: "Your calendar has been exported to an ICS file.",
      type: "success",
    });
  }, [exportToICS, addNotification]);

  const handleSync = useCallback(() => {
    syncWithTasks();
    syncWithPomodoro();

    addNotification({
      title: "Calendar Synced",
      message:
        "Your calendar has been synced with tasks and Pomodoro sessions.",
      type: "success",
    });
  }, [syncWithTasks, syncWithPomodoro, addNotification]);

  // Get upcoming events
  const upcomingEvents = events
    .filter((event) => new Date(event.start) > new Date())
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Calendar
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your study schedule, tasks, and sessions
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Calendar */}
        <div className="lg:flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          {/* Calendar Controls */}
          <div className="flex justify-between mb-4">
            <CalendarControls
              viewMode={viewMode}
              selectedDate={selectedDate}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onToday={handleToday}
              onViewModeChange={setViewMode}
            />

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={handleSync}
                className="flex items-center px-3 py-1.5 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <ArrowPathIcon className="h-4 w-4 mr-1" />
                Sync
              </button>
              <button
                onClick={handleExportCalendar}
                className="flex items-center px-3 py-1.5 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                Export
              </button>
              <button
                onClick={handleAddEvent}
                className="flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Event
              </button>
            </div>
          </div>

          {/* Calendar View */}
          <div className="h-[calc(100vh-350px)] min-h-[500px] border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <AnimatePresence mode="wait">
              {viewMode === "month" && (
                <motion.div
                  key="month-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full"
                >
                  <MonthView
                    selectedDate={selectedDate}
                    events={events}
                    firstDayOfWeek={userPreferences.firstDayOfWeek}
                    onDateClick={(date) => setSelectedDate(date.toISOString())}
                    onEventClick={handleEventClick}
                  />
                </motion.div>
              )}

              {viewMode === "week" && (
                <motion.div
                  key="week-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full"
                >
                  <WeekView
                    selectedDate={selectedDate}
                    events={events}
                    firstDayOfWeek={userPreferences.firstDayOfWeek}
                    workingHours={userPreferences.workingHours}
                    onEventClick={handleEventClick}
                    onTimeSlotClick={handleTimeSlotClick}
                  />
                </motion.div>
              )}

              {viewMode === "day" && (
                <motion.div
                  key="day-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full"
                >
                  <DayView
                    selectedDate={selectedDate}
                    events={events}
                    workingHours={userPreferences.workingHours}
                    onEventClick={handleEventClick}
                    onTimeSlotClick={handleTimeSlotClick}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Side Panel: Upcoming Events */}
        <div className="lg:w-80 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <BellIcon className="h-5 w-5 mr-2 text-indigo-500" />
            Upcoming Events
          </h2>

          <div className="space-y-3">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => {
                const start = new Date(event.start);

                return (
                  <div
                    key={event.id}
                    className="flex space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => handleEventClick(event)}
                  >
                    <div
                      className="w-2 self-stretch rounded-full"
                      style={{ backgroundColor: event.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {event.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatFriendlyDate(start)} •{" "}
                        {start.toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <button
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteEvent(event.id);
                      }}
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>No upcoming events</p>
                <button
                  className="mt-2 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium"
                  onClick={handleAddEvent}
                >
                  + Add a new event
                </button>
              </div>
            )}
          </div>

          {/* Quick Navigation */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Quick Navigation
            </h3>
            <div className="space-y-1">
              <button
                onClick={handleToday}
                className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Today
              </button>
              <button
                onClick={() => {
                  const tomorrow = new Date();
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  setSelectedDate(tomorrow.toISOString());
                  setViewMode("day");
                }}
                className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Tomorrow
              </button>
              <button
                onClick={() => {
                  const nextMonday = new Date();
                  nextMonday.setDate(
                    nextMonday.getDate() + ((8 - nextMonday.getDay()) % 7)
                  );
                  setSelectedDate(nextMonday.toISOString());
                  setViewMode("week");
                }}
                className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Next Week
              </button>
              <button
                onClick={() => {
                  const nextMonth = new Date();
                  nextMonth.setMonth(nextMonth.getMonth() + 1);
                  setSelectedDate(nextMonth.toISOString());
                  setViewMode("month");
                }}
                className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Next Month
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Event Form Modal */}
      <AnimatePresence>
        {showEventForm && (
          <CalendarEventForm
            event={selectedEvent}
            isOpen={showEventForm}
            onClose={() => setShowEventForm(false)}
            onSave={handleSaveEvent}
            colorOptions={userPreferences.colorMap}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
