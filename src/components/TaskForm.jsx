import {
  TextField,
  IconButton,
  Popover,
  Menu,
  MenuItem,
  Box,
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

export default function NewTaskForm({
  allTasks,
  setAllTasks,
  allLists,
  setAllLists,
  token,
}) {
  const [calendarAnchorEl, setCalendarAnchorEl] = useState(null);
  const [listAnchorEl, setListAnchorEl] = useState(null);

  const [taskName, setTaskName] = useState("");
  const [dueDate, setDueDate] = useState(dayjs(new Date()));
  const [selectedList, setSelectedList] = useState(allLists[0]);

  const handleSelectList = (list) => {
    setSelectedList(list);
    setListAnchorEl(null);
  };

  // create new task
  const handleCreateTask = async () => {
    const newTask = {
      taskName,
      dueDate,
      listName: selectedList.listName,
      completed: false,
      taskNote: "",
    };

    try {
      const createdTask = await taskService.createTask(newTask, token);

      // update allTasks state
      const updatedAllTasks = allTasks.concat(createdTask);
      setAllTasks(updatedAllTasks);

      // update allLists state
      const listToUpdate = allLists.find(
        (list) => list.listName === selectedList.listName
      );
      const updatedListTasks = listToUpdate.tasks.concat(createdTask);
      const updatedList = { ...listToUpdate, tasks: updatedListTasks };
      const updatedAllLists = allLists.map((list) =>
        list.listName === selectedList.listName ? updatedList : list
      );
      setAllLists(updatedAllLists);

      setTaskName("");
      setDueDate(dayjs(new Date()));
    } catch (error) {
      console.log("error from handleCreateTask: ", error.message);
    }
  };

  // console.log("allLists in NewTaskForm: ", allLists);

  return (
    <Box>
      <TextField
        variant="outlined"
        size="small"
        // fullWidth
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
      ></TextField>

      <div style={{ display: "inline" }}>
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
      </div>

      <div style={{ display: "inline" }}>
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
            <MenuItem key={list.id} onClick={() => handleSelectList(list)}>
              {list.listName}
            </MenuItem>
          ))}
        </Menu>
      </div>

      <IconButton onClick={handleCreateTask}>
        <AddCircleIcon></AddCircleIcon>
      </IconButton>
    </Box>
  );
}
