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
  getFirstDayOfMonth,
  getFirstDayOfNextMonth,
  getMonthStr,
} from "../helper";

function YearlyTrend({ ascendingRecords }) {
  const firstYear = ascendingRecords[0].date.getFullYear();
  const thisYear = new Date().getFullYear();
  const numOfYears = thisYear - firstYear + 1;

  const [yearIndex, setYearIndex] = useState(numOfYears - 1);

  const years = [];
  const monthStrs = [];
  const monthlyRecords = new Map();

  for (let year = firstYear; year <= thisYear; year++) {
    years.push(year);

    for (let month = 1; month <= 12; month++) {
      const monthStr = `${year}-${month}`;
      if (!monthlyRecords.has(monthStr)) {
        monthlyRecords.set(monthStr, 0);
        monthStrs.push(monthStr);
      }
    }
  }

  // console.log(monthlyRecords.get("2024-1"));

  for (let record of ascendingRecords) {
    const monthStr = getMonthStr(record.date);

    const newValue = monthlyRecords.get(monthStr) + record.durationInMinutes;
    monthlyRecords.set(monthStr, newValue);
  }

  const numOfMonths = monthStrs.length;
  const sliceStart = numOfMonths - (numOfYears - yearIndex) * 12;
  const sliceEnd = numOfMonths - (numOfYears - yearIndex - 1) * 12;

  const selectedMonths = monthStrs.slice(sliceStart, sliceEnd);
  const durations = selectedMonths.map(
    (monthStr) => getDurationStr(monthlyRecords.get(monthStr)).roundedHour
  );
  const shortMonthName = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const handlePrevYear = () => {
    setYearIndex(yearIndex - 1);
  };

  const handleNextYear = () => {
    setYearIndex(yearIndex + 1);
  };

  const disablePrevYear = yearIndex === 0;
  const disableNextYear = yearIndex === numOfYears - 1;
  const yearLabel =
    yearIndex === numOfYears - 1
      ? "This year"
      : yearIndex === numOfYears - 2
      ? "Last year"
      : years[yearIndex];

  console.log(yearIndex);

  return (
    <Paper>
      <Stack direction="row" justifyContent="space-between">
        <Typography>Trends</Typography>
        <Stack direction="row" alignItems="center">
          <IconButton onClick={handlePrevYear} disabled={disablePrevYear}>
            <NavigateBeforeIcon color={disablePrevYear ? "grey" : "primary"} />
          </IconButton>
          <Typography>{yearLabel}</Typography>
          <IconButton onClick={handleNextYear} disabled={disableNextYear}>
            <NavigateNextIcon color={disableNextYear ? "grey" : "primary"} />
          </IconButton>
        </Stack>
      </Stack>

      <Typography>Daily average: **</Typography>
      <LineChart
        xAxis={[{ scaleType: "point", data: shortMonthName }]}
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

export default YearlyTrend;
