import { Paper, TextField } from "@mui/material";

export default function ProductSearch() {
    return (
        <Paper elevation={3} sx={{ mb: 2 }}>
            <TextField
                label="Search Product..."
                variant="outlined"
                fullWidth>

            </TextField>
        </Paper>
    )
}