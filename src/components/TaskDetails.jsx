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
import listService from "../services/listService";

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

    // update allTasks state
    const updatedAllTasks = allTasks.map((task) =>
      task.id === selectedTask.id ? updatedTask : task
    );
    setAllTasks(updatedAllTasks);
  };

  const handleChangeList = async (selectedList) => {
    setMenuAnchorEl(null);

    // replace the task in Task collection and update the task in List collection
    const updatedTask = await listService.moveTask(
      token,
      selectedTask,
      selectedList.listName
    );

    // update allTasks state
    const updatedAllTasks = allTasks.map((task) =>
      task.id === selectedTask.id ? updatedTask : task
    );

    console.log("selectedTask.id", selectedTask.id);
    console.log("allTasks", allTasks);
    console.log("updatedTask", updatedTask);
    setAllTasks(updatedAllTasks);
  };

  // console.log(allLists);

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
            <MenuItem key={list.id} onClick={() => handleChangeList(list)}>
              {list.listName}
            </MenuItem>
          ))}
        </Menu>
      </Stack>
    </Box>
  );
}

export default TaskDetails;
