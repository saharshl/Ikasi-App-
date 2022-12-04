import moment from "moment";

import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Col, Row } from "react-native-easy-grid";
import { Avatar, Button, ButtonGroup, Rating } from "react-native-elements";
import CourseCard from "../components/CourseCard";
import CustomInput from "../components/CustomInput";
import CustomNumericInput from "../components/CustomNumericInput";
import CustomPicker from "../components/CustomPicker";
import CustomTextArea from "../components/CustomTextArea";
import { auth, firestore, firebase, db } from "../firebase";
import { samples } from "../samples/samples";

const DESC =
  "The definition of a description is a statement that gives details about someone or something. An example of description is a story about the places visited on a family trip. Aset of characteristics by which someone or something can be recognized.";

export default function AddNewCourse({ navigation, route, info }) {
  const [subject, setSubject] = useState(route.params?.subject);
  const [course, setCourse] = useState(route.params?.courseName);
  const [price, setPrice] = useState(route.params?.price ? String(route.params?.price) : 100);
  const [desc, setDesc] = useState(route.params?.description);

  const _onSubmit = async () => {
    let raw = {
      subject: subject,
      courseName: course,
      price: price,
      desc: desc,
      courseId: route.params?.edit === true ? route.params?.courseId : moment().unix(),
      tutorId: auth.currentUser.uid,
    };

    const courseId = route.params?.edit === true ? route.params?.courseId : moment().unix();

    const ref = db.ref(`users/${auth.currentUser.uid}`);

    await ref.once("value", (querySnapShot) => {
      let data = querySnapShot.val() ? querySnapShot.val() : {};
      raw = { ...raw, ...{ fullName: data.fullName } };
    });

    const item = JSON.parse(
      JSON.stringify({
        [courseId]: raw,
      })
    );

    db.ref(`courses/${subject}/${auth.currentUser.uid}`)
      .update(item)
      .then((res) => {
        alert("Create Success");
        navigation.goBack();
      });
  };

  const _onDelete = () => {
    db.ref(`courses/${subject}/${auth.currentUser.uid}/${route.params?.courseId}`)
      .remove()
      .then(() => {
        alert("Delete Success");
        navigation.goBack();
      });
  };

  const updatePrice = (e) => {
    if (Number(e) < 10000) {
      setPrice(e);
    }
  };

  const _onCancel = () => {
    navigation.goBack();
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{route.params?.edit === true ? "Edit" : "New"} Course Listing</Text>
      <CustomPicker value={subject} onValueChange={setSubject} arr={samples.subject_list} placeholder="Select Category" />
      <CustomInput placeholder="Course Title" onChangeText={setCourse} value={course} maxLength={15} />
      <Row style={{ height: 50 }}>
        <Col style={{ justifyContent: "center" }}>
          <Text style={styles.desc}>Price / Hr (HKD) :</Text>
        </Col>
        <Col>
          <CustomNumericInput iconStyle={{ marginRight: 5 }} placeholder="100" keyboardType="numeric" onChangeText={updatePrice} value={price} />
        </Col>
      </Row>
      <Text style={styles.bio}>{DESC}</Text>
      <CustomTextArea placeholder="Give a sample of what a good bio would look like" onChangeText={setDesc} value={desc} />
      <Button title={route.params?.edit === true ? "Save Changes" : "Post"} containerStyle={[styles.buttonContainer, { marginTop: 20 }]} buttonStyle={styles.buttonStyle} onPress={_onSubmit} />
      {route.params?.edit === true && (
        <Button title="Delete Course" containerStyle={styles.buttonContainer} buttonStyle={[styles.buttonStyle, { backgroundColor: "red", borderWidth: 0 }]} onPress={_onDelete} />
      )}
      <Button title="Cancel" type="outline" containerStyle={styles.buttonContainer} buttonStyle={styles.buttonStyle} onPress={_onCancel} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  desc: {
    fontSize: 15,
  },
  bio: {
    marginVertical: 20,
    fontSize: 12,
  },
  buttonContainer: {
    width: "100%",
  },
  buttonStyle: {
    borderWidth: 2,
    width: "100%",
    height: 50,
    marginTop: 10,
  },
});
