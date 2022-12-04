import React, { useState, useEffect, useCallback } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Col, Row } from "react-native-easy-grid";
import { Avatar, Button, Rating } from "react-native-elements";
import CourseCard from "../components/CourseCard";
import { auth, db } from "../firebase";
import { GiftedChat } from "react-native-gifted-chat";
import moment from "moment";
import CustomAvatar from "../components/CustomAvatar";

export default function ChatView({ navigation, route }) {
  const ROOM_ID = route.params?.roomId ? route.params?.roomId : `${auth.currentUser.uid}_${route.params?.tutorId}`;
  const courseName = route.params?.courseName;

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    console.log("ROOM_ID : ", ROOM_ID);

    const userRef = db.ref(`/users/${route.params?.tutorId}`).on("value", (sp) => {
      console.log(sp.val());

      let data = sp.val() ? sp.val() : {};
      let avatar;
      let fullName;
      let gender;

      if (data.hasOwnProperty("fullName")) {
        fullName = data.fullName;
      }

      if (data.hasOwnProperty("fullName")) {
        avatar = data.avatar;
      }

      if (data.hasOwnProperty("gender")) {
        gender = data.gender;
      }

      navigation.setOptions({
        tabBarStyle: { display: "none" },
        headerTitle: () => (
          <>
            <CustomAvatar gender={gender} uri={avatar} size="small" imageStyle={{ width: 30, height: 30 }} />
            <Text style={{ marginLeft: 5, fontSize: 16, color: "black" }}>{fullName}</Text>
          </>
        ),
        headerShown: true,
        tabBarStyle: { display: "none" },
      });
    });

    const ref = db.ref(`chatroom/${ROOM_ID}`);

    ref.on("value", async (querySnapShot) => {
      let data = querySnapShot.val() ? querySnapShot.val() : null;

      const msgArr = [];

      for (var msg in data) {
        let tmpMsg = data[msg];

        if (data[msg].hasOwnProperty("user")) {
          if (data[msg].user._id === auth.currentUser.uid) {
            tmpMsg = { ...data[msg], user: {} };
          }
          await msgArr.push(tmpMsg);
        }
      }

      msgArr.sort(function (a, b) {
        return b.createdAt < a.createdAt ? -1 : b.createdAt > a.createdAt ? 1 : 0;
      });

      setMessages(msgArr);
    });
  }, []);

  const onSend = useCallback(async (messages = []) => {
    const msg = { ...messages[0], ...{ user: { _id: auth.currentUser.uid } } };
    const lastUpdate = { lastUpdateAt: moment().unix(), lastMessageId: messages[0]._id, courseName: courseName };
    const ref = db.ref(`chatroom/${ROOM_ID}/${messages[0]._id}`);
    const updateTimeRef = db.ref(`chatroom/${ROOM_ID}`);

    await ref.update(msg);
    await updateTimeRef.update(lastUpdate);
  }, []);

  return (
    <GiftedChat
      renderAvatar={() => null}
      showUserAvatar={false}
      renderUsernameOnMessage={true}
      renderAvatarOnTop={true}
      alwaysShowSend={true}
      messages={messages}
      onSend={(messages) => onSend(messages)}
      showAvatarForEveryMessage={true}
      messagesContainerStyle={{ backgroundColor: "#fff" }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 75,
  },
  name: {
    fontSize: 25,
    fontWeight: "bold",
    marginVertical: 20,
  },
  desc: {
    fontSize: 18,
  },
});
