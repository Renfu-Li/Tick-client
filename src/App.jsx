import ToDoLists from "./pages/ToDoLists.jsx";
import { Route, Routes } from "react-router-dom";
import User from "./pages/User.jsx";
import CalendarView from "./pages/CalendarView.jsx";
import SideBar from "./components/SideBar.jsx";
import { useEffect, useState } from "react";
import taskService from "./services/taskService.js";
import listService from "./services/listService.js";
import focusService from "./services/focusService.js";
import Focus from "./pages/Focus.jsx";
import Statistics from "./pages/Statistics.jsx";
import Loading from "./components/Loading.jsx";
import {
  getShortDateStr,
  getTimeStr,
  calcuDuration,
  getNumericDateStr,
} from "./helper.js";

function App() {
  const [token, setToken] = useState(null);
  const [allTasks, setAllTasks] = useState([]);
  const [allLists, setAllLists] = useState([]);
  const [allFocuses, setAllFocuses] = useState([]);

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
          console.log(
            "error from taskService in App component: ",
            error.message
          );
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
          console.log(
            "error from listService in App component: ",
            error.message
          );
        });

      // get all focuses
      focusService
        .getAllFocuses(token)
        .then((focuses) => {
          const initialFocuses = focuses.map((focus) => {
            return {
              ...focus,
              taskName: focus.task.taskName,
            };
          });

          setAllFocuses(initialFocuses);
        })
        .catch((error) => {
          console.log(
            "error from focusService in App component: ",
            error.message
          );
        });
    }
  }, [token]);

  const allRecords = allFocuses.map((focus) => {
    const focusDate = new Date(focus.start);
    focusDate.setHours(0, 0, 0, 0);

    return {
      id: focus.id,
      taskName: focus.taskName,
      date: focusDate,
      dateStr: getShortDateStr(focus.start),
      numericDateStr: getNumericDateStr(focus.start),
      startTime: getTimeStr(focus.start),
      endTime: getTimeStr(focus.end),
      durationStr: calcuDuration(focus.start, focus.end).durationStr,
      durationInMinutes: calcuDuration(focus.start, focus.end)
        .durationInMinutes,
    };
  });

  allRecords.sort((record1, record2) => record2.date - record1.date);

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
          <Route
            path="/focus"
            element={
              <Focus
                token={token}
                allTasks={allTasks}
                allRecords={allRecords}
                allFocuses={allFocuses}
                setAllFocuses={setAllFocuses}
              ></Focus>
            }
          ></Route>
          <Route
            path="/statistics"
            element={
              allRecords.length > 0 ? (
                <Statistics allRecords={allRecords}></Statistics>
              ) : (
                <Loading />
              )
            }
          ></Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
