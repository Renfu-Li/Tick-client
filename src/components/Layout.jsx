import { Stack } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "./SideBar";

export default function Layout({ setToken }) {
  return (
    <Stack
      direction="row"
      height="100vh"
      // justifyContent="center"
      // alignItems="center"
      // position="relative"
    >
      <Sidebar setToken={setToken}></Sidebar>

      <Outlet></Outlet>
    </Stack>
  );
}
