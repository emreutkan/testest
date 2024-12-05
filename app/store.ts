

// store.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../slices/userSlice'; // Create this file as shown below
// import thunk from 'redux-thunk';

export const store = configureStore({
    reducer: {
        user: userReducer, // You can add more reducers here as your app grows
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
