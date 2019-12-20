import React, { Component } from 'react';
import { Text, View,  Button,Alert } from 'react-native';
import API from './API';

export default class HelloWorldApp extends Component {
  click() {
  API.get('/api/info').then(function(response) {
    Alert.alert('Success');
    console.log("response");
  })
  .catch(function(error) {
    console.log(error.response);
  })
  .finally(function() {
    // always executed
  });
}
  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>미세 톡톡스</Text>
        <Button title="Get Dust Information" onPress={this.click} />
      </View>
    );
  }
}
