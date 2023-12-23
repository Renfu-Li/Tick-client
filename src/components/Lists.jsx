import TodayIcon from "@mui/icons-material/Today";
import ViewWeekIcon from "@mui/icons-material/ViewWeek";
import InboxIcon from "@mui/icons-material/Inbox";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import {
  Button,
  Collapse,
  Divider,
  // IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import listService from "../services/listService";

export default function Lists({ allLists, setAllLists, setListToShow, token }) {
  const [selectedList, setSelectedList] = useState("today");
  const [listAddition, setListAddition] = useState(false);
  const [listName, setListName] = useState("");

  const handleSelect = (listName) => {
    setSelectedList(listName);
    setListToShow(listName);
  };

  const handleAddList = async () => {
    setListAddition(false);
    setListName("");
    const updatedAllLists = await listService.createList(token, listName);
    setAllLists(updatedAllLists);
  };

  return (
    <>
      <List dense>
        <ListItem>
          <ListItemButton
            selected={selectedList === "today"}
            onClick={() => handleSelect("today")}
          >
            <ListItemIcon>
              <TodayIcon></TodayIcon>
            </ListItemIcon>
            <ListItemText>Today</ListItemText>
          </ListItemButton>
        </ListItem>

        <ListItem>
          <ListItemButton
            selected={selectedList === "next7Days"}
            onClick={() => handleSelect("next7Days")}
          >
            <ListItemIcon>
              <ViewWeekIcon></ViewWeekIcon>
            </ListItemIcon>
            <ListItemText>Next 7 days</ListItemText>
          </ListItemButton>
        </ListItem>

        <ListItem>
          <ListItemButton
            selected={selectedList === "all"}
            onClick={() => handleSelect("all")}
          >
            <ListItemIcon>
              <InboxIcon></InboxIcon>
            </ListItemIcon>
            <ListItemText>All</ListItemText>
          </ListItemButton>
        </ListItem>
      </List>

      <Divider></Divider>

      <List dense>
        <ListItem>
          <ListItemButton onClick={() => setListAddition(!listAddition)}>
            <ListItemText>
              <Typography>Lists</Typography>
            </ListItemText>

            <AddIcon fontSize="small"></AddIcon>
          </ListItemButton>
        </ListItem>

        <ListItem>
          <Collapse in={listAddition}>
            <Stack spacing={1} direction="row">
              <TextField
                size="small"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
              ></TextField>

              <Button variant="contained" onClick={handleAddList}>
                Add
              </Button>
            </Stack>
          </Collapse>
        </ListItem>

        {allLists.map((list) => (
          <ListItem key={list._id}>
            <ListItemButton
              selected={selectedList === list.listName}
              onClick={() => handleSelect(list.listName)}
            >
              <ListItemIcon>
                <MenuIcon></MenuIcon>
              </ListItemIcon>
              <ListItemText>
                <Typography>{list.listName}</Typography>
              </ListItemText>
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider></Divider>
    </>
  );
}
