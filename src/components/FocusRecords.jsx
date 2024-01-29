import TimerIcon from "@mui/icons-material/Timer";

import {
  Box,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";

import { getShortDateStr } from "../helper";

function FocusRecords({ dailyRecords }) {
  return (
    <Box>
      <Typography variant="h6" mb="0.5em">
        Focus record
      </Typography>

      {Array.from(dailyRecords).map(([key, value]) => (
        <Box key={key}>
          <Typography fontSize="0.9em">{getShortDateStr(key)}</Typography>
          <List dense>
            {value.map((record) => (
              <ListItem key={record.id}>
                <Stack
                  width="100%"
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <TimerIcon
                    fontSize="small"
                    color="primary"
                    sx={{ mr: "0.5em" }}
                  ></TimerIcon>

                  <ListItemText
                    primary={record.taskName}
                    secondary={`${record.dateStr} ${record.startTime} - ${record.endTime}`}
                  ></ListItemText>
                  <Typography>{record.durationStr}</Typography>
                </Stack>
              </ListItem>
            ))}
          </List>
        </Box>
      ))}
    </Box>
  );
}

export default FocusRecords;
