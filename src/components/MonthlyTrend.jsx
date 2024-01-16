import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { LineChart } from "@mui/x-charts/LineChart";
import { IconButton, Paper, Stack, Typography } from "@mui/material";
import { useState } from "react";
import {
  addDays,
  getNumericDateStr,
  getDurationStr,
  getFirstDayOfMonth,
  getFirstDayOfNextMonth,
} from "../helper";

function MonthlyTrend({ ascendingRecords }) {
  const [monthIndex, setMonthIndex] = useState(0);

  const firstDay = ascendingRecords[0].date;
  const firstDayOfMonth = getFirstDayOfMonth(firstDay);
  // get first day of next month to show data until this month
  const firstDayOfNextMonth = getFirstDayOfNextMonth();

  // create a hashmap with all dates between the first day and the last day with records
  // use hash map because: 1. preserves the order of insersion, unlike object; 2. faster access by key compared to array
  const dailyRecords = new Map();
  for (
    let date = firstDayOfMonth;
    date < firstDayOfNextMonth;
    date = addDays(1, date)
  ) {
    const dateStr = getNumericDateStr(date);

    if (!dailyRecords.has(dateStr)) {
      dailyRecords.set(dateStr, {
        date,
        monthStr: `${date.getFullYear()}-${date.getMonth() + 1}`,
        duration: 0,
      });
    }
  }

  // add daily duration data the dailyRecords hash map
  for (let record of ascendingRecords) {
    const dateStr = getNumericDateStr(record.date);
    const mapValue = dailyRecords.get(dateStr);

    dailyRecords.set(dateStr, {
      ...mapValue,
      duration: mapValue.duration + record.durationInMinutes,
    });
  }

  let monthlyRecords = new Map();
  let months = [];

  // group daily durations by month
  for (let dateStr of dailyRecords.keys()) {
    const { monthStr, duration } = dailyRecords.get(dateStr);

    if (!monthlyRecords.has(monthStr)) {
      monthlyRecords.set(monthStr, []);
      months.push(monthStr);
    }

    const monthlyDurationArr = monthlyRecords.get(monthStr);

    monthlyRecords.set(
      monthStr,
      monthlyDurationArr.concat(getDurationStr(duration).roundedHour)
    );
  }

  const numOfMonths = months.length;
  const durations = monthlyRecords.get(months[numOfMonths - monthIndex - 1]);

  let days = [];
  for (let i = 1; i <= durations.length; i++) {
    days.push(i);
  }

  const disablePrevMonth = monthIndex === numOfMonths - 1;
  const disableNextMonth = monthIndex === 0;

  const handlePrevWeek = () => {
    setMonthIndex(monthIndex + 1);
  };

  const handleNextWeek = () => {
    setMonthIndex(monthIndex - 1);
  };

  const monthLabel =
    monthIndex === 0
      ? "This month"
      : monthIndex === 1
      ? "Last month"
      : months[numOfMonths - monthIndex - 1];

  return (
    <Paper>
      <Stack direction="row" justifyContent="space-between">
        <Typography>Trends</Typography>
        <Stack direction="row" alignItems="center">
          <IconButton onClick={handlePrevWeek} disabled={disablePrevMonth}>
            <NavigateBeforeIcon color={disablePrevMonth ? "grey" : "primary"} />
          </IconButton>
          <Typography>{monthLabel}</Typography>
          <IconButton onClick={handleNextWeek} disabled={disableNextMonth}>
            <NavigateNextIcon color={disableNextMonth ? "grey" : "primary"} />
          </IconButton>
        </Stack>
      </Stack>

      <Typography>Daily average: **</Typography>
      <LineChart
        xAxis={[{ scaleType: "point", data: days }]}
        series={[
          {
            data: durations,
            area: true,
            color: "cornflowerblue",
          },
        ]}
        width={650}
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

export default MonthlyTrend;
