import { Checkbox, TextField } from "@mui/material";

export default function TaskDetails() {
  return (
    <>
      <div>
        <Checkbox label="label"></Checkbox>
        <p>Task name</p>
        <TextField
          variant="standard"
          defaultValue="Description"
          fullWidth
        ></TextField>
        <p>Tags</p>
      </div>
    </>
  );
}
