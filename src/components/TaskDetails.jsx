import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import RestoreIcon from "@mui/icons-material/Restore";
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
  Tooltip,
  Typography,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useMemo, useState } from "react";
import dayjs from "dayjs";
import taskService from "../services/taskService";
import listService from "../services/listService";
import AlertDialog from "./AlertDialog";

import {
  removeNotification,
  setNotification,
} from "../reducers/notificationReducer";

import { updateTask } from "../reducers/taskReducer";
import { changeCount, updateList } from "../reducers/listReducer";
import { useDispatch, useSelector } from "react-redux";
import { getNumericDateStr } from "../helper";

function TaskDetails({ listToShow, selectedTask, setSelectedTask }) {
  const [calendarAnchorEl, setCalendarAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [openAlert, setOpenAlert] = useState(false);

  const dispatch = useDispatch();
  const allLists = useSelector((state) => state.allLists);
  const token = useSelector((state) => state.token);

  const dateStr = new Date(selectedTask?.dueDate).toLocaleDateString(
    undefined,
    {
      month: "short",
      day: "numeric",
    }
  );

  const availableLists = useMemo(
    () =>
      selectedTask
        ? allLists.filter((list) => list.listName !== selectedTask.listName)
        : [],
    [allLists, selectedTask]
  );

  const handleChangeDue = async (date) => {
    setCalendarAnchorEl(null);
    const newTask = {
      ...selectedTask,
      dueDate: date,
    };

    try {
      const updatedTask = await taskService.updateTask(
        selectedTask.id,
        newTask,
        token
      );

      // update allTasks state
      dispatch(updateTask(updatedTask));

      // notify user
      dispatch(
        setNotification(
          `Successfully changed due to ${getNumericDateStr(date)}`
        )
      );
      setTimeout(() => dispatch(removeNotification()), 3000);
    } catch (error) {
      dispatch(setNotification(`Error: ${error.message}`));
      setTimeout(() => dispatch(removeNotification()), 3000);
    }
  };

  const handleChangeList = async (selectedList) => {
    setMenuAnchorEl(null);

    // update the task count in List collection
    const sourceList = allLists.find(
      (list) => list.listName === selectedTask.listName
    );

    try {
      const updatedTask = await taskService.moveTask(
        token,
        selectedTask,
        sourceList,
        selectedList
      );

      // update allTasks state
      dispatch(updateTask(updatedTask));

      // update allLists state
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

      // notify user
      dispatch(
        setNotification(`Successfully moved to list ${selectedList.listName}`)
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

  const handleEditNote = async () => {
    const newTask = {
      ...selectedTask,
      taskNote: selectedTask.taskNote,
    };

    try {
      const updatedTask = await taskService.updateTask(
        selectedTask.id,
        newTask,
        token
      );

      // update allTasks state
      dispatch(updateTask(updatedTask));
    } catch (error) {
      dispatch(setNotification(`Error: ${error.message}`));
      setTimeout(() => {
        dispatch(removeNotification());
      }, 3000);
    }
  };

  const handleRemoveTask = async () => {
    const newTask = { ...selectedTask, removed: true };
    try {
      const updatedTask = await taskService.updateTask(
        selectedTask.id,
        newTask,
        token
      );

      // update allTasks state
      dispatch(updateTask(updatedTask));

      const listToUpdate = allLists.find(
        (list) => list.listName === selectedTask.listName
      );

      // only decrease the count when the task is not completed
      if (!selectedTask.completed) {
        const newList = { ...listToUpdate, count: listToUpdate.count - 1 };
        const updatedList = await listService.updateList(token, newList);

        // update task count in allLists state
        dispatch(updateList(updatedList));
      }

      // notify user
      dispatch(
        setNotification(`Successfully removed task ${selectedTask.taskName}`)
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

  const handleRestoreTask = async () => {
    // update task
    const newTask = { ...selectedTask, removed: false };

    try {
      const updatedTask = await taskService.updateTask(
        selectedTask.id,
        newTask,
        token
      );

      dispatch(updateTask(updatedTask));

      // only increase the count when the task is not completed
      if (!selectedTask.completed) {
        const listToUpdate = allLists.find(
          (list) => list.listName === selectedTask.listName
        );
        const newList = { ...listToUpdate, count: listToUpdate.count + 1 };
        const updatedList = await listService.updateList(token, newList);

        dispatch(updateList(updatedList));
      }

      // notify user
      dispatch(
        setNotification(
          `Successfully restored task to ${selectedTask.listName}`
        )
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

  return selectedTask ? (
    <Box
      paddingLeft="16px"
      paddingRight="16px"
      paddingTop="2px"
      sx={{ textAlign: "center", height: "100%" }}
    >
      <Stack direction="row" justifyContent="space-between">
        <Tooltip title="Change due date">
          <Button
            onClick={(e) => {
              setCalendarAnchorEl(e.currentTarget);
            }}
            startIcon={<CalendarMonthIcon />}
          >
            {dateStr}
          </Button>
        </Tooltip>

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
              disablePast
            ></DateCalendar>
          </LocalizationProvider>
        </Popover>

        <Tooltip title="Choose a new list">
          <Button
            startIcon={<FormatListBulletedIcon />}
            onClick={(e) => setMenuAnchorEl(e.currentTarget)}
          >
            Move to
          </Button>
        </Tooltip>
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

        {listToShow === "Trash" ? (
          <>
            <Tooltip title="Permanently delete">
              <IconButton onClick={() => setOpenAlert(true)}>
                <DeleteForeverIcon color="primary"></DeleteForeverIcon>
              </IconButton>
            </Tooltip>

            <AlertDialog
              openAlert={openAlert}
              setOpenAlert={setOpenAlert}
              task={selectedTask}
            ></AlertDialog>

            <Tooltip title="Restore to the original list">
              <IconButton onClick={handleRestoreTask}>
                <RestoreIcon color="primary"></RestoreIcon>
              </IconButton>
            </Tooltip>
          </>
        ) : (
          <Tooltip title="Remove to Trash">
            <IconButton onClick={handleRemoveTask}>
              <DeleteIcon color="primary"></DeleteIcon>
            </IconButton>
          </Tooltip>
        )}
      </Stack>

      <Paper
        sx={{
          padding: 0.5,
          mt: "0.6em",
        }}
      >
        <InputBase
          value={selectedTask.taskNote}
          onChange={(e) =>
            setSelectedTask({ ...selectedTask, taskNote: e.target.value })
          }
          placeholder="Task note"
          minRows={16}
          multiline
          fullWidth
          sx={{ ml: 1 }}
        ></InputBase>
      </Paper>

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
