import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Picker, ScrollView} from 'react-native';
import { auth, firestore } from '../firebase';
import { ExtraView } from '../components/styles';

const RegisterTutor = ({navigation}) => {
  const[role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('');
  const [yearsXP, setyearsXP] = useState('');
  const [language, setLanguage] = useState('');
  const[bio, setBio] = useState('');

  const handleSignUp = async(e) => {
    const {user} = await auth.createUserWithEmailAndPassword(email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log('Registered with', user.email)
        firestore.collection('Users').add({
          role: 'Tutor',
          fullName,
          gender,
          yearsXP,
          language,
          bio
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
        <Picker placeholder='gender'
          selectedValue={gender}
          style={{ height: 50, width: 315 }}
      >
        <Picker.Item label="Male" value={"Male"} onValueChannge = {(itemValue, itemIndex) => setGender(itemValue)}/>
        <Picker.Item label="Female" value={"Female"} onValueChannge = {(itemValue, itemIndex) => setGender(itemValue)} />
        </Picker>
      <TextInput keyboardType = "numeric" placeholder='Years of Experience' value={yearsXP} onChangeText={(text) => setyearsXP(text)} style={styles.input} />
      <Picker placeholder='language'
          selectedValue={language}
          style={{ height: 50, width: 315 }}
      >
        <Picker.Item label="English" value={language} onValueChannge = {(itemValue, itemIndex) => setLanguage(itemValue)}/>
        <Picker.Item label="Chinese" value={language} onValueChannge = {(itemValue, itemIndex) => setLanguage(itemValue)} />
      </Picker>
      <TextInput placeholder='Tell us about yourself' value={bio} onChangeText={(text) => setBio(text)} style={styles.bioinput} />
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

export default RegisterTutor;

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
  bioinput: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 35,
    borderRadius: 10,
    marginTop: 5,
  },
  picker: {
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
