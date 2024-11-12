import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Button,
    TextInput,
    Alert,
    ActivityIndicator,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    Image,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { addAddress, setCurrentAddress } from '@/slices/userSlice';
import { useNavigation } from '@react-navigation/native';
import MapView, { Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';
import LoginButton from "@/components/LoginScreenComponents/loginButton"; // Keep only one import
import debounce from 'lodash.debounce';

// Import custom marker image
import customMarker from '@/assets/images/logo.png'; // Ensure the path is correct

// Define the Address interface
interface Address {
    street: string;
    neighborhood: string;
    district: string;
    province: string;
    country: string;
    postalCode: string;
    apartmentNo: string;
}

const AddressSelectorScreen: React.FC = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const mapRef = useRef<MapView>(null);
    const [isMapInteracted, setIsMapInteracted] = useState<boolean>(false);
    const [initialLoading, setInitialLoading] = useState<boolean>(true);
    const [locationLoading, setLocationLoading] = useState<boolean>(false);
    const [activateAddressDetails, setActivateAddressDetails] = useState<boolean>(false);

    const [address, setAddress] = useState<Address>({
        street: '',
        neighborhood: '',
        district: '',
        province: '',
        country: '',
        postalCode: '',
        apartmentNo: '',
    });
    const [region, setRegion] = useState<Region>({
        latitude: 37.7749,
        longitude: -122.4194,
        latitudeDelta: 0.01, // Increased delta for better zoom control
        longitudeDelta: 0.01,
    });

    // Retrieve screen dimensions
    const { height, width } = Dimensions.get('window');
    const mapHeight = activateAddressDetails ? height * 0.3 : height * 0.8;

    // Function to handle fetching location and reverse geocoding
    const fetchLocation = async () => {
        try {
            const { status: existingStatus } = await Location.getForegroundPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Location.requestForegroundPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                Alert.alert('Permission Denied', 'Location permission is required to use this feature.');
                setInitialLoading(false);
                setLocationLoading(false);
                return;
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Highest,
                maximumAge: 10000,
                timeout: 5000,
            });

            const { latitude, longitude } = location.coords;

            const newRegion: Region = {
                latitude,
                longitude,
                latitudeDelta: 0.01, // Adjusted for better zoom
                longitudeDelta: 0.01,
            };

            setRegion(newRegion);
            mapRef.current?.animateToRegion(newRegion, 1000);

            await handleAddressUpdate(latitude, longitude, true); // Reset is desired on initial fetch

            setInitialLoading(false);
            setLocationLoading(false);
        } catch (error) {
            console.error('Error fetching location:', error);
            Alert.alert('Error', 'An error occurred while fetching the location.');
            setInitialLoading(false);
            setLocationLoading(false);
        }
    };

    const getUserLocation = async () => {
        if (locationLoading) return;
        setLocationLoading(true);
        await fetchLocation();
    };

    useEffect(() => {
        fetchLocation();
    }, []);

    const handleAddressChange = (field: keyof Address, value: string) => {
        setAddress(prevAddress => ({
            ...prevAddress,
            [field]: value,
        }));
    };

    const handleAddressConfirm = () => {
        const { street, district, province, country, postalCode, apartmentNo } = address;

        // Validate required fields; adjust as necessary
        if (street.trim() === '' || district.trim() === '' || country.trim() === '') {
            Alert.alert('Error', 'Please fill in at least Street, City, and Country.');
            return;
        }

        dispatch(addAddress(address));
        dispatch(setCurrentAddress(address));

        Alert.alert('Success', 'Address has been set!');
        navigation.goBack();
    };

    /**
     * Updated handleAddressUpdate function to handle both map press and drag end
     * @param latitude
     * @param longitude
     * @param shouldReset Determines whether to reset activateAddressDetails
     */
    const handleAddressUpdate = async (latitude: number, longitude: number, shouldReset: boolean = true) => {
        // if (shouldReset) {
        //     setActivateAddressDetails(false);
        // }
        // console.log('activateAddressDetails:', activateAddressDetails);

        try {
            const [addressData] = await Location.reverseGeocodeAsync({ latitude, longitude });
            if (addressData) {
                setAddress({
                    street: addressData.street || '',
                    neighborhood: addressData.subregion || '', // Adjust based on available data
                    district: addressData.city || '',
                    province: addressData.region || '',
                    country: addressData.country || '',
                    postalCode: addressData.postalCode || '',
                    apartmentNo: '', // Typically not available via reverse geocoding
                });
            } else {
                Alert.alert('No Address Found', 'Unable to retrieve address for the selected location.');
            }
        } catch (error) {
            console.error('Error fetching address:', error);
            Alert.alert('Error', 'An error occurred while fetching the address.');
        }
    };

    /**
     * Debounced version of handleAddressUpdate to improve performance
     */
    const debouncedHandleAddressUpdate = useRef(
        debounce(async (latitude: number, longitude: number) => {
            await handleAddressUpdate(latitude, longitude, true); // Reset on map interaction
        }, 500) // 500ms delay
    ).current;

    /**
     * Cleanup debounce on unmount
     */
    useEffect(() => {
        return () => {
            debouncedHandleAddressUpdate.cancel();
        };
    }, []);

    if (initialLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading...</Text>
            </View>
        );
    }

    const toggleAddressDetails = () => {
        setActivateAddressDetails(prevState => !prevState);
        console.log(activateAddressDetails)
    };

    const mapOntouchEvent = () => {
        setIsMapInteracted(true)
        setActivateAddressDetails(false)
    }
    return (
        <View style={styles.container}>
            <View style={[styles.mapContainer, { height: mapHeight, width: width }]}>
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    region={region}
                    onRegionChangeComplete={(newRegion: Region) => {
                        if (isMapInteracted) {
                            setRegion(newRegion);
                            const { latitude, longitude } = newRegion;
                            debouncedHandleAddressUpdate(latitude, longitude);
                        }
                    }}
                    onTouchStart={() => mapOntouchEvent()}
                    mapType="terrain"
                    showsUserLocation={true}
                    followsUserLocation={false}
                />

                {/* Fixed Center Marker with Custom Image */}
                <View style={styles.centerMarker}>
                    <Image source={customMarker} style={styles.customMarkerImage} />
                </View>

                <TouchableOpacity
                    style={styles.myLocationButton}
                    onPress={getUserLocation}
                    accessibilityLabel="Use My Location"
                    accessibilityHint="Centers the map on your current location and fills in your address"
                    disabled={locationLoading}
                >
                    {locationLoading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <MaterialIcons name="my-location" size={24} color="#fff" />
                    )}
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                style={styles.formWrapper}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
            >
                {!activateAddressDetails && (
                    <>
                        <Text style={styles.title}>Select or Enter Your Address</Text>
                        <View style={styles.addressPreview}>
                            <Text>{`${address.street}, ${address.district}, ${address.postalCode}`}</Text>
                            <Text style={styles.addressSubText}>{`${address.province}, ${address.country}`}</Text>
                        </View>
                    </>
                )}
                <LoginButton onPress={toggleAddressDetails} />

                {activateAddressDetails && (
                    <View style={styles.formContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Street"
                            value={address.street}
                            onChangeText={(text) => handleAddressChange('street', text)}
                            returnKeyType="next"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Neighborhood"
                            value={address.neighborhood}
                            onChangeText={(text) => handleAddressChange('neighborhood', text)}
                            returnKeyType="next"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="City"
                            value={address.district}
                            onChangeText={(text) => handleAddressChange('district', text)}
                            returnKeyType="next"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Region"
                            value={address.province}
                            onChangeText={(text) => handleAddressChange('province', text)}
                            returnKeyType="next"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Country"
                            value={address.country}
                            onChangeText={(text) => handleAddressChange('country', text)}
                            returnKeyType="next"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Postal Code"
                            value={address.postalCode}
                            onChangeText={(text) => handleAddressChange('postalCode', text)}
                            keyboardType="numeric"
                            returnKeyType="next"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Apartment Number"
                            value={address.apartmentNo}
                            onChangeText={(text) => handleAddressChange('apartmentNo', text)}
                            returnKeyType="done"
                        />
                        <Button title="Confirm Address" onPress={handleAddressConfirm} />
                    </View>
                )}
            </KeyboardAvoidingView>
        </View>)
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    mapContainer: {
        position: 'relative',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#000',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    centerMarker: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -24, // Half of the custom marker image width (48/2)
        marginTop: -48,  // Half of the custom marker image height (96/2) Adjust if needed
    },
    customMarkerImage: {
        width: 48,
        height: 48,
        resizeMode: 'contain',
    },
    myLocationButton: {
        position: 'absolute',
        bottom: 15,
        right: 15,
        backgroundColor: '#000',
        padding: 12,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 5,
    },
    formWrapper: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    addressPreview: {
        alignItems: 'flex-start',
        marginLeft: 80,
        marginBottom: 16,
    },
    addressSubText: {
        color: 'gray',
        fontWeight: '300',
        fontSize: 12,
    },
    formContainer: {
        width: '100%',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    input: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        fontSize: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
});

export default AddressSelectorScreen;
