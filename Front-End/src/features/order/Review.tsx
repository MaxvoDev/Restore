import { Typography } from '@mui/material';
import BasketTable from '../basket/BasketTable';
import { useAppSelector } from '../../app/store/configureStore';

export default function Review() {
    const { basket } = useAppSelector(state => state.basket);
    return (
        <>
            <Typography variant="h6" gutterBottom>
                Order summary
            </Typography>
            <BasketTable isBasketPage={false} items={basket?.items!} />
        </>
    );
}
