import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { Product, ProductParams } from "../../app/models/product";
import agent from "../../app/api/agent";
import { RootState } from "../../app/store/configureStore";
import { MetaData } from "../../app/models/pagination";

const productAdapter = createEntityAdapter<Product>();

export interface CatalogState{
    productLoaded: boolean;
    filterLoaded: boolean;
    status: string;
    types?: string[];
    brands?: string[];
    productParams: ProductParams;
    metaData: MetaData | null;
}

function createAxiosParams(productParams: ProductParams): URLSearchParams{
    const params = new URLSearchParams();
    params.append('pageNumber', productParams.pageNumber.toString());
    params.append('pageSize', productParams.pageSize.toString());
    params.append('orderBy', productParams.orderBy.toString());
    if(productParams.brands) params.append('brands', productParams.brands.toString());
    if(productParams.types) params.append('types', productParams.types?.toString());
    if(productParams.searchTerm) params.append('searchTerm', productParams.searchTerm);
    return params;
}

export const fetchProductsAsync = createAsyncThunk<Product[], void, { state: RootState }>(
    'catalog/fetchAllProductsAsync',
    async (_, thunkAPI) => {
        const params = createAxiosParams(thunkAPI.getState().catalog.productParams);
        try{
            const response = await agent.Catalog.list(params);
            thunkAPI.dispatch(setMetaData(response.metaData));
            return response.items;
        }
        catch(error: any){
            return thunkAPI.rejectWithValue({ error: error.data });
        }
    }
)

export const fetchProductDetailAsync = createAsyncThunk<Product, number>(
    'catalog/fetchProductDetailAsync',
    async (productId, thunkAPI) => {
        try{
            return await agent.Catalog.details(productId);
        }
        catch(error: any){
            return thunkAPI.rejectWithValue({ error: error.data });
        }
    }
)

export const fetchProductFiltersAsync = createAsyncThunk<{ brands: string[], types: string[] }, void>(
    'catalog/fetchProductFiltersAsync',
    async (_, thunkAPI) => {
        try{
            return await agent.Catalog.getFilters();
        }
        catch(error: any){
            return thunkAPI.rejectWithValue( { error: error.data });
        }
    }
)

function initParams(){
    return {
        pageNumber: 1,
        pageSize: 6,
        orderBy: 'name',
        brands: [],
        types: [],
        searchTerm: ""
    }
}

export const catalogSlice = createSlice({
    name: 'catalog',
    initialState: productAdapter.getInitialState<CatalogState>({
        productLoaded: false,
        filterLoaded: false,
        status: 'idle',
        brands: [],
        types: [],
        productParams: initParams(),
        metaData: null
    }),
    reducers: {
        resetParams: (state, action) => {
            state.productParams = initParams();
        },

        setProductParams: (state, action) => {
            state.productParams = {
                ...state.productParams,
                [action.payload.name]: action.payload.value 
            }
            if(action.payload.name != 'pageNumber')
                state.productParams.pageNumber = 1;

            state.productLoaded = false;
        },
        
        setMetaData: (state, action) => {
            state.metaData = action.payload;
        }
    },
    extraReducers: (builder => {
        builder.addCase(fetchProductsAsync.pending, (state, action) => {
            state.status = 'pendingFetchProduct';
        });

        builder.addCase(fetchProductDetailAsync.pending, (state, action) => {
            state.status = 'pendingFetchProduct';
        });

        builder.addCase(fetchProductsAsync.fulfilled, (state, action) => {
            productAdapter.setAll(state, action.payload);
            state.status = 'idle';
            state.productLoaded = true;
        });

        builder.addCase(fetchProductDetailAsync.fulfilled, (state, action) => {
            productAdapter.upsertOne(state, action.payload);
            state.status = 'idle';
            state.productLoaded = true;
        });

        builder.addCase(fetchProductsAsync.rejected, (state, action) => {
            state.status = 'idle';
        });

        builder.addCase(fetchProductFiltersAsync.pending, (state, action)=> {
            state.status = 'pendingFetchProductFiltersAsync';
        });

        builder.addCase(fetchProductFiltersAsync.fulfilled, (state, action) => {
            state.status = 'idle';
            state.types = action.payload.types;
            state.brands = action.payload.brands;
            state.filterLoaded = true;
        });

        builder.addCase(fetchProductFiltersAsync.rejected, (state, action) => {
            state.status = 'idle';
        });
    })
});

export const productSelectors = productAdapter.getSelectors((state: RootState) => state.catalog);

export const { resetParams, setProductParams, setMetaData } = catalogSlice.actions;