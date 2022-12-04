import { async } from "@firebase/util";
import { useFocusEffect, useNavigation } from "@react-navigation/core";
import moment from "moment";
import React, { useState, useEffect } from "react";
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View, Image, ActivityIndicator, RefreshControl } from "react-native";
import { Col, Row } from "react-native-easy-grid";
import { Avatar, Button, Icon, SearchBar } from "react-native-elements";
import CourseCard from "../components/CourseCard";
import { auth, firestore, firebase, db } from "../firebase";
import { samples } from "../samples/samples";
import { helper } from "../utils/helper";

const LOGO = require("../assets/splash.png");

const getCoursesFromFirebase = async (subject) => {
  var ref = db.ref(`/courses/${subject}`);
  const snapshot = await ref.once("value");
  return snapshot.val();
};

const searchBySearchValue = async (searchValue = "", subject = "") => {
  const resultArr = [];
  const tmp = new Map();

  let subject_list = samples.subject_list;

  if (subject != "") {
    subject_list = [subject];
  }

  for (let s of subject_list) {
    const res = await getCoursesFromFirebase(s.value);

    if (res) {
      for (var tutor in res) {
        for (var course in res[tutor]) {
          if (res[tutor][course].tutorId.includes(auth.currentUser.uid) && res[tutor][course].courseName.includes(searchValue)) {
            const userRef = db.ref(`users/${res[tutor][course].tutorId}`);
            const snapshot = await userRef.once("value");
            const user = snapshot.val();
            const info = { ...res[tutor][course], ...{ avatar: user.avatar ? user.avatar : null, fullName: user.fullName ? user.fullName : null } };

            await tmp.set(res[tutor][course].courseId, info);
          }
        }
      }
    }
  }

  for (const [name, value] of tmp) {
    resultArr.push(value);
  }

  await resultArr.sort(function (a, b) {
    return b.courseId < a.courseId ? -1 : b.courseId > a.courseId ? 1 : 0;
  });

  return resultArr;
};

export default function TutorHome({ navigation }) {
  const [searchValue, setSearchValue] = useState("");
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(false);
  const [version, setVersion] = useState();

  useEffect(() => {
    db.ref(`/courses/`).on("value", () => {
      setLastUpdate(moment().unix());
    });

    db.ref(`/users/`).on("value", () => {
      setLastUpdate(moment().unix());
    });

    (async function () {
      const v = await helper.getAppVersion();
      setVersion(v);
    })();
  }, []);

  useEffect(() => {
    setLoading(true);
    searchBySearchValue(searchValue).then((res) => {
      setList(res);
      setLoading(false);
    });
  }, [searchValue, lastUpdate]);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Row style={{ width: 120, position: "absolute" }}>
          <Col style={{ justifyContent: "center", alignItems: "center" }} size={30}>
            <Icon name="chalkboard-teacher" type="font-awesome-5" />
          </Col>
          <Col style={{ justifyContent: "center" }} size={70}>
            <Text>Tutor</Text>
          </Col>
        </Row>
        <Image source={LOGO} style={styles.logo} />
        <SearchBar
          placeholder="Search for courses ..."
          onChangeText={setSearchValue}
          value={searchValue}
          lightTheme
          containerStyle={{ backgroundColor: "transparent", borderTopWidth: 0, borderBottomWidth: 0 }}
          inputContainerStyle={{ backgroundColor: "#F1F1F1" }}
        />

        <Text style={styles.highlight}>My Courses Listing</Text>
        <AddNewCourse />
        {loading ? (
          <ActivityIndicator size={"large"} style={{ marginTop: 30 }} color="grey" />
        ) : (
          <>
            {list.length < 1 ? (
              <Text style={{ textAlign: "center", marginTop: 30, fontWeight: "bold", color: "grey" }}> No Course Found</Text>
            ) : (
              <>
                {list.map((item) => {
                  return (
                    <CourseCard
                      subject={item.subject}
                      courseName={item.courseName}
                      price={item.price}
                      description={item.desc}
                      tutor={item.fullName}
                      type="Tutor"
                      courseId={item.courseId}
                      avatar={item.avatar}
                      rateArr={item.rating}
                    />
                  );
                })}
              </>
            )}
            <Text style={{ fontSize: 10, textAlign: "center", marginVertical: 15, fontWeight: "bold", color: "grey" }}> Last update : {moment.unix(lastUpdate).format("YYYY-MM-DD hh:mm A")}</Text>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const AddNewCourse = () => {
  const navigation = useNavigation();

  const _onPress = () => {
    navigation.navigate("AddNewCourse");
  };
  return (
    <TouchableOpacity
      style={{
        justifyContent: "center",
        borderStyle: "dashed",
        width: "95%",
        height: 60,
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 20,
        alignSelf: "center",
        paddingVertical: 10,
        paddingHorizontal: 20,
      }}
      onPress={_onPress}
    >
      <Row
        style={{
          alignItems: "center",
        }}
      >
        <Text style={{ fontWeight: "bold", color: "grey", fontSize: 16 }}> Add a new course... </Text>
      </Row>
    </TouchableOpacity>
  );
};

const SubjectBlob = ({ item, setSubject }) => {
  const _onPress = () => {
    setSubject(item.value);
  };

  return (
    <TouchableOpacity style={styles.blob} onPress={_onPress}>
      <Text style={{ marginTop: 60, position: "absolute", bottom: -30 }}>{item.value.split(" ")[0]}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  logo: {
    width: 200,
    height: 50,
    alignSelf: "center",
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
  },
  subTitle: {
    textAlign: "center",
    fontSize: 20,
    marginVertical: 20,
  },
  highlight: {
    fontSize: 30,
    fontWeight: "bold",
    marginVertical: 20,
  },
  blob: {
    width: 65,
    height: 65,
    backgroundColor: "#F1F1F1",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
    marginBottom: 50,
  },
});
