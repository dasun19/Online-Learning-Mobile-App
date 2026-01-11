import React, { useEffect, useState, useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";
import { enableScreens } from "react-native-screens";
import { ActivityIndicator, View } from "react-native";
import AuthStack from "./src/navigation/AuthStack";
import StudentTabs from "./src/navigation/StudentTabs";
import InstructorTabs from "./src/navigation/InstructorTabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthProvider, AuthContext } from "./src/context/AuthContext";

enableScreens();

const AppNavigator = () => {
  const { user, loading } = useContext(AuthContext);
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

  useEffect(() => {
    checkFirstLaunch();
  }, []);

  const checkFirstLaunch = async () => {
    try {
      const value = await AsyncStorage.getItem("alreadyLaunched");
      if (value === null) {
        await AsyncStorage.setItem("alreadyLaunched", "true");
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    } catch (error) {
      console.log("Error checking first launch:", error);
      setIsFirstLaunch(false);
    }
  };

  // Show loading while checking auth
  if (loading || isFirstLaunch === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Show screen based on role
  if (user) {
    return user.role === "student" ? <StudentTabs /> : <InstructorTabs />;
  }

  // If not authenticated show auth flow
  return <AuthStack isFirstLaunch={isFirstLaunch} />;
};

const App = () => {
  return (
    
    <AuthProvider>
      <PaperProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </PaperProvider>
    </AuthProvider>
  );
};

export default App;