import { useState } from "react";
import { Alert, Slide } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

function Notification() {
  const [showAlert, setShowAlert] = useState(true);

  return (
    <Slide direction="up" in={showAlert} mountOnEnter unmountOnExit>
      <Alert
        icon={<CheckCircleOutlineIcon />}
        severity="success"
        variant="filled"
        style={{
          position: "absolute",

          bottom: 50,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: "1000",
          width: "30%",
        }}
      >
        alert content
      </Alert>
    </Slide>
  );
}

export default Notification;
