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

function StatisticsOverview({ currentWeekDurations, currentYearDurations }) {
  const today = new Date();
  const dateIndex = today.getDay() === 0 ? 6 : today.getDay();
  const todayDurationStr = getDurationStr(
    currentWeekDurations[dateIndex]
  ).durationStr;
  const thisWeekDuration = currentWeekDurations.reduce(
    (total, duration) => total + duration
  );
  const thisWeekDurationStr = getDurationStr(thisWeekDuration).durationStr;

  const monthIndex = today.getMonth();
  const thisMonthDurationStr = getDurationStr(
    currentYearDurations[monthIndex]
  ).durationStr;
  const thisYearDuration = currentYearDurations.reduce(
    (total, duration) => total + duration
  );
  const thisYearDurationStr = getDurationStr(thisYearDuration).durationStr;

  return (
    <Paper sx={{ padding: "1em", mb: "1.5em" }}>
      <Typography mb="0.5em">Overview</Typography>

      <Stack direction="row">
        <Container>
          <Typography color="gray" fontSize="90%">
            Today
          </Typography>
          <Typography fontSize="2em" color="primary">
            {todayDurationStr}
          </Typography>
        </Container>
        <Container>
          <Typography color="gray" fontSize="90%">
            This week
          </Typography>
          <Typography fontSize="2em" color="primary">
            {thisWeekDurationStr}
          </Typography>
        </Container>
        <Container>
          <Typography color="gray" fontSize="90%">
            This month
          </Typography>
          <Typography fontSize="2em" color="primary">
            {thisMonthDurationStr}
          </Typography>
        </Container>
        <Container>
          <Typography color="gray" fontSize="90%">
            This year
          </Typography>
          <Typography fontSize="2em" color="primary">
            {thisYearDurationStr}
          </Typography>
        </Container>
      </Stack>
    </Paper>
  );
}

export default StatisticsOverview;
