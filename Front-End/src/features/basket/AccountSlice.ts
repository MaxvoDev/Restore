import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { User } from "../../app/models/user";
import agent from "../../app/api/agent";

export interface AccountState{
    user: User | null;
}

const initialState: AccountState = {
    user: null
};

export const signInUserAsync = createAsyncThunk<User, { username: string, password: string }>(
    'account/signInUserAsync',
    async (loginDto, thunkAPI) => {
        try{
            const user = agent.Account.signin(loginDto);
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        }
        catch(error: any){
            thunkAPI.rejectWithValue({ error: error.data });
        }
    }
);

export const fetchCurrentUserAsync = createAsyncThunk<User>(
    'account/fetchCurrentUserAsync',
    async (_, thunkAPI) => {
        try{
            const user = agent.Account.currentUser();
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        }
        catch(error: any){
            thunkAPI.rejectWithValue({ error: error.data });
        }
    }
);

export const AccountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        signOut: (state, action) => {
            state.user = null;
            localStorage.removeItem('user');
        }
    },
    extraReducers: (builder => {
        builder.addMatcher(isAnyOf(signInUserAsync.fulfilled, fetchCurrentUserAsync.fulfilled), (state, action) => {
            state.user = action.payload;
        });

        builder.addMatcher(isAnyOf(signInUserAsync.rejected, fetchCurrentUserAsync.rejected), (state, action) => {
            console.error(action.error);
        });
    })
});

export const { signOut } = AccountSlice.actions;