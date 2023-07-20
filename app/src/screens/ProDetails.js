import React, { useState, useContext, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  ImageBackground,
  Platform,
  Modal,
} from "react-native";
import Input from "../views/components/Input";
import axios from "../axios";
import COLORS from "../conts/colors";
import { AuthContext } from "../Context/AuthContext";
import { Ionicons } from "@expo/vector-icons";

export default function ProDetails({ handleEditProfile }) {
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
  return (
    <View style={styles.fieldsContainer}>
      <Input
        editable={false}
        label={<Text style={{ color: COLORS.violet }}>Name</Text>}
        placeholder="User Name"
        value={profileData.name}
      />
      <Input
        keyboardType="numeric"
        editable={false}
        label={<Text style={{ color: COLORS.violet }}>Phone Number</Text>}
        placeholder="Phone Number"
        value={profileData.phone}
      />
      <Input
        editable={false}
        label={<Text style={{ color: COLORS.violet }}>Email</Text>}
        placeholder="Email Address"
        value={profileData.email}
      />
      <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
        <Text style={styles.buttonText}>Change Password</Text>
      </TouchableOpacity>
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
});
