import React, {useState, useEffect, useRef} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Button,
    TextInput,
    Alert,
    ActivityIndicator,
    Dimensions,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { addAddress, setCurrentAddress } from '@/slices/userSlice';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

interface Address {
    street: string;
    city: string;
    region: string;
    country: string;
    postalCode: string;
}

const AddressSelectorScreen: React.FC = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [isMapInteracted, setIsMapInteracted] = useState(false);
    const mapRef = useRef<MapView>(null); // Reference to the MapView
    const [address, setAddress] = useState<Address>({
        street: '',
        city: '',
        region: '',
        country: '',
        postalCode: '',
    });
    const [region, setRegion] = useState({
        latitude: 37.7749,
        longitude: -122.4194,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    const [loading, setLoading] = useState<boolean>(true);

    // Function to fetch location and update state
    const fetchLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Location permission is required to use this feature.');
                setLoading(false);
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;

            setRegion({
                latitude,
                longitude,
                latitudeDelta: 0.005, // Zoomed in for better detail
                longitudeDelta: 0.005,
            });

            const [addressData] = await Location.reverseGeocodeAsync({ latitude, longitude });
            if (addressData) {
                setAddress({
                    street: addressData.street || '',
                    city: addressData.city || '',
                    region: addressData.region || '',
                    country: addressData.country || '',
                    postalCode: addressData.postalCode || '',
                });
            } else {
                Alert.alert('No Address Found', 'Unable to retrieve address for the selected location.');
            }

            setLoading(false);
        } catch (error) {
            console.error('Error fetching location:', error);
            Alert.alert('Error', 'An error occurred while fetching the location.');
            setLoading(false);
        }
    };

    // Function to get user location when button is pressed
    const getUserLocation = async () => {
        setLoading(true);
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
        const { street, city, region, country, postalCode } = address;

        // Basic validation to ensure required fields are filled
        if (street.trim() === '' || city.trim() === '' || country.trim() === '') {
            Alert.alert('Error', 'Please fill in at least Street, City, and Country.');
            return;
        }

        // Add address to the Redux store
        dispatch(addAddress(address)); // Ensure your Redux action can handle an address object
        dispatch(setCurrentAddress(address));

        Alert.alert('Success', 'Address has been set!');
        navigation.goBack(); // Navigate back or to another screen
    };

    const handleMapPress = async (e: any) => {
        const { latitude, longitude } = e.nativeEvent.coordinate;

        // Center the map on the tapped location
        setRegion({
            ...region,
            latitude,
            longitude,
        });

        try {
            // Use reverse geocoding to get an address
            const [addressData] = await Location.reverseGeocodeAsync({ latitude, longitude });
            if (addressData) {
                setAddress({
                    street: addressData.street || '',
                    city: addressData.city || '',
                    region: addressData.region || '',
                    country: addressData.country || '',
                    postalCode: addressData.postalCode || '',
                });
            } else {
                Alert.alert('No Address Found', 'Unable to retrieve address for the selected location.');
            }
        } catch (error) {
            console.error('Error fetching address:', error);
            Alert.alert('Error', 'An error occurred while fetching the address.');
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
            <MapView
                ref={mapRef} // Reference to control the map programmatically
                style={styles.map}
                region={region}
                onPress={handleMapPress}
                onRegionChangeComplete={(newRegion) => {
                    if (isMapInteracted) {
                        setRegion(newRegion);
                    }
                }}
                onTouchStart={() => setIsMapInteracted(true)}
                mapType="terrain"
                showsUserLocation={true} // Show the user's location on the map
                followsUserLocation={false} // Set to true if you want the map to follow the user's movement
            >
                <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} />
            </MapView>
            <ScrollView contentContainerStyle={styles.scrollContainer}>


                <View style={styles.formContainer}>
                    <Button title="Use My Location" onPress={getUserLocation} />
                    <TextInput
                        style={styles.input}
                        placeholder="Street"
                        value={address.street}
                        onChangeText={(text) => handleAddressChange('street', text)}
                        returnKeyType="next"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="City"
                        value={address.city}
                        onChangeText={(text) => handleAddressChange('city', text)}
                        returnKeyType="next"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Region"
                        value={address.region}
                        onChangeText={(text) => handleAddressChange('region', text)}
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
                        returnKeyType="done"
                    />
                    <Button title="Confirm Address" onPress={handleAddressConfirm} />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const mapHeight = screenHeight * 0.5; // 60% of screen height

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        alignItems: 'center',

    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    map: {
        height: mapHeight, // 60% of the screen height
        width: screenWidth,
        marginBottom: 16,
        borderRadius: 8,
    },
    formContainer: {
        borderWidth: 1,
        width: '100%',
    },
    input: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 15,
        padding: 12,
        marginBottom: 12,
        fontSize: 16,
    },
});

export default AddressSelectorScreen;
