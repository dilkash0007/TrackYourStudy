import { useCallback } from "react";
import { motion } from "framer-motion";
import { CalendarEvent } from "../../store/calendarStore";
import {
  CheckCircleIcon,
  ClockIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { formatTime, formatFriendlyDate } from "../../utils/calendarHelpers";

interface CalendarEventItemProps {
  event: CalendarEvent;
  compact?: boolean;
  onClick?: (event: CalendarEvent) => void;
  onDelete?: (eventId: string) => void;
}

export const CalendarEventItem = ({
  event,
  compact = false,
  onClick,
  onDelete,
}: CalendarEventItemProps) => {
  const handleClick = useCallback(() => {
    if (onClick) onClick(event);
  }, [event, onClick]);

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onDelete) onDelete(event.id);
    },
    [event.id, onDelete]
  );

  // Format times
  const startDate = new Date(event.start);
  const endDate = new Date(event.end);

  // Determine styles based on event type and completion status
  const getBgColor = () => {
    if (event.completed) {
      return "bg-opacity-60 dark:bg-opacity-40"; // Reduce opacity for completed events
    }
    return "";
  };

  // Render a compact version for month and week views
  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={handleClick}
        className={`
          rounded-sm px-1 py-0.5 text-xs font-medium text-white cursor-pointer truncate
          ${getBgColor()}
        `}
        style={{ backgroundColor: event.color }}
      >
        {event.completed && (
          <CheckCircleIcon className="mr-1 inline-block h-3 w-3" />
        )}
        {event.title}
      </motion.div>
    );
  }

  // Render full version for detailed view
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={handleClick}
      className={`
        rounded-md p-2 text-white cursor-pointer overflow-hidden
        ${getBgColor()}
        relative group flex flex-col
      `}
      style={{ backgroundColor: event.color }}
    >
      <div className="flex items-start justify-between">
        <h3 className="font-semibold truncate">{event.title}</h3>
        {onDelete && (
          <button
            onClick={handleDelete}
            className="opacity-0 group-hover:opacity-100 transition-opacity rounded-full p-0.5 hover:bg-white/20"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      {!event.allDay && (
        <div className="flex items-center text-xs mt-1">
          <ClockIcon className="h-3 w-3 mr-1" />
          <span>
            {formatTime(startDate)} - {formatTime(endDate)}
          </span>
        </div>
      )}

      {event.description && (
        <p className="text-xs mt-1 truncate opacity-90">{event.description}</p>
      )}

      {event.completed && (
        <div className="absolute top-0 right-0 bottom-0 left-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="bg-white text-gray-900 text-xs font-medium px-2 py-0.5 rounded-full">
            Completed
          </span>
        </div>
      )}
    </motion.div>
  );
};
