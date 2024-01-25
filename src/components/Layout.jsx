import { Stack } from "@mui/material";
import { Outlet } from "react-router-dom";
import Notification from "./Notification";
import Sidebar from "./SideBar";

export default function Layout() {
  return (
    <Stack direction="row" height="100vh">
      <Sidebar></Sidebar>

      <Notification></Notification>

      <Outlet></Outlet>
    </Stack>
  );
}
