import Home from "./pages/Home.jsx";
import { Route, Routes } from "react-router-dom";
import User from "./pages/User.jsx";
import CalendarView from "./pages/CalendarView.jsx";
import { useEffect, useState } from "react";

function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setToken(token);
    }
  }, []);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={<User token={token} setToken={setToken}></User>}
        ></Route>
        <Route
          path="/home"
          element={<Home token={token} setToken={setToken}></Home>}
        ></Route>
        <Route path="/calendar" element={<CalendarView></CalendarView>}></Route>
      </Routes>
    </>
  );
}

export default App;
