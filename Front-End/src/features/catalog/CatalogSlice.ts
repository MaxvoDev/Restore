import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { Product } from "../../app/models/product";
import agent from "../../app/api/agent";
import { RootState } from "../../app/store/configureStore";

const productAdapter = createEntityAdapter<Product>();

export interface CatalogState{
    productLoaded: boolean;
    status: string;
}

export const fetchAllProductsAsync = createAsyncThunk<Product[]>(
    'catalog/fetchAllProductsAsync',
    async () => {
        try{
            return await agent.Catalog.list();
        }
        catch(err){
            console.log(err);
        }
    }
)

export const fetchProductDetailAsync = createAsyncThunk<Product, number>(
    'catalog/fetchProductDetailAsync',
    async (productId) => {
        try{
            return await agent.Catalog.details(productId);
        }
        catch(err){
            console.log(err);
        }
    }
)

export const catalogSlice = createSlice({
    name: 'catalog',
    initialState: productAdapter.getInitialState({
        productLoaded: false,
        status: 'idle'
    }),
    reducers: {},
    extraReducers: (builder => {
        builder.addCase(fetchAllProductsAsync.pending, (state, action) => {
            state.status = 'pendingFetchProduct';
        });

        builder.addCase(fetchAllProductsAsync.fulfilled, (state, action) => {
            productAdapter.setAll(state, action.payload);
            state.status = 'idle';
            state.productLoaded = true;
        });

        builder.addCase(fetchAllProductsAsync.rejected, (state, action) => {
            state.status = 'idle';
        });

        builder.addCase(fetchProductDetailAsync.pending, (state, action) => {
            state.status = 'pendingfetchProductDetailAsync';
        });

        builder.addCase(fetchProductDetailAsync.fulfilled, (state, action) => {
            productAdapter.upsertOne(state, action.payload);
            state.status = 'idle';
        });

        builder.addCase(fetchProductDetailAsync.rejected, (state, action) => {
            state.status = 'idle';
        });
    })
});

export const productSelectors = productAdapter.getSelectors((state: RootState) => state.catalog);