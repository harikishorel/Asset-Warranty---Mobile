import "react-native-gesture-handler";
import { View, Text, ActivityIndicator } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import LoginScreen from "../views/screens/LoginScreen";
import RegistrationScreen from "../views/screens/RegistrationScreen";
import Loader from "../views/components/Loader";
import HomeScreen from "../screens/HomeScreen";
import { AuthContext } from "../Context/AuthContext";
import CustomDrawer from "../components/CustomDrawer";
import ProfileScreen from "../screens/ProfileScreen";
import COLORS from "../conts/colors";
import { PaperProvider } from "react-native-paper";
import OpenScreen from "../components/OpenScreen";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const HomeStackNavigator = () => {
  const { isLoading, userToken } = useContext(AuthContext);

  const [showOpenScreen, setShowOpenScreen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowOpenScreen(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (showOpenScreen) {
    return <OpenScreen />;
  }

  // useEffect(() => {
  //   setTimeout(() => {
  //     isLoading();
  //   }, 2000);
  // }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

  return (
    // <NavigationContainer>
    <Stack.Navigator
      initialRouteName={userToken !== null ? "HomeScreen" : "LoginScreen"}
      screenOptions={{ headerShown: false }}>
      {userToken !== null ? (
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
      ) : (
        <>
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen
            name="RegistrationScreen"
            component={RegistrationScreen}
          />
        </>
      )}
    </Stack.Navigator>
    // </NavigationContainer>
  );
};

export default function AppNav() {
  const { userToken } = useContext(AuthContext);
  return (
    <NavigationContainer>
      <Drawer.Navigator
        useLegacyImplementation={true}
        drawerContent={(props) => (
          <CustomDrawer {...props} userToken={userToken || null} />
        )}
        screenOptions={{
          headerShown: false,
          drawerActiveBackgroundColor: COLORS.violet,
          drawerActiveTintColor: "#fff",
          drawerInactiveTintColor: "#333",
          drawerLabelStyle: {
            marginLeft: -25,
            fontSize: 15,
          },
        }}>
        <Drawer.Screen
          name="Home"
          component={HomeStackNavigator}
          options={{
            drawerIcon: ({ color }) => (
              <Ionicons name="home-outline" size={22} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            drawerIcon: ({ color }) => (
              <Ionicons name="person-outline" size={22} color={color} />
            ),
          }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
