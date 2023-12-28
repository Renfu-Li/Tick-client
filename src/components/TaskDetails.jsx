import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import CalendarMonth from "@mui/icons-material/CalendarMonth";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
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
  Typography,
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
  setSelectedTask,
  allTasks,
  setAllTasks,
  allLists,
}) {
  const [calendarAnchorEl, setCalendarAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  const availableLists = selectedTask
    ? allLists.filter((list) => list.listName !== selectedTask.listName)
    : [];

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

    setAllTasks(updatedAllTasks);
  };

  const handleEditNote = async () => {
    const newTask = {
      ...selectedTask,
      taskNote: selectedTask.taskNote,
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

  const handleDeleteTask = async () => {
    const deletedTask = await taskService.deleteTask(selectedTask.id, token);

    // update allTasks state
    const updatedAllTasks = allTasks.filter(
      (task) => task.id !== deletedTask.id
    );
    setAllTasks(updatedAllTasks);
  };

  return selectedTask ? (
    <Box sx={{ textAlign: "center" }}>
      {/* <Typography>{selectedTask.taskName}</Typography> */}
      <Stack direction="row" justifyContent="space-between">
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
          startIcon={<FormatListBulletedIcon />}
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
          {availableLists.map((list) => (
            <MenuItem key={list.id} onClick={() => handleChangeList(list)}>
              {list.listName}
            </MenuItem>
          ))}
        </Menu>

        <IconButton onClick={handleDeleteTask}>
          <DeleteIcon color="primary"></DeleteIcon>
        </IconButton>
      </Stack>

      <TextField
        id="outlined-multiline-flexible"
        label="Task note"
        multiline
        value={selectedTask.taskNote}
        onChange={(e) =>
          setSelectedTask({ ...selectedTask, taskNote: e.target.value })
        }
        rows={10}
        fullWidth
        sx={{ mt: "1em" }}
      ></TextField>
      <Button
        variant="contained"
        endIcon={<CheckIcon />}
        onClick={handleEditNote}
        sx={{ mt: "1em" }}
      >
        Change Note
      </Button>
    </Box>
  ) : (
    <Stack justifyContent="center" alignItems="center" sx={{ height: "100%" }}>
      <AdsClickIcon fontSize="large"></AdsClickIcon>
      <Typography>Click task title to view the detail or edit</Typography>
    </Stack>
  );
}

export default TaskDetails;
