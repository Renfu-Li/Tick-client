import { Typography, Box } from "@mui/material";
import TaskForm from "./TaskForm";
import TaskSections from "./TaskSections";

function Tasks({ listToShow, selectedTask, setSelectedTask }) {
  return (
    <Box
      paddingX="16px"
      overflow="auto"
      sx={{ borderRight: 0.5, borderColor: "lightgray", height: "100%" }}
    >
      <Typography ml={1.4} mt="0.8em" mb="0.5em" variant="h5">
        {listToShow}
      </Typography>

      {listToShow !== "Completed" && listToShow !== "Trash" && (
        <TaskForm listToShow={listToShow}></TaskForm>
      )}

      <TaskSections
        listToShow={listToShow}
        selectedTask={selectedTask}
        setSelectedTask={setSelectedTask}
      ></TaskSections>
    </Box>
  );
}

export default Tasks;
