// import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useContext } from "react";
import axios from "../../axios";
import {
  View,
  Text,
  SafeAreaView,
  Keyboard,
  ScrollView,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { AuthContext } from "../../Context/AuthContext";
import COLORS from "../../conts/colors";
import Button from "../components/Button";
import Input from "../components/Input";
import Loader from "../components/Loader";

const RegistrationScreen = ({ navigation }) => {
  const [inputs, setInputs] = React.useState({
    email: "",
    fullname: "",
    phone: "",
    password: "",
  });
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  const validate = () => {
    Keyboard.dismiss();
    let isValid = true;

    if (!inputs.email) {
      handleError("Please input email", "email");
      isValid = false;
    } else if (!inputs.email.match(/\S+@\S+\.\S+/)) {
      handleError("Please input a valid email", "email");
      isValid = false;
    }

    if (!inputs.fullname) {
      handleError("Please input fullname", "fullname");
      isValid = false;
    }

    if (!inputs.phone) {
      handleError("Please input phone number", "phone");
      isValid = false;
    }

    if (!inputs.password) {
      handleError("Please input password", "password");
      isValid = false;
    } else if (inputs.password.length < 5) {
      handleError("Min password length of 5", "password");
      isValid = false;
    }

    if (isValid) {
      register();
    }
  };
  const register = async () => {
    setLoading(true);

    try {
      const response = await axios.post("/register", {
        email: inputs.email,
        name: inputs.fullname,
        phone: inputs.phone,
        password: inputs.password,
      });

      if (response.status === 201) {
        // Registration successful, navigate to login screen
        navigation.navigate("LoginScreen");
      } else {
        // Registration failed, display error message
        const data = response.data;
        alert(data);
      }
    } catch (error) {
      alert("An error occurred, please try again");
    }

    setLoading(false);
  };

  const handleOnchange = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
  };
  const handleError = (error, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: error }));
  };

  // const { loginNew, userToken } = useContext(AuthContext);
  // console.log(
  //   userToken ? `User token: ${userToken}` : "User token is not present"
  // );

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
              Register
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
                onChangeText={(text) => handleOnchange(text, "fullname")}
                onFocus={() => handleError(null, "fullname")}
                iconName="account-outline"
                label={
                  <Text
                    style={{
                      color: COLORS.violet,
                    }}>
                    Full Name
                  </Text>
                }
                placeholder="Enter your full name"
                error={errors.fullname}
              />

              <Input
                keyboardType="numeric"
                onChangeText={(text) => handleOnchange(text, "phone")}
                onFocus={() => handleError(null, "phone")}
                iconName="phone-outline"
                label={
                  <Text
                    style={{
                      color: COLORS.violet,
                    }}>
                    Phone Number
                  </Text>
                }
                placeholder="Enter your phone number"
                error={errors.phone}
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
              <Button title="Register" onPress={validate} />
              {/* <Button title="Register" onPress={() => loginNew()} /> */}
              <Text
                onPress={() => navigation.navigate("LoginScreen")}
                style={{
                  color: COLORS.black,
                  fontWeight: "bold",
                  textAlign: "center",
                  fontSize: 16,
                }}>
                Already have account ?
                <Text
                  style={{
                    color: COLORS.violet,
                  }}>
                  {" "}
                  Login
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
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
};

export default RegistrationScreen;
