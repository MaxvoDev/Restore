import { Grid, Paper, Box, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";

export default function ServerError() {
    const { state } = useLocation();

    return (

        <Grid container justifyContent="center" alignItems="center" minHeight="80vh">
            <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ padding: 4 }}>
                    <Box textAlign="center">
                        <Typography variant="h4" color="textPrimary" gutterBottom>
                            Server Error
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                            {state.error}
                        </Typography>
                    </Box>
                </Paper>
            </Grid>
        </Grid>
    )
}