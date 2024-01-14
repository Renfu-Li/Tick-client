import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Button,
  Container,
  Grid,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";

function Statistics() {
  const [categoryAnchEl, setCategoryAnchEl] = useState(null);
  const openCategory = Boolean(categoryAnchEl);

  const [timeInBarAnchEl, setTimeInBarAnchEl] = useState(null);
  const openTimeInBar = Boolean(timeInBarAnchEl);

  const [timeInLineAnchEl, setTimeInLineAnchEl] = useState(null);
  const openTimeInLine = Boolean(timeInLineAnchEl);

  return (
    <Container>
      <Paper>
        <Typography>Overview</Typography>

        <Stack direction="row">
          <Container>
            <Typography color="gray" fontSize="90%">
              Today
            </Typography>
            <Typography fontSize="2em" color="primary">
              8h
            </Typography>
          </Container>
          <Container>
            <Typography color="gray" fontSize="90%">
              This week
            </Typography>
            <Typography fontSize="2em" color="primary">
              40h
            </Typography>
          </Container>
          <Container>
            <Typography color="gray" fontSize="90%">
              This month
            </Typography>
            <Typography fontSize="2em" color="primary">
              100h
            </Typography>
          </Container>
          <Container>
            <Typography color="gray" fontSize="90%">
              This year
            </Typography>
            <Typography fontSize="2em" color="primary">
              100h
            </Typography>
          </Container>
        </Stack>
      </Paper>

      <Paper>
        <Stack direction="row" justifyContent="space-between">
          <Typography>Focus distribution</Typography>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              endIcon={<ExpandMoreIcon />}
              sx={{ borderRadius: "24px" }}
              onClick={(e) => setCategoryAnchEl(e.currentTarget)}
            >
              Task
            </Button>
            <Menu
              anchorEl={categoryAnchEl}
              open={openCategory}
              onClose={() => setCategoryAnchEl(null)}
            >
              <MenuItem>Task</MenuItem>
              <MenuItem>List</MenuItem>
            </Menu>

            <Button
              variant="outlined"
              endIcon={<ExpandMoreIcon />}
              sx={{ borderRadius: "24px" }}
              onClick={(e) => setTimeInBarAnchEl(e.currentTarget)}
            >
              Day
            </Button>
            <Menu
              anchorEl={timeInBarAnchEl}
              open={openTimeInBar}
              onClose={() => setTimeInBarAnchEl(null)}
            >
              <MenuItem>Day</MenuItem>
              <MenuItem>Week</MenuItem>
              <MenuItem>Month</MenuItem>
              <MenuItem>Year</MenuItem>
            </Menu>
          </Stack>
        </Stack>
        <Typography>Distribution</Typography>
      </Paper>

      <Paper>
        <Stack direction="row" justifyContent="space-between">
          <Typography>Trends</Typography>
          <Stack direction="row">
            <Button
              variant="outlined"
              endIcon={<ExpandMoreIcon />}
              sx={{ borderRadius: "24px" }}
              onClick={(e) => setTimeInLineAnchEl(e.currentTarget)}
            >
              Week
            </Button>
            <Menu
              anchorEl={timeInLineAnchEl}
              open={openTimeInLine}
              onClose={() => setTimeInLineAnchEl(null)}
            >
              <MenuItem>Week</MenuItem>
              <MenuItem>Month</MenuItem>
              <MenuItem>Year</MenuItem>
            </Menu>
          </Stack>
        </Stack>

        <Typography>Trends chart</Typography>
      </Paper>
    </Container>
  );
}

export default Statistics;
