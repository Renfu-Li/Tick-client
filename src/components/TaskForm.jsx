import SendRoundedIcon from "@mui/icons-material/SendRounded";
import {
  IconButton,
  Popover,
  Menu,
  MenuItem,
  Paper,
  InputBase,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { useState } from "react";
import dayjs from "dayjs";
import taskService from "../services/taskService";
import listService from "../services/listService";

function TaskForm({
  allTasks,
  setAllTasks,
  allLists,
  setAllLists,
  listToShow,
  token,
}) {
  const [calendarAnchorEl, setCalendarAnchorEl] = useState(null);
  const [listAnchorEl, setListAnchorEl] = useState(null);

  const [taskName, setTaskName] = useState("");
  const [dueDate, setDueDate] = useState(dayjs(new Date()));
  const [selectedList, setSelectedList] = useState(null);

  const handleSelectList = (listName) => {
    setSelectedList(listName);
    setListAnchorEl(null);
  };

  // create new task
  const handleCreateTask = async () => {
    const listName = selectedList || listToShow;

    const newTask = {
      taskName,
      dueDate,
      listName,
      completed: false,
      removed: false,
      taskNote: "",
    };

    try {
      const createdTask = await taskService.createTask(newTask, token);

      const listToUpdate = allLists.find((list) => list.listName === listName);
      await listService.updateList(token, {
        ...listToUpdate,
        count: listToUpdate.count + 1,
      });

      // update allTasks state
      const updatedAllTasks = allTasks.concat(createdTask);
      setAllTasks(updatedAllTasks);

      // update allLists state
      const updatedAllLists = allLists.map((list) =>
        list.listName === selectedList
          ? { ...list, count: list.count + 1 }
          : list
      );
      setAllLists(updatedAllLists);

      setTaskName("");
      setDueDate(dayjs(new Date()));
    } catch (error) {
      console.log("error from handleCreateTask: ", error.message);
    }
  };

  return (
    <Paper
      component="form"
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        mb: "1em",
      }}
    >
      <InputBase
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        sx={{ ml: 1, flex: 1 }}
        placeholder="Add task"
        data-cy="task-input"
      ></InputBase>

      <IconButton
        onClick={(e) => {
          setCalendarAnchorEl(e.currentTarget);
        }}
        data-cy="calendar-button"
      >
        <CalendarMonthIcon></CalendarMonthIcon>
      </IconButton>

      <Popover
        open={Boolean(calendarAnchorEl)}
        anchorEl={calendarAnchorEl}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        onClose={() => {
          setCalendarAnchorEl(null);
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            value={dueDate}
            onChange={(date) => {
              setDueDate(date);
              setCalendarAnchorEl(null);
            }}
            disablePast
            data-cy="date-input-in-task-form"
          ></DateCalendar>
        </LocalizationProvider>
      </Popover>

      <IconButton
        onClick={(e) => {
          setListAnchorEl(e.currentTarget);
        }}
        data-cy="select-list-button"
      >
        <FormatListBulletedIcon></FormatListBulletedIcon>
      </IconButton>

      <Menu
        open={Boolean(listAnchorEl)}
        anchorEl={listAnchorEl}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        onClose={() => {
          setListAnchorEl(null);
        }}
        data-cy="list-menu-in-task-form"
      >
        {allLists.map((list) => (
          <MenuItem
            key={list.id}
            selected={listToShow === list.listName}
            onClick={() => handleSelectList(list.listName)}
          >
            {list.listName}
          </MenuItem>
        ))}
      </Menu>

      <IconButton onClick={handleCreateTask} data-cy="submit-task-button">
        <SendRoundedIcon></SendRoundedIcon>
      </IconButton>
    </Paper>
  );
}

export default TaskForm;
