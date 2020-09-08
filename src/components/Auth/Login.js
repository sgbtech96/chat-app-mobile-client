import React, { useState, useEffect, useContext } from "react";
import {
    StyleSheet,
    Text,
    View,
    Button,
    TextInput,
    AsyncStorage,
    TouchableOpacity,
    Dimensions,
    Platform,
    ScrollView,
    StatusBar,
} from "react-native";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";
import Spinner from "react-native-loading-spinner-overlay";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import styles from "./GlobalStyles";
import { AuthContext } from "./AuthContext";

const reviewSchema = yup.object({
    username: yup.string().required(),
    password: yup.string().required(),
});
const Login = ({ navigation }) => {
    const [spinner, setSpinner] = useState(false);
    const [err, setErr] = useState("");
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const { signIn } = useContext(AuthContext);
    const updateSecureTextEntry = () => {
        setSecureTextEntry(!secureTextEntry);
    };
    const login = async ({ username, password }) => {
        setSpinner(true);
        const res = await axios.post("http://192.168.43.35:8000/login", {
            username,
            password,
        });
        console.log(res.data);
        const { msg, error, token } = res.data;
        const userId = res.data.username;
        if (error) {
            setSpinner(false);
            setErr(error);
        } else {
            signIn(token, userId);
            setSpinner(false);
            setErr("");
        }
    };
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#410093" barStyle="light-content" />
            <View style={styles.header}>
                <Text style={styles.text_header}>Your login creds!</Text>
            </View>
            <Spinner
                visible={spinner}
                textContent={"Logging in..."}
                // textStyle={styles.spinnerTextStyle}
            />
            <Animatable.View animation="fadeInUpBig" style={styles.footer}>
                <Formik
                    initialValues={{
                        username: "",
                        password: "",
                    }}
                    validationSchema={reviewSchema}
                    onSubmit={(values, actions) => {
                        // actions.resetForm();
                        login(values);
                    }}
                >
                    {(props) => (
                        <ScrollView>
                            <Text style={styles.text_footer}>Username</Text>
                            <View style={styles.action}>
                                <FontAwesome
                                    name="user-o"
                                    color="#05375a"
                                    size={20}
                                />
                                <TextInput
                                    placeholder=" Your username?"
                                    onChangeText={props.handleChange(
                                        "username"
                                    )}
                                    value={props.values.username}
                                    style={styles.textInput}
                                    autoCapitalize="none"
                                />
                            </View>
                            <Text style={styles.error}>
                                {props.touched.username &&
                                    props.errors.username}
                            </Text>
                            <Text
                                style={[
                                    styles.text_footer,
                                    {
                                        marginTop: 35,
                                    },
                                ]}
                            >
                                Password
                            </Text>
                            <View style={styles.action}>
                                <Feather
                                    name="lock"
                                    color="#05375a"
                                    size={20}
                                />
                                <TextInput
                                    placeholder="What's your password?"
                                    onChangeText={props.handleChange(
                                        "password"
                                    )}
                                    value={props.values.password}
                                    secureTextEntry={
                                        secureTextEntry ? true : false
                                    }
                                    style={styles.textInput}
                                    autoCapitalize="none"
                                />
                                <TouchableOpacity
                                    onPress={updateSecureTextEntry}
                                >
                                    {secureTextEntry ? (
                                        <Feather
                                            name="eye-off"
                                            color="grey"
                                            size={20}
                                        />
                                    ) : (
                                        <Feather
                                            name="eye"
                                            color="grey"
                                            size={20}
                                        />
                                    )}
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.error}>
                                {props.touched.password &&
                                    props.errors.password}
                            </Text>
                            <View style={styles.errorBackend}>
                                <Text
                                    visible={err.length > 0}
                                    style={styles.error}
                                >
                                    {err}
                                </Text>
                            </View>
                            <View style={styles.button}>
                                <TouchableOpacity
                                    style={styles.signIn}
                                    onPress={props.handleSubmit}
                                >
                                    <LinearGradient
                                        colors={["#6632A8", "#410093"]}
                                        style={styles.signIn}
                                    >
                                        <Text
                                            style={[
                                                styles.textSign,
                                                {
                                                    color: "#fff",
                                                },
                                            ]}
                                        >
                                            Sign In
                                        </Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() =>
                                        navigation.navigate("SendOtp")
                                    }
                                    style={[
                                        styles.signIn,
                                        {
                                            borderColor: "#410093",
                                            borderWidth: 1,
                                            marginTop: 15,
                                        },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.textSign,
                                            {
                                                color: "#6632A8",
                                            },
                                        ]}
                                    >
                                        Not yet registered?
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    )}
                </Formik>
            </Animatable.View>
        </View>
    );
};

export default Login;
