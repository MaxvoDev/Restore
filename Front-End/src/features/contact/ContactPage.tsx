import { Button, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { decrement, increment } from "./CounterSlice";

export default function ContactPage(){
    const dispatch = useAppDispatch();
    const { data, title } = useAppSelector(state => state.counter);

    return (
        <>
        <Typography variant="h2">
            {data} { title}
            
        </Typography>

        <Button
        variant="contained"
        size="large"
        onClick={() => dispatch(increment(1))}>
            INCREMENT
        </Button>

        <Button variant="contained"
        size="large"
        onClick={() => dispatch(decrement(1))}
        >
            DECREMENT
        </Button>
        </>
    )
}