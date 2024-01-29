import TodayIcon from "@mui/icons-material/Today";
import ViewWeekIcon from "@mui/icons-material/ViewWeek";
import InboxIcon from "@mui/icons-material/Inbox";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import DeleteIcon from "@mui/icons-material/Delete";

import { ListItem, ListItemButton, Stack, Typography } from "@mui/material";

function SingleListItem({ listName, selected, handleSelectList }) {
  const listIcon = () => {
    switch (listName) {
      case "Today":
        return <TodayIcon color="action" sx={{ mr: "0.3em" }} />;
      case "Next 7 Days":
        return <ViewWeekIcon color="action" sx={{ mr: "0.3em" }} />;
      case "All":
        return <InboxIcon color="action" sx={{ mr: "0.3em" }} />;
      case "Completed":
        return <CheckBoxIcon color="action" sx={{ mr: "0.3em" }} />;
      case "Trash":
        return <DeleteIcon color="action" sx={{ mr: "0.3em" }} />;
      default:
        return null;
    }
  };

  return (
    <ListItem>
      <ListItemButton
        selected={selected}
        onClick={() => handleSelectList(listName)}
        sx={{ borderRadius: 1.5 }}
      >
        <Stack
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          width="100%"
          paddingRight="0.5em"
        >
          {listIcon()}
          <Typography fontSize="0.9em">{listName}</Typography>
        </Stack>
      </ListItemButton>
    </ListItem>
  );
}

export default SingleListItem;
