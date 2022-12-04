import { useNavigation } from '@react-navigation/core'
import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { auth, firestore, firebase } from '../firebase'
import {Card, Title, Paragraph} from 'react-native-paper'


const Home = () => {
  const navigation = useNavigation()
  const [name, setName] = useState('');
  

  const handleSignOut = async() => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Login")
      })
      .catch(error => alert(error.message))
  }

  firestore
  .collection('Users')
  .doc()
  .get()
  .then(querySnapshot => {
    setName(querySnapshot.data().fullName)
  });

  const getUserRole = async () => {
    const userDocument = await firestore.collection("Users").doc(auth.currentUser.uid).get()
    console.log(userDocument.data().role)
    return (userDocument.data().role)
  }


  if (getUserRole == 'Tutee'){
    return (
      <View style={styles.container}>
        <Text>Email: {auth.currentUser?.email}</Text>
        <Text>You are a tutee</Text>
        <TouchableOpacity
          onPress={handleSignOut}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Sign out</Text>
        </TouchableOpacity>
      </View>
    )
  } else{
    return(
    <View style={styles.container}>
      <Text>Welcome,{name}</Text>
      <Text>Email: {auth.currentUser?.email}</Text>
      <Text>You are a tutor</Text>
      <TouchableOpacity
        onPress={handleSignOut}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>
    </View>
    )
  }
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
   button: {
    backgroundColor: '#0782F9',
    width: '60%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 40,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
})