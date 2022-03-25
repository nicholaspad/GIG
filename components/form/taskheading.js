import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { gigTheme } from '../src/Theme.ts';

export default function TaskHeading() {
    return (
        <Box
            display="flex"
            flexWrap="wrap"
            alignItems="center"
            justifyContent="center"
            sx={{
                // backgroundColor: gigTheme.palette.background.paper,
            }}
        >
            {/* Task Title */}
            <TextField
                label="Task Title"
                variant="filled"
                fullWidth
                font={gigTheme.typography.fontFamily}
                sx={{
                    m: 1
                }}
            />

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
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="left"
                    >
                        Total crypto allocated:
                        <TextField sx={{ m: 0.5 }}></TextField>
                        ETH
                    </Box>
                </Grid>
                <Grid item xs={4}>
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="right"
                    >
                        Number of Taskers
                        <TextField sx={{ m: 0.5 }}></TextField>
                    </Box>
                </Grid>
            </Grid>

        </Box>
    )
}