import { useCallback, useState } from "react";
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
import { useSelector } from "react-redux";

dayjs.extend(timezone);
const mLocalizer = dayjsLocalizer(dayjs);

function CalendarView({
  localizer = mLocalizer,
  dayLayoutAlgorithm = "no-overlap",
  token,
}) {
  const [openEdit, setOpenEdit] = useState(false);
  const [openNew, setOpenNew] = useState(false);
  const [task, setTask] = useState(null);

  const allTasks = useSelector((state) => state.allTasks);

  const today = new Date();
  const minHour = new Date();
  minHour.setHours(6, 0, 0, 0);

  const maxHour = new Date();
  maxHour.setHours(23, 59, 59, 999);

  const allExistingTasks = allTasks.filter((task) => !task.removed);
  const events = allExistingTasks.map((task) => {
    return {
      ...task,
      title: task.taskName,
      start: new Date(task.dueDate),
      end: new Date(task.dueDate),
    };
  });

  const views = [Views.MONTH, Views.WEEK, Views.DAY];

  const handleSelectSlot = useCallback(({ start, end }) => {
    setOpenNew(true);

    setTask({
      title: "",
      start,
      end,
      taskName: "",
      dueDate: start,
      completed: false,
      removed: false,
      taskNote: "",
      listName: null,
    });
  }, []);

  const handleSelectEvent = useCallback((event) => {
    setOpenEdit(true);

    setTask(event);
  }, []);

  return (
    <>
      <div
        className="height600"
        style={{
          height: "100vh",
          width: "100%",
          padding: "1.1em",
          boxSizing: "border-box",
        }}
      >
        <Calendar
          dayLayoutAlgorithm={dayLayoutAlgorithm}
          defaultDate={today}
          events={events}
          localizer={localizer}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable
          min={minHour}
          max={maxHour}
          showMultiDayTimes
          step={30}
          views={views}
          popup
        />

        {openEdit && (
          <EventDialog
            token={token}
            open={openEdit}
            setOpen={setOpenEdit}
            targetTask={task}
            setTask={setTask}
            action="edit"
          ></EventDialog>
        )}

        {openNew && (
          <EventDialog
            token={token}
            open={openNew}
            setOpen={setOpenNew}
            targetTask={task}
            setTask={setTask}
            action="create"
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
