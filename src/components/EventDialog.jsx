import CheckIcon from "@mui/icons-material/Check";
import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import DeleteIcon from "@mui/icons-material/Delete";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  Box,
  Button,
  Divider,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Popover,
  Stack,
} from "@mui/material";
import taskService from "../services/taskService";
import listService from "../services/listService";
import Checkbox from "@mui/material/Checkbox";

export default function FormDialog({
  token,
  open,
  setOpen,
  targetTask,
  setTask,
  allTasks,
  setAllTasks,
  allLists,
  setAllLists,
  action,
}) {
  const [calendarAnchorEl, setCalendarAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedList, setSelectedList] = useState(null);

  const getDateStr = (date) =>
    new Date(date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });

  const handleCheck = async () => {
    const newTask = { ...targetTask, completed: !targetTask.completed };
    const updatedTask = await taskService.updateTask(
      targetTask.id,
      newTask,
      token
    );

    // update allTasks state
    const newAllTasks = allTasks.map((t) =>
      t.id === targetTask.id ? updatedTask : t
    );
    setAllTasks(newAllTasks);

    const listToUpdate = allLists.find(
      (list) => list.listName === targetTask.listName
    );
    const updatedList = targetTask.completed
      ? { ...listToUpdate, count: listToUpdate.count + 1 }
      : { ...listToUpdate, count: listToUpdate.count - 1 };

    // update count in List collection
    await listService.updateList(token, updatedList);

    // update task counts in allLists state
    const updatedAllLists = allLists.map((list) =>
      list.listName === targetTask.listName ? updatedList : list
    );

    setAllLists(updatedAllLists);
  };

  const handleChangeDue = async (date) => {
    setCalendarAnchorEl(null);
    setTask({
      ...targetTask,
      dueDate: date,
    });
  };

  const handleChangeList = async (list) => {
    setMenuAnchorEl(null);
    setSelectedList(list);
  };

  const handleEditTask = async () => {
    setOpen(false);

    const newTask = {
      ...targetTask,
      dueDate: targetTask.dueDate,
      listName: selectedList?.listName || targetTask.listName,
      taskName: targetTask.taskName,
      taskNote: targetTask.taskNote,
    };

    let updatedTask;
    const sourceList = allLists.find(
      (list) => list.listName === targetTask.listName
    );

    if (selectedList && selectedList.listName !== targetTask.listName) {
      updatedTask = await taskService.moveTask(
        token,
        newTask,
        sourceList,
        selectedList
      );
    } else {
      updatedTask = await taskService.updateTask(targetTask.id, newTask, token);
    }

    // update allTasks state
    const updatedAllTasks = allTasks.map((task) =>
      task.id === targetTask.id ? updatedTask : task
    );
    setAllTasks(updatedAllTasks);

    // update the task count in List collection if task moved to another list
    if (selectedList && selectedList.listName !== targetTask.listName) {
      const listsAfterRemoval = allLists.map((list) =>
        list.listName === targetTask.listName
          ? { ...list, count: list.count - 1 }
          : list
      );

      const listsAfterAddition = listsAfterRemoval.map((list) =>
        list.listName === selectedList.listName
          ? { ...list, count: list.count + 1 }
          : list
      );
      setAllLists(listsAfterAddition);
    }

    setSelectedList(null);
  };

  const handleRemoveTask = async () => {
    setOpen(false);
    const newTask = { ...targetTask, removed: true };
    const updatedTask = await taskService.updateTask(
      targetTask.id,
      newTask,
      token
    );

    // update allTasks state
    const updatedAllTasks = allTasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );
    setAllTasks(updatedAllTasks);

    const listToUpdate = allLists.find(
      (list) => list.listName === targetTask.listName
    );
    const updatedList = { ...listToUpdate, count: listToUpdate.count - 1 };
    const returnedList = await listService.updateList(token, updatedList);

    // update task count in allLists state
    const updatedAllLists = allLists.map((list) =>
      list.listName === returnedList.listName ? returnedList : list
    );
    setAllLists(updatedAllLists);
  };

  const handleCreateTask = async () => {
    setOpen(false);

    const newTask = {
      ...targetTask,
      // taskName,
      listName: selectedList.listName,
      // taskNote,
    };

    const createdTask = await taskService.createTask(newTask, token);

    const listToUpdate = allLists.find(
      (list) => list.listName === selectedList.listName
    );
    await listService.updateList(token, {
      ...listToUpdate,
      count: listToUpdate.count + 1,
    });

    // update allTasks state
    const updatedAllTasks = allTasks.concat(createdTask);
    setAllTasks(updatedAllTasks);

    // update allLists state
    const updatedAllLists = allLists.map((list) =>
      list.listName === selectedList.listName
        ? { ...list, count: list.count + 1 }
        : list
    );
    setAllLists(updatedAllLists);

    // clear local states
    setSelectedList(null);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogContent dividers={true} sx={{ padding: 0, minWidth: "400px" }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          padding="0.2em 0.5em"
        >
          {action === "edit" && (
            <Checkbox
              checked={targetTask.completed}
              onChange={handleCheck}
              color="primary"
            ></Checkbox>
          )}

          <Button
            onClick={(e) => {
              setCalendarAnchorEl(e.currentTarget);
            }}
            startIcon={<CalendarMonthIcon />}
          >
            {getDateStr(targetTask.dueDate)}
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
                value={dayjs(targetTask.dueDate)}
                onChange={(date) => handleChangeDue(date)}
              ></DateCalendar>
            </LocalizationProvider>
          </Popover>

          <Button
            startIcon={<FormatListBulletedIcon />}
            onClick={(e) => setMenuAnchorEl(e.currentTarget)}
          >
            {selectedList?.listName || "List"}
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
                selected={targetTask.listName === list.listName}
                onClick={() => handleChangeList(list)}
              >
                {list.listName}
              </MenuItem>
            ))}
          </Menu>
        </Stack>

        <Divider></Divider>

        <Box padding="0.2em 1.2em">
          <InputBase
            fullWidth
            placeholder="What would you like to do?"
            value={targetTask.taskName}
            onChange={(e) =>
              setTask({ ...targetTask, taskName: e.target.value })
            }
          ></InputBase>
          <InputBase
            fullWidth
            value={targetTask.taskNote}
            onChange={(e) =>
              setTask({ ...targetTask, taskNote: e.target.value })
            }
            placeholder="Description"
            multiline
            rows={6}
          ></InputBase>
        </Box>

        <Divider></Divider>

        <Stack
          direction="row"
          justifyContent={action === "edit" ? "space-between" : "flex-end"}
          padding="0.2em 0.3em"
        >
          {action === "edit" && (
            <IconButton onClick={handleRemoveTask}>
              <DeleteIcon></DeleteIcon>
            </IconButton>
          )}

          <IconButton
            onClick={action === "edit" ? handleEditTask : handleCreateTask}
          >
            <CheckIcon></CheckIcon>
          </IconButton>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
