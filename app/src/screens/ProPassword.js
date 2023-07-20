import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from "react-native";
import Toast from "react-native-toast-message";
import COLORS from "../conts/colors";
import Input from "../views/components/Input";
import axios from "../axios";
import { AuthContext } from "../Context/AuthContext";

export default function ProPassword({ handleBack, handleChangePassword }) {
  const [inputs, setInputs] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const { userToken } = useContext(AuthContext);
  // View Details
  const [profileData, setProfileData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get("/profile", {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        const userData = response.data;
        setProfileData(userData);
      } catch (error) {
        console.error("Error fetching user profile data", error);
      }
    };
    fetchProfileData();
  }, []);

  // View Details

  const [errors, setErrors] = React.useState({});
  const handleError = (error, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: error }));
  };

  const validate = async () => {
    Keyboard.dismiss();
    let isValid = true;
    if (!inputs.oldPassword) {
      handleError("Please enter the Old Password", "oldPassword");
      isValid = false;
    } else if (inputs.oldPassword !== profileData.password) {
      handleError("Incorrect Old Password", "oldPassword");
      isValid = false;
    }

    if (!inputs.newPassword) {
      handleError("Please enter New Password ", "newPassword");
      isValid = false;
    }

    if (!inputs.confirmPassword) {
      handleError("Password doesn't match New Password", "confirmPassword");
      isValid = false;
    }

    if (inputs.confirmPassword !== inputs.newPassword) {
      handleError("Password not match", "confirmPassword");
      isValid = false;
    } else if (inputs.newPassword.length < 5) {
      handleError("Min password length of 5", "newPassword");
      isValid = false;
    }

    if (isValid) {
      try {
        await changePassword(); // Call the changePassword function
        handleChangePassword(); // Perform any other logic after successful password change
      } catch (error) {
        // Handle the error from changePassword if needed
        console.error("Error changing password", error);
      }
    }
  };

  const changePassword = async () => {
    try {
      const response = await axios.put(
        "/profile/edit",
        {
          password: inputs.newPassword, // Use the new password as the value to update
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      // Handle the success response from the server, e.g., show a success message
      //   console.log("Password changed successfully!");
      // You can also reset the input fields here if needed
      setInputs({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      // Handle the error response from the server, e.g., show an error message
      console.error("Error changing password", error);
    }
  };

  return (
    <View style={styles.fieldsContainer}>
      <Input
        label={<Text style={{ color: COLORS.violet }}>Old Password</Text>}
        placeholder="Old Password"
        value={inputs.oldPassword}
        onFocus={() => handleError(null, "oldPassword")}
        // onChangeText={(text) => setOldPassword(text)}
        onChangeText={(text) => setInputs({ ...inputs, oldPassword: text })}
        error={errors.oldPassword}
        password
      />
      <Input
        label={<Text style={{ color: COLORS.violet }}>New Password</Text>}
        placeholder="New Password"
        value={inputs.newPassword}
        onFocus={() => handleError(null, "newPassword")}
        // onChangeText={(text) => setNewPassword(text)}
        onChangeText={(text) => setInputs({ ...inputs, newPassword: text })}
        error={errors.newPassword}
        password
      />
      <Input
        label={<Text style={{ color: COLORS.violet }}>Confirm Password</Text>}
        placeholder="Confirm Password"
        value={inputs.confirmPassword}
        onFocus={() => handleError(null, "confirmPassword")}
        // onChangeText={(text) => setConfirmPassword(text)}
        onChangeText={(text) => setInputs({ ...inputs, confirmPassword: text })}
        error={errors.confirmPassword}
        password
      />
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.backButton]}
          onPress={handleBack}>
          <Text style={[styles.buttonText, styles.backButtonText]}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={validate}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  fieldsContainer: {
    width: "80%",
    marginLeft: 35,
    marginTop: -40,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: "center", // Updated style: align the button to the center
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  backButton: {
    marginRight: 10,
    // backgroundColor: "red",
  },
  backButtonText: {
    color: "white",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "center", // Align the buttons horizontally at the center
  },
});
