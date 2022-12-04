import { useNavigation } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Picker, ScrollView, ActivityIndicator } from "react-native";
import { auth, db, firestore } from "../firebase";
import { Dropdown } from "react-native-element-dropdown";
import { MultiSelect } from "react-native-element-dropdown";
import AntDesign from "react-native-vector-icons/AntDesign";
import CustomInput from "../components/CustomInput";
import { ButtonGroup, Button, Avatar } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import { uploadImage } from "../utils/uploadImage";
import { samples } from "../samples/samples";

import CustomAvatar from "../components/CustomAvatar";
import CustomMutipleSelect from "../components/CustomMutipleSelect";
import CustomTextArea from "../components/CustomTextArea";
import { converter } from "../utils/convertMultipleToString";
import CustomNumericInput from "../components/CustomNumericInput";

const EditProfile = ({ navigation, route }) => {
  const [userName, setUserName] = useState(route.params?.user.userName);
  const [fullName, setFullName] = useState(route.params?.user.fullName);
  const [email, setEmail] = useState(route.params?.user.email);
  const [gender, setGender] = useState(converter.decodeArray(route.params?.user.gender, samples.gender_list));
  const [avatar, setAvatar] = useState({ uri: route.params?.user.avatar });
  const [year, setYear] = useState(route.params?.user.year);
  const [education, setEducation] = useState(converter.decodeArray(route.params?.user.education, samples.education_list));
  const [language, setLanguage] = useState(converter.decodeArray(route.params?.user.language, samples.language_list));
  const [area, setArea] = useState(converter.decodeArray(route.params?.user.area, samples.subject_list));
  const [bio, setBio] = useState(route.params?.user.bio);

  const [loading, setLoading] = useState(false);

  const _onSubmit = async () => {
    try {
      setLoading(true);

      const modified = email.replace(/\s+/g, "").toLowerCase();
      const modified_userName = userName.replace(/\s+/g, "").toLowerCase();

      let info = {
        fullName: fullName,
        userName: modified_userName,
        email: modified,
      };

      if (avatar.uri != route.params?.user.avatar) {
        const res = await uploadImage(avatar);
        info = { ...info, avatar: res };
      }

      if (route.params?.user.type === "Tutor") {
        const details = {
          year: year,
          education: converter.encodeArray(education, samples.education_list),
          language: converter.encodeArray(language, samples.language_list),
          area: converter.encodeArray(area, samples.subject_list),
          bio: bio,
          gender: converter.encodeArray(gender, samples.gender_list),
        };

        info = { ...info, ...details };
      }

      const ref = db.ref(`users/${auth.currentUser.uid}`);
      await ref.update(info);
      setLoading(false);

      navigation.goBack();
    } catch (error) {
      setLoading(false);
      alert(error.message);
    }
  };

  const _onPickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      base64: true,
      quality: 1,
    });

    if (!result.cancelled) {
      setAvatar(result);
    }
  };

  return (
    <ScrollView style={{ backgroundColor: "#fff" }} showsVerticalScrollIndicator={false}>
      {route.params?.user && (
        <View style={styles.container}>
          {loading ? (
            <View style={{ marginTop: 200 }}>
              <ActivityIndicator size={"large"} color="grey" />
              <Text style={{ marginTop: 30, color: "grey" }}>Uploading ...</Text>
            </View>
          ) : (
            <>
              <Text style={styles.title}>Update Profile </Text>
              {route.params?.user.type === "Tutor" && (
                <>
                  <TouchableOpacity onPress={_onPickImage}>
                    <CustomAvatar gender={gender} uri={avatar.uri} containerStyle={{ marginBottom: 20 }} />
                  </TouchableOpacity>
                  <Text style={{ marginBottom: 20 }}>Upload your person image (optional)</Text>
                  <CustomMutipleSelect single={true} selectedItems={gender} onSelectedItemsChange={setGender} placeholder="Gender" arr={samples.gender_list} />
                </>
              )}
              <CustomInput placeholder="Full Name" value={fullName} onChangeText={setFullName} />
              <CustomInput placeholder="Email" value={email} onChangeText={setEmail} />
              <CustomInput placeholder="Username" value={userName} onChangeText={setUserName} />
              {route.params?.user.type === "Tutor" && (
                <>
                  <CustomMutipleSelect arr={samples.language_list} placeholder="Language" selectedItems={language} onSelectedItemsChange={setLanguage} type="Language" />
                  <CustomMutipleSelect single={true} arr={samples.education_list} placeholder="Education" selectedItems={education} onSelectedItemsChange={setEducation} />
                  <CustomNumericInput placeholder="Years of Experience" keyboardType="numeric" onChangeText={setYear} value={year} />
                  <CustomMutipleSelect arr={samples.subject_list} placeholder="Area of expertise" selectedItems={area} onSelectedItemsChange={setArea} type="Area" />
                  <CustomTextArea placeholder="Tell us about yourself…" onChangeText={setBio} value={bio} />
                </>
              )}

              <Button
                title="Save Changes"
                titleStyle={{ textAlign: "center", width: "100%" }}
                type="outline"
                buttonStyle={{ borderWidth: 2, width: "95%", height: 50, alignSelf: "center" }}
                containerStyle={{ marginTop: 30 }}
                onPress={_onSubmit}
              />
            </>
          )}
        </View>
      )}
    </ScrollView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    marginTop: 75,
  },
  title: {
    fontWeight: "bold",
    fontSize: 30,
    marginBottom: 30,
  },
  inputContainer: {
    width: "80%",
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  button: {
    backgroundColor: "#0782F9",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonOutline: {
    backgroundColor: "white",
    marginTop: 5,
    borderColor: "#0782F9",
    borderWidth: 2,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  buttonOutlineText: {
    color: "#0782F9",
    fontWeight: "700",
    fontSize: 16,
  },
});
