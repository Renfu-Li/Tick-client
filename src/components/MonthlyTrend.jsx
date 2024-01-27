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
import { useMemo, useState } from "react";
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

  const dailyRecords = useMemo(() => {
    let records = new Map();

    for (
      let date = firstDayOfMonth;
      date < firstDayOfNextMonth;
      date = addDays(1, date)
    ) {
      const dateStr = getNumericDateStr(date);

      if (!records.has(dateStr)) {
        records.set(dateStr, {
          date,
          monthStr: `${date.getFullYear()}-${date.getMonth() + 1}`,
          duration: 0,
        });
      }
    }

    // add daily duration data the dailyRecords hash map
    for (let record of ascendingRecords) {
      const dateStr = getNumericDateStr(record.date);
      const mapValue = records.get(dateStr);

      records.set(dateStr, {
        ...mapValue,
        duration: mapValue.duration + record.durationInMinutes,
      });
    }

    return records;
  }, [firstDayOfMonth, firstDayOfNextMonth, ascendingRecords]);

  const recordsAndMonths = useMemo(() => {
    const monthlyRecords = new Map();
    const months = [];

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

    return { monthlyRecords, months };
  }, [dailyRecords]);

  const { monthlyRecords, months } = recordsAndMonths;

  const numOfMonths = months.length;
  const durations = monthlyRecords.get(months[numOfMonths - monthIndex - 1]);

  const days = useMemo(() => {
    const dates = [];

    for (let i = 1; i <= durations.length; i++) {
      dates.push(i);
    }

    return dates;
  }, [durations.length]);

  const data = useMemo(
    () =>
      days.map((day, index) => {
        return {
          day,
          duration: durations[index],
        };
      }),
    [days, durations]
  );

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
    <Paper sx={{ padding: "1em" }} elevation={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography>Monthly trend</Typography>
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

export default MonthlyTrend;
