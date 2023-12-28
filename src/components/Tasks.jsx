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
  ListItem,
} from "@mui/material";
// import { useState, useEffect } from "react";
import taskService from "../services/taskService";
import TaskDetails from "./TaskDetails";
import TaskForm from "./TaskForm";
import { useEffect, useState } from "react";
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
  const allExistingTasks = allTasks.filter((task) => !task.deleted);
  const todayTasks = allTasks.filter(
    (task) => new Date(task.dueDate) <= new Date()
  );

  // find and set next 7 days' tasks
  const sevenDaysLater = new Date();
  sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);
  const next7DaysTasks = allTasks.filter(
    (task) => new Date(task.dueDate) <= sevenDaysLater
  );
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
  // console.log(incompletedTasks);

  const [selectedTask, setSelectedTask] = useState(null);

  const handleCheck = async (task) => {
    const newTask = { ...task, completed: !task.completed };
    await taskService.updateTask(task.id, newTask, token);

    // update allTasks state
    const newAllTasks = allTasks.map((t) => (t.id === task.id ? newTask : t));
    setAllTasks(newAllTasks);
  };

  // console.log(selectedTask);
  return (
    <Grid container justifyContent="space-evenly" spacing={2}>
      <Grid item xs={6}>
        <TaskForm
          allTasks={allTasks}
          setAllTasks={setAllTasks}
          allLists={allLists}
          setAllLists={setAllLists}
          token={token}
        ></TaskForm>

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
      </Grid>

      <Grid item xs={6}>
        <TaskDetails
          token={token}
          selectedTask={selectedTask}
          setSelectedTask={setSelectedTask}
          allTasks={allTasks}
          setAllTasks={setAllTasks}
          allLists={allLists}
          setAllLists={setAllLists}
        ></TaskDetails>
      </Grid>
    </Grid>
  );
}

export default Tasks;
