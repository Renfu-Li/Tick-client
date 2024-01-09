import { Grid, Stack } from "@mui/material";

import Lists from "../components/Lists";
import Tasks from "../components/Tasks";
import { useEffect, useState } from "react";
import TaskDetails from "../components/TaskDetails";

export default function ToDoLists({
  token,
  allTasks,
  setAllTasks,
  allLists,
  setAllLists,
}) {
  const [listToShow, setListToShow] = useState("Today");
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => setSelectedTask(null), [listToShow]);

  return (
    <Stack direction="row" height="100vh">
      {/* <SideBar setToken={setToken}></SideBar> */}

      <Lists
        allLists={allLists}
        setAllLists={setAllLists}
        setListToShow={setListToShow}
        token={token}
      ></Lists>

      <Grid container sx={{ height: "100vh" }}>
        <Grid item xs={6} sx={{ height: "100vh" }}>
          <Tasks
            listToShow={listToShow}
            token={token}
            allTasks={allTasks}
            setAllTasks={setAllTasks}
            allLists={allLists}
            setAllLists={setAllLists}
            selectedTask={selectedTask}
            setSelectedTask={setSelectedTask}
          ></Tasks>
        </Grid>
        <Grid item xs={6} sx={{ height: "100vh" }}>
          <TaskDetails
            token={token}
            listToShow={listToShow}
            selectedTask={selectedTask}
            setSelectedTask={setSelectedTask}
            allTasks={allTasks}
            setAllTasks={setAllTasks}
            allLists={allLists}
            setAllLists={setAllLists}
          ></TaskDetails>
        </Grid>
      </Grid>
    </Stack>
  );
}
