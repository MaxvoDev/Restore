import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { User } from "../../app/models/user";
import agent from "../../app/api/agent";
import { setBasket } from "./BasketSlice";

export interface AccountState{
    user: User | null;
}

const initialState: AccountState = {
    user: null,
};

export const signInUserAsync = createAsyncThunk<User, { username: string, password: string }>(
    'account/signInUserAsync',
    async (loginDto, thunkAPI) => {
        try{
            const user = await agent.Account.signin(loginDto);
            localStorage.setItem('user', JSON.stringify(user));
            if(user.basket) thunkAPI.dispatch(setBasket(user.basket));
            return user;
        }
        catch(error: any){
            return thunkAPI.rejectWithValue({ error: error });
        }
    }
);

export const signUpUserAsync = createAsyncThunk<User, { username: string, password: string, email: string }>(
    'account/signUpUserAsync',
    async (signUpDto, thunkAPI) => {
        try{
            const user = await agent.Account.signup(signUpDto);
            return user;
        }
        catch(error: any){
            return thunkAPI.rejectWithValue({ error: error });
        }
    }
);

export const fetchCurrentUserAsync = createAsyncThunk<User>(
    'account/fetchCurrentUserAsync',
    async (_, thunkAPI) => {
        const savedUser = JSON.parse(localStorage.getItem('user')!);
        thunkAPI.dispatch(setUser(savedUser));
        try{
            const user = await agent.Account.currentUser();
            localStorage.setItem('user', JSON.stringify(user));
            if(user.basket) thunkAPI.dispatch(setBasket(user.basket));
            return user;
        }
        catch(error: any){
            return thunkAPI.rejectWithValue({ error: error });
        }
    },
    {
        condition: () => {
            if (!localStorage.getItem('user')) return false;
        }
    }
);

export const AccountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        signOut: (state) => {
            state.user = null;
            localStorage.removeItem('user');
        },

        setUser: (state, action) => {
            state.user = action.payload;
        }
    },
    extraReducers: (builder => {
        builder.addMatcher(isAnyOf(signInUserAsync.fulfilled, fetchCurrentUserAsync.fulfilled), (state, action) => {
            state.user = action.payload;
        });

        builder.addMatcher(isAnyOf(signInUserAsync.rejected, fetchCurrentUserAsync.rejected), (state, action: any) => {
            state.user = null;
            localStorage.removeItem('user');
            throw action.payload.error;
        });
        
        builder.addMatcher(isAnyOf(signUpUserAsync.rejected), (state, action: any) => {
            throw action.payload.error;
        });
    })
});

export const { signOut, setUser } = AccountSlice.actions;