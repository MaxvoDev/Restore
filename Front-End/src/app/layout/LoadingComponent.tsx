import { Backdrop, CircularProgress, Typography } from "@mui/material"
interface Props{
    message?: string;
}

export default function LoadingComponent({ message = "Loading..." }: Props) {
    return (
        <>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={true}
            >
                <CircularProgress color="inherit" />
                <Typography marginLeft={3}>{message}</Typography>
            </Backdrop>
        </>
    )
}