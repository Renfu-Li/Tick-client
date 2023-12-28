import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import TodayIcon from "@mui/icons-material/Today";
import ViewWeekIcon from "@mui/icons-material/ViewWeek";
import InboxIcon from "@mui/icons-material/Inbox";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Button,
  Collapse,
  Divider,
  IconButton,
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
  const [selectedList, setSelectedList] = useState("Today");
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
    <List
      dense
      sx={{
        borderLeft: 0.5,
        borderRight: 0.5,
        borderColor: "lightgray",
        height: "100%",
        minWidth: "280px",
        paddingY: "8px",
        display: "inline-block",
      }}
    >
      <ListItem>
        <ListItemButton
          selected={selectedList === "Today"}
          onClick={() => handleSelect("Today")}
          sx={{ borderRadius: 1.5 }}
        >
          <ListItemIcon>
            <TodayIcon></TodayIcon>
          </ListItemIcon>
          <ListItemText primary="Today"></ListItemText>
        </ListItemButton>
      </ListItem>

      <ListItem>
        <ListItemButton
          selected={selectedList === "Next 7 Days"}
          onClick={() => handleSelect("Next 7 Days")}
          sx={{ borderRadius: 1.5 }}
        >
          <ListItemIcon>
            <ViewWeekIcon></ViewWeekIcon>
          </ListItemIcon>
          <ListItemText primary="Next 7 days"></ListItemText>
        </ListItemButton>
      </ListItem>

      <ListItem>
        <ListItemButton
          selected={selectedList === "All"}
          onClick={() => handleSelect("All")}
          sx={{ borderRadius: 1.5 }}
        >
          <ListItemIcon>
            <InboxIcon></InboxIcon>
          </ListItemIcon>
          <ListItemText primary="All"></ListItemText>
        </ListItemButton>
      </ListItem>

      <Divider variant="middle" sx={{ paddingY: "4px" }}></Divider>

      <ListItem>
        <ListItemButton
          onClick={() => setListAddition(!listAddition)}
          sx={{ borderRadius: 1.5 }}
        >
          <ListItemText secondary="Lists"></ListItemText>
          <ListItemIcon>
            <AddIcon fontSize="small"></AddIcon>
          </ListItemIcon>
        </ListItemButton>
      </ListItem>

      <ListItem sx={{ paddingY: 0 }}>
        <Collapse in={listAddition}>
          <Stack spacing={1} direction="row">
            <TextField
              size="small"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              fullWidth
            ></TextField>

            <IconButton variant="outlined" onClick={handleAddList}>
              <AddCircleOutlineOutlinedIcon></AddCircleOutlineOutlinedIcon>
            </IconButton>
          </Stack>
        </Collapse>
      </ListItem>

      {allLists.map((list) => (
        <ListItem key={list.id}>
          <ListItemButton
            selected={selectedList === list.listName}
            onClick={() => handleSelect(list.listName)}
            sx={{ borderRadius: 1.5 }}
          >
            <ListItemIcon>
              <MenuIcon></MenuIcon>
            </ListItemIcon>
            <ListItemText primary={list.listName}></ListItemText>
          </ListItemButton>
        </ListItem>
      ))}

      <Divider variant="middle" sx={{ paddingY: "4px" }}></Divider>

      <ListItem>
        <ListItemButton
          selected={selectedList === "Completed"}
          onClick={() => handleSelect("Completed")}
          sx={{ borderRadius: 1.5 }}
        >
          <ListItemIcon>
            <CheckBoxIcon></CheckBoxIcon>
          </ListItemIcon>
          <ListItemText primary="Completed"></ListItemText>
        </ListItemButton>
      </ListItem>
      <ListItem>
        <ListItemButton
          selected={selectedList === "Trash"}
          onClick={() => handleSelect("Trash")}
          sx={{ borderRadius: 1.5 }}
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
