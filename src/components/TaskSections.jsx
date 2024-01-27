import { List } from "@mui/material";
import taskService from "../services/taskService";
import listService from "../services/listService";
import TaskItems from "./TaskItems";
import { useDispatch, useSelector } from "react-redux";
import { updateTask } from "../reducers/taskReducer";
import { updateList } from "../reducers/listReducer";

import {
  removeNotification,
  setNotification,
} from "../reducers/notificationReducer";
import { useMemo } from "react";

function TaskSections({ listToShow, selectedTask, setSelectedTask }) {
  const tomorrow = useMemo(() => {
    let date = new Date();
    date.setDate(date.getDate() + 1);
    date.setHours(0, 0, 0, 0);

    return date;
  }, []);

  const dispatch = useDispatch();
  const allTasks = useSelector((state) => state.allTasks);
  const allLists = useSelector((state) => state.allLists);
  const token = useSelector((state) => state.token);

  // find existing and removed tasks
  const allExistingTasks = useMemo(
    () => allTasks.filter((task) => !task.removed),
    [allTasks]
  );

  const removedTasks = useMemo(
    () => allTasks.filter((task) => task.removed),
    [allTasks]
  );

  // find and set today's tasks
  const todayTasks = useMemo(
    () => allExistingTasks.filter((task) => new Date(task.dueDate) < tomorrow),
    [allExistingTasks, tomorrow]
  );

  // find and set next 7 days' tasks
  const sevenDaysLater = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    date.setHours(0, 0, 0, 0);

    return date;
  }, []);

  const next7DaysTasks = useMemo(
    () =>
      allExistingTasks.filter(
        (task) => new Date(task.dueDate) < sevenDaysLater
      ),
    [allExistingTasks, sevenDaysLater]
  );

  // find existing tasks, completed tasks and removed tasks
  const completedTasks = useMemo(
    () => allExistingTasks.filter((task) => task.completed),
    [allExistingTasks]
  );

  // compute the tasktoShow from props
  const unsortedTasks =
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

  const tasksToShow = useMemo(
    () =>
      [...unsortedTasks].sort(
        (task1, task2) => new Date(task1.dueDate) - new Date(task2.dueDate)
      ),
    [unsortedTasks]
  );

  const uncompletedTasksInList = useMemo(
    () => tasksToShow.filter((task) => !task.completed),
    [tasksToShow]
  );

  const completedTasksInList = useMemo(
    () => tasksToShow.filter((task) => task.completed),
    [tasksToShow]
  );

  const handleCheck = async (task) => {
    const newTask = { ...task, completed: !task.completed };

    try {
      const updatedTask = await taskService.updateTask(task.id, newTask, token);

      // update allTasks state
      dispatch(updateTask(updatedTask));

      const listToUpdate = allLists.find(
        (list) => list.listName === task.listName
      );
      const newList = task.completed
        ? { ...listToUpdate, count: listToUpdate.count + 1 }
        : { ...listToUpdate, count: listToUpdate.count - 1 };

      // update count in List collection
      const updatedList = await listService.updateList(token, newList);

      // update task counts in allLists state
      dispatch(updateList(updatedList));
    } catch (error) {
      dispatch(setNotification(`Error: ${error.message}`));
      setTimeout(() => {
        dispatch(removeNotification());
      }, 3000);
    }
  };

  return (
    <List dense sx={{ mt: "0.5em", p: 0, overflow: "auto" }}>
      <TaskItems
        sectionName={listToShow === "Trash" ? "Uncompleted" : "Ongoing"}
        tasks={uncompletedTasksInList}
        selectedTask={selectedTask}
        setSelectedTask={setSelectedTask}
        handleCheck={handleCheck}
        listToShow={listToShow}
        initialOpen={true}
      ></TaskItems>

      <TaskItems
        sectionName="Completed"
        tasks={completedTasksInList}
        selectedTask={selectedTask}
        setSelectedTask={setSelectedTask}
        handleCheck={handleCheck}
        listToShow={listToShow}
        initialOpen={listToShow === "Completed" ? true : false}
      ></TaskItems>
    </List>
  );
}

export default TaskSections;
