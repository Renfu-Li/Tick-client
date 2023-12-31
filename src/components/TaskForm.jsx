import SendRoundedIcon from "@mui/icons-material/SendRounded";
import {
  TextField,
  IconButton,
  Popover,
  Menu,
  MenuItem,
  Box,
  Stack,
  Paper,
  InputBase,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { useState } from "react";
import dayjs from "dayjs";
import taskService from "../services/taskService";

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
    const newTask = {
      taskName,
      dueDate,
      listName: selectedList || listToShow,
      completed: false,
      deleted: false,
      taskNote: "",
    };

    try {
      const createdTask = await taskService.createTask(newTask, token);

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
      ></InputBase>

      <IconButton
        onClick={(e) => {
          setCalendarAnchorEl(e.currentTarget);
        }}
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
          ></DateCalendar>
        </LocalizationProvider>
      </Popover>

      <IconButton
        onClick={(e) => {
          setListAnchorEl(e.currentTarget);
        }}
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

      <IconButton onClick={handleCreateTask}>
        <SendRoundedIcon></SendRoundedIcon>
      </IconButton>
    </Paper>
  );
}

export default TaskForm;
