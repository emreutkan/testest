import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Modal, StyleSheet, Platform, Dimensions, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { countryCodes } from '@/components/constants/countryCodes';
import { scaleFont } from '@/components/utils/ResponsiveFont';

const PhoneInput = ({ selectedCode, onCodeChange, phoneNumber, onPhoneChange }) => {
    const [tempCode, setTempCode] = useState(selectedCode);
    const [isPickerVisible, setIsPickerVisible] = useState(false);

    const handleConfirmSelection = () => {
        onCodeChange(tempCode);
        setIsPickerVisible(false);
    };

    return (
        <View style={styles.inputContainer}>
            {/* Country Code Selection */}
            <TouchableOpacity onPress={() => setIsPickerVisible(true)} style={styles.countryCodeContainer}>
                <Text style={styles.countryCodeText}>{selectedCode}</Text>
            </TouchableOpacity>

            {/* iOS-specific Modal for Picker */}
            {Platform.OS === 'ios' ? (
                <Modal visible={isPickerVisible} transparent animationType="slide">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Picker
                                selectedValue={tempCode}
                                onValueChange={(itemValue) => setTempCode(itemValue)}
                                style={styles.picker}
                            >
                                {countryCodes.map((item) => (
                                    <Picker.Item
                                        key={item.code}
                                        label={`${item.country} (${item.code})`}
                                        value={item.code}
                                    />
                                ))}
                            </Picker>
                            <TouchableOpacity onPress={handleConfirmSelection} style={styles.confirmButton}>
                                <Text style={styles.confirmButtonText}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            ) : null}

            {/* Android Picker Display */}
            {Platform.OS === 'android' ? isPickerVisible ? (
                <View style={{ height: scaleFont(200), width: '100%' }}>
                    <Picker
                        selectedValue={selectedCode}
                        onValueChange={(itemValue) => onCodeChange(itemValue)}
                        style={styles.picker}
                    >
                        {countryCodes.map((item) => (
                            <Picker.Item
                                key={item.code}
                                label={`${item.country} (${item.code})`}
                                value={item.code}
                            />
                        ))}
                    </Picker>
                </View>
            ) : null : null}

            {/* Phone Input */}
            <TouchableOpacity style={styles.phoneInputContainer} activeOpacity={1}>
                <TextInput
                    style={styles.phoneInput}
                    placeholder="Phone number"
                    value={phoneNumber}
                    onChangeText={onPhoneChange}
                    keyboardType="phone-pad"
                />
            </TouchableOpacity>
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
        marginTop: scaleFont(20),
        backgroundColor: '#007AFF',
        paddingVertical: scaleFont(10),
        paddingHorizontal: scaleFont(20),
        borderRadius: scaleFont(5),
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: scaleFont(21),
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
    },
    countryCodeText: {
        fontSize: scaleFont(16),
        color: '#333',
    },
    phoneInput: {
        flex: 1,
        fontSize: scaleFont(16),
        color: '#333',
        fontFamily: 'Poppins-Regular',
    },
    phoneInputContainer: {
        flex: 1,
        paddingVertical: scaleFont(10),
        paddingHorizontal: 0,
    },
});

export default PhoneInput;
