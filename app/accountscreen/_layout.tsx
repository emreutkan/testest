import React from 'react';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // Import GestureHandlerRootView
import { store } from "@/app/store";
import { Slot } from 'expo-router';

const Layout = () => {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Provider store={store}>
                <Slot />
            </Provider>
        </GestureHandlerRootView>
    );
};

export default Layout;
