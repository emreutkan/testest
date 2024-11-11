import React from 'react';
import Header from "@/components/afterloginComponents/Header";
import { Slot } from 'expo-router';

const Layout = () => {
    return (
        <>
            <Header />
            <Slot />
        </>
    );
};

export default Layout;
