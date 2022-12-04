import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Col, Row } from "react-native-easy-grid";
import { Avatar, Button, Icon } from "react-native-elements";
import CourseCard from "../components/CourseCard";
import CustomAvatar from "../components/CustomAvatar";
import { auth, firestore, firebase, db } from "../firebase";
import { samples } from "../samples/samples";
import { converter } from "../utils/convertMultipleToString";

export default function Profile({ navigation, info }) {
  const [user, setUser] = useState();
  const [rate, setRate] = useState(0);
  const [review, setReview] = useState(0);

  let expHeight = 40;
  let langHeight = 40;

  useEffect(() => {
    db.ref("/users/" + auth.currentUser.uid).on("value", (querySnapShot) => {
      let data = querySnapShot.val() ? querySnapShot.val() : {};
      setUser(data);
    });

    let pts = 0;
    let reviews = 0;

    for (let s of samples.subject_list) {
      db.ref(`/courses/${s.value}/${auth.currentUser.uid}`).once("value", (querySnapShot) => {
        let data = querySnapShot.val() ? querySnapShot.val() : {};

        for (let courses in data) {
          for (let item in data[courses]) {
            if (item === "rating") {
              for (let rating in data[courses][item]) {
                pts += data[courses][item][rating];
                reviews += 1;
              }
            }
          }
        }
      });
    }

    if (reviews > 0) {
      expHeight = user ? (Math.floor(user.area.split(" . ").length / 3) + 1) * 40 : 40;
      langHeight = user ? (Math.floor(user.language.split(" . ").length / 3) + 1) * 40 : 40;
      setRate((pts / reviews).toFixed(1));
      setReview(reviews);
    }
  }, []);

  const _onEdit = () => {
    navigation.navigate("EditProfile", { user: user });
  };

  const _onLogout = () => {
    auth.signOut();
  };

  return (
    <View style={styles.container}>
      <Row style={{ height: 50 }}>
        <Col style={{ justifyContent: "center" }} size={90}>
          <Text style={styles.title}>My Profile</Text>
        </Col>
        <Col style={{ justifyContent: "center" }} size={10}>
          <TouchableOpacity onPress={_onEdit}>
            <Icon type="font-awesome-5" name="edit" size={30} />
          </TouchableOpacity>
        </Col>
      </Row>
      {user && (
        <>
          {user.type === "Tutor" && <CustomAvatar gender={user.gender} uri={user.avatar} containerStyle={{ marginTop: 20 }} />}
          <Text style={styles.name}>{user.fullName}</Text>
          <Text style={styles.userName}>{user.userName}</Text>

          {user.type === "Tutor" ? (
            <>
              <Row style={{ width: "100%", height: user.area.length / 40 > 1 ? (user.area.length / 40) * 35 : 35, justifyContent: "center" }}>
                <Col size={30}>
                  <Text style={styles.desc}>Expert in: </Text>
                </Col>
                <Col size={70}>
                  <Text style={styles.desc}>{user.area}</Text>
                </Col>
              </Row>
              <Row style={{ width: "100%", height: 35, justifyContent: "center" }}>
                <Col size={30}>
                  <Text style={styles.desc}>Experience: </Text>
                </Col>
                <Col size={70}>
                  <Text style={styles.desc}>{user.year} Years</Text>
                </Col>
              </Row>
              <Row style={{ width: "100%", height: 35, justifyContent: "center" }}>
                <Col size={30}>
                  <Text style={styles.desc}>Education: </Text>
                </Col>
                <Col size={70}>
                  <Text style={styles.desc}>{user.education}</Text>
                </Col>
              </Row>
              <Row style={{ width: "100%", height: langHeight, justifyContent: "center" }}>
                <Col size={30}>
                  <Text style={styles.desc}>Language: </Text>
                </Col>
                <Col size={70}>
                  <Text style={styles.desc}>{user.language}</Text>
                </Col>
              </Row>
              <Row style={{ width: "100%", height: 70 }}>
                <Col size={30}>
                  <Text style={styles.desc}>Bio: </Text>
                </Col>
                <Col size={70}>
                  <Text style={styles.desc} numberOfLines={3}>
                    {user.bio}
                  </Text>
                </Col>
              </Row>
              <Row style={{ width: "100%", height: 100 }}>
                <Col size={30}>
                  <Text style={styles.desc}>Avg Rating: </Text>
                </Col>
                <Col size={70}>
                  <Text style={styles.desc}>
                    {rate} ({review} reviews)
                  </Text>
                </Col>
              </Row>
            </>
          ) : (
            <>
              <Row style={{ width: "100%", height: 35, justifyContent: "center", alignItems: "center" }}>
                <Col style={{ justifyContent: "center" }} size={30}>
                  <Text style={styles.desc}>Email: </Text>
                </Col>
                <Col style={{ justifyContent: "center" }} size={70}>
                  <Text style={styles.desc}>{user.email}</Text>
                </Col>
              </Row>
              {user.type === "Tutor" && (
                <Row style={{ width: "100%", height: 35, justifyContent: "center", alignItems: "center" }}>
                  <Col style={{ justifyContent: "center" }} size={30}>
                    <Text style={styles.desc}>Gender: </Text>
                  </Col>
                  <Col style={{ justifyContent: "center" }} size={70}>
                    <Text style={styles.desc}>{user.gender}</Text>
                  </Col>
                </Row>
              )}
            </>
          )}
        </>
      )}
      <Button title={"Log out"} containerStyle={{ position: "absolute", bottom: 20, width: "100%" }} onPress={_onLogout} />
    </View>
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
  title: {
    alignSelf: "flex-start",
    fontSize: 35,
    fontWeight: "bold",
  },
  name: {
    fontSize: 25,
    fontWeight: "bold",
    marginVertical: 10,
  },
  userName: {
    fontSize: 15,
    color: "#C0C0C0",
    marginBottom: 20,
  },
  desc: {
    fontSize: 15,
  },
});
