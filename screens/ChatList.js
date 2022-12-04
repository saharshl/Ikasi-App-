import { useNavigation } from "@react-navigation/core";
import moment from "moment";

import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native";
import { Col, Row } from "react-native-easy-grid";
import { Avatar, Icon } from "react-native-elements";
import CustomAvatar from "../components/CustomAvatar";
import { auth, firestore, db } from "../firebase";

export default function ChatList({ navigation }) {
  const [list, setList] = useState([]);

  useEffect(() => {
    let ref = db.ref(`chatroom`);

    ref.on("value", async (querySnapShot) => {
      let data = querySnapShot.val() ? querySnapShot.val() : null;
      const res = [];

      for (var chatroom in data) {
        const lastUpdate = data[chatroom].lastUpdateAt;
        const lastMessageContent = data[chatroom][data[chatroom].lastMessageId].text;
        const courseName = data[chatroom].courseName;
        const user = chatroom.split("_")[0] === auth.currentUser.uid ? chatroom.split("_")[1] : chatroom.split("_")[0];

        if (chatroom.includes(auth.currentUser.uid)) {
          const userRef = db.ref(`users/${user}`);
          await userRef.once("value", async (sp) => {
            let userValue = sp.val() ? sp.val() : null;

            await res.push({ userId: user, user: userValue, lastUpdate: lastUpdate, lastMessageContent: lastMessageContent, courseName: courseName, roomId: chatroom });
          });
        }
      }

      res.sort(function (a, b) {
        return b.lastUpdate < a.lastUpdate ? -1 : b.lastUpdate > a.lastUpdate ? 1 : 0;
      });

      setList(res);
    });
  }, []);

  return (
    <ScrollView style={{ backgroundColor: "#fff" }}>
      <View style={styles.container}>
        {list.length < 1 ? (
          <View style={{ marginTop: 200, alignItems: "center" }}>
            <Text style={{ marginTop: 30, color: "grey" }}>No Record Found.</Text>
          </View>
        ) : (
          <>
            {list.map((item, index) => {
              return (
                <ChatListItem
                  user={item.user}
                  lastContent={item.lastMessageContent}
                  index={index}
                  courseName={item.courseName}
                  lastUpdate={item.lastUpdate}
                  roomId={item.roomId}
                  userId={item.userId}
                />
              );
            })}
          </>
        )}
      </View>
    </ScrollView>
  );
}

const ChatListItem = ({ index, user, lastContent, courseName, lastUpdate, roomId, userId }) => {
  const navigation = useNavigation();

  console.log(userId);

  console.log(user.gender);
  const _onChat = () => {
    navigation.navigate("ChatView", { roomId: roomId, courseName: courseName, tutorId: userId });
  };

  return (
    <TouchableOpacity style={styles.itemContainer} onPress={_onChat}>
      <Row>
        <Col style={{ justifyContent: "center", alignItems: "center" }} size={25}>
          <CustomAvatar gender={user.gender} uri={user.avatar} size={"small"} imageStyle={{ width: 60, height: 60 }} />
        </Col>
        <Col style={{ paddingVertical: 10, paddingHorizontal: 5 }} size={75}>
          <Row size={30}>
            <Text style={styles.itemName}>{user.fullName}</Text>
          </Row>
          <Row size={40}>
            <Text style={styles.courseName}>{courseName}</Text>
          </Row>
          <Row size={30}>
            <Text style={styles.content} numberOfLines={1}>
              {lastContent}
            </Text>
          </Row>
          <Text style={styles.time}>{moment.unix(lastUpdate).format("YY/MM/DD hh:mm A")}</Text>
        </Col>
      </Row>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  itemContainer: {
    width: "100%",
    height: 85,
    borderWidth: 1,
    borderColor: "#F1F1F1",
  },
  itemName: {
    fontSize: 16,
  },
  courseName: {
    fontSize: 18,

    fontWeight: "bold",
  },
  content: {
    color: "grey",
    width: "100%",
  },
  time: {
    fontSize: 12,
    color: "grey",
    position: "absolute",
    top: 5,
    right: 10,
  },
});
