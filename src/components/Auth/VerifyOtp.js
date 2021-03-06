import React, { useState, useEffect } from "react";
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
import { Assets } from "@react-navigation/stack";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import styles from "./GlobalStyles";

const reviewSchema = yup.object({
    otp: yup.string().required(),
});
const VerifyOtp = ({ navigation }) => {
    const [spinner, setSpinner] = useState(false);
    const [err, setErr] = useState("");
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const updateSecureTextEntry = () => {
        setSecureTextEntry(!secureTextEntry);
    };
    const verifyOtp = async (values) => {
        setSpinner(true);
        const email = await AsyncStorage.getItem("email");
        const res = await axios.post(
            "https://sgbtech96-auth-chat-server.herokuapp.com/verifyOtp",
            {
                email,
                otp: values.otp,
            }
        );
        console.log(res.data);
        const { msg, error } = res.data;
        if (error) {
            setSpinner(false);
            setErr(error);
        } else {
            setSpinner(false);
            setErr("");
            navigation.navigate("Register");
        }
    };
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#410093" barStyle="light-content" />
            <View style={styles.header}>
                <Text style={styles.text_header}>Email Verification</Text>
                <Text style={styles.text_header}>Step 2 of 2</Text>
            </View>
            <Spinner
                visible={spinner}
                animation="slide"
                textContent={"Verifying Otp..."}
                textStyle={{
                    color: "#fff",
                    fontWeight: "700",
                }}
                // textStyle={styles.spinnerTextStyle}
            />
            <Animatable.View
                animation="fadeInUpBig"
                style={[
                    styles.footer,
                    {
                        flex: 3,
                    },
                ]}
            >
                <Formik
                    initialValues={{
                        otp: "",
                    }}
                    validationSchema={reviewSchema}
                    onSubmit={(values, actions) => {
                        // actions.resetForm();
                        verifyOtp(values);
                    }}
                >
                    {(props) => (
                        <ScrollView>
                            <Text style={styles.text_footer}>Otp</Text>
                            <View style={styles.action}>
                                <Feather
                                    name="lock"
                                    color="#05375a"
                                    size={20}
                                />
                                <TextInput
                                    placeholder="Let us know your Otp"
                                    onChangeText={props.handleChange("otp")}
                                    value={props.values.otp}
                                    style={styles.textInput}
                                    autoCapitalize="none"
                                    secureTextEntry={
                                        secureTextEntry ? true : false
                                    }
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
                                {props.touched.otp && props.errors.otp}
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
                                            Verify Otp
                                        </Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate("Login")}
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
                                        Login Instead
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

export default VerifyOtp;
