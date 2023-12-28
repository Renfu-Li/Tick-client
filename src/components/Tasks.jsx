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
  Box,
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
    <Box
      paddingX="16px"
      paddingY="8px"
      sx={{ borderRight: 0.5, borderColor: "lightgray", height: "100%" }}
    >
      <Typography ml={1.4} mb="0.5em" variant="h5">
        {listToShow}
      </Typography>

      {listToShow !== "Completed" && listToShow !== "Trash" && (
        <TaskForm
          allTasks={allTasks}
          setAllTasks={setAllTasks}
          allLists={allLists}
          listToShow={listToShow}
          token={token}
        ></TaskForm>
      )}

      <TaskItems
        token={token}
        listToShow={listToShow}
        allTasks={allTasks}
        setAllTasks={setAllTasks}
        selectedTask={selectedTask}
        setSelectedTask={setSelectedTask}
      ></TaskItems>
    </Box>
  );
}

export default Tasks;
