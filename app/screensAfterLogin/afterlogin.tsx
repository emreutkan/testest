import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/store'; // Adjust the path to your store type
import { addItemToCart } from '@/slices/cartSlice'; // Adjust path to your actions

const AfterLoginScreen = () => {
    const dispatch = useDispatch();
    const cartItems = useSelector((state: RootState) => state.cart.items); // Access cart items from Redux state

    const handleAddItem = () => {
        // Example action to add an item to the cart
        dispatch(addItemToCart({ id: '1', name: 'Example Item', quantity: 1, price: 10 }));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.welcomeText}>Welcome to the After Login Screen!</Text>
            <Text style={styles.cartInfo}>Items in Cart: {cartItems.length}</Text>
            <Button title="Add Item to Cart" onPress={handleAddItem} />
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
