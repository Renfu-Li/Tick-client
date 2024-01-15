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

function Statistics({ allRecords }) {
  const [weekInTrends, setWeekInTrends] = useState(0);

  const [categoryAnchEl, setCategoryAnchEl] = useState(null);
  const openCategory = Boolean(categoryAnchEl);

  const [timeInBarAnchEl, setTimeInBarAnchEl] = useState(null);
  const openTimeInBar = Boolean(timeInBarAnchEl);

  // const [timeInLineAnchEl, setTimeInLineAnchEl] = useState(null);
  // const openTimeInLine = Boolean(timeInLineAnchEl);

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const ascendingRecords = [...allRecords].sort(
    (record1, record2) => record1.date - record2.date
  );

  const firstDay = allRecords[allRecords.length - 1].date;
  const lastDay = allRecords[0].date;

  const firstMonday = getMonday(firstDay);
  const lastMonday = getMonday(lastDay);
  const thisMonday = getMonday();
  const nextMonday = addDays(7, thisMonday);

  // create a hashmap with all dates between the first day and the last day with records
  // use hash map because: 1. preserves the order of insersion, unlike object; 2. faster access by key compared to array
  const dailyRecords = new Map();
  for (let date = firstMonday; date < nextMonday; date = addDays(1, date)) {
    const dateStr = getNumericDateStr(date);
    if (!dailyRecords.get(dateStr)) {
      dailyRecords.set(dateStr, {
        date,
        duration: 0,
      });
    }
  }

  // add the records data to teh hashmap
  for (let record of ascendingRecords) {
    const mapValue = dailyRecords.get(record.numericDateStr);

    const newMapValue = {
      date: record.date,
      duration: mapValue.duration + record.durationInMinutes,
    };
    dailyRecords.set(record.numericDateStr, newMapValue);
  }

  const numOfWeeks = calcuDateDiff(firstMonday, lastMonday) / 7 + 1;
  const mondays = getAllMondays(firstMonday, numOfWeeks);
  const dateStrsInAWeek = getDateStrsInAWeek(
    mondays[numOfWeeks - weekInTrends - 1]
  );

  const weeklyDuration = dateStrsInAWeek.map((dateStr) => {
    const durationInMinutes = dailyRecords.get(dateStr.numericStr).duration;
    return getDurationStr(durationInMinutes).roundedHour;
  });

  const handlePrevWeek = () => {
    setWeekInTrends(weekInTrends + 1);
  };

  const handleNextWeek = () => {
    setWeekInTrends(weekInTrends - 1);
  };

  const weekLabel =
    weekInTrends === 0
      ? "This week"
      : weekInTrends === 1
      ? "Last week"
      : `${dateStrsInAWeek[0].longStr} - ${dateStrsInAWeek[6].longStr}`;

  const disablePrevWeek = weekInTrends === numOfWeeks - 1;
  const disableNextWeek = weekInTrends === 0;

  // console.log(typeof weeklyDuration[0]);

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

      <Paper>
        <Stack direction="row" justifyContent="space-between">
          <Typography>Trends</Typography>
          <Stack direction="row" alignItems="center">
            <IconButton onClick={handlePrevWeek} disabled={disablePrevWeek}>
              <NavigateBeforeIcon
                color={disablePrevWeek ? "grey" : "primary"}
              />
            </IconButton>
            <Typography>{weekLabel}</Typography>
            <IconButton onClick={handleNextWeek} disabled={disableNextWeek}>
              <NavigateNextIcon color={disableNextWeek ? "grey" : "primary"} />
            </IconButton>
          </Stack>
        </Stack>

        <Typography>Trends chart</Typography>
        <LineChart
          xAxis={[{ scaleType: "point", data: weekDays }]}
          series={[
            {
              data: weeklyDuration,
              // area: true,
              color: "cornflowerblue",
            },
          ]}
          width={500}
          height={300}
          sx={{
            ".MuiLineElement-root": {
              stroke: "cornflowerblue",
              strokeWidth: 3,
            },
            ".MuiMarkElement-root": {
              stroke: "#8884d8",
              scale: "0.6",
              fill: "#fff",
              strokeWidth: 2,
            },
          }}
        ></LineChart>
      </Paper>
    </Container>
  );
}

export default Statistics;
