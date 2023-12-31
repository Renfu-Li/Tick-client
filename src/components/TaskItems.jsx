import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useState } from "react";
import {
  Checkbox,
  Collapse,
  List,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  ListItem,
  Stack,
  Typography,
} from "@mui/material";
import taskService from "../services/taskService";

function TaskItems({
  token,
  listToShow,
  allTasks,
  setAllTasks,
  allLists,
  setAllLists,
  selectedTask,
  setSelectedTask,
}) {
  const [showCompleted, setShowCompleted] = useState(false);

  // find existing and removed tasks
  const allExistingTasks = allTasks.filter((task) => !task.removed);
  const removedTasks = allTasks.filter((task) => task.removed);
  // find and set today's tasks
  const todayTasks = allExistingTasks.filter(
    (task) => new Date(task.dueDate) <= new Date()
  );
  // find and set next 7 days' tasks
  const sevenDaysLater = new Date();
  sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);
  const next7DaysTasks = allExistingTasks.filter(
    (task) => new Date(task.dueDate) <= sevenDaysLater
  );
  // find existing tasks, completed tasks and removed tasks
  const completedTasks = allExistingTasks.filter((task) => task.completed);

  // compute the tasktoShow from props
  const tasksToShow =
    listToShow === "Today"
      ? todayTasks
      : listToShow === "Next 7 Days"
      ? next7DaysTasks
      : listToShow === "All"
      ? allExistingTasks
      : listToShow === "Completed"
      ? completedTasks
      : listToShow === "Trash"
      ? removedTasks
      : allTasks.filter(
          (task) => task.listName === listToShow && !task.removed
        );

  const incompletedTasksInList = tasksToShow.filter((task) => !task.completed);
  const completedTasksInList = tasksToShow.filter((task) => task.completed);

  const calDateDiff = (date) => {
    const diffInMs = new Date(date) - new Date();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    return diffInDays;
  };

  const handleCheck = async (task) => {
    const newTask = { ...task, completed: !task.completed };
    await taskService.updateTask(task.id, newTask, token);

    // update allTasks state
    const newAllTasks = allTasks.map((t) => (t.id === task.id ? newTask : t));
    setAllTasks(newAllTasks);

    // update task counts in allLists state
    const updatedAllLists = task.completed
      ? allLists.map((list) =>
          list.listName === task.listName
            ? { ...list, count: list.count + 1 }
            : list
        )
      : allLists.map((list) =>
          list.listName === task.listName
            ? { ...list, count: list.count - 1 }
            : list
        );
    setAllLists(updatedAllLists);
  };
  return (
    <List dense sx={{ mt: "0.5em", p: 0 }}>
      {incompletedTasksInList.map((task) => (
        <ListItem key={task.id} disablePadding>
          <ListItemButton
            selected={selectedTask?.id === task.id}
            onClick={() => setSelectedTask(task)}
            sx={{ borderRadius: 1.5 }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              width="100%"
            >
              <Stack direction="row" alignItems="center">
                <Checkbox
                  checked={task.completed}
                  onChange={() => handleCheck(task)}
                  disabled={listToShow === "Trash"}
                  inputProps={{
                    "aria-label": "Checkbox for task completion",
                  }}
                ></Checkbox>
                <Typography fontSize="0.9em">{task.taskName}</Typography>
              </Stack>

              <Stack direction="row" spacing={1}>
                <Typography fontSize="0.8em" color="grey">
                  {task.listName}
                </Typography>
                <Typography
                  fontSize="0.8em"
                  color={calDateDiff(task.dueDate) >= 0 ? "primary" : "red"}
                >
                  {Math.abs(calDateDiff(task.dueDate))} D
                </Typography>
              </Stack>
            </Stack>
          </ListItemButton>
        </ListItem>
      ))}

      {listToShow !== "Completed" && (
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => setShowCompleted(!showCompleted)}
            sx={{ borderRadius: 1.5 }}
          >
            <ListItemIcon sx={{ position: "relative", left: "9px" }}>
              {showCompleted ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItemIcon>
            <ListItemText secondary="Completed"></ListItemText>
          </ListItemButton>
        </ListItem>
      )}

      <Collapse in={showCompleted || listToShow === "Completed"}>
        {completedTasksInList.map((task) => (
          <ListItem key={task.id} disablePadding>
            <ListItemButton
              selected={selectedTask?.id === task.id}
              onClick={() => setSelectedTask(task)}
              sx={{ borderRadius: 1.5 }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                width="100%"
              >
                <Stack direction="row" alignItems="center">
                  <Checkbox
                    checked={task.completed}
                    onChange={() => handleCheck(task)}
                    disabled={listToShow === "Trash"}
                    inputProps={{
                      "aria-label": "Checkbox for task completion",
                    }}
                  ></Checkbox>
                  <Typography fontSize="0.9em">{task.taskName}</Typography>
                </Stack>

                <Stack direction="row" spacing={1}>
                  <Typography fontSize="0.8em" color="grey">
                    {task.listName}
                  </Typography>
                  <Typography
                    fontSize="0.8em"
                    color={calDateDiff(task.dueDate) >= 0 ? "primary" : "red"}
                  >
                    {Math.abs(calDateDiff(task.dueDate))} D
                  </Typography>
                </Stack>
              </Stack>
            </ListItemButton>
          </ListItem>
        ))}
      </Collapse>
    </List>
  );
}

export default TaskItems;
