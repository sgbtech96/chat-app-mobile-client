import React from "react";
import { View, Text, StyleSheet } from "react-native";
import moment from "moment";

export default function Message({ item, user }) {
    return item.from !== user ? (
        <View style={styles.msgWrapper}>
            <View style={styles.msgTime}>
                <Text style={{ fontSize: 10, color: "#666" }}>
                    {moment(item.createdAt).format("h:mm a")}
                </Text>
            </View>
            <View style={styles.msgContainer}>
                <View style={styles.msgBox}>
                    <View style={styles.txtContainer}>
                        <Text style={styles.msgText}>{item.text}</Text>
                    </View>
                </View>
                {/* <View style={styles.msgSender}>
                    <Text style={{ fontSize: 10, color: "#888" }}>@me</Text>
                </View> */}
            </View>
        </View>
    ) : (
        <View style={styles.msgWrapper}>
            <View style={styles.msgTime2}>
                <Text style={{ fontSize: 10, color: "#666" }}>
                    {moment(item.createdAt).format("h:mm a")}
                </Text>
            </View>
            <View style={styles.msgContainer2}>
                {/* <View style={styles.msgSender}>
                    <Text style={{ fontSize: 10, color: "#888" }}>@me</Text>
                </View> */}
                <View style={styles.msgBox2}>
                    <View style={styles.txtContainer}>
                        <Text style={styles.msgText}>{item.text}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    msgWrapper: {
        // backgroundColor: "#fff",
        marginTop: 5,
        marginBottom: 5,
        display: "flex",
        paddingLeft: 4,
        paddingRight: 4,
    },
    msgContainer: {
        display: "flex",
        flexDirection: "row",
    },
    msgBox: {
        backgroundColor: "#28bae1",
        width: "50%",
        borderRadius: 20,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#fff",
    },
    txtContainer: {
        // backgroundColor: "#333",
        margin: "3%",
        width: "90%",
    },
    msgText: {
        color: "#fff",
    },
    msgSender: {
        alignSelf: "flex-end",
    },
    msgTime: {
        marginLeft: "15%",
        marginRight: "65%",
        // backgroundColor: "#333",
        display: "flex",
        alignItems: "center",
    },
    msgBox2: {
        backgroundColor: "#fbb03b",
        width: "50%",
        borderRadius: 20,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#fff",
    },
    msgContainer2: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    msgTime2: {
        marginLeft: "65%",
        marginRight: "15%",
        // backgroundColor: "#333",
        display: "flex",
        alignItems: "center",
    },
});
