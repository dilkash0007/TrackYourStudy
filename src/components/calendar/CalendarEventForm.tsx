import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CalendarEvent, EventType } from "../../store/calendarStore";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface CalendarEventFormProps {
  event?: CalendarEvent;
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, "id">) => void;
  colorOptions: Record<EventType, string>;
}

export const CalendarEventForm = ({
  event,
  isOpen,
  onClose,
  onSave,
  colorOptions,
}: CalendarEventFormProps) => {
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    start: string; // ISO string for date input
    startTime: string; // Time string HH:MM
    end: string; // ISO string for date input
    endTime: string; // Time string HH:MM
    allDay: boolean;
    type: EventType;
    color: string;
  }>({
    title: "",
    description: "",
    start: new Date().toISOString().split("T")[0],
    startTime: "09:00",
    end: new Date().toISOString().split("T")[0],
    endTime: "10:00",
    allDay: false,
    type: "studySession",
    color: colorOptions.studySession,
  });

  // Initialize form data with event data if editing
  useEffect(() => {
    if (event) {
      const startDate = new Date(event.start);
      const endDate = new Date(event.end);

      setFormData({
        title: event.title,
        description: event.description,
        start: startDate.toISOString().split("T")[0],
        startTime: startDate.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        end: endDate.toISOString().split("T")[0],
        endTime: endDate.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        allDay: event.allDay,
        type: event.type,
        color: event.color,
      });
    } else {
      // Set default values for new event
      const today = new Date();
      const startTime = new Date(today);
      startTime.setHours(9, 0, 0, 0);

      const endTime = new Date(today);
      endTime.setHours(10, 0, 0, 0);

      setFormData({
        title: "",
        description: "",
        start: today.toISOString().split("T")[0],
        startTime: startTime.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        end: today.toISOString().split("T")[0],
        endTime: endTime.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        allDay: false,
        type: "studySession",
        color: colorOptions.studySession,
      });
    }
  }, [event, colorOptions]);

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));

    // Update color when type changes
    if (name === "type") {
      setFormData((prev) => ({
        ...prev,
        color: colorOptions[value as EventType] || prev.color,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Combine date and time
    const startDateTime = new Date(`${formData.start}T${formData.startTime}`);
    const endDateTime = new Date(`${formData.end}T${formData.endTime}`);

    // Create event object
    const newEvent: Omit<CalendarEvent, "id"> = {
      title: formData.title,
      description: formData.description,
      start: formData.allDay
        ? new Date(`${formData.start}T00:00:00`).toISOString()
        : startDateTime.toISOString(),
      end: formData.allDay
        ? new Date(`${formData.end}T23:59:59`).toISOString()
        : endDateTime.toISOString(),
      allDay: formData.allDay,
      type: formData.type,
      color: formData.color,
      completed: event?.completed || false,
    };

    // Keep linked ID if editing
    if (event?.linkedId) {
      (newEvent as any).linkedId = event.linkedId;
    }

    onSave(newEvent);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full mx-auto overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {event ? "Edit Event" : "Add Event"}
          </h2>
          <button
            className="text-gray-400 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300"
            onClick={onClose}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Title <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 
                dark:border-gray-600 dark:text-white"
              required
            />
          </div>

          {/* Event Type */}
          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Event Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 
                dark:border-gray-600 dark:text-white"
            >
              <option value="studySession">Study Session</option>
              <option value="task">Task</option>
              <option value="pomodoro">Pomodoro Session</option>
              <option value="exam">Exam/Test</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 
                dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* All Day Toggle */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="allDay"
                name="allDay"
                type="checkbox"
                checked={formData.allDay}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 
                  focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor="allDay"
                className="font-medium text-gray-700 dark:text-gray-300"
              >
                All day
              </label>
            </div>
          </div>

          {/* Date/Time Inputs */}
          <div className="space-y-4">
            {/* Start Date/Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="start"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Start Date <span className="text-red-600">*</span>
                </label>
                <input
                  type="date"
                  id="start"
                  name="start"
                  value={formData.start}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                    focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 
                    dark:border-gray-600 dark:text-white"
                  required
                />
              </div>

              {!formData.allDay && (
                <div>
                  <label
                    htmlFor="startTime"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Start Time <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                      focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 
                      dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
              )}
            </div>

            {/* End Date/Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="end"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  End Date <span className="text-red-600">*</span>
                </label>
                <input
                  type="date"
                  id="end"
                  name="end"
                  value={formData.end}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                    focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 
                    dark:border-gray-600 dark:text-white"
                  required
                />
              </div>

              {!formData.allDay && (
                <div>
                  <label
                    htmlFor="endTime"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    End Time <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="time"
                    id="endTime"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                      focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 
                      dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
              )}
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <label
              htmlFor="color"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Color
            </label>
            <div className="mt-1 flex flex-wrap gap-2">
              {Object.values(colorOptions).map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, color }))}
                  className={`h-8 w-8 rounded-full focus:outline-none focus:ring-2 
                    focus:ring-offset-2 dark:focus:ring-offset-gray-800 
                    ${
                      formData.color === color
                        ? "ring-2 ring-offset-2 dark:ring-offset-gray-800"
                        : ""
                    }`}
                  style={{ backgroundColor: color }}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 bg-white py-2 px-4 
                text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 
                dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 
                dark:hover:bg-gray-600 dark:focus:ring-offset-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md border border-transparent bg-indigo-600 py-2 px-4 
                text-sm font-medium text-white shadow-sm hover:bg-indigo-700 
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 
                dark:focus:ring-offset-gray-800"
            >
              {event ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};
