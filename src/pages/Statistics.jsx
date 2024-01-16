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

function Statistics({ allRecords }) {
  const ascendingRecords = [...allRecords].sort(
    (record1, record2) => record1.date - record2.date
  );

  return (
    <Container>
      <Typography fontSize="1.8em" my="0.5em">
        Statistics
      </Typography>

      <Paper sx={{ padding: "1em", mb: "1.5em" }}>
        <Typography mb="0.5em">Overview</Typography>

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

      <Grid container justifyContent="space-between" spacing={3} mb="1.5em">
        <Grid item xs={5.5}>
          <WeeklyTrend ascendingRecords={ascendingRecords} />
        </Grid>

        <Grid item xs={6.5}>
          <YearlyTrend ascendingRecords={ascendingRecords} />
        </Grid>

        <Grid item xs={12}>
          <MonthlyTrend ascendingRecords={ascendingRecords} />
        </Grid>
      </Grid>
    </Container>
  );
}

export default Statistics;
