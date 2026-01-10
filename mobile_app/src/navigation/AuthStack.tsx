import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import StudentTabs from "../navigation/StudentTabs";
import InstructorTabs from "../navigation/InstructorTabs";

export type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
    StudentTabs: undefined;
    InstructorTabs: undefined;

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
            <Stack.Screen name="StudentTabs" component={StudentTabs} />
            <Stack.Screen name="InstructorTabs" component={InstructorTabs} />
        </Stack.Navigator>
    )
}

export default AuthStack;