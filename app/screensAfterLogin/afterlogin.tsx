import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/store'; // Adjust the path to your store type
import Header from "@/components/afterloginComponents/Header";
const AfterLoginScreen = () => {
    const dispatch = useDispatch();

    return (
        <View style={styles.container}>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    cartInfo: {
        fontSize: 16,
        marginVertical: 8,
    },
});

export default AfterLoginScreen;
