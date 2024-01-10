import CheckIcon from "@mui/icons-material/Check";
import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import DeleteIcon from "@mui/icons-material/Delete";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  Box,
  Button,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Paper,
  Popover,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import taskService from "../services/taskService";
import listService from "../services/listService";
import CheckBox from "@mui/icons-material/CheckBox";
import { LegendToggleOutlined } from "@mui/icons-material";

export default function FormDialog({
  token,
  open,
  setOpen,
  selectedEvent,
  allTasks,
  setAllTasks,
  allLists,
  setAllLists,
}) {
  const { title, start, end, ...selectedTask } = selectedEvent;

  const [calendarAnchorEl, setCalendarAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [dueDate, setDueDate] = useState(selectedTask.dueDate);
  const [selectedList, setSelectedList] = useState(null);
  const [taskName, setTaskName] = useState(selectedTask.taskName);
  const [taskNote, setTaskNote] = useState(selectedTask.taskNote);

  const dateStr = new Date(dueDate).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

  const handleCheck = async (task) => {
    const newTask = { ...task, completed: !task.completed };
    await taskService.updateTask(task.id, newTask, token);

    // update allTasks state
    const newAllTasks = allTasks.map((t) => (t.id === task.id ? newTask : t));
    setAllTasks(newAllTasks);

    const listToUpdate = allLists.find(
      (list) => list.listName === task.listName
    );
    const updatedList = task.completed
      ? { ...listToUpdate, count: listToUpdate.count + 1 }
      : { ...listToUpdate, count: listToUpdate.count - 1 };

    // update count in List collection
    await listService.updateList(token, updatedList);

    // update task counts in allLists state
    const updatedAllLists = allLists.map((list) =>
      list.listName === task.listName ? updatedList : list
    );

    setAllLists(updatedAllLists);
  };

  const handleChangeDue = async (date) => {
    setCalendarAnchorEl(null);
    setDueDate(date);
  };

  const handleChangeList = async (list) => {
    setMenuAnchorEl(null);
    setSelectedList(list);
  };

  const handleEditTask = async () => {
    setOpen(false);

    const newTask = {
      ...selectedTask,
      dueDate: dueDate,
      listName: selectedList?.listName || selectedTask.listName,
      taskName,
      taskNote,
    };

    let updatedTask;
    const sourceList = allLists.find(
      (list) => list.listName === selectedTask.listName
    );

    if (selectedList && selectedList.listName !== selectedTask.listName) {
      updatedTask = await taskService.moveTask(
        token,
        newTask,
        sourceList,
        selectedList
      );
    } else {
      updatedTask = await taskService.updateTask(
        selectedTask.id,
        newTask,
        token
      );
    }

    // update allTasks state
    const updatedAllTasks = allTasks.map((task) =>
      task.id === selectedTask.id ? updatedTask : task
    );
    setAllTasks(updatedAllTasks);

    // update the task count in List collection
    const listsAfterRemoval = allLists.map((list) =>
      list.listName === selectedTask.listName
        ? { ...list, count: list.count - 1 }
        : list
    );

    const listsAfterAddition = listsAfterRemoval.map((list) =>
      list.listName === selectedList.listName
        ? { ...list, count: list.count + 1 }
        : list
    );
    setAllLists(listsAfterAddition);
  };

  const handleRemoveTask = async () => {
    setOpen(false);
    const newTask = { ...selectedTask, removed: true };
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

    const listToUpdate = allLists.find(
      (list) => list.listName === selectedTask.listName
    );
    const updatedList = { ...listToUpdate, count: listToUpdate.count - 1 };
    const returnedList = await listService.updateList(token, updatedList);

    // update task count in allLists state
    const updatedAllLists = allLists.map((list) =>
      list.listName === returnedList.listName ? returnedList : list
    );
    setAllLists(updatedAllLists);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      {/* <DialogTitle>Add a task</DialogTitle> */}
      <DialogContent>
        <Box>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <CheckBox
              checked={selectedTask.completed}
              onChange={handleCheck}
              color="primary"
            ></CheckBox>

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
                  value={dayjs(dueDate)}
                  onChange={(date) => handleChangeDue(date)}
                ></DateCalendar>
              </LocalizationProvider>
            </Popover>

            <Button
              startIcon={<FormatListBulletedIcon />}
              onClick={(e) => setMenuAnchorEl(e.currentTarget)}
            >
              List
            </Button>
            <Menu
              anchorEl={menuAnchorEl}
              open={Boolean(menuAnchorEl)}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              onClose={() => setMenuAnchorEl(null)}
            >
              {allLists.map((list) => (
                <MenuItem
                  key={list.id}
                  selected={selectedTask.listName === list.listName}
                  onClick={() => handleChangeList(list)}
                >
                  {list.listName}
                </MenuItem>
              ))}
            </Menu>
          </Stack>

          <InputBase
            fullWidth
            placeholder="What would you like to do?"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          ></InputBase>
          <InputBase
            fullWidth
            value={taskNote}
            onChange={(e) => setTaskNote(e.target.value)}
            placeholder="Description"
            multiline
            rows={4}
          ></InputBase>

          <Stack direction="row" justifyContent="space-between">
            <IconButton onClick={handleRemoveTask}>
              <DeleteIcon></DeleteIcon>
            </IconButton>
            <IconButton onClick={handleEditTask}>
              <CheckIcon></CheckIcon>
            </IconButton>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
