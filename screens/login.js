import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import firebase from "firebase";
export default class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
    };
  }
  userLogin = async () => {
    if (this.state.email && this.state.password) {
      try {
        const response = await firebase
          .auth()
          .signInWithEmailAndPassword(this.state.email, this.state.password);
        if (response) {
          this.props.navigation.navigate("TransactionScreen");
        }
      } catch (error) {
        Alert.alert(error.message);
      }
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <TextInput
          onChangeText={(text) => {
            this.setState({ email: text });
          }}
          style={styles.textInput}
          placeholder="email"
          value={this.state.email}
        />
        <TextInput
          onChangeText={(text) => {
            this.setState({ password: text });
          }}
          style={styles.textInput}
          placeholder="password"
          value={this.state.password}
          secureTextEntry={true}
        ></TextInput>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.userLogin();
          }}
        >
          <Text>Login</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 100,
  },
  textInput: {
    borderWidth: 0.5,
    padding: 10,
    fontSize: 15,
    width: "50%",
    marginTop: 10,
    marginRight: 5,
    //fontFamily:
  },
  button: {
    backgroundColor: "yellow",
    borderRadius: 5,
    padding: 10,
    width: "20%",
    marginTop: 10,
    marginRight: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});
