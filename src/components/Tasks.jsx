import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  Collapse,
  // FormControlLabel,
  // IconButton,
  Button,
} from "@mui/material";
// import { useState, useEffect } from "react";
import taskService from "../services/taskService";
import { useState } from "react";

export default function Tasks({
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
    <>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Status</TableCell>
            <TableCell>Task</TableCell>
            <TableCell>Due Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {incompletedTasks &&
            incompletedTasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>
                  <Checkbox
                    checked={task.completed}
                    onChange={() => handleCheck(task)}
                    inputProps={{
                      "aria-label": "Checkbox for task completion",
                    }}
                    size="small"
                  ></Checkbox>
                </TableCell>
                <TableCell>{task.taskName}</TableCell>

                <TableCell>
                  {new Date(task.dueDate).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <Button
        onClick={() => setShowCompleted(!showCompleted)}
        endIcon={showCompleted ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      >
        Completed
      </Button>
      <Collapse in={showCompleted}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell>Task</TableCell>
              <TableCell>Due Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {completedTasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>
                  <Checkbox
                    checked={task.completed}
                    onChange={() => handleCheck(task)}
                    inputProps={{
                      "aria-label": "Checkbox for task completion",
                    }}
                    size="small"
                  ></Checkbox>
                </TableCell>
                <TableCell>{task.taskName}</TableCell>

                <TableCell>
                  {new Date(task.dueDate).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Collapse>
    </>
  );
}
