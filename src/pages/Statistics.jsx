import { Container, Grid, Typography } from "@mui/material";
import {
  getMonday,
  calcuDateDiff,
  getMonthStr,
  addDays,
  getNumericDateStr,
} from "../helper";
import WeeklyTrend from "../components/WeeklyTrend";
import MonthlyTrend from "../components/MonthlyTrend";
import YearlyTrend from "../components/YearlyTrend";
import StatisticsOverview from "../components/StatisticsOverview";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMemo } from "react";

function Statistics({ allRecords }) {
  const ascendingRecords = useMemo(
    () =>
      [...allRecords].sort((record1, record2) => record1.date - record2.date),
    [allRecords]
  );

  const token = useSelector((state) => state.token);

  const firstDay = ascendingRecords[0].date;
  const firstMonday = getMonday(firstDay);
  const nextMonday = addDays(7, getMonday());
  const numOfWeeks = calcuDateDiff(firstMonday, nextMonday) / 7;

  // create a hashmap with all dates between the first day and the last day with records
  // use hash map because: 1. preserves the order of insersion, unlike object; 2. faster access by key compared to array
  const allDuratoins = useMemo(() => {
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

    const durations = [];
    for (let dateStr of dailyRecords.keys()) {
      const duration = dailyRecords.get(dateStr).duration;
      durations.push(duration);
    }

    return durations;
  }, [ascendingRecords, firstMonday, nextMonday]);

  const currentWeekDurations = useMemo(
    () => allDuratoins.slice((numOfWeeks - 1) * 7, numOfWeeks * 7),
    [allDuratoins, numOfWeeks]
  );

  // group data by month
  const firstYear = ascendingRecords[0].date.getFullYear();
  const thisYear = new Date().getFullYear();
  const numOfYears = thisYear - firstYear + 1;

  const durationsAndYears = useMemo(() => {
    const years = [];
    const monthlyRecords = new Map();
    const monthStrs = [];
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

    for (let record of ascendingRecords) {
      const monthStr = getMonthStr(record.date);

      const newValue = monthlyRecords.get(monthStr) + record.durationInMinutes;
      monthlyRecords.set(monthStr, newValue);
    }

    const allDurationsByMonth = [];
    for (let monthStr of monthlyRecords.keys()) {
      const duration = monthlyRecords.get(monthStr);
      allDurationsByMonth.push(duration);
    }

    return { allDurationsByMonth, years };
  }, [ascendingRecords, firstYear, thisYear]);

  const { allDurationsByMonth, years } = durationsAndYears;

  const currentYearDurations = allDurationsByMonth.slice(
    (numOfYears - 1) * 12,
    numOfYears * 12
  );

  return (
    <Container sx={{ height: "100vh", overflow: "auto" }}>
      {!token && <Navigate to="/" />}

      <Typography variant="h5" my="0.3em" textAlign="center">
        Statistics
      </Typography>

      <StatisticsOverview
        currentWeekDurations={currentWeekDurations}
        currentYearDurations={currentYearDurations}
      ></StatisticsOverview>

      <Grid container justifyContent="space-between" spacing={3} mb="1.5em">
        <Grid item xs={5.5}>
          <WeeklyTrend
            numOfWeeks={numOfWeeks}
            firstMonday={firstMonday}
            allDuratoins={allDuratoins}
          />
        </Grid>

        <Grid item xs={6.5}>
          <YearlyTrend
            numOfYears={numOfYears}
            years={years}
            allDurationsByMonth={allDurationsByMonth}
          />
        </Grid>

        <Grid item xs={12}>
          <MonthlyTrend ascendingRecords={ascendingRecords} />
        </Grid>
      </Grid>
    </Container>
  );
}

export default Statistics;
