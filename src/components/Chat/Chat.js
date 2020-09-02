import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    AsyncStorage,
    TextInput,
    // Button,
    FlatList,
    StyleSheet,
    Keyboard,
    ScrollView,
} from "react-native";
import socketIOClient from "socket.io-client";
import axios from "axios";
import Message from "./Message";
import { Container, Header, Content, Item, Input, Button } from "native-base";
import { max } from "moment";

let socket;
export default function Chat(props) {
    const [username, setUsername] = useState("");
    // const inputRef = useRef(null);
    const boxRef = useRef(null);
    const room = props.room;
    const ENDPOINT = "https://sgbtech96-chat-server.herokuapp.com/";

    const [text, setText] = useState("");
    const [messages, setMessages] = useState([]);
    const [enb, setEnb] = useState(false);

    useEffect(() => {
        console.log("useEffect creds at Chat.js", username);
        // fetching the username from Async Storage
        const getUsername = async () => {
            try {
                const tmp = await AsyncStorage.getItem("phno");
                setUsername(tmp);
            } catch (e) {
                console.log("error while getting phno :(");
            }
        };
        if (username == "") getUsername();
    }, [username]);

    useEffect(() => {
        console.log("useEffect fetch at Chat.js", username);
        //loading in the previous chats from the room
        const fetch = async () => {
            if (username == "") return;
            try {
                const { data } = await axios.get(
                    `https://sgbtech96-chat-server.herokuapp.com/chats/${room}`
                );
                setMessages(data.chats);
            } catch (e) {
                console.log("error while fetching previous chats from db :(");
            }
        };
        fetch();
    }, [username]);

    useEffect(() => {
        console.log("useEffect socket at Chat.js", username);
        //setting up socket
        socket = socketIOClient(ENDPOINT);
        socket.on("connect", () => {
            if (username != "") socket.emit("join", { username, room });
        });
        socket.on("newMessage", (msg) => {
            setMessages((prev) => [...prev, msg]);
            // setTimeout(() => {
            //     inputRef.current.scrollToEnd({ animated: true, index: 0 });
            // }, 1000);
        });

        return () => {
            socket.close();
        };
    }, [username]);

    const handleSend = () => {
        setEnb(true);
        if (text.trim().length == 0) {
            setText("");
            setEnb(false);
            return;
        }
        setText("");
        socket.emit("createMessage", { text, username, room });
        setEnb(false);
    };

    useEffect(() => {
        Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
        Keyboard.addListener("keyboardDidHide", _keyboardDidHide);

        // cleanup function
        return () => {
            Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
            Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
        };
    }, []);

    const _keyboardDidShow = () => {
        boxRef.current.scrollToEnd({ animated: true, duration: 100 });
    };

    const _keyboardDidHide = () => {
        // setDisplay(9.2);
        // setBox(0.8);
    };
    const handleBlur = (e) => {
        console.warn("Enter");
        if (e.keyCode === 40) {
            e.target.blur();
        }
    };

    const scrollToPosition = () => {
        boxRef.current.scrollToEnd({ animated: false, duration: 100 });
    };

    return (
        <View style={styles.totalWrapper}>
            <View style={{ ...styles.displayMessages, flex: 9.4 }}>
                {/* <FlatList
                    style={{ display: "flex" }}
                    data={messages}
                    renderItem={({ item, index }) => <Message item={item} />}
                    keyExtractor={(item) => item.createdAt.toString()}
                    ref={inputRef}
                    // onContentSizeChange={() => {
                    //     inputRef.current.scrollToEnd({
                    //         animated: false,
                    //         index: 0,
                    //     });
                    // }}
                    showsVerticalScrollIndicator={false}
                    // initialScrollIndex={0} */}
                {/* /> */}
                <ScrollView ref={boxRef} onContentSizeChange={scrollToPosition}>
                    {messages.map((item) => (
                        <Message
                            item={item}
                            user={username}
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
                            // onFocus={() => {
                            //     setDisplay(6);
                            //     setBox(1);
                            // }}
                            // onBlur={() => {
                            //     setDisplay(9.2);
                            //     setBox(0.8);
                            // }}
                            multiline
                            // onKeyPress={handleBlur}
                        />
                    </Item>
                </View>
                <View style={{ width: "25%", height: "100%" }}>
                    <Button
                        // rounded
                        info
                        onPress={handleSend}
                        style={{
                            width: "100%",
                            height: "100%",
                            backgroundColor: "#089000",
                        }}
                        disabled={enb}
                    >
                        <View
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                // backgroundColor: "#ddd",
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
        // backgroundColor: "#ddd",
    },
    displayMessages: {
        margin: 5,
        // backgroundColor: "#ddd",
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
