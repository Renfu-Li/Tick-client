import { Typography, Box } from "@mui/material";
import TaskForm from "./TaskForm";
import TaskSections from "./TaskSections";

function Tasks({
  token,
  listToShow,
  allTasks,
  setAllTasks,
  allLists,
  setAllLists,
  selectedTask,
  setSelectedTask,
}) {
  return (
    <Box
      paddingX="16px"
      overflow="auto"
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
          setAllLists={setAllLists}
          listToShow={listToShow}
          token={token}
        ></TaskForm>
      )}

      <TaskSections
        token={token}
        listToShow={listToShow}
        allTasks={allTasks}
        setAllTasks={setAllTasks}
        allLists={allLists}
        setAllLists={setAllLists}
        selectedTask={selectedTask}
        setSelectedTask={setSelectedTask}
      ></TaskSections>
    </Box>
  );
}

export default Tasks;
