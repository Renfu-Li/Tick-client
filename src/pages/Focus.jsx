import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import {
  Box,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";

function Focus() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Grid container>
      <Grid item xs={7}>
        <Stack justifyContent="space-evenly" alignItems="center" height="100%">
          <Typography fontSize="1.2em">Focus</Typography>

          <Button
            onClick={handleClick}
            variant="outlined"
            endIcon={<KeyboardArrowRightIcon />}
            sx={{ borderRadius: "24px" }}
          >
            Task
          </Button>
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <MenuItem>task example</MenuItem>
            <MenuItem>task example</MenuItem>
            <MenuItem>task example</MenuItem>
          </Menu>

          <Stack
            justifyContent="center"
            alignItems="center"
            borderRadius="50%"
            border="5px solid rgb(230, 230, 230)"
            width={260}
            height={260}
          >
            <Typography fontSize="2.5em">50:00</Typography>
          </Stack>

          <Button variant="outlined" sx={{ borderRadius: "24px" }}>
            Start
          </Button>
        </Stack>
      </Grid>

      <Grid item xs={5}>
        <Box>
          <Typography>Overview</Typography>
          <Grid
            container
            // spacing={1}
            justifyContent="space-between"
            margin="0.5em"
          >
            <Grid item xs={5} borderRadius={1.5} bgcolor="rgb(230, 230, 230)">
              <Box>
                <Typography>Today's Focus</Typography>
                <Typography>0</Typography>
              </Box>
            </Grid>

            <Grid item xs={5} borderRadius={1.5} bgcolor="rgb(230, 230, 230)">
              <Box>
                <Typography>This week's Focus</Typography>
                <Typography>0</Typography>
              </Box>
            </Grid>
            {/* <Grid item xs={6}></Grid>
            <Grid item xs={6}></Grid> */}
          </Grid>

          <Typography>Focus record</Typography>
          <List>
            <ListItem>
              <ListItemText>focus 1</ListItemText>
            </ListItem>

            <ListItem>
              <ListItemText>focus 2</ListItemText>
            </ListItem>

            <ListItem>
              <ListItemText>focus 2</ListItemText>
            </ListItem>
          </List>
        </Box>
      </Grid>
    </Grid>
  );
}

export default Focus;
