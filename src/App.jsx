import ToDoLists from "./pages/ToDoLists.jsx";
import { Route, Routes } from "react-router-dom";
import User from "./pages/User.jsx";
import CalendarView from "./pages/CalendarView.jsx";
import Layout from "./components/Layout.jsx";
import { useEffect } from "react";
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

import { useDispatch, useSelector } from "react-redux";
import { setTasks } from "./reducers/taskReducer.js";
import { setLists } from "./reducers/listReducer.js";
import { setFocuses } from "./reducers/focusReducer.js";
import { setToken } from "./reducers/tokenReducer.js";

function App() {
  const dispatch = useDispatch();
  const allFocuses = useSelector((state) => state.allFocuses);
  const token = useSelector((state) => state.token);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      dispatch(setToken(token));
    }
  }, [dispatch]);

  useEffect(() => {
    if (token) {
      // get all tasks
      taskService
        .getAllTasks(token)
        .then((tasks) => {
          dispatch(setTasks(tasks));
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

          dispatch(setLists(listInfo));
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

          dispatch(setFocuses(initialFocuses));
        })
        .catch((error) => {
          console.log(
            "error from focusService in App component: ",
            error.message
          );
        });
    }
  }, [token, dispatch]);

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
        <Route path="/" element={<User></User>}></Route>

        <Route element={<Layout></Layout>}>
          <Route path="/lists" element={<ToDoLists></ToDoLists>}></Route>
          <Route
            path="/calendar"
            element={<CalendarView></CalendarView>}
          ></Route>
          <Route
            path="/focus"
            element={<Focus allRecords={allRecords}></Focus>}
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
