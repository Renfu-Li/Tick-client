import {
  Box,
  Divider,
  Grid,
  InputBase,
  Paper,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { getShortDateStr, getDurationStr, getMonday } from "../helper";

import FocusRecords from "../components/FocusRecords";
import FocusControl from "../components/FocusControl";

function Focus({ allRecords }) {
  const [start, setStart] = useState(null);
  const [focusNote, setFocusNote] = useState("");

  const todayDurationStr = useMemo(() => {
    const todayStr = getShortDateStr();
    const todayRecords = allRecords.filter(
      (record) => record.dateStr === todayStr
    );
    const todayDurationMinutes = todayRecords.reduce(
      (total, record) => total + record.durationInMinutes,
      0
    );

    const str = getDurationStr(todayDurationMinutes).durationStr;
    return str;
  }, [allRecords]);

  const weeklyDurationStr = useMemo(() => {
    const currentWeekFocuses = allRecords.filter(
      (record) => new Date(record.date) >= getMonday()
    );
    const weeklyDurationMinutes = currentWeekFocuses.reduce(
      (total, record) => total + record.durationInMinutes,
      0
    );

    const str = getDurationStr(weeklyDurationMinutes).durationStr;
    return str;
  }, [allRecords]);

  const dailyRecords = useMemo(() => {
    const records = new Map();
    for (let record of allRecords) {
      const numericDateStr = record.numericDateStr;

      if (!records.has(numericDateStr)) {
        records.set(numericDateStr, []);
      }

      const mapValue = records.get(numericDateStr);
      mapValue.push(record);

      records.set(numericDateStr, mapValue);
    }

    return records;
  }, [allRecords]);

  return (
    <Grid container justifyContent="space-between" height="100%" margin={0}>
      <Grid
        item
        xs={6}
        height="100%"
        paddingY="0.7em"
        sx={{ borderRight: 0.5, borderColor: "lightgray" }}
      >
        <FocusControl start={start} setStart={setStart} focusNote={focusNote} />
      </Grid>

      <Grid
        item
        xs={6}
        height="100%"
        paddingX="1em"
        paddingY="0.7em"
        overflow="auto"
      >
        <Typography variant="h6">Overview</Typography>
        <Grid container justifyContent="space-between" margin="0.5em" mx={0}>
          <Grid
            item
            xs={5.5}
            borderRadius={1.5}
            bgcolor="rgb(245, 245, 245)"
            padding={1.5}
          >
            <Typography color="grey" fontSize="90%">
              Today&lsquo;s Focus
            </Typography>
            <Typography mt="0.5em" fontSize="1.5em">
              {todayDurationStr}
            </Typography>
          </Grid>

          <Grid
            item
            xs={5.5}
            borderRadius={1.5}
            bgcolor="rgb(245, 245, 245)"
            padding={1.5}
          >
            <Typography color="grey" fontSize="90%">
              This week&lsquo;s Focus
            </Typography>
            <Typography mt="0.5em" fontSize="1.5em">
              {weeklyDurationStr}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: "1.5em", color: "lightgray" }}></Divider>

        {start ? (
          <Box>
            <Typography variant="h6" mb={1}>
              Focus Note
            </Typography>
            <Paper
              sx={{
                padding: 0.5,
              }}
            >
              <InputBase
                value={focusNote}
                onChange={(e) => setFocusNote(e.target.value)}
                placeholder="What do you have in mind?"
                minRows={10}
                multiline
                fullWidth
                sx={{ ml: 1 }}
              ></InputBase>
            </Paper>
          </Box>
        ) : (
          <FocusRecords dailyRecords={dailyRecords} />
        )}
      </Grid>
    </Grid>
  );
}

export default Focus;
