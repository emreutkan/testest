// components/LoginScreenComponents/EmailInput.tsx

import React, { useState } from 'react';
import { TouchableOpacity, TextInput, StyleSheet, Keyboard } from 'react-native';
import { scaleFont } from '../utils/ResponsiveFont';
import { UserModel } from '@/models/UserModel';

const EmailLoginField: React.FC = () => {
    const user = UserModel.getInstance();
    const [email, setEmail] = useState<string>(user.getEmail() || '');

    const handleEmailChange = (text: string) => {
        setEmail(text);
        user.setEmail(text);
    };

    return (
        <TouchableOpacity
            style={styles.inputContainer}
            onPress={() => Keyboard.dismiss()}
        >
            <TextInput
                style={styles.buttonText}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={handleEmailChange}
                onFocus={() => console.log("Input Focused")}
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
        borderRadius: scaleFont(16),
        paddingHorizontal: scaleFont(15),
        backgroundColor: '#fff',
        width: '100%',
        height: scaleFont(50),
    },
    buttonText: {
        marginLeft: scaleFont(10),
        flex: 1,
        fontSize: scaleFont(17),
        color: '#1a1818',
        fontFamily: 'Poppins-Regular',
    },
});

export default EmailLoginField;
