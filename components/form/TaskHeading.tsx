import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import styles from "../styles/utils.module.css";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FilledInput from "@mui/material/FilledInput";
import Grid from "@mui/material/Grid";
import { gigTheme } from "../../src/Theme";
import Typography from "@mui/material/Typography";
import DefaultGrayCard from "../common/DefaultGrayCard";

//BELOW IS TEMP
import { ThemeProvider } from "@mui/material";

export default function TaskHeading() {
  return (
    <DefaultGrayCard>
      {/* Task Title */}
      {/* <ThemeProvider theme={gigTheme}> */}
      <TextField
        label="Task Title"
        variant="filled"
        fullWidth
        color="secondary"
        sx={{
          m: 1,
          color: "red",
        }}
      />

      {/* </ThemeProvider> */}

      {/* Task Description */}
      <TextField
        label="Task Description. (Ex: Answer a survey about your opinions)"
        variant="filled"
        fullWidth
        sx={{ m: 1 }}
      />

      {/* Crypto Allocation */}
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Box display="flex" alignItems="center" justifyContent="left">
            Total crypto allocated:
            <TextField sx={{ m: 0.5 }}></TextField>
            ETH
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box display="flex" alignItems="center" justifyContent="right">
            Number of Taskers
            <TextField sx={{ m: 0.5 }}></TextField>
          </Box>
        </Grid>
      </Grid>
    </DefaultGrayCard>
  );
}
