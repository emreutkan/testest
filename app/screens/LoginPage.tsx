import { View, Text, TouchableWithoutFeedback, TouchableOpacity, StyleSheet, Alert, Keyboard } from 'react-native';
import React, { useState } from 'react';
import LoginButton from '@/components/LoginScreenComponents/loginButton';
import { useRouter } from 'expo-router';
import AppleOTP from "@/components/LoginScreenComponents/AppleOTPLogin";
import EmailLoginField from "@/components/LoginScreenComponents/emailInput";
import { scaleFont } from '@/components/utils/ResponsiveFont';
import PhoneInput from '@/components/LoginScreenComponents/PhoneInput';
import { GoogleSignInButton, EmailSignInButton, PhoneSignInButton } from '@/components/LoginScreenComponents/loginButtons';
import { UserModel } from '@/models/UserModel';
import phoneInput from "@/components/LoginScreenComponents/PhoneInput";

const LoginPage: React.FC = () => {
    const router = useRouter();
    const [user, setUser] = useState<UserModel>(new UserModel());

    const [phoneLogin, setPhoneLogin] = useState<boolean>(true);

    const handlePhoneChange = (text: string) => {
        const updatedUser = new UserModel(text, user.getEmail());
        updatedUser.setPhoneNumber(text);
        setUser(updatedUser);
    };

    const handlePhoneSubmit = (): void => {
        if (user.getPhoneNumber().trim() === '') {
            Alert.alert('Error', 'Phone number cannot be empty.');
            return;
        }
        if (!user.isValidPhone()) {
            Alert.alert('Error', 'Please enter a valid phone number.');
            return;
        }
        router.push('/screensVerificationPage');
    };

    const handleLoginButton = (): void => {
        if (phoneLogin) {
            handlePhoneSubmit();
        } else {
            handleEmailSubmit();
        }
    };

    function handleEmailSubmit(): void {
        throw new Error('Function not implemented.');
    }

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.bottomContainer}>
                <View style={{ marginHorizontal: scaleFont(15) }}>
                    <Text style={styles.welcomeText}>Last Call,</Text>
                    <Text style={styles.welcomeText2}>Tasty Deals Await!</Text>

                    {phoneLogin ? (
                        <PhoneInput
                            user={user}
                        />
                    ) : (
                        <EmailLoginField />
                    )}

                    {isCodeSent && <Text style={styles.message}>Check your phone for the code.</Text>}

                    <View style={{ marginTop: scaleFont(10), marginBottom: scaleFont(50) }}>
                        <LoginButton onPress={handleLoginButton} />
                    </View>

                    <View style={styles.registerContainer}>
                        <Text style={styles.registerText}>or</Text>
                        <TouchableOpacity onPress={() => router.push('./RegisterPage')}>
                            <Text style={styles.registerTextClick}> Register here</Text>
                        </TouchableOpacity>
                    </View>

                    <AppleOTP />
                    <GoogleSignInButton />

                    {phoneLogin ? (
                        <TouchableOpacity onPress={() => setPhoneLogin(false)}>
                            <EmailSignInButton />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={() => setPhoneLogin(true)}>
                            <PhoneSignInButton />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    bottomContainer: {
        flex: 1,
        paddingHorizontal: scaleFont(35),
    },
    welcomeText: {
        fontSize: scaleFont(35),
        textAlign: 'center',
        color: '#000000',
        marginTop: scaleFont(20),
        marginBottom: scaleFont(5),
    },
    welcomeText2: {
        fontSize: scaleFont(35),
        textAlign: 'center',
        marginBottom: scaleFont(20),
        color: '#50703C',
    },
    message: {
        marginTop: scaleFont(10),
        textAlign: 'center',
        color: '#fff',
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    registerText: {
        fontFamily: 'Poppins-Regular',
        fontSize: scaleFont(18),
        color: '#000',
        verticalAlign: 'middle',
    },
    registerTextClick: {
        fontFamily: 'Poppins-Regular',
        fontSize: scaleFont(18),
        color: '#23b3e8',
        verticalAlign: 'middle',
    },
});

export default LoginPage;
