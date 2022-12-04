import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ExtraText, ExtraView, TextLink, TextLinkContent, B } from '../components/styles';
import { auth } from '../firebase';
import { Button, Icon, Input, Rating } from 'react-native-elements';
import { Col, Row } from 'react-native-easy-grid';
import CustomAvatar from './CustomAvatar';

const DESC =
  'The definition of a description is a statement that gives details about someone or something. An example of description is a story about the places visited on a family trip. Aset of characteristics by which someone or something can be recognized.';

export default CourseCard = ({
  subject,
  courseName = 'CourseName',
  tutor = 'Chan Tai Man',
  description = DESC,
  price = '123',
  tutorId = 'ABC123',
  type = 'Student',
  courseId,
  avatar,
  rateArr = {},
}) => {
  const navigation = useNavigation();
  const [rating, setRating] = useState(0);

  useEffect(() => {
    let newRate = 0;

    if (Object.keys(rateArr).length > 0) {
      for (var r in rateArr) {
        newRate += rateArr[r];
      }

      setRating(newRate / Object.keys(rateArr).length);
    }
  }, []);

  const _onPress = () => {
    if (type === 'Student') {
      navigation.navigate('ViewProfile', { tutorId: tutorId, courseName: courseName, courseId: courseId, subject: subject });
    } else {
      navigation.navigate('AddNewCourse', { courseId: courseId, subject: subject, courseName: courseName, description: description, price: price, edit: true });
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={_onPress}>
      {/* <Row>
        <Col size={80}>
          <Text style={styles.title} numberOfLines={1}>
            {courseName}
          </Text>
          <Text style={styles.desc}>Taught by : {tutor}</Text>
          <Text style={styles.desc} numberOfLines={2}>
            Description: {description}
          </Text>
        </Col>
        <Col size={20}>
          <Text style={styles.hr}>${price}/hr</Text>
          {type === 'Student' ? (
            <Rating ratingCount={5} imageSize={20} size={1} tintColor='#F1F1F1' style={{ marginRight: 30 }} />
          ) : (
            <Icon type='font-awesome-5' name='edit' containerStyle={{ marginTop: 30 }} />
          )}
        </Col>
      </Row> */}
      {/* <Rating readonly={true} startingValue={rating} ratingCount={5} imageSize={20} size={1} ratingColor='#EDDF63' tintColor='#F1F1F1' style={{ alignSelf: 'flex-start' }} /> */}

      {/* <Row style={{ width: '100%', height: '30%' }}>
        <Col style={{ height: '100%', justifyContent: 'center' }} size={80}>
          <Text style={styles.title}>{courseName}</Text>
        </Col>
        <Col style={{ height: '100%', justifyContent: 'center' }} size={20}>
          <Text style={styles}>${price}/hr</Text>
          <Rating readonly={true} startingValue={rating} ratingCount={5} imageSize={20} size={1} ratingColor='#EDDF63' tintColor='#F1F1F1' style={{ alignSelf: 'flex-start' }} />
        </Col>
      </Row>
      <Row style={{ width: '100%', height: '70%' }}>
        <Col style={{ height: '100%' }} size={75}>
          <Text style={styles.tut}>
            <Text style={{ textDecorationLine: 'underline' }}>{tutor}</Text> . {subject}
          </Text>
          <Text numberOfLines={3}>Description: {description}</Text>
        </Col>
      </Row> */}

      <Row size={30}>
        <Col style={{ height: '100%', justifyContent: 'center' }} size={80}>
          <Text style={styles.title}>{courseName}</Text>
        </Col>
        <Col style={{ height: '100%', justifyContent: 'center' }} size={20}>
          <Text style={styles.hr}>${price}/hr</Text>
        </Col>
      </Row>
      <Row size={20}>
        <Col style={{ height: '100%', justifyContent: 'center' }} size={80}>
          <Text style={styles.tut}>
            <Text style={{ textDecorationLine: 'underline' }}>{tutor}</Text> . {subject}
          </Text>
        </Col>
        <Col style={{ height: '100%', justifyContent: 'center', alignItems: 'center', paddingRight: 15 }} size={20}>
          <Rating readonly={true} startingValue={rating} ratingCount={5} imageSize={15} size={1} ratingColor='black' tintColor='#F1F1F1' style={{ alignSelf: 'flex-start' }} />
        </Col>
      </Row>
      <Row size={50}>
        <Text numberOfLines={3}>Description: {description}</Text>
      </Row>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '95%',
    height: 125,
    backgroundColor: '#F1F1F1',
    borderRadius: 20,
    marginBottom: 20,
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22.5,
    fontWeight: 'bold',

    width: 180,
  },
  tut: {
    fontSize: 15,
  },
  desc: {
    fontSize: 15,

    fontStyle: 'italic',
    color: 'grey',
  },
  hr: {
    fontStyle: 'italic',
  },
});
