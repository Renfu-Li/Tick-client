import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { LineChart } from "@mui/x-charts/LineChart";
import { IconButton, Paper, Stack, Typography } from "@mui/material";
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

function WeeklyTrend({ ascendingRecords }) {
  const [weekInTrends, setWeekInTrends] = useState(0);

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const firstDay = ascendingRecords[0].date;
  // const lastDay = ascendingRecords[ascendingRecords.length - 1].date;
  const firstMonday = getMonday(firstDay);
  // const lastMonday = getMonday(lastDay);
  const nextMonday = addDays(7, getMonday());

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

  const numOfWeeks = calcuDateDiff(firstMonday, nextMonday) / 7;
  const mondays = getAllMondays(firstMonday, numOfWeeks);
  const dateStrsInAWeek = getDateStrsInAWeek(
    mondays[numOfWeeks - weekInTrends - 1]
  );

  const weeklyDurations = dateStrsInAWeek.map((dateStr) => {
    const durationInMinutes = dailyRecords.get(dateStr.numericStr).duration;
    return getDurationStr(durationInMinutes).roundedHour;
  });

  const handlePrevWeek = () => {
    setWeekInTrends(weekInTrends + 1);
  };

  const handleNextWeek = () => {
    setWeekInTrends(weekInTrends - 1);
  };

  console.log(numOfWeeks);

  const weekLabel =
    weekInTrends === 0
      ? "This week"
      : weekInTrends === 1
      ? "Last week"
      : `${dateStrsInAWeek[0].longStr} - ${dateStrsInAWeek[6].longStr}`;

  const disablePrevWeek = weekInTrends === numOfWeeks - 1;
  const disableNextWeek = weekInTrends === 0;

  return (
    <Paper>
      <Stack direction="row" justifyContent="space-between">
        <Typography>Trends</Typography>
        <Stack direction="row" alignItems="center">
          <IconButton onClick={handlePrevWeek} disabled={disablePrevWeek}>
            <NavigateBeforeIcon color={disablePrevWeek ? "grey" : "primary"} />
          </IconButton>
          <Typography>{weekLabel}</Typography>
          <IconButton onClick={handleNextWeek} disabled={disableNextWeek}>
            <NavigateNextIcon color={disableNextWeek ? "grey" : "primary"} />
          </IconButton>
        </Stack>
      </Stack>

      <Typography>Daily average: **</Typography>
      <LineChart
        xAxis={[{ scaleType: "point", data: weekDays }]}
        series={[
          {
            data: weeklyDurations,
            area: true,
            color: "cornflowerblue",
          },
        ]}
        width={400}
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
  );
}

export default WeeklyTrend;
