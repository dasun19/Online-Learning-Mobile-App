import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";
import { enableScreens } from "react-native-screens";
import AuthStack from "./src/navigation/AuthStack";
import AsyncStorage from "@react-native-async-storage/async-storage";

enableScreens();

const App = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      const value = await AsyncStorage.getItem("alreadyLaunched");

      if (value === null) {
        await AsyncStorage.setItem("alreadyLaunched", "true");
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    };
    checkFirstLaunch();

  }, []);

  if (isFirstLaunch === null) {
    return null;
  }

  return (
    <PaperProvider>
      <NavigationContainer>
        <AuthStack isFirstLaunch={isFirstLaunch} />
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;