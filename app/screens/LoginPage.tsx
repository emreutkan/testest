import { View, Text, TouchableWithoutFeedback, TouchableOpacity, StyleSheet, Alert, Keyboard } from 'react-native'
import React, { useState } from 'react'
import LoginButton from '@/components/LoginScreenComponents/loginButton'
import { useRouter } from 'expo-router';
import  AppleOTP from "@/components/LoginScreenComponents/AppleOTPLogin"
import EmailLoginField from "@/components/LoginScreenComponents/emailInput"
import { scaleFont } from '@/components/utils/ResponsiveFont';
import PhoneInput from '@/components/LoginScreenComponents/PhoneInput';
import { GoogleSignInButton, EmailSignInButton, PhoneSignInButton } from '@/components/LoginScreenComponents/loginButtons';
const LoginPage: React.FC = () => {
  const router = useRouter();

  const [selectedCode, setSelectedCode] = useState<string>('+90');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [isCodeSent, setIsCodeSent] = useState<boolean>(false);
  const [phoneLogin, setPhoneLogin] = useState<boolean>(true);
  
    const handleLoginButton = () => {
        console.log('Login button pressed!');
        router.push('./RegisterPage')

      };

        const handlePhoneChange = (text: string) => {
        const sanitizedText = text.replace(/[^0-9]/g, '').slice(0, 10);
        setPhoneNumber(sanitizedText);
    };

    const isValidPhone = (phone: string): boolean => {
        const phoneRegex = /^[0-9]{10,15}$/;
        return phoneRegex.test(phone);
    };

    const handlePhoneSubmit = (): void => {
        if (phoneNumber.trim() === '') {
            Alert.alert('Error', 'Phone number cannot be empty.');
            return;
        }
        if (!isValidPhone(phoneNumber)) {
            Alert.alert('Error', 'Please enter a valid phone number.');
            return;
        }
        setIsCodeSent(true);
        router.push('/screensVerificationPage')

      };
  function handleEmailSubmit(): void {
    throw new Error('Function not implemented.');
  }

  return (
    
    <>
     <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={styles.bottomContainer}>
                    <View style={{ marginHorizontal: scaleFont(15) }}>
                        <Text style={styles.welcomeText}>Last Call,</Text>
                        <Text style={styles.welcomeText2}>Tasty Deals Await!</Text>

                        {phoneLogin ? (
                            <PhoneInput
                                selectedCode={selectedCode}
                                onCodeChange={setSelectedCode}
                                phoneNumber={phoneNumber}
                                onPhoneChange={handlePhoneChange}
                            />
                        ) : (
                            <EmailLoginField />
                        )}

                        {isCodeSent && <Text style={styles.message}>Check your phone for the code.</Text>}

                        <View style={{ marginTop: scaleFont(10), marginBottom: scaleFont(50) }}>
                            <LoginButton onPress={phoneLogin ? handlePhoneSubmit : handleEmailSubmit} />
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
                            <TouchableOpacity
                                onPress={() => setPhoneLogin(false)}
                            >
                                <EmailSignInButton />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                onPress={() => setPhoneLogin(true)}
                            >
                                <PhoneSignInButton />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </TouchableWithoutFeedback>
      <AppleOTP></AppleOTP>
    </>


    
  )
}

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
  welcomeText2:{
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
