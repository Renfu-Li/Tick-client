import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import {
  Box,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import focusService from "../services/focusService";

function Focus({ token, allTasks }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [task, setTask] = useState(null);
  const [start, setStart] = useState(null);
  const [focusNote, setFocusNote] = useState("");
  const [allFocuses, setAllFocuses] = useState([]);

  useEffect(() => {
    if (token) {
      focusService
        .getAllFocuses(token)
        .then((focuses) => setAllFocuses(focuses));
    }
  }, [token]);

  const open = Boolean(anchorEl);

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
      const updatedAllFocuses = allFocuses.concat(createdFocus);
      setAllFocuses(updatedAllFocuses);
      setStart(null);
    }
  };

  const handleSelectTask = (task) => {
    setTask(task);
    setAnchorEl(null);
  };

  console.log(allFocuses);

  return (
    <Grid container>
      <Grid item xs={7}>
        <Stack justifyContent="space-evenly" alignItems="center" height="100%">
          <Typography fontSize="1.2em">Focus</Typography>

          <Button
            onClick={handleClick}
            variant="outlined"
            endIcon={<KeyboardArrowRightIcon />}
            sx={{ borderRadius: "24px" }}
          >
            {task?.taskName || "Task"}
          </Button>
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
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
            <Typography fontSize="2.5em">00:00</Typography>
          </Stack>

          <Button
            variant="outlined"
            sx={{ borderRadius: "24px" }}
            onClick={handleFocusStatus}
          >
            {start ? "End" : "Start"}
          </Button>
        </Stack>
      </Grid>

      <Grid item xs={5}>
        <Box>
          <Typography>Overview</Typography>
          <Grid
            container
            // spacing={1}
            justifyContent="space-between"
            margin="0.5em"
          >
            <Grid item xs={5} borderRadius={1.5} bgcolor="rgb(230, 230, 230)">
              <Box>
                <Typography>Today's Focus</Typography>
                <Typography>0</Typography>
              </Box>
            </Grid>

            <Grid item xs={5} borderRadius={1.5} bgcolor="rgb(230, 230, 230)">
              <Box>
                <Typography>This week's Focus</Typography>
                <Typography>0</Typography>
              </Box>
            </Grid>
            {/* <Grid item xs={6}></Grid>
            <Grid item xs={6}></Grid> */}
          </Grid>

          <Typography>Focus record</Typography>
          <List>
            <ListItem>
              <ListItemText>focus 1</ListItemText>
            </ListItem>

            <ListItem>
              <ListItemText>focus 2</ListItemText>
            </ListItem>

            <ListItem>
              <ListItemText>focus 2</ListItemText>
            </ListItem>
          </List>
        </Box>
      </Grid>
    </Grid>
  );
}

export default Focus;
