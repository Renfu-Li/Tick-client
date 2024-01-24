import { useEffect, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import {
  Checkbox,
  Collapse,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  ListItem,
  Stack,
  Typography,
} from "@mui/material";

function TaskItems({
  sectionName,
  tasks,
  selectedTask,
  setSelectedTask,
  handleCheck,
  listToShow,
  initialOpen,
}) {
  const [open, setOpen] = useState(initialOpen);

  useEffect(() => {
    setOpen(initialOpen);
  }, [initialOpen, listToShow]);

  const calDateDiff = (date) => {
    let today = new Date();
    today.setHours(0, 0, 0, 0);

    const formattedDate = new Date(date);
    formattedDate.setHours(0, 0, 0, 0);
    const diffInMs = new Date(date) - today;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    return diffInDays;
  };

  return (
    <>
      {listToShow !== "Completed" && (
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => setOpen(!open)}
            sx={{ borderRadius: 1.5 }}
          >
            <ListItemIcon sx={{ position: "relative", left: "9px" }}>
              {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItemIcon>
            <ListItemText secondary={sectionName}></ListItemText>
          </ListItemButton>
        </ListItem>
      )}

      <Collapse in={open}>
        {tasks.map((task) => (
          <ListItem key={task.id} disablePadding>
            <ListItemButton
              selected={selectedTask?.id === task.id}
              onClick={() => setSelectedTask(task)}
              sx={{ borderRadius: 1.5 }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                width="100%"
              >
                <Stack direction="row" alignItems="center">
                  <Checkbox
                    checked={task.completed}
                    onChange={() => handleCheck(task)}
                    disabled={listToShow === "Trash"}
                    inputProps={{
                      "aria-label": "Checkbox for task completion",
                    }}
                  ></Checkbox>
                  <Typography fontSize="0.9em">{task.taskName}</Typography>
                </Stack>

                <Stack direction="row" spacing={1}>
                  <Typography fontSize="0.8em" color="grey">
                    {task.listName}
                  </Typography>
                  <Typography
                    fontSize="0.8em"
                    color={calDateDiff(task.dueDate) >= 0 ? "primary" : "red"}
                  >
                    {Math.abs(calDateDiff(task.dueDate))} D
                  </Typography>
                </Stack>
              </Stack>
            </ListItemButton>
          </ListItem>
        ))}
      </Collapse>
    </>
  );
}

export default TaskItems;
