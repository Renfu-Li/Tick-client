import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import CalendarMonth from "@mui/icons-material/CalendarMonth";
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  Popover,
  Stack,
  TextField,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useState } from "react";
import dayjs from "dayjs";
import taskService from "../services/taskService";

function TaskDetails({
  token,
  selectedTask,
  allTasks,
  setAllTasks,
  allLists,
  setAllLists,
}) {
  const [calendarAnchorEl, setCalendarAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  // const [selectedList, setSelectedList] = useState(null);

  const handleChangeDue = async (date) => {
    setCalendarAnchorEl(null);
    const newTask = {
      ...selectedTask,
      dueDate: date,
    };

    const updatedTask = await taskService.updateTask(
      selectedTask.id,
      newTask,
      token
    );

    const updatedAllTasks = allTasks.map((task) =>
      task.id === selectedTask.id ? updatedTask : task
    );
    setAllTasks(updatedAllTasks);

    const listToUpdate = allLists.find(
      (list) => list.listName === selectedTask.listName
    );
    const newListTasks = listToUpdate.tasks.map((task) =>
      task.id === selectedTask.id ? newTask : task
    );
    const updatedList = { ...listToUpdate, tasks: newListTasks };
    const updatedAllLists = allLists.map((list) =>
      list._id === listToUpdate._id ? updatedList : list
    );
    setAllLists(updatedAllLists);
  };

  const handleChangeList = async (selectedList) => {
    setMenuAnchorEl(null);

    // update task in Task
    const newTask = { ...selectedTask, listName: selectedList.listName };
    const updatedTask = await taskService.updateTask(
      selectedTask.id,
      newTask,
      token
    );

    // update task in User

    // update allTasks
    const updatedAllTasks = allTasks.map((task) =>
      task.id === selectedTask.id ? updatedTask : task
    );
    setAllTasks(updatedAllTasks);

    // update allLists
    const listToDeleteTask = allLists.find(
      (list) => list.listName === selectedTask.listName
    );
    const tasksAfterDeletion = listToDeleteTask.tasks.filter(
      (task) => task.id !== selectedTask.id
    );
    const updatedListAfterDeletion = {
      ...listToDeleteTask,
      tasks: tasksAfterDeletion,
    };
    const allListsAfterDeletion = allLists.map((list) =>
      list.listName === selectedTask.listName ? updatedListAfterDeletion : list
    );
    setAllLists(allListsAfterDeletion);

    const listToAddTask = allLists.find(
      (list) => list.listName === selectedList.listName
    );
    const tasksAfterAddition = listToAddTask.tasks.concat(updatedTask);
    const updatedListAfterAddition = {
      ...listToAddTask,
      tasks: tasksAfterAddition,
    };
    const allListsAfterAddition = allLists.map((list) =>
      list.listName === selectedList.listName ? updatedListAfterAddition : list
    );
    setAllLists(allListsAfterAddition);
  };

  console.log(allLists);

  return (
    <Box>
      <Stack direction="row">
        <Button
          onClick={(e) => {
            setCalendarAnchorEl(e.currentTarget);
          }}
          startIcon={<CalendarMonthIcon />}
        >
          New Due
        </Button>

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
              value={dayjs(selectedTask?.dueDate)}
              onChange={(date) => handleChangeDue(date)}
            ></DateCalendar>
          </LocalizationProvider>
        </Popover>

        <Button
          endIcon={<FormatListBulletedIcon />}
          onClick={(e) => setMenuAnchorEl(e.currentTarget)}
        >
          Move to
        </Button>
        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          onClose={() => setMenuAnchorEl(null)}
        >
          {allLists.map((list) => (
            <MenuItem key={list._id} onClick={() => handleChangeList(list)}>
              {list.listName}
            </MenuItem>
          ))}
        </Menu>
      </Stack>
    </Box>
  );
}

export default TaskDetails;
