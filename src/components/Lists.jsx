import TodayIcon from "@mui/icons-material/Today";
import ViewWeekIcon from "@mui/icons-material/ViewWeek";
import InboxIcon from "@mui/icons-material/Inbox";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Collapse,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import listService from "../services/listService";

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
    const createdList = await listService.createList(token, listName);
    const updatedAllLists = allLists.concat(createdList);
    setAllLists(updatedAllLists);

    setListName("");
  };

  return (
    <List
      dense
      sx={{
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
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
            paddingRight="0.5em"
          >
            <Stack direction="row" alignItems="center">
              <TodayIcon color="action" sx={{ mr: "0.3em" }}></TodayIcon>
              <Typography fontSize="0.9em">Today</Typography>
            </Stack>

            {/* <Typography fontSize="0.8em" color="grey">
              3
            </Typography> */}
          </Stack>
        </ListItemButton>
      </ListItem>

      <ListItem>
        <ListItemButton
          selected={selectedList === "Next 7 Days"}
          onClick={() => handleSelect("Next 7 Days")}
          sx={{ borderRadius: 1.5 }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
            paddingRight="0.5em"
          >
            <Stack direction="row" alignItems="center">
              <ViewWeekIcon color="action" sx={{ mr: "0.3em" }}></ViewWeekIcon>
              <Typography fontSize="0.9em">Next 7 Days</Typography>
            </Stack>

            {/* <Typography fontSize="0.8em" color="grey">
              3
            </Typography> */}
          </Stack>
        </ListItemButton>
      </ListItem>

      <ListItem>
        <ListItemButton
          selected={selectedList === "All"}
          onClick={() => handleSelect("All")}
          sx={{ borderRadius: 1.5 }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
            paddingRight="0.5em"
          >
            <Stack direction="row" alignItems="center">
              <InboxIcon color="action" sx={{ mr: "0.3em" }}></InboxIcon>
              <Typography fontSize="0.9em">All</Typography>
            </Stack>

            {/* <Typography fontSize="0.8em" color="grey">
              3
            </Typography> */}
          </Stack>
        </ListItemButton>
      </ListItem>

      <Divider variant="middle" sx={{ paddingY: "4px" }}></Divider>

      <ListItem>
        <ListItemButton
          onClick={() => setListAddition(!listAddition)}
          sx={{ borderRadius: 1.5 }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
          >
            <Typography fontSize="0.9em">Lists</Typography>

            <AddIcon color="action"></AddIcon>
          </Stack>
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
              data-cy="new-list-input"
            ></TextField>

            <IconButton
              variant="outlined"
              onClick={handleAddList}
              sx={{ paddingLeft: "0.2em" }}
              data-cy="add-list-button"
            >
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
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              width="100%"
              paddingRight="0.5em"
            >
              <Stack direction="row" alignItems="center">
                <MenuIcon color="action" sx={{ mr: "0.3em" }}></MenuIcon>
                <Typography data-cy="listName-in-Lists" fontSize="0.9em">
                  {list.listName}
                </Typography>
              </Stack>

              <Typography fontSize="0.8em" color="grey">
                {list.count}
              </Typography>
            </Stack>
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
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
            paddingRight="0.5em"
          >
            <Stack direction="row" alignItems="center">
              <CheckBoxIcon color="action" sx={{ mr: "0.3em" }}></CheckBoxIcon>
              <Typography fontSize="0.9em">Completed</Typography>
            </Stack>

            {/* <Typography fontSize="0.8em" color="grey">
              3
            </Typography> */}
          </Stack>
        </ListItemButton>
      </ListItem>

      <ListItem>
        <ListItemButton
          selected={selectedList === "Trash"}
          onClick={() => handleSelect("Trash")}
          sx={{ borderRadius: 1.5 }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
            paddingRight="0.5em"
          >
            <Stack direction="row" alignItems="center">
              <DeleteIcon color="action" sx={{ mr: "0.3em" }}></DeleteIcon>
              <Typography fontSize="0.9em">Trash</Typography>
            </Stack>

            {/* <Typography fontSize="0.8em" color="grey">
              3
            </Typography> */}
          </Stack>
        </ListItemButton>
      </ListItem>
    </List>
  );
}

export default Lists;
