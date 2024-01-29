import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Button, Menu, MenuItem, Stack, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import focusService from "../services/focusService";
import { getTimerStr } from "../helper";

import {
  removeNotification,
  setNotification,
} from "../reducers/notificationReducer";

import { useDispatch, useSelector } from "react-redux";
import { createFocus } from "../reducers/focusReducer";

function FocusControl({ start, setStart, focusNote }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [task, setTask] = useState(null);
  const [time, setTime] = useState(0);

  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const allTasks = useSelector((state) => state.allTasks);

  const availableTasks = useMemo(
    () => allTasks.filter((task) => !task.completed && !task.removed),
    [allTasks]
  );

  useEffect(() => {
    let intervalId;
    if (start) {
      intervalId = setInterval(() => {
        const interval = Date.now() - start;
        setTime(interval);
      }, 100);
    }

    return () => clearInterval(intervalId);
  }, [start, time]);

  const handleSelectTask = (task) => {
    setTask(task);
    setAnchorEl(null);
  };

  const handleFocusStatus = async () => {
    try {
      if (!task) {
        dispatch(setNotification("Error: Please select a task"));
        setTimeout(() => dispatch(removeNotification()), 3000);

        return;
      }

      if (!start) {
        setStart(new Date());
      } else {
        const newFocus = {
          task: task.id,
          start,
          end: new Date(),
          focusNote,
        };
        const createdFocus = await focusService.createFocus(token, newFocus);
        // manually add the taskName because task isn't populated in backend after creating a focus
        const createdFocusInfo = {
          ...createdFocus,
          taskName: task.taskName,
        };
        dispatch(createFocus(createdFocusInfo));

        // clear up local states
        setTask(null);
        setStart(null);
        setTime(0);

        // notify user
        dispatch(
          setNotification(`Successfully created a focus for  ${task.taskName}`)
        );
        setTimeout(() => dispatch(removeNotification()), 3000);
      }
    } catch (error) {
      dispatch(setNotification(`Error: ${error.message}`));
      setTimeout(() => {
        dispatch(removeNotification());
      }, 3000);
    }
  };

  return (
    <>
      <Typography textAlign="center" variant="h5">
        Focus
      </Typography>

      <Stack justifyContent="space-evenly" alignItems="center" height="90%">
        <Button
          onClick={(e) => setAnchorEl(e.currentTarget)}
          variant="outlined"
          endIcon={<ExpandMoreIcon />}
          sx={{ borderRadius: "24px" }}
          // marginY: "2em"
        >
          {task?.taskName || "Task"}
        </Button>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          {availableTasks.map((task) => (
            <MenuItem key={task.id} onClick={() => handleSelectTask(task)}>
              {task.taskName}
            </MenuItem>
          ))}
        </Menu>

        <Stack
          justifyContent="center"
          alignItems="center"
          borderRadius="50%"
          border="5px solid rgb(230, 230, 230)"
          width={260}
          height={260}
        >
          <Typography fontSize="2.5em">{getTimerStr(time)}</Typography>
        </Stack>

        <Button
          variant="contained"
          sx={{ borderRadius: "24px" }}
          onClick={handleFocusStatus}
        >
          {start ? "End" : "Start"}
        </Button>
      </Stack>
    </>
  );
}

export default FocusControl;
