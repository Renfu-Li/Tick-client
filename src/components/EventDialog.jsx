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
import { useDispatch, useSelector } from "react-redux";
import { createTask, updateTask } from "../reducers/taskReducer";
import { changeCount, updateList } from "../reducers/listReducer";

import {
  removeNotification,
  setNotification,
} from "../reducers/notificationReducer";

export default function EventDialog({
  open,
  setOpen,
  targetTask,
  setTask,
  action,
}) {
  const [calendarAnchorEl, setCalendarAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedList, setSelectedList] = useState(null);

  const dispatch = useDispatch();
  const allLists = useSelector((state) => state.allLists);
  const token = useSelector((state) => state.token);

  const getDateStr = (date) =>
    new Date(date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });

  const handleCheck = async () => {
    const newTask = { ...targetTask, completed: !targetTask.completed };

    try {
      const updatedTask = await taskService.updateTask(
        targetTask.id,
        newTask,
        token
      );

      // update allTasks state
      dispatch(updateTask(updatedTask));

      const listToUpdate = allLists.find(
        (list) => list.listName === targetTask.listName
      );
      const newList = targetTask.completed
        ? { ...listToUpdate, count: listToUpdate.count + 1 }
        : { ...listToUpdate, count: listToUpdate.count - 1 };

      // update count in List collection
      const updatedList = await listService.updateList(token, newList);

      // update task counts in allLists state
      dispatch(updateList(updatedList));
    } catch (error) {
      dispatch(setNotification(`Error: ${error.message}`));
      setTimeout(() => dispatch(removeNotification()), 3000);
    }
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

    try {
      let updatedTask;
      if (selectedList && selectedList.listName !== targetTask.listName) {
        updatedTask = await taskService.moveTask(
          token,
          newTask,
          sourceList,
          selectedList
        );

        // update the task count in List collection if task moved to another list
        const sourceList = allLists.find(
          (list) => (list.listName = targetTask.listName)
        );
        dispatch(
          changeCount({
            type: "DECREASE",
            payload: sourceList,
          })
        );

        dispatch(
          changeCount({
            type: "INCREASE",
            payload: selectedList,
          })
        );
      } else {
        updatedTask = await taskService.updateTask(
          targetTask.id,
          newTask,
          token
        );
      }

      // update allTasks state
      dispatch(updateTask(updatedTask));

      setSelectedList(null);

      // notify user
      dispatch(setNotification(`Successfully updated task`));
      setTimeout(() => {
        dispatch(removeNotification());
      }, 3000);
    } catch (error) {
      dispatch(setNotification(`Error: ${error.message}`));
      setTimeout(() => {
        dispatch(removeNotification());
      }, 3000);
    }
  };

  const handleRemoveTask = async () => {
    setOpen(false);
    const newTask = { ...targetTask, removed: true };

    try {
      const updatedTask = await taskService.updateTask(
        targetTask.id,
        newTask,
        token
      );

      // update allTasks state
      dispatch(updateTask(updatedTask));

      const listToUpdate = allLists.find(
        (list) => list.listName === targetTask.listName
      );
      const newList = { ...listToUpdate, count: listToUpdate.count - 1 };
      const updatedList = await listService.updateList(token, newList);

      // update task count in allLists state
      dispatch(updateList(updatedList));

      //notify user
      dispatch(setNotification(`Successfully removed task`));
      setTimeout(() => {
        dispatch(removeNotification());
      }, 3000);
    } catch (error) {
      dispatch(setNotification(`Error: ${error.message}`));
      setTimeout(() => {
        dispatch(removeNotification());
      }, 3000);
    }
  };

  const handleCreateTask = async () => {
    setOpen(false);

    const newTask = {
      ...targetTask,
      // taskName,
      listName: selectedList.listName,
      // taskNote,
    };

    try {
      const createdTask = await taskService.createTask(newTask, token);

      const listToUpdate = allLists.find(
        (list) => list.listName === selectedList.listName
      );
      const updatedList = await listService.updateList(token, {
        ...listToUpdate,
        count: listToUpdate.count + 1,
      });

      // update allTasks state
      dispatch(createTask(createdTask));

      // update allLists state
      dispatch(updateList(updatedList));

      // clear local states
      setSelectedList(null);

      // notify user
      dispatch(
        setNotification(`Successfully created a task ${createdTask.taskName}`)
      );
      setTimeout(() => {
        dispatch(removeNotification());
      }, 3000);
    } catch (error) {
      dispatch(setNotification(`Error: ${error.message}`));
      setTimeout(() => {
        dispatch(removeNotification());
      }, 3000);
    }
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
