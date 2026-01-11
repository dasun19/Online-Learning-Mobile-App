import { useState, useContext } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Button, Text, TextInput, useTheme, Snackbar } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/AuthStack";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>("");
    const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);

    const theme = useTheme();
    const { login } = useContext(AuthContext);

    const handleLogin = async () => {
        if (!email || !password) {
            setError("Please fill in all fields")
            return;
        }

        if (password.length < 6) {
            setError("Passwords must be at least 6 characters long.")
            return;
        }
        try {
            setError(null);

            const response = await API.post("/auth/login", {
                email,
                password,
            });

            const { user, token } = response.data;

            // Save globally
            await login(user, token);

            console.log("Login successfull!", response.data);

            setSnackbarVisible(true)


        } catch (error: any) {
            if (error.response) {
                setError(error.response.data.message);
            } else {
                setError("Network error. Please try again.")
            }
        }
    };

    const handleSwitchMode = () => {
        navigation.replace("Register")
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title} variant="headlineMedium">
                    Welcome Back
                </Text>

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

                {error && <Text style={{ color: theme.colors.error }}> {error} </Text>}

                <Button
                    mode="contained"
                    style={styles.button}
                    onPress={handleLogin}>
                    Sign In
                </Button>

                <Button
                    mode="text"
                    onPress={handleSwitchMode}
                    style={styles.switchMode}>
                    Don't have an account? Sign Up
                </Button>

                <Snackbar
                    visible={snackbarVisible}
                    onDismiss={() => setSnackbarVisible(false)}
                    duration={1500}
                    style={{ backgroundColor: "#f5f5f5" }}
                >
                    <Text style={{ color: "#4CAF50" }}>
                        Login successful!
                    </Text>
                </Snackbar>

            </View>
        </KeyboardAvoidingView>
    )
}

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
});