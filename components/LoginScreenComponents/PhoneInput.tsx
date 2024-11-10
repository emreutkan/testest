import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Modal, StyleSheet, Platform, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { countryCodes } from '@/components/constants/countryCodes';
import { scaleFont } from '@/components/utils/ResponsiveFont';

const PhoneInput = ({ user }) => {
    const [tempCode, setTempCode] = useState(user.getSelectedCode());
    const [isPickerVisible, setIsPickerVisible] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState(user.getPhoneNumber() || '');

    const handleChangeText = (text: String) => {
        setPhoneNumber(text); // Update local state immediately
        user.setPhoneNumber(text); // Update UserModel as needed
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
        <View style={styles.inputContainer}>
            {renderCountryCodeSelector()}
            <TextInput
                style={styles.phoneInput}
                placeholder="Phone number"
                onChangeText={(text) => {
                    handleChangeText(text); // Update phone number in UserModel
                }}
                value={phoneNumber}
                keyboardType="phone-pad"
            />

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
        padding: scaleFont(20),
        borderWidth: 1,
        borderRadius: 15,
        textAlignVertical: 'center', // Centers the text within the padding
        position: 'absolute',
        backgroundColor: 'transparent'

    },
    countryCodeText: {
        fontSize: scaleFont(16),
        color: '#333',
        // borderWidth: 1

    },
    phoneInput: {
        flex: 1,
        fontSize: scaleFont(16),
        color: '#333',
        fontFamily: 'Poppins-Regular',
        // marginLeft: scaleFont(10), // Adds space between code and input
        // borderWidth: 1

    },
});

export default PhoneInput;
