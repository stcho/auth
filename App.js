/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View, TextInput, AsyncStorage, TouchableOpacity, Modal} from 'react-native';
import axios from 'axios'

export default class App extends Component {
  state = {
    email: '',
    password: '',
    error: null,
    modalVisible: false
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
      console.log('ERROR:', err.response)
      this.setState({error: "Error: Not Found"})
    }
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  async createAccount() {
    console.log("CREATE ACCOUNT")
  }

  // async getPosts() {
  //   try {
  //     const response = await axios.get('http://localhost:3001/api/posts')
  //     console.log(response)
  //   } catch(err) {
  //     console.log(err.response)
  //   }
  // }

  render() {
    let error;

    if (this.state.error) {
      error = <Text style={styles.error}>{this.state.error}</Text>
    } else {
      error = null
    }

    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.margin}>Auth App</Text>

          <TextInput
            style={styles.margin}
            autoFocus
            placeholder='Email'
            autoCorrect={false}
            keyboardType="email-address"
            value={this.state.email}
            onChangeText={value => this.setState({ email: value })}
          />

          <TextInput
            style={styles.margin}
            secureTextEntry
            placeholder='Password'
            autoCorrect={false}
            value={this.state.password}
            onChangeText={value => this.setState({ password: value })}
          />


          {error}

          <TouchableOpacity
            style={styles.margin}
            onPress={() => this.login()} 
          >
            <Text>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.margin}
            onPress={() => this.setModalVisible(true)}
          >
            <Text>Sign Up</Text>
          </TouchableOpacity>

        </View>

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <TouchableOpacity
            style={{margin: 22}}
            onPress={() => {
              this.setModalVisible(!this.state.modalVisible);
            }}
          >
            <Text>X</Text>
          </TouchableOpacity>

          <View style={styles.container}>
            <Text style={styles.margin}>Sign Up</Text>

            <TextInput
              style={styles.margin}
              autoFocus
              label='Email'
              placeholder='Email'
              autoCorrect={false}
              keyboardType="email-address"
              value={this.state.email}
              onChangeText={value => this.setState({ email: value })}
            />

            <TextInput
              style={styles.margin}
              secureTextEntry
              placeholder='Password'
              autoCorrect={false}
              value={this.state.password}
              onChangeText={value => this.setState({ password: value })}
            />

            <TouchableOpacity
              style={styles.margin}
              onPress={() => this.createAccount()}
            >
              <Text>Create Account</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  margin: {
    marginBottom: 10
  },
  error: {
    color: 'red',
    marginBottom: 10
  }
});
