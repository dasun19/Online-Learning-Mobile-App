import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";

export type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
};

type AuthStackProps = {
    isFirstLaunch: boolean;
}

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack = ({ isFirstLaunch }: AuthStackProps) => {
    return (
        <Stack.Navigator initialRouteName={isFirstLaunch ? "Register" : "Login"}
            screenOptions={{
                headerShown: false
            }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
    )
}

export default AuthStack;