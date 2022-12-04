import { StyleSheet, Text, TextInput } from 'react-native';
import React from 'react';

export default function CustomTextArea({ value = '', onChangeText = () => {}, placeholder = 'placeholder' }) {
  return (
    <TextInput
      value={value}
      placeholder={placeholder}
      onChangeText={onChangeText}
      multiline={true}
      style={{
        textAlignVertical: 'top',
        backgroundColor: '#f1f1f1',
        width: '95%',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#D1D1D1',
        height: 85,
        paddingVertical: 5,
        paddingHorizontal: 10,
        fontSize: 16,
      }}
      numberOfLines={3}
      maxLength={120}
      returnKeyType='done'
    />
  );
}

const styles = StyleSheet.create({});
