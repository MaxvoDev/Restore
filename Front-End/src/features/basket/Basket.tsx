import { useAppSelector } from "../../app/store/configureStore";
import EmptyBasketMessage from "./EmptyBasket";
import LoadingComponent from "../../app/layout/LoadingComponent";
import BasketTable from "./BasketTable";


export default function BasketPage() {
    const { basket } = useAppSelector(state => state.basket);

    if (!basket) return <LoadingComponent message="Loading Basket Items..."/>
    if (!basket.items.length) return <EmptyBasketMessage />

    return (
        <>
            <BasketTable isBasketPage={true} items={basket.items} />
        </>
    )
}   