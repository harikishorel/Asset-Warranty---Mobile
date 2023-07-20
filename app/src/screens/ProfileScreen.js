import React, { useState, useContext, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Keyboard,
  Image,
  ImageBackground,
  Platform,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { AuthContext } from "../Context/AuthContext";
import jwtDecode from "jwt-decode";
import COLORS from "../conts/colors";
import Input from "../views/components/Input";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import axios from "../axios";
import * as FileSystem from "expo-file-system";
import ProDetails from "./ProDetails";
import ProPassword from "./ProPassword";

export default function ProfileScreen({ navigation }) {
  const { userToken } = useContext(AuthContext);
  const [profileImage, setProfileImage] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const handleChangePassword = () => {
    setIsPopupVisible(true);
  };

  // Image Upload
  const handleProfileImageUpload = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access the camera roll is required!");
      return;
    }
    const pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (!pickerResult.canceled) {
      const { assets } = pickerResult;
      if (Array.isArray(assets) && assets.length > 0) {
        const selectedImage = assets[0];
        // Save the image to the phone storage
        const filename = selectedImage.uri.split("/").pop();
        const destination = `${FileSystem.documentDirectory}${filename}`;
        await FileSystem.copyAsync({
          from: selectedImage.uri,
          to: destination,
        });
        setProfileImage(destination);
        await AsyncStorage.setItem("profileImage", destination);
      }
    }
  };

  useEffect(() => {
    const getProfileImage = async () => {
      const imageUri = await AsyncStorage.getItem("profileImage");
      if (imageUri) {
        setProfileImage(imageUri);
      }
    };
    getProfileImage();
  }, []);

  // Image Upload

  const handleEditProfile = () => {
    setEditMode(true);
  };

  const handleBack = () => {
    setEditMode(false);
  };

  return (
    <SafeAreaView
      style={{ backgroundColor: COLORS.white, flex: 1, paddingTop: 40 }}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <ImageBackground
          source={require("../images/1541.jpg")}
          style={styles.backgroundImage}
          resizeMode="cover" // Adjusts the image to cover the entire container
        >
          <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("HomeScreen");
                  setEditMode(false);
                }}
                style={styles.backButton}>
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color="white"
                  style={styles.backButtonIcon}
                />
              </TouchableOpacity>
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </View>

            <TouchableOpacity
              style={styles.profilePictureContainer}
              onPress={handleProfileImageUpload}>
              {profileImage ? (
                <Image
                  style={styles.profilePicture}
                  source={{ uri: profileImage }}
                />
              ) : (
                <ImageBackground style={styles.profilePicturePlaceholder}>
                  <Text style={styles.uploadText}>Upload</Text>
                </ImageBackground>
              )}
            </TouchableOpacity>
          </View>
        </ImageBackground>
        {/* Render ProDetails component */}
        {!editMode && <ProDetails handleEditProfile={handleEditProfile} />}

        {/* Render ProPassword component in Edit mode */}
        {editMode && (
          <ProPassword
            handleChangePassword={handleChangePassword}
            handleBack={handleBack}
          />
        )}

        {/* Buttons for Edit Mode and Non-Edit Mode */}
        {/* {editMode ? (
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.backButton]}
              onPress={handleBack}>
              <Text style={[styles.buttonText, styles.backButtonText]}>
                Back
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handlePass}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
            <Text style={styles.buttonText}>Change Password</Text>
          </TouchableOpacity>
        )} */}
        <Modal visible={isPopupVisible} animationType="fade" transparent>
          <View style={styles.popupContainer}>
            <View style={styles.popupContent}>
              <Ionicons
                name="checkmark-circle-outline"
                size={64}
                color="green"
              />
              <Text style={styles.popupText}>
                Password changed successfully
              </Text>
              <TouchableOpacity
                style={styles.okButton}
                onPress={() => {
                  setIsPopupVisible(false);
                  setEditMode(false);
                }}>
                <Text style={styles.okButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  backButtonIcon: {
    backgroundColor: "transparent",
  },
  backgroundImage: {
    flex: 1,
    height: "85%", // Adjusts the height to fill the screen
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    marginRight: 100,
  },
  backButton: {
    marginRight: 0,
    backgroundColor: "red",
  },
  editProfileText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  profilePictureContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: "hidden",
    marginBottom: 90,
    alignSelf: "center",
  },
  profilePicture: {
    flex: 1,
  },
  profilePicturePlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ccc",
  },
  uploadText: {
    color: "white",
    fontSize: 18,
  },
  fieldsContainer: {
    width: "80%",
    // marginBottom: 100,
    // alignItems: "center"
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
  button12: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginLeft: 5,
    marginBottom: 10,
  },
  editProfileText: {
    display: "flex",
    marginLeft: 90,
    width: 100,
    fontSize: 15,
    fontWeight: "bold",
    color: "white", // Add this line to explicitly set the text color
  },
  popupContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  popupContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  popupText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 20,
  },
  okButton: {
    marginTop: 10,
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  okButtonText: {
    color: "white",
    fontSize: 16,
  },
});
