import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";

import {
  Calendar,
  Views,
  DateLocalizer,
  dayjsLocalizer,
} from "react-big-calendar";

import timezone from "dayjs/plugin/timezone";
import axios from "axios";
dayjs.extend(timezone);
const mLocalizer = dayjsLocalizer(dayjs);

const ColoredDateCellWrapper = ({ children }) =>
  React.cloneElement(React.Children.only(children), {
    style: {
      backgroundColor: "white",
    },
  });

function CalendarView({ localizer = mLocalizer }) {
  const [events, setEvents] = useState([]);
  const today = new Date();
  const minHour = new Date();
  minHour.setHours(6, 0, 0, 0);

  const maxHour = new Date();
  maxHour.setHours(23, 59, 59, 999);

  useEffect(() => {
    axios.get("http://localhost:8000/tasks").then((response) => {
      const tasks = response.data;
      const events = tasks.map((task) => {
        const nextDay = new Date(task.dueDate);
        nextDay.setDate(nextDay.getDate() + 1);

        return {
          id: task.id,
          title: task.taskName,
          allDay: true,
          start: new Date(task.dueDate),
          end: new Date(task.dueDate),
          desc: task.taskNote,
        };
      });

      setEvents(events);
    });
  }, []);

  const { components, views } = useMemo(
    () => ({
      components: {
        timeSlotWrapper: ColoredDateCellWrapper,
      },
      views: [Views.MONTH, Views.WEEK, Views.DAY],
    }),
    []
  );

  return (
    <>
      <div
        className="height600"
        style={{ height: "100vh", width: "100%", padding: "0.5em" }}
      >
        <Calendar
          components={components}
          defaultDate={today}
          events={events}
          localizer={localizer}
          min={minHour}
          max={maxHour}
          showMultiDayTimes
          step={60}
          views={views}
          popup
        />
      </div>
    </>
  );
}

CalendarView.propTypes = {
  localizer: PropTypes.instanceOf(DateLocalizer),
};

export default CalendarView;
