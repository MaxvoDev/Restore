import { Backdrop, CircularProgress, Typography } from "@mui/material"

export default function LoadingComponent() {
    return (
        <>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={true}
            >
                <CircularProgress color="inherit" />
                <Typography marginLeft={3}>Loading...</Typography>
            </Backdrop>
        </>
    )
}