import { Container, Grid, Typography } from "@mui/material";
import { useState } from "react";
import {
  getMonday,
  calcuDateDiff,
  getAllMondays,
  getMonthStr,
  addDays,
  getNumericDateStr,
  getDateStrsInAWeek,
  getDurationStr,
} from "../helper";
import WeeklyTrend from "../components/WeeklyTrend";
import MonthlyTrend from "../components/MonthlyTrend";
import YearlyTrend from "../components/YearlyTrend";
import StatisticsOverview from "../components/StatisticsOverview";

function Statistics({ allRecords }) {
  const ascendingRecords = [...allRecords].sort(
    (record1, record2) => record1.date - record2.date
  );

  const firstDay = ascendingRecords[0].date;
  const firstMonday = getMonday(firstDay);
  const nextMonday = addDays(7, getMonday());
  const numOfWeeks = calcuDateDiff(firstMonday, nextMonday) / 7;

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

  const allDuratoins = [];
  for (let dateStr of dailyRecords.keys()) {
    const duration = dailyRecords.get(dateStr).duration;
    allDuratoins.push(duration);
  }

  const currentWeekDurations = allDuratoins.slice(
    (numOfWeeks - 1) * 7,
    numOfWeeks * 7
  );

  // group data by month
  const firstYear = ascendingRecords[0].date.getFullYear();
  const thisYear = new Date().getFullYear();
  const numOfYears = thisYear - firstYear + 1;

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

  const currentYearDurations = allDurationsByMonth.slice(
    (numOfYears - 1) * 12,
    numOfYears * 12
  );

  return (
    <Container>
      <Typography fontSize="1.8em" my="0.5em">
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
