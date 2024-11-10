import React, {useState} from "react";
import {Alert, Keyboard, TouchableWithoutFeedback, View} from "react-native";
import LoginButton from "@/components/LoginScreenComponents/loginButton";
import { scaleFont } from "@/components/utils/ResponsiveFont";
import EmailLoginField from "@/components/LoginScreenComponents/emailInput";
import PhoneInput from "@/components/LoginScreenComponents/PhoneInput";
import { useRouter } from 'expo-router';
import NameSurnameField from "@/components/LoginScreenComponents/NameSurnameInputField";

const RegisterScreen: React.FC = () => {
    const [isCodeSent, setIsCodeSent] = useState<boolean>(false);
    const router = useRouter();
    const user =

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
       <>
       <View style={styles.container}>
           <View style={styles.inputArea}>
               <NameSurnameField></NameSurnameField>
           </View>
        <View style={styles.inputArea}>
            <PhoneInput
                user={user}
            />
        </View>
        <View style={styles.inputArea}>
            <EmailLoginField />
        </View>

        <View style={styles.buttonArea}>
            <View style={styles.backButton}>
                <LoginButton
                onPress={() => router.back()}
                title = '<'/></View>
            <View style={styles.SignupButton}>
                <LoginButton
                    onPress={() => handleRegister}
                    title = 'Sign up'
                /></View>
        </View>


            </View>
       </>

        </TouchableWithoutFeedback>
        </>

    );
};

const styles = {
    container: {
        flex: 1,
        paddingTop: scaleFont(35),
        paddingHorizontal: scaleFont(35),


    },
    inputArea: {
        marginBottom: scaleFont(15)
    },
    buttonArea: {
        marginTop: scaleFont(35),
        padding: scaleFont(0),
        justifyContent: "space-between",
        flexDirection: 'row',
    },
    backButton:{
        flex: 1,
        marginBottom: scaleFont(10),

    },
    SignupButton:{
        flex: 4,
        marginLeft: scaleFont(10),
        marginBottom: scaleFont(10),

    },
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
