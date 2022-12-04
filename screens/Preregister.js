import { useNavigation } from '@react-navigation/core'
import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { ExtraText, ExtraView, TextLink, TextLinkContent, B} from '../components/styles';
import { firestore } from '../firebase';


const Preregister = ({navigation}) => {


  return (
    <KeyboardAvoidingView
      style={styles.container}
    >
      <View>
      <ExtraView>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('RegisterTutor');
          }}
          style = {styles.registerbutton}
        >
        <Text style={styles.buttonText}> Register as Tutor </Text>
        </TouchableOpacity>
        </ExtraView>

        <ExtraView>
        <TouchableOpacity
          style = {styles.registerbutton}
          onPress={() => navigation.navigate('Register')}
        >
            <Text style={styles.buttonText}> Register as Tutee </Text>
        </TouchableOpacity>
        </ExtraView>
      </View>
    </KeyboardAvoidingView>
  )
}

export default Preregister

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    width: '80%'
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  button: {
    backgroundColor: '#0782F9',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  registerbutton:{
    position:'relative',
    backgroundColor: '#0782F9',
    width: '110%',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent:'center',
  },
  buttonOutline: {
    backgroundColor: 'white',
    marginTop: 5,
    borderColor: '#0782F9',
    borderWidth: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonOutlineText: {
    color: '#0782F9',
    fontWeight: '700',
    fontSize: 16,
  },
})