import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, View, AsyncStorage } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { AuthContext } from "./AuthContext";
import axios from "axios";

const Logout = ({ navigation }) => {
    const [spinner, setSpinner] = useState(true);
    const { signOut } = useContext(AuthContext);
    const logout = async () => {
        const token = await AsyncStorage.getItem("authToken");
        const res = await axios.get("http://192.168.43.35:8000/logout", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log(res.data);
        signOut();
    };
    useEffect(() => {
        logout();
    }, []);
    return (
        <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
            <Spinner
                visible={spinner}
                textContent={"Logging out..."}
                // textStyle={styles.spinnerTextStyle}
            />
        </View>
    );
};

export default Logout;

const styles = StyleSheet.create({});
