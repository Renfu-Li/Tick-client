import { List } from "@mui/material";
import taskService from "../services/taskService";
import listService from "../services/listService";
import TaskItems from "./TaskItems";
import { useDispatch, useSelector } from "react-redux";
import { updateTask } from "../reducers/taskReducer";
import { updateList } from "../reducers/listReducer";

function TaskSections({ token, listToShow, selectedTask, setSelectedTask }) {
  let tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const disPatch = useDispatch();
  const allTasks = useSelector((state) => state.allTasks);
  const allLists = useSelector((state) => state.allLists);

  // find existing and removed tasks
  const allExistingTasks = allTasks.filter((task) => !task.removed);
  const removedTasks = allTasks.filter((task) => task.removed);
  // find and set today's tasks
  const todayTasks = allExistingTasks.filter(
    (task) => new Date(task.dueDate) < tomorrow
  );
  // find and set next 7 days' tasks
  const sevenDaysLater = new Date();
  sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);
  sevenDaysLater.setHours(0, 0, 0, 0);
  const next7DaysTasks = allExistingTasks.filter(
    (task) => new Date(task.dueDate) < sevenDaysLater
  );
  // find existing tasks, completed tasks and removed tasks
  const completedTasks = allExistingTasks.filter((task) => task.completed);

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

  const tasksToShow = [...unsortedTasks].sort(
    (task1, task2) => new Date(task1.dueDate) - new Date(task2.dueDate)
  );

  const uncompletedTasksInList = tasksToShow.filter((task) => !task.completed);
  const completedTasksInList = tasksToShow.filter((task) => task.completed);

  const handleCheck = async (task) => {
    const newTask = { ...task, completed: !task.completed };
    const updatedTask = await taskService.updateTask(task.id, newTask, token);

    // update allTasks state
    disPatch(updateTask(updatedTask));

    const listToUpdate = allLists.find(
      (list) => list.listName === task.listName
    );
    const newList = task.completed
      ? { ...listToUpdate, count: listToUpdate.count + 1 }
      : { ...listToUpdate, count: listToUpdate.count - 1 };

    // update count in List collection
    const updatedList = await listService.updateList(token, newList);

    // update task counts in allLists state
    disPatch(updateList(updatedList));
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
