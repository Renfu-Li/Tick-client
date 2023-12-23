import CalendarMonth from "@mui/icons-material/CalendarMonth";
import {
  Box,
  Checkbox,
  IconButton,
  Popover,
  Stack,
  TextField,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useState } from "react";

function TaskDetails() {
  const [calendarAnchorEl, setCalendarAnchorEl] = useState(null);

  return (
    <Box>
      <IconButton
        onClick={(e) => {
          setCalendarAnchorEl(e.currentTarget);
        }}
      >
        <CalendarMonthIcon></CalendarMonthIcon>
      </IconButton>

      <Popover
        open={Boolean(calendarAnchorEl)}
        anchorEl={calendarAnchorEl}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        onClose={() => {
          setCalendarAnchorEl(null);
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {/* <DateCalendar
            value={dueDate}
            onChange={(date) => {
              setDueDate(date);
              setCalendarAnchorEl(null);
            }}
          ></DateCalendar> */}
        </LocalizationProvider>
      </Popover>
    </Box>
  );
}

export default TaskDetails;
