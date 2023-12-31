import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
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
  setAllLists,
}) {
  const [calendarAnchorEl, setCalendarAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  const dateStr = new Date(selectedTask?.dueDate).toLocaleDateString(
    undefined,
    {
      month: "short",
      day: "numeric",
    }
  );

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

    // update allLists state
    const listsAfterRemoval = allLists.map((list) =>
      list.listName === selectedTask.listName
        ? { ...list, count: list.count - 1 }
        : list
    );

    const listsAfterAddition = listsAfterRemoval.map((list) =>
      list.listName === selectedList ? { ...list, count: list.count + 1 } : list
    );
    setAllLists(listsAfterAddition);
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

  const handleRemoveTask = async () => {
    const newTask = { ...selectedTask, deleted: true };
    const updatedTask = await taskService.updateTask(
      selectedTask.id,
      newTask,
      token
    );

    // update allTasks state
    const updatedAllTasks = allTasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );
    setAllTasks(updatedAllTasks);

    // update task count in allLists state
    const updatedAllLists = allLists.map((list) =>
      list.listName === selectedTask.listName
        ? { ...list, count: list.count - 1 }
        : list
    );
    setAllLists(updatedAllLists);
  };

  return selectedTask ? (
    <Box
      paddingLeft="16px"
      paddingRight="16px"
      paddingTop="2px"
      sx={{ textAlign: "center", height: "100%" }}
    >
      <Stack direction="row" justifyContent="space-between">
        <Button
          onClick={(e) => {
            setCalendarAnchorEl(e.currentTarget);
          }}
          startIcon={<CalendarMonthIcon />}
        >
          {dateStr}
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

        <IconButton onClick={handleRemoveTask}>
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
        variant="outlined"
        endIcon={<CheckIcon />}
        onClick={handleEditNote}
        sx={{ mt: "1em" }}
      >
        Change Note
      </Button>
    </Box>
  ) : (
    <Stack
      justifyContent="center"
      alignItems="center"
      spacing={2}
      sx={{ height: "100%" }}
    >
      <AdsClickIcon fontSize="large"></AdsClickIcon>
      <Typography>Click task title to view the detail or edit</Typography>
    </Stack>
  );
}

export default TaskDetails;
