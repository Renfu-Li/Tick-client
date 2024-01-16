import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { LineChart } from "@mui/x-charts/LineChart";
import {
  Button,
  Container,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import {
  getMonday,
  calcuDateDiff,
  getAllMondays,
  addDays,
  getNumericDateStr,
  getDateStrsInAWeek,
  getDurationStr,
} from "../helper";
import WeeklyTrend from "../components/WeeklyTrend";
import MonthlyTrend from "../components/MonthlyTrend";
import YearlyTrend from "../components/YearlyTrend";

function Distribution() {
  const [weekInTrends, setWeekInTrends] = useState(0);

  const [categoryAnchEl, setCategoryAnchEl] = useState(null);
  const openCategory = Boolean(categoryAnchEl);

  const [timeInBarAnchEl, setTimeInBarAnchEl] = useState(null);
  const openTimeInBar = Boolean(timeInBarAnchEl);

  return (
    <Paper>
      <Stack direction="row" justifyContent="space-between">
        <Typography>Focus distribution</Typography>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            endIcon={<ExpandMoreIcon />}
            sx={{ borderRadius: "24px" }}
            onClick={(e) => setCategoryAnchEl(e.currentTarget)}
          >
            Task
          </Button>
          <Menu
            anchorEl={categoryAnchEl}
            open={openCategory}
            onClose={() => setCategoryAnchEl(null)}
          >
            <MenuItem>Task</MenuItem>
            <MenuItem>List</MenuItem>
          </Menu>

          <Button
            variant="outlined"
            endIcon={<ExpandMoreIcon />}
            sx={{ borderRadius: "24px" }}
            onClick={(e) => setTimeInBarAnchEl(e.currentTarget)}
          >
            Day
          </Button>
          <Menu
            anchorEl={timeInBarAnchEl}
            open={openTimeInBar}
            onClose={() => setTimeInBarAnchEl(null)}
          >
            <MenuItem>Day</MenuItem>
            <MenuItem>Week</MenuItem>
            <MenuItem>Month</MenuItem>
            <MenuItem>Year</MenuItem>
          </Menu>
        </Stack>
      </Stack>
      <Typography>Distribution</Typography>
    </Paper>
  );
}
