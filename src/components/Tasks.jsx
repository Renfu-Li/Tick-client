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
  Typography,
} from "@mui/material";
// import { useState, useEffect } from "react";
import taskService from "../services/taskService";
import TaskDetails from "./TaskDetails";
import TaskForm from "./TaskForm";
import TaskItems from "./TaskItems";
import { useEffect, useState } from "react";
// import AddCircle from "@mui/icons-material/AddCircle";

function Tasks({
  token,
  listToShow,
  allTasks,
  setAllTasks,
  allLists,
  selectedTask,
  setSelectedTask,
}) {
  return (
    <>
      <Typography variant="h5">{listToShow}</Typography>
      <TaskForm
        allTasks={allTasks}
        setAllTasks={setAllTasks}
        allLists={allLists}
        token={token}
      ></TaskForm>

      <TaskItems
        token={token}
        listToShow={listToShow}
        allTasks={allTasks}
        setAllTasks={setAllTasks}
        selectedTask={selectedTask}
        setSelectedTask={setSelectedTask}
      ></TaskItems>
    </>
  );
}

export default Tasks;
