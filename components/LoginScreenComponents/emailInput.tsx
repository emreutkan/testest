import React, { useState } from 'react';
import { TouchableOpacity, TextInput, StyleSheet, View, Keyboard } from 'react-native';
import { scaleFont } from '../utils/ResponsiveFont';
const EmailLoginField: React.FC = () => {
    const [email, setEmail] = useState<string>('');

    return (
        <TouchableOpacity
            style={styles.inputContainer}
            onPress={() => Keyboard.dismiss()} // Dismiss keyboard if you click outside
        >
            <TextInput
                style={styles.buttonText}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
                onFocus={() => console.log("Input Focused")} // Optional: log when focused
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 16,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        width: '100%',
        height: scaleFont(50)
    },

    buttonText: {
        marginLeft: 10,
        flex: 1,
        fontSize: 17,
        color: '#1a1818',
        fontFamily: 'Poppins-Regular',
    },
});

export default EmailLoginField;
