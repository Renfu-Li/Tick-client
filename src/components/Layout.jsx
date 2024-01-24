import { Stack } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "./SideBar";

export default function Layout() {
  return (
    <Stack direction="row" height="100vh">
      <Sidebar></Sidebar>

      <Outlet></Outlet>
    </Stack>
  );
}
