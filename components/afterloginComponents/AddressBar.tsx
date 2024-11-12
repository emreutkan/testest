import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store'; // Adjust this import to match your store structure
import { scaleFont } from '@/components/utils/ResponsiveFont';
import { Ionicons } from '@expo/vector-icons'; // Make sure you have this package installed: `expo install @expo/vector-icons`

const AddressBar: React.FC = () => {
    const addresses = useSelector((state: RootState) => state.user.addresses);
    const [selectedAddress, setSelectedAddress] = useState<string>(addresses.length > 0 ? addresses[0] : 'No address available');
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [containerWidth, setContainerWidth] = useState<number>(0);

    const handleAddressSelect = (address: string) => {
        setSelectedAddress(address);
        setModalVisible(false);
    };

    const renderAddressContent = () => {
        if (containerWidth <= scaleFont(26)) {
            return null;
        } else if (containerWidth > scaleFont(26) && containerWidth <= scaleFont(100)) {
            return (
                <Text style={styles.addressText}>
                    {addresses.length > 0 ? selectedAddress.split(' ')[0] : 'no\naddress'}
                </Text>
            );
        } else {
            return (
                <Text style={styles.addressText}>
                    {addresses.length > 0 ? selectedAddress : 'No address selected'}
                </Text>
            );
        }
    };

    return (
        <View
            style={styles.addressBar}
            onLayout={(event) => setContainerWidth(event.nativeEvent.layout.width)}
        >
            <Ionicons name="location-sharp" size={scaleFont(20)} color="#666" style={styles.icon} />
            {renderAddressContent()}

            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.touchableOverlay}>
            </TouchableOpacity>

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
                                        <Text style={styles.addressOptionText}>{item}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
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
    },
    addressText: {
        fontSize: scaleFont(16),
        color: '#333',
        marginLeft: scaleFont(8),
    },
    icon: {
        marginRight: scaleFont(0),
    },
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
    closeButton: {
        marginTop: scaleFont(10),
        alignItems: 'center',
        padding: scaleFont(10),
        backgroundColor: '#ccc',
        borderRadius: scaleFont(5),
    },
    closeButtonText: {
        color: '#fff',
        fontSize: scaleFont(16),
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
