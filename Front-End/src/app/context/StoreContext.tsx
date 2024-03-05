import { PropsWithChildren, createContext, useContext, useState } from "react";
import { Basket } from "../models/basket";

interface StoreContextValue{
    basket: Basket | null;
    setBasket: (basket: Basket) => void;
    removeBasketItem: (productId: number, quantity: number) => void;
}

export const StoreContext = createContext<StoreContextValue | undefined>(undefined);

export function useStoreContext(){
    const context = useContext(StoreContext);

    if(context == undefined){
        throw Error("Oops - we do not seem to be inside provider");
    }

    return context;
}

export function StoreProvider({children}: PropsWithChildren<any>){
    const [basket, setBasket] = useState<Basket | null>(null);

    function removeBasketItem(productId: number, quantity: number){
        if(!basket) return;
        const items = [...basket.items]
        const productIndex = items.findIndex(i => i.productId == productId);
        if(productIndex > -1){
            items[productIndex].quantity -= quantity;
            if(items[productIndex].quantity <= 0){
                items.splice(productIndex, 1);
            }
            setBasket(prevState => {
                return {
                    ...prevState!,
                    items
                }
            });
        }
    }

    return (
        <StoreContext.Provider value={{ basket, setBasket, removeBasketItem }}>
            {children}
        </StoreContext.Provider>
    )
}