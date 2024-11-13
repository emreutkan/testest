import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store'; // Adjust this import to match your store structure
import { scaleFont } from '@/components/utils/ResponsiveFont';
import { Ionicons } from '@expo/vector-icons'; // Make sure you have this package installed: `expo install @expo/vector-icons`
import LoginButton from "@/components/LoginScreenComponents/loginButton";
import { router } from "expo-router";

interface Address {
    street: string;
    neighborhood: string;
    district: string;
    province: string;
    country: string;
    postalCode: string;
    apartmentNo: string;
}

const AddressBar: React.FC = () => {
    const addresses = useSelector((state: RootState) => state.user.addresses) as Address[];
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(addresses.length > 0 ? addresses[0] : null);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [textWidth, setTextWidth] = useState<number>(0);

    const handleAddressSelect = (address: Address) => {
        setSelectedAddress(address);
        setModalVisible(false);
    };

    const renderAddressContent = () => {
        if (!selectedAddress) return 'No address selected';
        if (textWidth <= scaleFont(100)) {
            return selectedAddress.street;
        } else if (textWidth > scaleFont(100) && textWidth <= scaleFont(200)) {
            return `${selectedAddress.street}`;
        } else {
            return `${selectedAddress.street}, ${selectedAddress.district}`;
        }
    };

    const switchToAddAddress = () => {
        router.push('../addressSelectionScreen');
    };

    return (
        <View
            style={[
                styles.addressBar,
                { minWidth: textWidth + scaleFont(40) } // Adjust minWidth dynamically
            ]}
        >
            <Ionicons name="location-sharp" size={scaleFont(20)} color="#666" style={styles.icon} />
            <Text
                style={styles.addressText}
                onLayout={(event) => setTextWidth(event.nativeEvent.layout.width)}
            >
                {renderAddressContent()}
            </Text>

            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.touchableOverlay} />

            {modalVisible && (
                <Modal
                    transparent
                    animationType="slide"
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <FlatList
                                data={addresses}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity onPress={() => handleAddressSelect(item)} style={styles.addressOption}>
                                        <Text style={styles.addressOptionText}>
                                            {`${item.street}, ${item.district}`}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            />
                            <TouchableOpacity onPress={switchToAddAddress} style={styles.addAddressOption}>
                                <Text style={styles.addAddressOptionText}> + Add new address</Text>
                            </TouchableOpacity>

                            <LoginButton onPress={() => setModalVisible(false)} style={styles.closeButton} title="Close" />
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    addressBar: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: scaleFont(10),
        borderRadius: scaleFont(20),
        backgroundColor: '#f1f1f1',
        borderColor: '#ccc',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 2,
        maxHeight: scaleFont(60),
        minWidth: scaleFont(120),
    },
    addressText: {
        fontSize: scaleFont(16),
        color: '#333',
        marginLeft: scaleFont(8),
    },
    icon: {},
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: scaleFont(10),
        padding: scaleFont(15),
    },
    addressOption: {
        paddingVertical: scaleFont(10),
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    addressOptionText: {
        fontSize: scaleFont(16),
        color: '#333',
    },
    addAddressOptionText: {
        fontSize: scaleFont(16),
        color: '#333',
    },
    closeButton: {
        marginTop: scaleFont(10),
        alignItems: 'center',
        padding: scaleFont(10),
        backgroundColor: '#ccc',
        borderRadius: scaleFont(5),
    },
    touchableOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
});

export default AddressBar;
