import { Container, Paper, Typography } from "@mui/material";

export default function NotFound(){
    return (
        <Container component={Paper}>
            <Typography variant="h3">Oops, We could not find what you are looking for</Typography>
        </Container>
    )
}