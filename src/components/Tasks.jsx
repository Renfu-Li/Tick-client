import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import {
  Checkbox,
  Collapse,
  List,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Grid,
} from "@mui/material";
// import { useState, useEffect } from "react";
import taskService from "../services/taskService";
import TaskDetails from "./TaskDetails";
import TaskForm from "./TaskForm";
import { useState } from "react";
// import AddCircle from "@mui/icons-material/AddCircle";

function Tasks({
  token,
  listToShow,
  allTasks,
  setAllTasks,
  allLists,
  setAllLists,
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

  // compute the tasktoShow from props
  const tasksToShow =
    listToShow === "today"
      ? todayTasks
      : listToShow === "next7Days"
      ? next7DaysTasks
      : listToShow === "all"
      ? allTasks
      : allLists.find((list) => list.listName === listToShow).tasks;

  const incompletedTasks = tasksToShow.filter((task) => !task.completed);
  const completedTasks = tasksToShow.filter((task) => task.completed);

  const [selectedTaskId, setSelectedTaskId] = useState(
    incompletedTasks[0]?.id || null
  );

  const handleCheck = async (task) => {
    const newTask = { ...task, completed: !task.completed };
    await taskService.updateTask(task.id, newTask, token);

    // update allTasks state
    const newAllTasks = allTasks.map((t) => (t.id === task.id ? newTask : t));
    setAllTasks(newAllTasks);

    // update allLists state
    const listToUpdate = allLists.find(
      (list) => list.listName === task.listName
    );
    const newListTasks = listToUpdate.tasks.map((t) =>
      t.id === task.id ? newTask : t
    );
    const updatedList = { ...listToUpdate, tasks: newListTasks };
    const newAllLists = allLists.map((list) =>
      list.listName === task.listName ? updatedList : list
    );
    setAllLists(newAllLists);
  };

  return (
    <Grid container justifyContent="space-evenly">
      <Grid item xs={6}>
        <TaskForm
          allTasks={allTasks}
          setAllTasks={setAllTasks}
          allLists={allLists}
          setAllLists={setAllLists}
          token={token}
        ></TaskForm>

        <List dense>
          {/* <ListItemButton>
          <ListItemText primary="Tasks"></ListItemText>
        </ListItemButton> */}

          {incompletedTasks.map((task) => (
            <ListItemButton
              key={task.id}
              selected={selectedTaskId === task.id}
              onClick={() => setSelectedTaskId(task.id)}
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
          ))}

          <ListItemButton onClick={() => setShowCompleted(!showCompleted)}>
            <ListItemIcon>
              {showCompleted ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItemIcon>
            <ListItemText primary="Completed"></ListItemText>
          </ListItemButton>

          <Collapse in={showCompleted}>
            {completedTasks.map((task) => (
              <ListItemButton
                key={task.id}
                selected={selectedTaskId === task.id}
                onClick={() => setSelectedTaskId(task.id)}
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
            ))}
          </Collapse>
        </List>
      </Grid>

      <Grid item xs={6}>
        <TaskDetails></TaskDetails>
      </Grid>
    </Grid>
  );
}

export default Tasks;
