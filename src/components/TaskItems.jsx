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
} from "@mui/material";
import taskService from "../services/taskService";

function TaskItems({
  token,
  listToShow,
  allTasks,
  setAllTasks,
  selectedTask,
  setSelectedTask,
}) {
  const [showCompleted, setShowCompleted] = useState(false);

  // find and set today's tasks
  const todayTasks = allTasks.filter(
    (task) => new Date(task.dueDate) <= new Date()
  );
  // find and set next 7 days' tasks
  const sevenDaysLater = new Date();
  sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);
  const next7DaysTasks = allTasks.filter(
    (task) => new Date(task.dueDate) <= sevenDaysLater
  );
  // find existing tasks, completed tasks and deleted tasks
  const allExistingTasks = allTasks.filter((task) => !task.deleted);
  const completedTasks = allTasks.filter((task) => task.completed);
  const deletedTasks = allTasks.filter((task) => task.deleted);

  // compute the tasktoShow from props
  const tasksToShow =
    listToShow === "today"
      ? todayTasks
      : listToShow === "next7Days"
      ? next7DaysTasks
      : listToShow === "all"
      ? allExistingTasks
      : listToShow === "completed"
      ? completedTasks
      : listToShow === "deleted"
      ? deletedTasks
      : allTasks.filter(
          (task) => task.listName === listToShow && !task.deleted
        );

  const incompletedTasks = tasksToShow.filter((task) => !task.completed);
  const completedTasksInList = tasksToShow.filter((task) => task.completed);

  const handleCheck = async (task) => {
    const newTask = { ...task, completed: !task.completed };
    await taskService.updateTask(task.id, newTask, token);

    // update allTasks state
    const newAllTasks = allTasks.map((t) => (t.id === task.id ? newTask : t));
    setAllTasks(newAllTasks);
  };
  return (
    <List dense sx={{ mt: "0.5em" }}>
      {incompletedTasks.map((task) => (
        <ListItem key={task.id}>
          <ListItemButton
            selected={selectedTask?.id === task.id}
            onClick={() => setSelectedTask(task)}
          >
            <ListItemIcon>
              <Checkbox
                checked={task.completed}
                onChange={() => handleCheck(task)}
                inputProps={{
                  "aria-label": "Checkbox for task completion",
                }}
              ></Checkbox>
            </ListItemIcon>
            <ListItemText
              primary={task.taskName}
              secondary={`due on ${new Date(
                task.dueDate
              ).toLocaleDateString()}`}
            ></ListItemText>
          </ListItemButton>
        </ListItem>
      ))}

      {listToShow !== "completed" && (
        <ListItem>
          <ListItemButton onClick={() => setShowCompleted(!showCompleted)}>
            <ListItemIcon>
              {showCompleted ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItemIcon>
            <ListItemText primary="Completed"></ListItemText>
          </ListItemButton>
        </ListItem>
      )}

      <Collapse in={showCompleted}>
        {completedTasksInList.map((task) => (
          <ListItem key={task.id}>
            <ListItemButton
              selected={selectedTask?.id === task.id}
              onClick={() => setSelectedTask(task)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={task.completed}
                  onChange={() => handleCheck(task)}
                  inputProps={{
                    "aria-label": "Checkbox for task completion",
                  }}
                ></Checkbox>
              </ListItemIcon>
              <ListItemText
                primary={task.taskName}
                secondary={`due on ${new Date(
                  task.dueDate
                ).toLocaleDateString()}`}
              ></ListItemText>
            </ListItemButton>
          </ListItem>
        ))}
      </Collapse>
    </List>
  );
}

export default TaskItems;
