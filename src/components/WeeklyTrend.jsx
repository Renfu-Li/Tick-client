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
import { getAllMondays, getDateStrsInAWeek, getDurationStr } from "../helper";

function WeeklyTrend({ numOfWeeks, firstMonday, allDuratoins }) {
  const [weekIndex, setWeekIndex] = useState(numOfWeeks - 1);

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const mondays = getAllMondays(firstMonday, numOfWeeks);
  const dateStrsInAWeek = getDateStrsInAWeek(
    mondays[numOfWeeks - weekIndex - 1]
  );

  const numOfDays = numOfWeeks * 7;
  const sliceStart = numOfDays - 7 * (numOfWeeks - weekIndex);
  const sliceEnd = numOfDays - 7 * (numOfWeeks - weekIndex - 1);
  const durations = allDuratoins.slice(sliceStart, sliceEnd);
  const durationHours = durations.map(
    (duration) => getDurationStr(duration).roundedHour
  );

  // const durations = dateStrsInAWeek.map((dateStr) => {
  //   const durationInMinutes = dailyRecords.get(dateStr.numericStr).duration;
  //   return getDurationStr(durationInMinutes).roundedHour;
  // });

  const data = weekDays.map((day, index) => {
    return {
      day,
      duration: durationHours[index],
    };
  });

  const handlePrevWeek = () => {
    setWeekIndex(weekIndex - 1);
  };

  const handleNextWeek = () => {
    setWeekIndex(weekIndex + 1);
  };

  const weekLabel =
    weekIndex === numOfWeeks - 1
      ? "This week"
      : weekIndex === numOfWeeks - 2
      ? "Last week"
      : `${dateStrsInAWeek[0].longStr} - ${dateStrsInAWeek[6].longStr}`;

  const disablePrevWeek = weekIndex === 0;
  const disableNextWeek = weekIndex === numOfWeeks - 1;

  return (
    <Paper sx={{ padding: "1em" }} elevation={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography>Weekly trend</Typography>
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

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
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
