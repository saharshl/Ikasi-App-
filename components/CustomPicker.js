import { useNavigation } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ExtraText, ExtraView, TextLink, TextLinkContent, B } from "../components/styles";
import { auth } from "../firebase";
import { Button, Input } from "react-native-elements";
import { Icon, Select } from "native-base";

export default CustomPicker = ({ value = "", onValueChange = () => {}, arr = [], placeholder = "Place Holder" }) => {
  return (
    <Select placeholder={placeholder} fontSize={17} selectedValue={value} height={50} width={"94%"} marginBottom={3} borderWidth={0} backgroundColor={"#F1F1F1"} onValueChange={onValueChange}>
      {arr.map((e) => {
        return <Select.Item label={e.value} value={e.value} fontSize={20} />;
      })}
    </Select>
  );
};

const styles = StyleSheet.create({});
