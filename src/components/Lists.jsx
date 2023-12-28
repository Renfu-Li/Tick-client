import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import TodayIcon from "@mui/icons-material/Today";
import ViewWeekIcon from "@mui/icons-material/ViewWeek";
import InboxIcon from "@mui/icons-material/Inbox";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import DeleteIcon from "@mui/icons-material/Delete";
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
import CheckBox from "@mui/icons-material/CheckBox";

function Lists({ allLists, setAllLists, setListToShow, token }) {
  const [selectedList, setSelectedList] = useState("today");
  const [listAddition, setListAddition] = useState(false);
  const [listName, setListName] = useState("");

  const handleSelect = (listName) => {
    setSelectedList(listName);
    setListToShow(listName);
  };

  const handleAddList = async () => {
    setListAddition(false);
    const updatedAllLists = await listService.createList(token, listName);
    setAllLists(updatedAllLists);

    setListName("");
  };

  // console.log(allLists);

  return (
    <List dense>
      <ListItem>
        <ListItemButton
          selected={selectedList === "today"}
          onClick={() => handleSelect("today")}
        >
          <ListItemIcon>
            <TodayIcon></TodayIcon>
          </ListItemIcon>
          <ListItemText primary="Today"></ListItemText>
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
          <ListItemText primary="Next 7 days"></ListItemText>
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
          <ListItemText primary="All"></ListItemText>
        </ListItemButton>
      </ListItem>

      <Divider variant="middle"></Divider>

      <ListItem>
        <ListItemButton onClick={() => setListAddition(!listAddition)}>
          <ListItemText primary="Lists"></ListItemText>
          <ListItemIcon>
            <AddIcon fontSize="small"></AddIcon>
          </ListItemIcon>
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
        <ListItem key={list.id}>
          <ListItemButton
            selected={selectedList === list.listName}
            onClick={() => handleSelect(list.listName)}
          >
            <ListItemIcon>
              <MenuIcon></MenuIcon>
            </ListItemIcon>
            <ListItemText primary={list.listName}></ListItemText>
          </ListItemButton>
        </ListItem>
      ))}

      <Divider variant="middle"></Divider>

      <ListItem>
        <ListItemButton
          selected={selectedList === "completed"}
          onClick={() => handleSelect("completed")}
        >
          <ListItemIcon>
            <CheckBoxIcon></CheckBoxIcon>
          </ListItemIcon>
          <ListItemText primary="Completed"></ListItemText>
        </ListItemButton>
      </ListItem>
      <ListItem>
        <ListItemButton
          selected={selectedList === "deleted"}
          onClick={() => handleSelect("deleted")}
        >
          <ListItemIcon>
            <DeleteIcon></DeleteIcon>
          </ListItemIcon>
          <ListItemText primary="Trash"></ListItemText>
        </ListItemButton>
      </ListItem>
    </List>
  );
}

export default Lists;
