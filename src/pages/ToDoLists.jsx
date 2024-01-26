import { Grid, Stack } from "@mui/material";

import Lists from "../components/Lists";
import Tasks from "../components/Tasks";
import { useEffect, useState } from "react";
import TaskDetails from "../components/TaskDetails";

export default function ToDoLists({ token }) {
  const [listToShow, setListToShow] = useState("Today");
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => setSelectedTask(null), [listToShow]);

  return (
    <Stack direction="row" height="100%" width="100%" boxSizing="border-box">
      <Lists setListToShow={setListToShow} token={token}></Lists>

      <Grid container sx={{ height: "100%" }} justifyContent="space-evenly">
        <Grid item xs={6} sx={{ height: "100%" }}>
          <Tasks
            listToShow={listToShow}
            token={token}
            selectedTask={selectedTask}
            setSelectedTask={setSelectedTask}
          ></Tasks>
        </Grid>
        <Grid item xs={6} sx={{ height: "100%" }} paddingTop="0.8em">
          <TaskDetails
            token={token}
            listToShow={listToShow}
            selectedTask={selectedTask}
            setSelectedTask={setSelectedTask}
          ></TaskDetails>
        </Grid>
      </Grid>
    </Stack>
  );
}
