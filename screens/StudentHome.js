import { useFocusEffect } from "@react-navigation/core";
import moment from "moment";
import React, { useState, useEffect } from "react";
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View, Image, ActivityIndicator } from "react-native";
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
          if ((res[tutor][course].fullName && res[tutor][course].fullName.includes(searchValue)) || res[tutor][course].courseName.includes(searchValue)) {
            const userRef = db.ref(`users/${res[tutor][course].tutorId}`);
            const snapshot = await userRef.once("value");
            const user = snapshot.val();
            const info = { ...res[tutor][course], ...{ avatar: user.avatar, fullName: user.fullName } };

            await tmp.set(res[tutor][course].courseId, info);
          }
        }
      }
    }
  }

  for (const [name, value] of tmp) {
    resultArr.push(value);
  }

  return resultArr;
};

export default function StudentHome() {
  const [searchValue, setSearchValue] = useState("");
  const [subject, setSubject] = useState("");
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(false);
  const [version, setVersion] = useState();

  useEffect(() => {
    setLoading(true);
    searchBySearchValue(searchValue, subject).then((res) => {
      setList(res);
      setLoading(false);
    });
  }, [searchValue, subject, lastUpdate]);

  useEffect(() => {
    db.ref(`courses`).on("value", () => {
      setLastUpdate(moment().unix());
    });

    (async function () {
      const v = await helper.getAppVersion();
      setVersion(v);
    })();
  }, []);

  const _onClearAll = () => {
    setSubject("");
    setSearchValue("");
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Row style={{ width: 120, position: "absolute" }}>
          <Col style={{ justifyContent: "center", alignItems: "center" }} size={30}>
            <Icon name="user-graduate" type="font-awesome-5" />
          </Col>
          <Col style={{ justifyContent: "center" }} size={70}>
            <Text>Student </Text>
          </Col>
        </Row>
        <Image source={LOGO} style={styles.logo} />
        <SearchBar
          placeholder="Search for tutors or courses"
          onChangeText={setSearchValue}
          value={searchValue}
          lightTheme
          containerStyle={{ backgroundColor: "transparent", borderTopWidth: 0, borderBottomWidth: 0 }}
          inputContainerStyle={{ backgroundColor: "#F1F1F1" }}
        />
        <Row style={{ height: 75 }}>
          <Col size={80} style={{ justifyContent: "center" }}>
            <Text style={styles.highlight}>Browse Categories</Text>
          </Col>
          <Col size={20} style={{ justifyContent: "center" }}>
            <TouchableOpacity onPress={_onClearAll}>
              <Text style={styles.seeAll}>View All</Text>
            </TouchableOpacity>
          </Col>
        </Row>

        <FlatList
          data={samples.subject_list}
          renderItem={(item) => {
            return <SubjectBlob item={item.item} setSubject={setSubject} currentSubject={subject} />;
          }}
          numColumns={4}
        />

        <Text style={[styles.highlight, { marginBottom: 30 }]}>Recent course listing</Text>
        {loading ? (
          <ActivityIndicator size={"large"} style={{ marginTop: 30 }} color="grey" />
        ) : (
          <>
            {list.length > 0 ? (
              <>
                {list.map((item) => {
                  return (
                    <CourseCard
                      subject={item.subject}
                      courseName={item.courseName}
                      price={item.price}
                      description={item.desc}
                      tutor={item.fullName}
                      type="Student"
                      courseId={item.courseId}
                      tutorId={item.tutorId}
                      avatar={item.avatar}
                      rateArr={item.rating}
                    />
                  );
                })}
              </>
            ) : (
              <Text style={{ textAlign: "center", marginTop: 30, fontWeight: "bold", color: "grey" }}> No Course Found</Text>
            )}

            <Text style={{ fontSize: 10, textAlign: "center", marginVertical: 15, fontWeight: "bold", color: "grey" }}> Last update : {moment.unix(lastUpdate).format("YYYY-MM-DD hh:mm A")}</Text>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const SubjectBlob = ({ item, setSubject, currentSubject }) => {
  const _onPress = () => {
    setSubject(item);
  };

  return (
    <TouchableOpacity style={[styles.blob, currentSubject.value === item.value ? { backgroundColor: item.color } : {}]} onPress={_onPress}>
      <Icon name={item.icon} type={item.type} size={item.size} color={currentSubject.value === item.value ? "" : item.color} />
      <View style={{ width: "100%", height: 30, position: "absolute", bottom: -30, alignItems: "center", justifyContent: "center" }}>
        <Text style={[{ fontSize: 12, textAlign: "center" }, currentSubject.value === item.value && { fontWeight: "bold" }]}>{item.value}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 40,
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
    fontSize: 23,
    fontWeight: "bold",
  },
  seeAll: {
    fontSize: 15,
    fontWeight: "bold",
  },
  blob: {
    width: 65,
    height: 65,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
    marginBottom: 50,
  },
});
