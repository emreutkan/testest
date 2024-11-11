// userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    name: string;
    surname: string;
    email: string;
    phoneNumber: string;
    location: { latitude: number; longitude: number } | null;
}

const initialState: UserState = {
    name: '',
    surname: '',
    email: '',
    phoneNumber: '',
    location: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserDetails: (state, action: PayloadAction<{ name: string; surname: string; email: string; phoneNumber: string }>) => {
            state.name = action.payload.name;
            state.surname = action.payload.surname;
            state.email = action.payload.email;
            state.phoneNumber = action.payload.phoneNumber;
        },
        setLocation: (state, action: PayloadAction<{ latitude: number; longitude: number }>) => {
            state.location = action.payload;
        },
    },
});

export const { setUserDetails, setLocation } = userSlice.actions;
export default userSlice.reducer;
