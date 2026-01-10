
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Button, Text, TextInput, useTheme, RadioButton, Snackbar } from "react-native-paper";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/AuthStack";
import { useNavigation } from "@react-navigation/native";
import API from "../../api/axios";

type RegisterScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, "Register">

export default function RegisterScreen() {

    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [role, setRole] = useState<"student" | "instructor">("student");
    const [error, setError] = useState<string | null>("");
    const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);

    const theme = useTheme();
    const navigation = useNavigation<RegisterScreenNavigationProp>();



    const handleAuth = async () => {
        if (!name || !email || !password) {
            setError("Please fill in all fields")
            return;
        }

        if (password.length < 6) {
            setError("Passwords must be at least 6 characters long.")
            return;
        }
        try {

            setError(null);

            const response = await API.post("/auth/register", {
                name,
                email,
                password,
                role,
            });

            console.log("Register success:", response.data);

            // Navigate to login after success
            setSnackbarVisible(true);

            setTimeout(() => {
                navigation.replace("Login");
            }, 1500);

        } catch (error: any) {
            if (error.response) {
                setError(error.response.data.message);
            } else {
                setError("Network error. Please try again.")
            }
        }

    };

    const handleSwitchMode = () => {
        navigation.replace("Login")
    };


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title} variant="headlineMedium">
                    Create Account
                </Text>

                <TextInput style={styles.input}
                    label="Name"
                    autoCapitalize="none"
                    placeholder="Your name"
                    mode="outlined"
                    onChangeText={setName}
                />
                <TextInput style={styles.input}
                    label="Email"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholder="example@gmail.com"
                    mode="outlined"
                    onChangeText={setEmail}
                />

                <TextInput style={styles.input}
                    label="Password"
                    autoCapitalize="none"
                    mode="outlined"
                    secureTextEntry
                    onChangeText={setPassword}
                />
                <View style={styles.roleButton}>
                    <RadioButton
                        value="student"
                        status={role === "student" ? "checked" : "unchecked"}
                        onPress={() => setRole("student")}
                    />
                    <Text>Student</Text>
                    <RadioButton
                        value="instructor"
                        status={role === "instructor" ? "checked" : "unchecked"}
                        onPress={() => setRole("instructor")}
                    />
                    <Text>Instructor</Text>
                </View>


                {error && <Text style={{ color: theme.colors.error }}> {error} </Text>}
                <Button
                    mode="contained"
                    style={styles.button}
                    onPress={handleAuth}>
                    Sign Up
                </Button>

                <Button
                    mode="text"
                    onPress={handleSwitchMode}
                    style={styles.switchMode}>

                    Already have an account? Sign In

                </Button>

                <Snackbar
                    visible={snackbarVisible}
                    onDismiss={() => setSnackbarVisible(false)}
                    duration={1500}
                    style={{ backgroundColor: "#f5f5f5" }}
                >
                    <Text style={{ color: "#4CAF50" }}>
                        Account created successfully!
                    </Text>
                </Snackbar>

            </View>
        </KeyboardAvoidingView>
    )

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5"
    },
    content: {
        flex: 1,
        padding: 20,
        justifyContent: "center"
    },
    title: {
        textAlign: "center",
        marginBottom: 24

    },
    input: {
        marginBottom: 16

    },
    button: {
        marginTop: 8

    },
    switchMode: {
        marginTop: 16

    },
    roleButton: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16
    }

})