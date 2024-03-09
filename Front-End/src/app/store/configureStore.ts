import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { basketSlice } from "../../features/basket/BasketSlice";
import { counterSlice } from "../../features/contact/CounterSlice";
import { catalogSlice } from "../../features/catalog/CatalogSlice";
import { AccountSlice } from "../../features/basket/AccountSlice";


export  const store = configureStore({
    reducer: {
        basket: basketSlice.reducer,
        catalog: catalogSlice.reducer,
        account: AccountSlice.reducer,
        counter: counterSlice.reducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;