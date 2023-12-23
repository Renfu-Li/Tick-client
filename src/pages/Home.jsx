import { Grid } from "@mui/material";

import Lists from "../components/Lists";
import Tasks from "../components/Tasks";
import TaskDetails from "../components/TaskDetails";
import SideBar from "../components/SideBar";
import taskService from "../services/taskService";
import { useEffect, useState } from "react";
import listService from "../services/listService";
import TaskForm from "../components/TaskForm";

export default function Home({ token, setToken }) {
  const [allTasks, setAllTasks] = useState([]);
  const [allLists, setAllLists] = useState([]);
  const [listToShow, setListToShow] = useState("today");

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
          setAllLists(lists);
        })
        .catch((error) => {
          console.log("error from listService in Home: ", error.message);
        });
    }
  }, [token]);

  return (
    <Grid container>
      <Grid item xs={1}>
        <SideBar setToken={setToken}></SideBar>
      </Grid>
      <Grid item xs={3}>
        <Lists
          allLists={allLists}
          setAllLists={setAllLists}
          setListToShow={setListToShow}
          token={token}
        ></Lists>
      </Grid>
      <Grid item xs={4}>
        <TaskForm
          allTasks={allTasks}
          setAllTasks={setAllTasks}
          allLists={allLists}
          setAllLists={setAllLists}
          token={token}
        ></TaskForm>
        <Tasks
          listToShow={listToShow}
          token={token}
          allTasks={allTasks}
          setAllTasks={setAllTasks}
          allLists={allLists}
          setAllLists={setAllLists}
        ></Tasks>
      </Grid>
      <Grid item xs={4}>
        <TaskDetails></TaskDetails>
      </Grid>
    </Grid>
  );
}
