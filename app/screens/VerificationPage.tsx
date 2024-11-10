import React, {useState} from "react";
import {Alert, Keyboard, TouchableWithoutFeedback, View} from "react-native";
import LoginButton from "@/components/LoginScreenComponents/loginButton";
import { scaleFont } from "@/components/utils/ResponsiveFont";
import EmailLoginField from "@/components/LoginScreenComponents/emailInput";

import { useRouter } from 'expo-router';

const VerificationPage = () => {
    const router = useRouter();


    return (
        <View style={styles.container}>

        </View>
    )
}

const styles = {
    container: {
        flex: 1,
        paddingTop: scaleFont(35),
        paddingHorizontal: scaleFont(35),
    }
}