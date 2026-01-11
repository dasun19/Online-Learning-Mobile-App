import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View, ScrollView } from "react-native";
import { Button, Text, TextInput, useTheme, RadioButton, Snackbar } from "react-native-paper";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/AuthStack";
import { useNavigation } from "@react-navigation/native";
import API from "../../api/axios";

type RegisterScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, "Register">;

export default function RegisterScreen() {
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [role, setRole] = useState<"student" | "instructor">("student");
    const [error, setError] = useState<string | null>("");
    const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const theme = useTheme();
    const navigation = useNavigation<RegisterScreenNavigationProp>();

    const handleAuth = async () => {
        setError("");

        if (!name.trim()) {
            setError("Name is required");
            return;
        }
        if (name.trim().length < 2) {
            setError("Name must be at least 2 characters");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            setError("Email is required");
            return;
        }
        if (!emailRegex.test(email.trim())) {
            setError("Please enter a valid email");
            return;
        }

        // Basic password validation
        if (!password) {
            setError("Password is required");
            return;
        }
        if (password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }
        if (!/[A-Z]/.test(password)) {
            setError("Password must contain an uppercase letter");
            return;
        }
        if (!/[a-z]/.test(password)) {
            setError("Password must contain a lowercase letter");
            return;
        }
        if (!/[0-9]/.test(password)) {
            setError("Password must contain a number");
            return;
        }

        // Confirm password validation
        if (!confirmPassword) {
            setError("Please confirm your password");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await API.post("/auth/register", {
                name: name.trim(),
                email: email.trim().toLowerCase(),
                password,
                role,
            });

            console.log("Register success:", response.data);

            setSnackbarVisible(true);
            setTimeout(() => {
                navigation.replace("Login");
            }, 1500);

        } catch (error: any) {
            if (error.response) {
                setError(error.response.data.message || "Registration failed");
            } else {
                setError("Network error. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSwitchMode = () => {
        navigation.replace("Login");
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.content}>
                    <Text style={styles.title} variant="headlineMedium">
                        Create Account
                    </Text>

                    <TextInput
                        style={styles.input}
                        label="Name"
                        autoCapitalize="words"
                        placeholder="Your name"
                        mode="outlined"
                        value={name}
                        onChangeText={(text) => {
                            setName(text);
                            setError("");
                        }}
                    />

                    <TextInput
                        style={styles.input}
                        label="Email"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        placeholder="example@gmail.com"
                        mode="outlined"
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text);
                            setError("");
                        }}
                    />

                    <TextInput
                        style={styles.input}
                        label="Password"
                        autoCapitalize="none"
                        mode="outlined"
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text);
                            setError("");
                        }}
                        right={
                            <TextInput.Icon
                                icon={showPassword ? "eye-off" : "eye"}
                                onPress={() => setShowPassword(!showPassword)}
                            />
                        }
                    />

                    <TextInput
                        style={styles.input}
                        label="Confirm Password"
                        autoCapitalize="none"
                        mode="outlined"
                        secureTextEntry={!showConfirmPassword}
                        value={confirmPassword}
                        onChangeText={(text) => {
                            setConfirmPassword(text);
                            setError("");
                        }}
                        right={
                            <TextInput.Icon
                                icon={showConfirmPassword ? "eye-off" : "eye"}
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                            />
                        }
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

                    {error && <Text style={{ color: theme.colors.error, marginTop: 8 }}>{error}</Text>}

                    <Button
                        mode="contained"
                        style={styles.button}
                        onPress={handleAuth}
                        loading={loading}
                        disabled={loading}>
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
                        style={{ backgroundColor: "#4CAF50" }}>
                        <Text style={{ color: "#fff" }}>
                            Account created successfully!
                        </Text>
                    </Snackbar>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5"
    },
    scrollContent: {
        flexGrow: 1
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
});