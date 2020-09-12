import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    AsyncStorage,
    TextInput,
    FlatList,
    StyleSheet,
    Keyboard,
    ScrollView,
} from "react-native";
import socketIOClient from "socket.io-client";
import axios from "axios";
import Message from "./Message";
import Spinner from "react-native-loading-spinner-overlay";
import {
    Container,
    Header,
    Content,
    Item,
    Input,
    Button,
    Left,
    Right,
    Icon,
    Body,
} from "native-base";
import { useIsFocused } from "@react-navigation/native";

let socket;
export default function Chat({ navigation }) {
    const [spinner, setSpinner] = useState(true);
    const boxRef = useRef(null);
    const [text, setText] = useState("");
    let [messages, setMessages] = useState([]);
    const [enable, setEnable] = useState(false);
    const [creds, setCreds] = useState({
        token: null,
        roomId: null,
        username: null,
    });

    const isFocused = useIsFocused();

    const fetchChats = async () => {
        if (!isFocused) return;
        console.log("fetchChats");
        setSpinner(true);
        creds.token = await AsyncStorage.getItem("authToken");
        creds.roomId = await AsyncStorage.getItem("roomId");
        creds.username = await AsyncStorage.getItem("username");
        console.log("await crossed");
        const res = await axios.get(
            `https://sgbtech96-auth-chat-server.herokuapp.com/chats/${creds.roomId}`,
            {
                headers: {
                    Authorization: `Bearer ${creds.token}`,
                },
            }
        );
        // console.log(res.data);
        if (res.data.error) {
            console.log("hello1");
            setSpinner(false);
            return;
        }
        console.log("fetchChats", creds.roomId);
        setMessages(res.data.chats);
        setSpinner(false);
    };

    useEffect(() => {
        console.log(
            "use effect in chat.js",
            creds.token,
            creds.roomId,
            creds.username
        );
        fetchChats();
        return () => {
            creds.token = creds.roomId = creds.username = null;
        };
    }, [isFocused]);
    useEffect(() => {
        if (!isFocused) return;
        if (!creds.token) return;
        console.log("Joining Room", creds.roomId);
        socket = socketIOClient(
            "https://sgbtech96-auth-chat-server.herokuapp.com/"
        );
        socket.on("connect", () => {
            socket.emit("join", {
                username: creds.username,
                room: creds.roomId,
            });
        });
        socket.on("newMessage", (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        return () => {
            socket.close();
        };
    }, [isFocused, creds.token]);

    const handleSend = () => {
        setEnable(true);
        if (text.trim().length == 0) {
            setText("");
            setEnable(false);
            return;
        }
        setText("");
        socket.emit("createMessage", {
            text,
            username: creds.username,
            room: creds.roomId,
        });
        setEnable(false);
    };

    useEffect(() => {
        if (!isFocused) return;
        Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
        return () => {
            Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
        };
    }, [isFocused]);

    const _keyboardDidShow = () => {
        boxRef.current.scrollToEnd({ animated: true, duration: 100 });
    };

    const scrollToPosition = () => {
        boxRef.current.scrollToEnd({ animated: false, duration: 100 });
    };

    return creds.token === null ? (
        <Spinner
            visible={spinner}
            textContent={"Fetching your chats..."}
            // textStyle={styles.spinnerTextStyle}
        />
    ) : (
        <View style={styles.totalWrapper}>
            <Header style={{ backgroundColor: "#410093" }}>
                <Left>
                    <Button
                        transparent
                        onPress={() => {
                            navigation.toggleDrawer();
                        }}
                    >
                        <Icon name="menu" />
                    </Button>
                </Left>
                <Right>
                    <Text
                        style={{
                            color: "#fff",
                            fontWeight: "700",
                        }}
                    >
                        {creds.roomId.replace(creds.username, "")}
                    </Text>
                </Right>
            </Header>
            <View style={{ ...styles.displayMessages, flex: 9.4 }}>
                <ScrollView ref={boxRef} onContentSizeChange={scrollToPosition}>
                    {messages.map((item) => (
                        <Message
                            item={item}
                            user={creds.username}
                            key={
                                item.createdAt.toString() +
                                Math.random().toString()
                            }
                        />
                    ))}
                </ScrollView>
            </View>
            <View style={{ ...styles.sendMessages, flex: 0.6 }}>
                <View style={{ width: "70%", height: "100%" }}>
                    <Item style={{ width: "100%", height: "100%" }}>
                        <Input
                            placeholder="Type here..."
                            onChangeText={(val) => setText(val)}
                            style={{ width: "100%", height: "100%" }}
                            value={text}
                            multiline
                        />
                    </Item>
                </View>
                <View style={{ width: "25%", height: "100%" }}>
                    <Button
                        info
                        onPress={handleSend}
                        style={{
                            width: "100%",
                            height: "100%",
                            backgroundColor: "#410093",
                        }}
                        disabled={enable}
                    >
                        <View
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <Text
                                style={{
                                    color: "#fff",
                                    fontSize: 20,
                                }}
                            >
                                SEND
                            </Text>
                        </View>
                    </Button>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    totalWrapper: {
        flex: 1,
    },
    displayMessages: {
        margin: 5,
    },
    sendMessages: {
        display: "flex",
        minHeight: 30,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingTop: 4,
        paddingBottom: 4,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.0,

        elevation: 24,

        backgroundColor: "#fff",
    },
});
