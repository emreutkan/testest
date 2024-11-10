import React from "react";
import { Alert, Keyboard, TouchableWithoutFeedback, View } from "react-native";
import LoginButton from "@/components/LoginScreenComponents/loginButton";
import { scaleFont } from "@/components/utils/ResponsiveFont";
import EmailLoginField from "@/components/LoginScreenComponents/emailInput";
import PhoneInput from "@/components/LoginScreenComponents/PhoneInput";
import { useRouter } from 'expo-router';
import NameSurnameField from "@/components/LoginScreenComponents/NameSurnameInputField";
import { UserModel } from "@/models/UserModel";

const RegisterScreen: React.FC = () => {
    const router = useRouter();
    const user = UserModel.getInstance(); // Use the singleton instance here

    const handleRegister = (): void => {
        // Implement registration logic using `user` instance
    };

    return (
        <>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <>
                    <View style={styles.container}>
                        <View style={styles.inputArea}>
                            <NameSurnameField />
                        </View>
                        <View style={styles.inputArea}>
                            <PhoneInput user={user} />
                        </View>
                        <View style={styles.inputArea}>
                            <EmailLoginField />
                        </View>

                        <View style={styles.buttonArea}>
                            <View style={styles.backButton}>
                                <LoginButton
                                    onPress={() => router.back()}
                                    title='<'
                                />
                            </View>
                            <View style={styles.SignupButton}>
                                <LoginButton
                                    onPress={handleRegister} // Correct function call syntax
                                    title='Sign up'
                                />
                            </View>
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
        marginBottom: scaleFont(15),
    },
    buttonArea: {
        marginTop: scaleFont(35),
        padding: scaleFont(0),
        justifyContent: "space-between",
        flexDirection: 'row',
    },
    backButton: {
        flex: 1,
        marginBottom: scaleFont(10),
    },
    SignupButton: {
        flex: 4,
        marginLeft: scaleFont(10),
        marginBottom: scaleFont(10),
    },
    registerContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
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
