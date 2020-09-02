import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, AsyncStorage, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Chat from "./src/components/Chat/Chat";
import SplashScreen from "./src/components/Auth/SplashScreen";

const Wait = () => {
    return <Text>Wait...</Text>;
};

const Home = ({ navigation }) => {
    return (
        <View>
            <Text>HOME</Text>
            <Button
                title="Go to Chat"
                onPress={() => navigation.navigate("Chat")}
            />
        </View>
    );
};

export default function App() {
    const Stack = createStackNavigator();
    const [flag, setFlag] = useState(0);
    useEffect(() => {
        console.log("useEffect at App.js");
        const setUsername = async () => {
            await AsyncStorage.setItem("phno", "+91 9478121646");
            setFlag(1);
        };
        setUsername();
    }, []);

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen
                    name="Chat"
                    component={() => {
                        if (flag) return <Chat room="avc" />;
                        return <Wait />;
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});
