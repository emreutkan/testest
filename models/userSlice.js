// userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    phoneNumber: '',
    selectedCode: '+90',
    email: '',
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setPhoneNumber: (state, action) => {
            state.phoneNumber = action.payload;
        },
        setSelectedCode: (state, action) => {
            state.selectedCode = action.payload;
        },
        setEmail: (state, action) => {
            state.email = action.payload;
        },
    },
});

export const { setPhoneNumber, setSelectedCode, setEmail } = userSlice.actions;
export default userSlice.reducer;
