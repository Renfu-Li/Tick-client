import React, { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";

import {
  Calendar,
  Views,
  DateLocalizer,
  dayjsLocalizer,
} from "react-big-calendar";

import timezone from "dayjs/plugin/timezone";
import EventDialog from "../components/EventDialog";

dayjs.extend(timezone);
const mLocalizer = dayjsLocalizer(dayjs);

function CalendarView({
  localizer = mLocalizer,
  dayLayoutAlgorithm = "no-overlap",
  token,
  allTasks,
  setAllTasks,
  allLists,
  setAllLists,
}) {
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const today = new Date();
  const minHour = new Date();
  minHour.setHours(6, 0, 0, 0);

  const maxHour = new Date();
  maxHour.setHours(23, 59, 59, 999);

  const allExistingTasks = allTasks.filter((task) => !task.removed);
  const events = allExistingTasks.map((task) => {
    // const nextDay = new Date(task.dueDate);
    // nextDay.setDate(nextDay.getDate() + 1);

    return {
      ...task,
      title: task.taskName,
      start: new Date(task.dueDate),
      end: new Date(task.dueDate),
    };
  });

  const views = [Views.MONTH, Views.WEEK, Views.DAY];

  // const handleSelectSlot = useCallback(
  //   ({ start, end }) => {
  //     const title = window.prompt("New Event Name");
  //     if (title) {
  //       setEvents((prev) => [...prev, { start, end, title }]);
  //     }
  //   },
  //   [setEvents]
  // );

  const handleSelectEvent = useCallback((event) => {
    setOpen(true);
    setSelectedEvent(event);
  }, []);

  return (
    <>
      <div
        className="height600"
        style={{ height: "100vh", width: "100%", padding: "0.5em" }}
      >
        <Calendar
          // components={components}
          dayLayoutAlgorithm={dayLayoutAlgorithm}
          defaultDate={today}
          events={events}
          localizer={localizer}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={() => console.log("hello")}
          selectable
          min={minHour}
          max={maxHour}
          showMultiDayTimes
          step={30}
          views={views}
          popup
        />

        {open && (
          <EventDialog
            token={token}
            open={open}
            setOpen={setOpen}
            selectedEvent={selectedEvent}
            allTasks={allTasks}
            setAllTasks={setAllTasks}
            allLists={allLists}
            setAllLists={setAllLists}
          ></EventDialog>
        )}
      </div>
    </>
  );
}

CalendarView.propTypes = {
  localizer: PropTypes.instanceOf(DateLocalizer),
};

export default CalendarView;
