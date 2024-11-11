import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { height: screenHeight } = Dimensions.get('window'); // Get device height
const HEADER_HEIGHT = screenHeight * 0.2; // 20% of the screen height

const Header = () => {
    return (
        <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Header Component</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        height: HEADER_HEIGHT, // Set header height to 20% of the screen height
        backgroundColor: '#6200ee', // Example background color
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default Header;
