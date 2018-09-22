/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TextInput, AsyncStorage, TouchableOpacity} from 'react-native';
import axios from 'axios'

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {
  state = {
    email: '',
    password: ''
  }
  
  async login() {
    const { email, password } = this.state

    try {
      const response = await axios.post('http://localhost:3001/api/login', { email, password })
      console.log(response)
      await AsyncStorage.setItem('userToken', response.data.userToken)
      axios.defaults.headers.common.Authorization = `Bearer ${response.data.userToken}`;
      this.getPosts()
    } catch(err) {
      console.log(err.response)
    }
  }

  async getPosts() {
    try {
      const response = await axios.get('http://localhost:3001/api/posts')
      console.log(response)

    } catch(err) {
      console.log(err.response)
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View>
          <TextInput
            autoFocus
            placeholder='Email'
            autoCorrect={false}
            keyboardType="email-address"
            value={this.state.email}
            onChangeText={value => this.setState({ email: value })}
          />

          <TextInput
            secureTextEntry
            placeholder='Password'
            autoCorrect={false}
            value={this.state.password}
            onChangeText={value => this.setState({ password: value })}
          />

          <TouchableOpacity
            onPress={() => this.login()} 
          >
            <Text>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
