import React from "react";
import { View, Text } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./Home";
import SendOtp from "./SendOtp";
import VerifyOtp from "./VerifyOtp";
import Register from "./Register";
import Login from "./Login";

export default function RootStackScreen({ navigation }) {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator headerMode="none">
            <Stack.Screen name="Home" component={Home}></Stack.Screen>
            <Stack.Screen name="SendOtp" component={SendOtp}></Stack.Screen>
            <Stack.Screen name="VerifyOtp" component={VerifyOtp}></Stack.Screen>
            <Stack.Screen name="Register" component={Register}></Stack.Screen>
            <Stack.Screen name="Login" component={Login}></Stack.Screen>
        </Stack.Navigator>
    );
}
