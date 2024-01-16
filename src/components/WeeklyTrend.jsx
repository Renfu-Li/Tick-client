import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
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
  const firstMonday = getMonday(firstDay);
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

  const data = weekDays.map((day, index) => {
    return {
      day,
      duration: weeklyDurations[index],
    };
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

  return (
    <Paper sx={{ padding: "1em" }}>
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
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          width={500}
          height={400}
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
          style={{ fontFamily: "roboto", fontSize: "75%" }}
        >
          <defs>
            <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0088FE" />
              <stop offset="100%" stopColor="#FFFFFF" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="4 4" vertical={false} />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="duration"
            stroke="#8884d8"
            fill="url(#blueGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Paper>
  );
}

export default WeeklyTrend;
