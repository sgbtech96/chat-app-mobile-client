import React, { useState, useEffect, useContext } from "react";
import {
    StyleSheet,
    View,
    AsyncStorage,
    TouchableOpacity,
    TimePickerAndroid,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import axios from "axios";
import {
    Container,
    Header,
    Content,
    Card,
    CardItem,
    Text,
    Icon,
    Right,
    Left,
    List,
    Body,
    Title,
    Button,
} from "native-base";

let token, myUsername;

const AllUsers = ({ navigation }) => {
    const [users, setUsers] = useState([]);
    const [spinner, setSpinner] = useState(false);
    const fetchUsers = async () => {
        console.log("fetchUsers");
        setSpinner(true);
        token = await AsyncStorage.getItem("authToken");
        const res = await axios.get(
            "https://sgbtech96-auth-chat-server.herokuapp.com/allUsers",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        // console.log(res.data);
        myUsername = await AsyncStorage.getItem("username");
        // console.log(myUsername);
        const filteredUsers = res.data.filter(
            (usr) => usr.username !== myUsername
        );
        setUsers(filteredUsers);
        setSpinner(false);
    };
    const handleClick = async (name) => {
        console.log("handleClick");
        setSpinner(true);
        const res = await axios.post(
            "https://sgbtech96-auth-chat-server.herokuapp.com/room",

            {
                us1: myUsername,
                us2: name,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        // console.log(res.data);
        await AsyncStorage.setItem("roomId", res.data.roomId);
        setSpinner(false);
        navigation.navigate("Chat");
    };
    useEffect(() => {
        console.log("useEffect at AllUsers.js");
        fetchUsers();
    }, []);
    return spinner ? (
        <Spinner
            visible={spinner}
            textContent={"Please Wait..."}
            // textStyle={styles.spinnerTextStyle}
        />
    ) : (
        <View style={{ flex: 1, justifyContent: "center" }}>
            <Container>
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
                            Choose a User to Chat
                        </Text>
                    </Right>
                </Header>
                <Content>
                    {users.map((usr, i) => (
                        <TouchableOpacity
                            onPress={() => {
                                handleClick(usr.username);
                            }}
                            key={i}
                        >
                            <Card>
                                <CardItem>
                                    <Left>
                                        <Icon active name="person" />
                                        <Text>{usr.username}</Text>
                                    </Left>
                                    <Right>
                                        <Icon name="arrow-forward" />
                                    </Right>
                                </CardItem>
                            </Card>
                        </TouchableOpacity>
                    ))}
                </Content>
            </Container>
        </View>
    );
};

export default AllUsers;

const styles = StyleSheet.create({});
