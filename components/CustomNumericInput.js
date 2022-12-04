import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import NumericInput from 'react-native-numeric-input';
import { Input, Icon } from 'react-native-elements';
import { Col } from 'react-native-easy-grid';

export default function CustomNumericInput({ value = 0, onChangeText = () => {}, placeholder = '', customStyle, iconStyle }) {
  const onMinus = () => {
    const tmp = parseFloat(value) - 1;
    onChangeText(String(tmp));
  };

  const onPlus = () => {
    const tmp = parseFloat(value) + 1;
    onChangeText(String(tmp));
  };

  return (
    <Input
      value={value}
      onChangeText={onChangeText}
      inputContainerStyle={[styles.input, customStyle]}
      placeholder={placeholder}
      containerStyle={{ width: '100%', height: 50, marginBottom: 20 }}
      keyboardType={'number-pad'}
      returnKeyType='done'
      rightIcon={
        <Col style={[{ justifyContent: 'center', marginRight: 22 }, iconStyle]}>
          <Icon name='md-caret-up-outline' type='ionicon' size={15} color='#A8A8A8' onPress={onMinus} />
          <Icon name='md-caret-down-outline' type='ionicon' size={15} color='#A8A8A8' onPress={onPlus} />
        </Col>
      }
    />
  );
}

const styles = StyleSheet.create({
  input: {
    width: '100%',
    borderBottomWidth: 0,
    borderRadius: 5,
    height: '100%',
    backgroundColor: '#F1F1F1',
    paddingHorizontal: 10,
  },
});
