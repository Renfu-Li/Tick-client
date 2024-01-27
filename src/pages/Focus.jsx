import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TimerIcon from "@mui/icons-material/Timer";

import {
  Box,
  Button,
  Divider,
  Grid,
  InputBase,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import focusService from "../services/focusService";
import {
  getShortDateStr,
  getTimerStr,
  getDurationStr,
  getMonday,
} from "../helper";

import {
  removeNotification,
  setNotification,
} from "../reducers/notificationReducer";
import { Navigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { createFocus } from "../reducers/focusReducer";

function Focus({ allRecords }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [task, setTask] = useState(null);
  const [time, setTime] = useState(0);
  const [start, setStart] = useState(null);
  const [focusNote, setFocusNote] = useState("");

  const dispatch = useDispatch();
  const allTasks = useSelector((state) => state.allTasks);
  const token = useSelector((state) => state.token);

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

  const todayDurationStr = useMemo(() => {
    const todayStr = getShortDateStr();
    const todayRecords = allRecords.filter(
      (record) => record.dateStr === todayStr
    );
    const todayDurationMinutes = todayRecords.reduce(
      (total, record) => total + record.durationInMinutes,
      0
    );

    const str = getDurationStr(todayDurationMinutes).durationStr;
    return str;
  }, [allRecords]);

  const weeklyDurationStr = useMemo(() => {
    const currentWeekFocuses = allRecords.filter(
      (record) => new Date(record.date) >= getMonday()
    );
    const weeklyDurationMinutes = currentWeekFocuses.reduce(
      (total, record) => total + record.durationInMinutes,
      0
    );

    const str = getDurationStr(weeklyDurationMinutes).durationStr;
    return str;
  }, [allRecords]);

  const open = Boolean(anchorEl);

  const dailyRecords = useMemo(() => {
    const records = new Map();
    for (let record of allRecords) {
      const numericDateStr = record.numericDateStr;

      if (!records.has(numericDateStr)) {
        records.set(numericDateStr, []);
      }

      const mapValue = records.get(numericDateStr);
      mapValue.push(record);

      records.set(numericDateStr, mapValue);
    }

    return records;
  }, [allRecords]);

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

  const handleSelectTask = (task) => {
    setTask(task);
    setAnchorEl(null);
  };

  return (
    <Grid container justifyContent="space-between" height="100%" margin={0}>
      {!token && <Navigate to="/" />}

      <Grid
        item
        xs={6}
        height="100%"
        paddingY="0.7em"
        sx={{ borderRight: 0.5, borderColor: "lightgray" }}
      >
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
            open={open}
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
            // mb="2em"
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
      </Grid>

      <Grid
        item
        xs={6}
        height="100%"
        paddingX="1em"
        paddingY="0.7em"
        overflow="auto"
      >
        <Typography variant="h6">Overview</Typography>
        <Grid container justifyContent="space-between" margin="0.5em" mx={0}>
          <Grid
            item
            xs={5.5}
            borderRadius={1.5}
            bgcolor="rgb(245, 245, 245)"
            padding={1.5}
          >
            <Typography color="grey" fontSize="90%">
              Today&lsquo;s Focus
            </Typography>
            <Typography mt="0.5em" fontSize="1.5em">
              {todayDurationStr}
            </Typography>
          </Grid>

          <Grid
            item
            xs={5.5}
            borderRadius={1.5}
            bgcolor="rgb(245, 245, 245)"
            padding={1.5}
          >
            <Typography color="grey" fontSize="90%">
              This week&lsquo;s Focus
            </Typography>
            <Typography mt="0.5em" fontSize="1.5em">
              {weeklyDurationStr}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: "1.5em", color: "lightgray" }}></Divider>

        {start ? (
          <Box>
            <Typography variant="h6" mb={1}>
              Focus Note
            </Typography>
            <Paper
              sx={{
                padding: 0.5,
              }}
            >
              <InputBase
                value={focusNote}
                onChange={(e) => setFocusNote(e.target.value)}
                placeholder="What do you have in mind?"
                minRows={10}
                multiline
                fullWidth
                sx={{ ml: 1 }}
              ></InputBase>
            </Paper>
          </Box>
        ) : (
          <Box>
            <Typography variant="h6" mb="0.5em">
              Focus record
            </Typography>

            {Array.from(dailyRecords).map(([key, value]) => (
              <Box key={key}>
                <Typography fontSize="0.9em">{getShortDateStr(key)}</Typography>
                <List dense>
                  {value.map((record) => (
                    <ListItem key={record.id}>
                      <Stack
                        width="100%"
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <TimerIcon
                          fontSize="small"
                          color="primary"
                          sx={{ mr: "0.5em" }}
                        ></TimerIcon>

                        <ListItemText
                          primary={record.taskName}
                          secondary={`${record.dateStr} ${record.startTime} - ${record.endTime}`}
                        ></ListItemText>
                        <Typography>{record.durationStr}</Typography>
                      </Stack>
                    </ListItem>
                  ))}
                </List>
              </Box>
            ))}
          </Box>
        )}
      </Grid>
    </Grid>
  );
}

export default Focus;
