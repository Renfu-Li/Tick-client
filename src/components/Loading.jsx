import { Box, Typography } from "@mui/material";

function Loading() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100%"
    >
      <Typography>No data yet...</Typography>
    </Box>
  );
}

export default Loading;
