import React, {useState} from "react";
import {Alert, Keyboard, TouchableWithoutFeedback, View} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import LoginButton from "@/components/LoginScreenComponents/loginButton";
import { scaleFont } from "@/components/utils/ResponsiveFont";
import EmailLoginField from "@/components/LoginScreenComponents/emailInput";
import PhoneInput from "@/components/LoginScreenComponents/PhoneInput";

const RegisterScreen: React.FC = () => {
    const [selectedCode, setSelectedCode] = useState<string>('+90');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [isCodeSent, setIsCodeSent] = useState<boolean>(false);
    const [phoneLogin, setPhoneLogin] = useState<boolean>(true);
    const handlePhoneChange = (text: string) => {
        const sanitizedText = text.replace(/[^0-9]/g, '').slice(0, 10);
        setPhoneNumber(sanitizedText);
    };
    const handleRegister = (): void => {

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
            Alert.alert('Code Sent', 'A verification code was sent to your phone.');
            setIsCodeSent(true);
            // navigation.navigate('Code', { input: phoneNumber });
        };

        const handleEmailSubmit = () => {
            // Implement email submit logic here
        };    };

    return (
    <>
    
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={{paddingTop: scaleFont(35)}}>
        <PhoneInput
                selectedCode={selectedCode}
                onCodeChange={setSelectedCode}
                phoneNumber={phoneNumber}
                onPhoneChange={handlePhoneChange}
            />
            <EmailLoginField />
        </View>


        </TouchableWithoutFeedback>
        </>

    );
};

const styles = {
    registerContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between', // Align items to the start
        marginHorizontal: 15,

    },
    iconButtonContainer: {
        width: '20%',
        alignItems: 'center',
    },
    textButtonContainer: {
        flexGrow: 1,
    },
};

export default RegisterScreen;
