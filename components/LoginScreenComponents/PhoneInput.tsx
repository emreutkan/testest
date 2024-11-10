import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Modal, StyleSheet, Platform, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { countryCodes } from '@/components/constants/countryCodes';
import { scaleFont } from '@/components/utils/ResponsiveFont';
import { UserModel } from "@/models/UserModel";

const PhoneInput = () => {
    const user = UserModel.getInstance();

    const [tempCode, setTempCode] = useState(user.getSelectedCode());
    const [isPickerVisible, setIsPickerVisible] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState(user.getPhoneNumber() || '');
    const [isTyping, setIsTyping] = useState(false);

    const handleChangeText = (text) => {
        if (text.length <= 9) {
            setPhoneNumber(text); // Update local state immediately
            user.setPhoneNumber(text); // Update UserModel as needed
        }
        setIsTyping(text.length > 0);
    };

    const handleClearText = () => {
        setPhoneNumber('');
        user.setPhoneNumber('');
        setIsTyping(false);
    };

    const handleConfirmSelection = () => {
        user.setSelectedCode(tempCode); // Update code in UserModel
        setIsPickerVisible(false);
    };

    const renderCountryCodeSelector = () => (
        <TouchableOpacity onPress={() => setIsPickerVisible(true)} style={styles.countryCodeContainer}>
            <Text style={styles.countryCodeText}>{user.getSelectedCode()}</Text>
        </TouchableOpacity>
    );

    const renderPicker = () => (
        <Picker
            selectedValue={tempCode}
            onValueChange={(itemValue) => setTempCode(itemValue)}
            style={styles.picker}
        >
            {countryCodes.map((item) => (
                <Picker.Item key={item.code} label={`${item.country} (${item.code})`} value={item.code} />
            ))}
        </Picker>
    );

    return (
        <View style={[
            styles.inputContainer,
            isTyping && { borderColor: 'gray' } // Change border color when typing
        ]}>
            {renderCountryCodeSelector()}
            <TextInput
                style={styles.phoneInput}
                placeholder="Phone number"
                onChangeText={handleChangeText}
                value={phoneNumber}
                keyboardType="phone-pad"
                maxLength={9} // Enforces maximum of 9 characters
            />
            {isTyping && (
                <TouchableOpacity onPress={handleClearText} style={styles.clearButton}>
                    <Text style={styles.clearButtonText}>X</Text>
                </TouchableOpacity>
            )}

            {isPickerVisible && (
                <Modal visible={isPickerVisible} transparent animationType="slide">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            {renderPicker()}
                            <TouchableOpacity onPress={handleConfirmSelection} style={styles.confirmButton}>
                                <Text style={styles.confirmButtonText}>OK</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setIsPickerVisible(false)} style={styles.cancelButton}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: Dimensions.get('window').width * 0.8,
        backgroundColor: '#fff',
        borderRadius: scaleFont(16),
        padding: scaleFont(20),
        alignItems: 'center',
    },
    picker: {
        width: '100%',
    },
    confirmButton: {
        marginTop: scaleFont(10),
        backgroundColor: '#007AFF',
        paddingVertical: scaleFont(10),
        paddingHorizontal: scaleFont(20),
        borderRadius: scaleFont(5),
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: scaleFont(16),
    },
    cancelButton: {
        marginTop: scaleFont(10),
        paddingVertical: scaleFont(10),
        paddingHorizontal: scaleFont(20),
    },
    cancelButtonText: {
        color: '#FF0000',
        fontSize: scaleFont(16),
    },
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
    countryCodeContainer: {
        paddingRight: scaleFont(10),
        paddingVertical: scaleFont(10),
        backgroundColor: 'transparent',
    },
    countryCodeText: {
        fontSize: scaleFont(16),
        color: '#333',
    },
    phoneInput: {
        flex: 1,
        fontSize: scaleFont(16),
        color: '#333',
        // borderWidth: 1,
        textAlignVertical: 'center',
        fontFamily: Platform.OS === 'android' ? 'Poppins' : 'Poppins-Regular',
        paddingVertical: scaleFont(10),
    },
    clearButton: {
        paddingHorizontal: scaleFont(10),
        paddingVertical: scaleFont(5),
        justifyContent: 'center',
        alignItems: 'center',
    },
    clearButtonText: {
        color: '#999',
        fontSize: scaleFont(16),
    },
});

export default PhoneInput;
