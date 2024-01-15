import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TimerIcon from "@mui/icons-material/Timer";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import {
  Box,
  Button,
  Divider,
  Grid,
  InputBase,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import focusService from "../services/focusService";
import {
  getShortDateStr,
  getTimerStr,
  getDurationStr,
  getMonday,
} from "../helper";

function Focus({ token, allTasks, allFocuses, setAllFocuses, allRecords }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [task, setTask] = useState(null);
  const [time, setTime] = useState(0);
  const [start, setStart] = useState(null);
  const [focusNote, setFocusNote] = useState("");

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

  const todayStr = getShortDateStr();
  const todayRecords = allRecords.filter(
    (record) => record.dateStr === todayStr
  );
  const todayDurationMinutes = todayRecords.reduce(
    (total, record) => total + record.durationInMinutes,
    0
  );
  const todayDurationStr = getDurationStr(todayDurationMinutes).durationStr;

  const currentWeekFocuses = allRecords.filter(
    (record) => new Date(record.date) >= getMonday()
  );
  const weeklyDurationMinutes = currentWeekFocuses.reduce(
    (total, record) => total + record.durationInMinutes,
    0
  );
  const weeklyDurationStr = getDurationStr(weeklyDurationMinutes).durationStr;

  const open = Boolean(anchorEl);

  const handleFocusStatus = async () => {
    if (!start) {
      setStart(new Date());
    } else {
      const newFocus = {
        taskId: task.id,
        start,
        end: new Date(),
        focusNote,
      };
      const createdFocus = await focusService.createFocus(token, newFocus);
      // manually add the taskName because task isn't populated in backend after creating a focus
      const updatedAllFocuses = allFocuses.concat({
        ...createdFocus,
        taskName: task.taskName,
      });

      // clear up local states
      setAllFocuses(updatedAllFocuses);
      setTask(null);
      setStart(null);
      setTime(0);
    }
  };

  const handleSelectTask = (task) => {
    setTask(task);
    setAnchorEl(null);
  };

  return (
    <Grid
      container
      position="relative"
      spacing={1}
      justifyContent="space-evenly"
    >
      <Grid
        item
        xs={6}
        position="sticky"
        top="0px"
        height="100vh"
        sx={{ borderRight: 0.5, borderColor: "lightgray" }}
      >
        <Stack justifyContent="space-evenly" alignItems="center" height="100%">
          <Typography fontSize="1.2em">Focus</Typography>

          <Button
            onClick={(e) => setAnchorEl(e.currentTarget)}
            variant="outlined"
            endIcon={<ExpandMoreIcon />}
            sx={{ borderRadius: "24px" }}
          >
            {task?.taskName || "Task"}
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={() => setAnchorEl(null)}
          >
            {allTasks.map((task) => (
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
      </Grid>

      <Grid item xs={5} height="100vh" mt="2em">
        <Typography>Overview</Typography>
        <Grid
          container
          // spacing={1}
          justifyContent="space-between"
          margin="0.5em"
          mx={0}
        >
          <Grid
            item
            xs={5.5}
            borderRadius={1.5}
            bgcolor="rgb(245, 245, 245)"
            padding={1.5}
          >
            <Typography color="grey" fontSize="90%">
              Today's Focus
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
              This week's Focus
            </Typography>
            <Typography mt="0.5em" fontSize="1.5em">
              {weeklyDurationStr}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: "2em", color: "lightgray" }}></Divider>

        {start ? (
          <Box>
            <Typography mb={1}>Focus Note</Typography>
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
            <Typography>Focus record</Typography>
            <List>
              {allRecords.map((record) => (
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
        )}
      </Grid>
    </Grid>
  );
}

export default Focus;
