import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Picker } from 'react-native';
import { auth, firestore } from '../firebase';
import { Dropdown } from 'react-native-element-dropdown';
import { MultiSelect } from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';


const Register = ({navigation}) => {
  const[role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('');

  const getUser = async () => {
    const userDocument = await firestore.collection("Users").doc("xLvyQfbxlolTuRlJFqDi")
    .get()
    console.log(userDocument.data().fullName)
  }

  const handleSignUp = async(e) => {
    const {user} = await auth.createUserWithEmailAndPassword(email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log('Registered with', user.email)
        firestore.collection('Users').add({
          role: 'Tutee',
          fullName,
          gender,
        })
        navigation.navigate('RegisterTutor')
        return userCredentials.user.updateProfile({
          displayName: fullName,
        });
      })
      .catch((error) => alert(error.message));
  };





  return (
    <View style={styles.container} behavior='padding'>
      <View style={styles.inputContainer}>
        <TextInput placeholder='Full name' value={fullName} onChangeText={(fullName) => setFullName(fullName)} style={styles.input} />
        <TextInput placeholder='Email' value={email} onChangeText={(text) => setEmail(text)} style={styles.input} />
        <TextInput placeholder='Password' value={password} onChangeText={(text) => setPassword(text)} style={styles.input} secureTextEntry />
      
    </View>


      <View style={styles.buttonContainer}>
        <TouchableOpacity 
        onPress={handleSignUp/*() => navigation.navigate('RegisterTutor')*/}
         style={[styles.button, styles.buttonOutline]}>
          <Text style={styles.buttonOutlineText}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>

  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    width: '80%',
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
});
