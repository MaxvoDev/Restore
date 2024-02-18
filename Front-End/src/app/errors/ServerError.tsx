import { Container, Paper, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";

export default function ServerError() {
    const { state } = useLocation();

    return (
        <Container component={Paper}>
            {state?.error ? (
                <Typography variant="h3">{state.error}</Typography>
            )
                :
                (
                    <Typography variant="h3">Server Error</Typography>
                )
            }

        </Container>
    )
}