import { Alert, Slide } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useSelector } from "react-redux";

function Notification() {
  const notification = useSelector((state) => state.notification);

  return (
    <Slide direction="up" in={Boolean(notification)} mountOnEnter unmountOnExit>
      <Alert
        icon={<CheckCircleOutlineIcon />}
        severity={notification[0] === "S" ? "success" : "error"}
        variant="filled"
        style={{
          position: "absolute",
          bottom: 50,
          left: "35%",
          zIndex: "1000",
          width: "30%",
        }}
      >
        {notification}
      </Alert>
    </Slide>
  );
}

export default Notification;
