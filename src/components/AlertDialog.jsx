import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import taskService from "../services/taskService";

function AlertDialog({
  openAlert,
  setOpenAlert,
  taskId,
  allTasks,
  setAllTasks,
  token,
}) {
  const handleDeleteTask = async () => {
    await taskService.deleteTask(token, taskId);

    const updatedAllTasks = allTasks.filter((task) => task.id !== taskId);
    setAllTasks(updatedAllTasks);

    // no need to update allLists as the count has been decreased when the task was removed
    setOpenAlert(false);
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
          it?
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
