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

function Statistics({ allRecords }) {
  const [weekInTrends, setWeekInTrends] = useState(0);

  const [categoryAnchEl, setCategoryAnchEl] = useState(null);
  const openCategory = Boolean(categoryAnchEl);

  const [timeInBarAnchEl, setTimeInBarAnchEl] = useState(null);
  const openTimeInBar = Boolean(timeInBarAnchEl);

  // const [timeInLineAnchEl, setTimeInLineAnchEl] = useState(null);
  // const openTimeInLine = Boolean(timeInLineAnchEl);

  const ascendingRecords = [...allRecords].sort(
    (record1, record2) => record1.date - record2.date
  );

  return (
    <Container>
      <Paper>
        <Typography>Overview</Typography>

        <Stack direction="row">
          <Container>
            <Typography color="gray" fontSize="90%">
              Today
            </Typography>
            <Typography fontSize="2em" color="primary">
              8h
            </Typography>
          </Container>
          <Container>
            <Typography color="gray" fontSize="90%">
              This week
            </Typography>
            <Typography fontSize="2em" color="primary">
              40h
            </Typography>
          </Container>
          <Container>
            <Typography color="gray" fontSize="90%">
              This month
            </Typography>
            <Typography fontSize="2em" color="primary">
              100h
            </Typography>
          </Container>
          <Container>
            <Typography color="gray" fontSize="90%">
              This year
            </Typography>
            <Typography fontSize="2em" color="primary">
              100h
            </Typography>
          </Container>
        </Stack>
      </Paper>

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

      <Grid container justifyContent="space-around">
        <Grid item xs={4}>
          <WeeklyTrend ascendingRecords={ascendingRecords} />
        </Grid>
        <Grid item xs={7}>
          <MonthlyTrend ascendingRecords={ascendingRecords} />
        </Grid>
      </Grid>
    </Container>
  );
}

export default Statistics;
