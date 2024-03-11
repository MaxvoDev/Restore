import { Grid, Paper, Box, Typography } from "@mui/material";

export default function NotFound() {
    return (
        <Grid container justifyContent="center" alignItems="center" minHeight="80vh">
            <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ padding: 4 }}>
                    <Box textAlign="center">
                        <Typography variant="h4" color="textPrimary" gutterBottom>
                            404 NOT FOUND
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                            Oops, We could not find what you are looking for
                        </Typography>
                    </Box>
                </Paper>
            </Grid>
        </Grid>
    )
}