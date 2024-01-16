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
import { getDurationStr, getMonthStr } from "../helper";

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

  const data = shortMonthName.map((month, index) => {
    return {
      month,
      duration: durations[index],
    };
  });

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

  return (
    <Paper sx={{ padding: "1em" }}>
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

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          width={1000}
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
              <stop offset="0%" stopColor="cornflowerblue" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="4 4" vertical={false} />
          <XAxis dataKey="month" />
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

export default YearlyTrend;
