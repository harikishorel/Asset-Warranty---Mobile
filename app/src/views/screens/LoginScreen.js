import React, { useContext } from "react";
import axios from "../../axios";

import {
  View,
  Text,
  SafeAreaView,
  Keyboard,
  Alert,
  ImageBackground,
  ScrollView,
} from "react-native";
import COLORS from "../../conts/colors";
import Button from "../components/Button";
import Input from "../components/Input";
import Loader from "../components/Loader";
import { AuthContext } from "../../Context/AuthContext";

const LoginScreen = ({ navigation }) => {
  const [inputs, setInputs] = React.useState({ email: "", password: "" });
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  const { loginNew, userToken } = useContext(AuthContext);

  // console.log(
  //   userToken ? `User token: ${userToken}` : "User token is not present"
  // );

  const validate = async () => {
    Keyboard.dismiss();
    let isValid = true;
    if (!inputs.email) {
      handleError("Please input email", "email");
      isValid = false;
    }
    if (!inputs.password) {
      handleError("Please input password", "password");
      isValid = false;
    }
    if (isValid) {
      // login();
      loginNew(inputs.email, inputs.password);
    }
  };

  // const login = async () => {
  //   setLoading(true);

  //   try {
  //     const response = await axios.post("/login", {
  //       email: inputs.email,
  //       password: inputs.password,
  //     });

  //     if (response.status === 201) {
  //       // Registration successful, navigate to login screen
  //       navigation.navigate("HomeScreen");
  //     } else {
  //       // Registration failed, display error message
  //       const data = response.data;
  //       alert(data);
  //     }
  //   } catch (error) {
  //     alert("An error occurred, please try again");
  //   }

  //   setLoading(false);
  // };

  const handleOnchange = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
  };

  const handleError = (error, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: error }));
  };
  return (
    <SafeAreaView style={{ backgroundColor: COLORS.white, flex: 1 }}>
      <Loader visible={loading} />
      <ImageBackground
        source={require("../../images/81310.jpg")}
        style={styles.backgroundImage}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View>
            <Text
              style={{ color: COLORS.black, fontSize: 40, fontWeight: "bold" }}>
              Log In
            </Text>

            <View style={{ marginVertical: 20 }}>
              <Input
                onChangeText={(text) => handleOnchange(text, "email")}
                onFocus={() => handleError(null, "email")}
                iconName="email-outline"
                label={
                  <Text
                    style={{
                      color: COLORS.violet,
                    }}>
                    Email
                  </Text>
                }
                placeholder="Enter your email address"
                error={errors.email}
              />
              <Input
                onChangeText={(text) => handleOnchange(text, "password")}
                onFocus={() => handleError(null, "password")}
                iconName="lock-outline"
                label={
                  <Text
                    style={{
                      color: COLORS.violet,
                    }}>
                    Password
                  </Text>
                }
                placeholder="Enter your password"
                error={errors.password}
                password
              />
              <Button title="Log In" onPress={validate} />
              {/* <Button
                title="Log In"
                onPress={() => loginNew(email, password)}
              /> */}

              <Text
                onPress={() => navigation.navigate("RegistrationScreen")}
                style={{
                  color: COLORS.black,
                  fontWeight: "bold",
                  textAlign: "center",
                  fontSize: 16,
                }}>
                Don't have account ?
                <Text
                  style={{
                    color: COLORS.violet,
                  }}>
                  {" "}
                  Register
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = {
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 25,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  container: {
    flex: 1,
    // alignItems: "center",
  },
  title: {
    color: COLORS.black,
    fontSize: 40,
    fontWeight: "bold",
  },
  subtitle: {
    color: COLORS.grey,
    fontSize: 18,
    marginVertical: 10,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
};

export default LoginScreen;
