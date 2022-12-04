import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Col, Row } from "react-native-easy-grid";
import { Avatar, Button, Rating } from "react-native-elements";
import CourseCard from "../components/CourseCard";
import CustomAvatar from "../components/CustomAvatar";
import { auth, firestore, firebase, db } from "../firebase";
import { samples } from "../samples/samples";

export default function ViewProfile({ navigation, route }) {
  const [user, setUser] = useState();
  const [rate, setRate] = useState(0);
  const [review, setReview] = useState(0);
  const { courseId, courseName, tutorId, subject } = route.params;

  const [isRated, setIsRated] = useState(false);

  let expHeight = 40;
  let langHeight = 40;

  useEffect(() => {
    db.ref("/users/" + tutorId).on("value", (querySnapShot) => {
      let data = querySnapShot.val() ? querySnapShot.val() : {};
      setUser(data);

      expHeight = (Math.floor(data.area.split(" . ").length / 3) + 1) * 40;
      langHeight = (Math.floor(data.language.split(" . ").length / 3) + 1) * 40;
    });

    let pts = 0;
    let reviews = 0;

    for (let s of samples.subject_list) {
      db.ref(`/courses/${s.value}/${tutorId}`).on("value", (querySnapShot) => {
        let data = querySnapShot.val() ? querySnapShot.val() : {};

        for (let courses in data) {
          for (let item in data[courses]) {
            if (item === "rating") {
              for (let rating in data[courses][item]) {
                console.log("user name : ", rating, auth.currentUser.uid);
                console.log("current course : ", data[courses].courseId, courseId);

                if (rating == auth.currentUser.uid && data[courses].courseId == courseId) {
                  setIsRated(true);
                }
                pts += data[courses][item][rating];
                reviews += 1;
              }
            }
          }
        }
      });
    }

    if (reviews > 0) {
      setRate((pts / reviews).toFixed(1));
      setReview(reviews);
    }
  }, []);

  const _onFinishRating = (rating) => {
    const newRate = {
      [auth.currentUser.uid]: rating,
    };

    db.ref(`/courses/${subject}/${tutorId}/${courseId}/rating`).update(newRate);

    const r = rate * review + rating;

    setRate((r / (review + 1)).toFixed(1));
    setReview(review + 1);
  };

  const _onChat = () => {
    navigation.navigate("ChatView", route.params);
  };

  const _onReport = () => {
    alert("Thank you for your report");
  };

  return (
    <ScrollView style={{ backgroundColor: "#fff" }} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        {user && (
          <>
            <CustomAvatar gender={user.gender === "Male" ? 0 : 1} uri={user.avatar} />
            <Text style={styles.name}>{user.fullName}</Text>
            <Text style={styles.userName}>{user.userName}</Text>
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
            <Row style={{ width: "100%", height: 85 }}>
              <Col size={30}>
                <Text style={styles.desc}>Bio: </Text>
              </Col>
              <Col size={70}>
                <Text style={styles.desc}>{user.bio}</Text>
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
            {!isRated && (
              <Row style={{ width: "100%", justifyContent: "center", alignItems: "center", marginVertical: 10 }}>
                <Text>Rate {user.fullName} ? </Text>
                <Rating startingValue={0} ratingCount={5} imageSize={20} onFinishRating={_onFinishRating} />
              </Row>
            )}
            <Button
              title={`Interested? Chat with ${user.fullName}`}
              buttonStyle={{ backgroundColor: "#32A789", height: 50, marginVertical: 20 }}
              onPress={_onChat}
              containerStyle={{ width: "100%" }}
            />
            <Button title={"Report"} buttonStyle={{ backgroundColor: "#F24726", height: 50, marginBottom: 50 }} onPress={_onReport} containerStyle={{ width: "100%" }} />
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  name: {
    fontSize: 25,
    fontWeight: "bold",
    marginVertical: 10,
  },
  userName: {
    fontSize: 15,
    color: "grey",
    marginBottom: 20,
  },
  desc: {
    fontSize: 15,
  },
});
