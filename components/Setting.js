import { useNavigation } from "@react-navigation/core";
import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Col, Row } from "react-native-easy-grid";
import { Avatar, Button, Icon, Rating } from "react-native-elements";
import CourseCard from "../components/CourseCard";
import { auth, firestore, firebase } from "../firebase";

export default function Setting() {
  const _onPress = () => {};

  return <Icon name="setting" type="antdesign" size={30} containerStyle={{ marginRight: 10 }} onPress={_onPress} />;
}

const styles = StyleSheet.create({});
