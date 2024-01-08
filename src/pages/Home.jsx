import { Grid, Stack } from "@mui/material";

import Lists from "../components/Lists";
import Tasks from "../components/Tasks";
import SideBar from "../components/SideBar";
import taskService from "../services/taskService";
import { useEffect, useState } from "react";
import listService from "../services/listService";
import TaskDetails from "../components/TaskDetails";

export default function Home({ token, setToken }) {
  const [allTasks, setAllTasks] = useState([]);
  const [allLists, setAllLists] = useState([]);
  const [listToShow, setListToShow] = useState("Today");
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    if (token) {
      // get all tasks
      taskService
        .getAllTasks(token)
        .then((tasks) => {
          setAllTasks(tasks);
        })
        .catch((error) => {
          console.log("error from taskService in Home: ", error.message);
        });

      // get all lists
      listService
        .getAllList(token)
        .then((lists) => {
          const listInfo = lists.map((list) => {
            return {
              listName: list.listName,
              id: list.id,
              count: list.count,
            };
          });

          setAllLists(listInfo);
        })
        .catch((error) => {
          console.log("error from listService in Home: ", error.message);
        });
    }
  }, [token]);

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
