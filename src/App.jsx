import ToDoLists from "./pages/ToDoLists.jsx";
import { Route, Routes } from "react-router-dom";
import User from "./pages/User.jsx";
import CalendarView from "./pages/CalendarView.jsx";
import SideBar from "./components/SideBar.jsx";
import { useEffect, useState } from "react";
import taskService from "./services/taskService.js";
import listService from "./services/listService.js";

function App() {
  const [token, setToken] = useState(null);
  const [allTasks, setAllTasks] = useState([]);
  const [allLists, setAllLists] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setToken(token);
    }
  }, []);

  useEffect(() => {
    if (token) {
      // get all tasks
      taskService
        .getAllTasks(token)
        .then((tasks) => {
          setAllTasks(tasks);
        })
        .catch((error) => {
          console.log("error from taskService in ToDoLists: ", error.message);
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
          console.log("error from listService in ToDoLists: ", error.message);
        });
    }
  }, [token]);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={<User token={token} setToken={setToken}></User>}
        ></Route>

        <Route element={<SideBar setToken={setToken}></SideBar>}>
          <Route
            path="/lists"
            element={
              <ToDoLists
                token={token}
                setToken={setToken}
                allTasks={allTasks}
                setAllTasks={setAllTasks}
                allLists={allLists}
                setAllLists={setAllLists}
              ></ToDoLists>
            }
          ></Route>
          <Route
            path="/calendar"
            element={
              <CalendarView
                token={token}
                setToken={setToken}
                allTasks={allTasks}
                setAllTasks={setAllTasks}
                allLists={allLists}
                setAllLists={setAllLists}
              ></CalendarView>
            }
          ></Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
