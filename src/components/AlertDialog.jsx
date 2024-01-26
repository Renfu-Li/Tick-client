import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import taskService from "../services/taskService";
import { useDispatch, useSelector } from "react-redux";

import {
  removeNotification,
  setNotification,
} from "../reducers/notificationReducer";
import { deleteTask } from "../reducers/taskReducer";
import focusService from "../services/focusService";
import { deleteByTask } from "../reducers/focusReducer";

function AlertDialog({ openAlert, setOpenAlert, task }) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);

  const handleDeleteTask = async () => {
    try {
      const deletedTask = await taskService.deleteTask(token, task.id);

      dispatch(deleteTask(deletedTask));

      // no need to update allLists as the count has been decreased when the task was removed
      // but need to delete the related focuses
      await focusService.deleteFocusByTask(token, task.id);
      dispatch(deleteByTask(task.id));

      setOpenAlert(false);

      // notify user
      dispatch(setNotification(`Successfully deleted task ${task.taskName}`));
      setTimeout(() => {
        dispatch(removeNotification());
      }, 3000);
    } catch (error) {
      dispatch(setNotification(`Error: ${error.message}`));
      setTimeout(() => {
        dispatch(removeNotification());
      }, 3000);
    }
  };

  return (
    <Dialog
      open={openAlert}
      onClose={() => setOpenAlert(true)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Delete Forever</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          The task will be permanently deleted. Are you sure you want to delete
          it? All related focuses will also be deleted
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenAlert(false)}>Cancel</Button>
        <Button onClick={handleDeleteTask} autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AlertDialog;
