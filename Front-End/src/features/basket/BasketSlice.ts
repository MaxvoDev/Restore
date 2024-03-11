import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Basket } from "../../app/models/basket";
import agent from "../../app/api/agent";
import { getCookie } from "../../app/util/util";

export interface BasketState{
    basket: Basket | null;
    status: string;
}

const initialState: BasketState = {
    basket: null,
    status: 'idle'
}

export const fetchBasketItemAsync = createAsyncThunk<Basket>(
    'basket/fetchBasketItemAsync',
    async (_, thunkAPI) => {
        try{
            return await agent.Basket.get();
        }
        catch(error){
            return thunkAPI.rejectWithValue(error);
        }
    },
    {
        condition: (state, action) => {
            const buyerId = getCookie('buyerId');
            if(!buyerId) return false;
        }
    }
);

export const addBasketItemAsync = createAsyncThunk<Basket, { productId: number, quantity: number }>(
    'basket/addBasketItemAsync',
    async ({ productId, quantity }, thunkAPI) => {
        try{
            return await agent.Basket.addItem(productId, quantity);
        }
        catch(err){ 
            return thunkAPI.rejectWithValue(err);
        }
    }    
)

export const removeBasketItemAsync = createAsyncThunk<void, { productId: number, quantity: number }>(
    'basket/removeBasketItemAsync',
    async ({ productId, quantity }, thunkAPI) => {
        try{
            return await agent.Basket.removeItem(productId, quantity);
        }   
        catch(err){
            return thunkAPI.rejectWithValue(err);
        }
    }
)

export const basketSlice = createSlice({
    name: 'basket',
    initialState,
    reducers: {
        setBasket: (state, action) => {
            state.basket = action.payload;
        }
    },

    extraReducers: (builder => {
        builder.addCase(fetchBasketItemAsync.pending, (state, action) => {
            console.log(action);
        });

        builder.addCase(fetchBasketItemAsync.fulfilled, (state, action) => {
            state.status = 'idle';
            state.basket = action.payload;
        });

        builder.addCase(fetchBasketItemAsync.rejected, (state, action) => {
            state.status = 'idle';
        });


        builder.addCase(addBasketItemAsync.pending, (state, action) => {
            console.log(action);
            state.status = 'pendingAddItem' + action.meta.arg.productId;
        });

        builder.addCase(addBasketItemAsync.fulfilled, (state, action) => {
            state.status = 'idle';
            state.basket = action.payload;
        });

        builder.addCase(addBasketItemAsync.rejected, (state, action) => {
            console.log(action);
            state.status = 'idle';
        });

        builder.addCase(removeBasketItemAsync.pending, (state, action) => {
            console.log(action);
            state.status = 'pendingRemoveItem' + action.meta.arg.productId;
        });

        builder.addCase(removeBasketItemAsync.fulfilled, (state, action) => {
            const { productId, quantity } = action.meta.arg;
            const index = state.basket?.items.findIndex((item) => item.productId == productId);
            if(index === -1 || !index) return;
    
            state.basket!.items[index].quantity -= quantity;
            if(state.basket!.items[index].quantity <= 0)
                state.basket?.items.splice(index, 1);

            state.status = 'idle';
        });

        builder.addCase(removeBasketItemAsync.rejected, (state, action) => {
            state.status = 'idle';
        })
    })
})

export const { setBasket } = basketSlice.actions;