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
    Animated, Easing,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { addAddress, setCurrentAddress } from '@/slices/userSlice';
import { useNavigation } from '@react-navigation/native';
import MapView, { Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';
import LoginButton from '@/components/LoginScreenComponents/loginButton'; // Keep only one import
import debounce from 'lodash.debounce';
import { scaleFont } from '@/components/utils/ResponsiveFont';

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
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });

    // New state for reverse geocoding loading
    const [isReverseGeocoding, setIsReverseGeocoding] = useState<boolean>(false);

    // Retrieve screen dimensions
    const { height, width } = Dimensions.get('window');

    // Initialize Animated Value
    const [mapAnimation] = useState(new Animated.Value(0));

// Existing interpolation for the map's translateY
    const animatedMapTranslateY = mapAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -height * 0.45], // Adjust as needed
    });

// New interpolation for the formWrapper's translateY
    const animatedFormTranslateY = mapAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -height * 0.45], // The same value to sync movement
    });
    // Animate when activateAddressDetails changes
    useEffect(() => {
        Animated.timing(mapAnimation, {
            toValue: activateAddressDetails ? 1 : 0,
            duration: 300,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            useNativeDriver: true,
        }).start();
    }, [activateAddressDetails]);

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
                latitudeDelta: 0.01,
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
        try {
            setIsReverseGeocoding(true); // Start loading
            const [addressData] = await Location.reverseGeocodeAsync({ latitude, longitude });
            if (addressData) {
                setAddress({
                    street: addressData.street || '',
                    neighborhood: addressData.subregion || '',
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
        } finally {
            setIsReverseGeocoding(false); // End loading
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



    const toggleAddressDetails = () => {
        setActivateAddressDetails(prevState => !prevState);
    };

    const mapOntouchEvent = () => {
        setIsMapInteracted(true);
        setActivateAddressDetails(false);
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#f5f5f5',
        },
        mapContainer: {
            // position: 'relative',
            borderBottomLeftRadius: 20,
            height: height * 0.75, // this pushes the formwrapper further down dont change it
            borderWidth: 12,
            borderBottomRightRadius: 20,
            overflow: 'hidden',
            backgroundColor: '#000',
        },
        formWrapper: {
            borderWidth: 12,
            marginBottom: scaleFont(50),
            flex: 1,
            // paddingHorizontal: 16,
            // paddingTop: 16,
        },
        map: {
            ...StyleSheet.absoluteFillObject,
        },
        centerMarker: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginLeft: scaleFont(-23.5),
            marginTop: scaleFont(-13),
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

        title: {
            fontSize: 20,
            fontWeight: 'bold',
            // marginBottom: 12,
            textAlign: 'center',
        },
        addressPreviewContainer: {
            marginHorizontal: scaleFont(20),
            position: 'relative',
            // marginBottom: 16,
            flex: 1, // Take available space
            // marginRight: 8, // Add some margin to separate from the loading overlay or button
            flexDirection: 'row', // Arrange children in a row
            alignItems: 'center', // Vertically center the items
            justifyContent: 'space-between', // Optional: Adjust spacing between items if needed
        },
        addressPreview: {
        },
        addressSubText: {
            color: 'gray',
            fontWeight: '300',
            fontSize: 12,
        },
        addressLoadingOverlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 8,
            marginLeft: 8, // Space between address preview and loading overlay
        },
        loadingText: {
            marginTop: 5,
            fontSize: 14,
            color: '#000',
        },
        formContainer: {
            width: '100%',
            backgroundColor: '#fff',
            // padding: 16,
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
        reverseGeocodingOverlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            justifyContent: 'center',
            alignItems: 'center',
        }, loginButton: {
            // flex: 2/3,
            width: '35%',
            borderWidth: 1,
            marginLeft: scaleFont(8)
        }

    });

    if (initialLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading...</Text>
            </View>
        );
    }


    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.mapContainer,
                    {
                        width: width,
                        transform: [{ translateY: animatedMapTranslateY }],
                    },
                ]}
            >
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
                <View style={styles.centerMarker}>
                    <MaterialIcons name="place" size={48} color="#FF0000" />
                </View>

                <TouchableOpacity
                    style={styles.myLocationButton}
                    onPress={getUserLocation}
                    accessibilityLabel="Use My Location"
                    accessibilityHint="Centers the map on your current location and fills in your address"
                    disabled={locationLoading}
                >
                    {locationLoading ? (
                        <ActivityIndicator size="small" color="#0000ff" />
                    ) : (
                        <MaterialIcons name="my-location" size={24} color="#fff" />
                    )}
                </TouchableOpacity>
            </Animated.View>

            <KeyboardAvoidingView
                style={styles.formWrapper}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
            >
                {!activateAddressDetails && (
                    <>
                        <Text style={styles.title}>Select or Enter Your Address</Text>
                        <View style={styles.addressPreviewContainer}>
                            <View style={styles.addressPreview}>
                                <Text>{`${address.street}, ${address.district} ${address.postalCode}`}</Text>
                                <Text style={styles.addressSubText}>{`${address.province}, ${address.country}`}</Text>
                            </View>
                            {isReverseGeocoding && (
                                <View style={styles.addressLoadingOverlay}>
                                    <ActivityIndicator size="small" color="#0000ff" />
                                    <Text style={styles.loadingText}>Fetching address...</Text>
                                </View>
                            )}
                            <View style={styles.loginButton}>
                                <LoginButton
                                    onPress={toggleAddressDetails}
                                    title={'Select'}/>

                            </View>
                        </View>

                    </>
                )}

                {activateAddressDetails && (
                    <Animated.View
                        style={[
                            styles.formWrapper,
                            {
                                transform: [{ translateY: animatedFormTranslateY }],
                            },
                        ]}
                    >
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
                    </Animated.View>
                )}
            </KeyboardAvoidingView>
        </View>
    );

};


export default AddressSelectorScreen;
