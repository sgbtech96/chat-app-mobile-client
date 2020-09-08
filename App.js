import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, AsyncStorage, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import RootStackScreen from "./src/components/Auth/RootStackScreen";
import { AuthContext } from "./src/components/Auth/AuthContext";
import AllUsers from "./src/components/Auth/AllUsers";
import Logout from "./src/components/Auth/Logout";
import Chat from "./src/components/Chat/Chat";
import Spinner from "react-native-loading-spinner-overlay";
import DrawerContent from "./src/components/Auth/DrawerContent";

export default function App() {
    const [spinner, setSpinner] = useState(true);
    const Drawer = createDrawerNavigator();
    const initialLoginState = {
        authToken: null,
        username: null,
    };
    const loginReducer = (prevState, action) => {
        switch (action.type) {
            case "RETRIEVE_TOKEN":
                return {
                    ...prevState,
                    authToken: action.authToken,
                    username: action.username,
                };
            case "LOGIN":
                return {
                    ...prevState,
                    authToken: action.authToken,
                    username: action.username,
                };
            case "LOGOUT":
                return {
                    ...prevState,
                    authToken: null,
                    username: null,
                };
        }
    };
    const [loginState, dispatch] = React.useReducer(
        loginReducer,
        initialLoginState
    );
    const authContext = React.useMemo(
        () => ({
            signIn: async (authToken, username) => {
                setSpinner(true);
                try {
                    await AsyncStorage.setItem("authToken", authToken);
                    await AsyncStorage.setItem("username", username);
                } catch (e) {
                    console.log(e);
                }
                dispatch({ type: "LOGIN", username, authToken });
                setSpinner(false);
            },
            signOut: async () => {
                setSpinner(true);
                try {
                    await AsyncStorage.removeItem("authToken", null);
                    await AsyncStorage.removeItem("username", null);
                } catch (e) {
                    console.log(e);
                }
                dispatch({ type: "LOGOUT" });
                setSpinner(false);
            },
        }),
        []
    );
    useEffect(() => {
        setTimeout(async () => {
            let userToken, userName;
            userToken = userName = null;
            try {
                userToken = await AsyncStorage.getItem("authToken");
                userName = await AsyncStorage.getItem("username");
            } catch (e) {
                console.log(e);
            }
            dispatch({
                type: "RETRIEVE_TOKEN",
                authToken: userToken,
                username: userName,
            });
            setSpinner(false);
        }, 1000);
    }, []);
    return spinner ? (
        <Spinner
            visible={spinner}
            textContent={"Just a sec..."}
            // textStyle={styles.spinnerTextStyle}
        />
    ) : (
        <AuthContext.Provider value={authContext}>
            <NavigationContainer>
                {loginState.authToken !== null ? (
                    <Drawer.Navigator
                        drawerContent={(props) => (
                            <DrawerContent
                                {...props}
                                username={loginState.username}
                            />
                        )}
                    >
                        <Drawer.Screen
                            name="AllUsers"
                            component={AllUsers}
                            // options={{
                            //     title: "Users",
                            //     gestureEnabled: false,
                            // }}
                        />
                        <Drawer.Screen name="Chat" component={Chat} />
                        <Drawer.Screen
                            name="Logout"
                            component={Logout}
                            options={{
                                title: "Sign Out",
                            }}
                        />
                    </Drawer.Navigator>
                ) : (
                    <RootStackScreen />
                )}
            </NavigationContainer>
        </AuthContext.Provider>
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
