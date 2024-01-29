import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";

import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";

import {
  Collapse,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import SingleListItem from "./SingleListItem";
import { useState } from "react";
import listService from "../services/listService";
import { useDispatch, useSelector } from "react-redux";
import { createList } from "../reducers/listReducer";

import {
  removeNotification,
  setNotification,
} from "../reducers/notificationReducer";

function Lists({ setListToShow }) {
  const [selectedList, setSelectedList] = useState("Today");
  const [listAddition, setListAddition] = useState(false);
  const [listName, setListName] = useState("");

  const dispatch = useDispatch();
  const allLists = useSelector((state) => state.allLists);
  const token = useSelector((state) => state.token);

  const handleSelect = (listName) => {
    setSelectedList(listName);
    setListToShow(listName);
  };

  const handleAddList = async () => {
    setListAddition(false);
    try {
      const createdList = await listService.createList(token, listName);
      dispatch(createList(createdList));

      setListName("");
    } catch (error) {
      dispatch(setNotification(`Error: ${error.message}`));
      setTimeout(() => {
        dispatch(removeNotification());
      }, 3000);
    }
  };

  return (
    <List
      dense
      sx={{
        borderRight: 0.5,
        borderColor: "lightgray",
        height: "100%",
        minWidth: "250px",
        paddingTop: "0.8em",
        paddingBottom: 0,
        display: "inline-block",
        overflow: "auto",
        boxSizing: "border-box",
      }}
    >
      <SingleListItem
        listName="Today"
        selected={selectedList === "Today"}
        handleSelectList={handleSelect}
      />

      <SingleListItem
        listName="Next 7 Days"
        selected={selectedList === "Next 7 Days"}
        handleSelectList={handleSelect}
      />

      <SingleListItem
        listName="All"
        selected={selectedList === "All"}
        handleSelectList={handleSelect}
      />

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

            <Tooltip title="Add a new list">
              <AddIcon color="action"></AddIcon>
            </Tooltip>
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

            <Tooltip title="Confirm to create">
              <IconButton
                variant="outlined"
                onClick={handleAddList}
                sx={{ paddingLeft: "0.2em" }}
                data-cy="add-list-button"
              >
                <AddCircleOutlineOutlinedIcon></AddCircleOutlineOutlinedIcon>
              </IconButton>
            </Tooltip>
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

      <SingleListItem
        listName="Completed"
        selected={selectedList === "Completed"}
        handleSelectList={handleSelect}
      />

      <SingleListItem
        listName="Trash"
        selected={selectedList === "Trash"}
        handleSelectList={handleSelect}
      />
    </List>
  );
}

export default Lists;
