import { useNavigation } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Picker, ScrollView } from "react-native";
import { auth, db, firestore } from "../firebase";
import { Dropdown } from "react-native-element-dropdown";
import { MultiSelect } from "react-native-element-dropdown";
import AntDesign from "react-native-vector-icons/AntDesign";
import CustomInput from "../components/CustomInput";
import { ButtonGroup, Button, Avatar } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import { uploadImage } from "../utils/uploadImage";

const men = require("../images/men.png");
const women = require("../images/women.png");
const user = require("../images/user.png");

const CustomAvatar = ({ gender, size = "xlarge", uri = null, containerStyle = {}, imageStyle = {} }) => {
  let bc;
  let img = uri;

  console.log(gender);

  if (gender == "Male" || gender == "0") {
    bc = "#D8ECFF";
    img = img == null ? men : img;
  } else if (gender == "Female" || gender == "1") {
    bc = "#FFD8EA";
    img = img == null ? women : img;
  } else {
    bc = "#D1D1D1";
    img = img == null ? user : img;
  }
  const bw = size == "small" ? 2 : 5;

  return (
    <View style={[{ overflow: "hidden", justifyContent: "center", alignItems: "center", borderRadius: 20000, borderColor: bc, borderWidth: bw }, containerStyle]}>
      <Image source={img} resizeMode="cover" style={[{ width: 85, height: 85 }, imageStyle]} />
    </View>
  );
};

export default CustomAvatar;
