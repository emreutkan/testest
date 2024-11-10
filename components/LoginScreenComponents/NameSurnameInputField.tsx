import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { TouchableOpacity, TextInput, StyleSheet, View, Keyboard } from 'react-native';
import { scaleFont } from '../utils/ResponsiveFont';

type NameSurnameFieldProps = {};

export interface NameSurnameFieldHandles {
    getFieldsText(): { firstName: string, surname: string };
}

const NameSurnameField = forwardRef<NameSurnameFieldHandles, NameSurnameFieldProps>((_, ref) => {
    const [fullName, setFullName] = useState<string>('');

    useImperativeHandle(ref, () => ({
        getFieldsText(): { firstName: string, surname: string } {
            const names = fullName.trim().split(/\s+/);
            const firstName = names.slice(0, -1).join(' ') || names[0];
            const surname = names[names.length - 1];
            return { firstName, surname };
        }
    }));

    const handleTextChange = (text: string) => {
        // Remove any non-letter characters except for spaces
        setFullName(text.replace(/[^a-zA-Z\s]/g, ''));
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.inputContainer} onPress={() => Keyboard.dismiss()}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your full name"
                    value={fullName}
                    onChangeText={handleTextChange}
                    onFocus={() => console.log("Name Input Focused")}
                />
            </TouchableOpacity>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 16,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        width: '100%',
        height: scaleFont(50),
    },
    input: {
        marginLeft: 10,
        flex: 1,
        fontSize: 17,
        color: '#1a1818',
        fontFamily: 'Poppins-Regular',
    },
});

export default NameSurnameField;