import React, { useState, createContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "../axios";
import jwtDecode from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  const loginNew = (email, password) => {
    setIsLoading(true);
    axios
      .post("/login", {
        email,
        password,
      })
      .then((res) => {
        const token = res.data; // Assuming res.data contains the JWT token

        const decodedToken = jwtDecode(token);

        // Display user details in the console as JSON
        // console.log("User Details:");
        // // console.log(JSON.stringify(decodedToken, null, 2));
        // const name = decodedToken.name;
        // console.log("Name:", name);

        setUserInfo(decodedToken);
        setUserToken(token);

        AsyncStorage.setItem("userInfo", JSON.stringify(decodedToken));
        AsyncStorage.setItem("userToken", token);
      })
      .catch(() => {
        // Show alert for incorrect email and password
        alert("Incorrect Email or Password");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const logoutNew = () => {
    setIsLoading(true);
    setUserToken(null);
    AsyncStorage.removeItem("userInfo");
    AsyncStorage.removeItem("userToken");
    setIsLoading(false);
  };

  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      let userInfo = await AsyncStorage.getItem("userInfo");
      let userToken = await AsyncStorage.getItem("userToken");
      userInfo = JSON.stringify(userInfo);

      if (userInfo) {
        setUserToken(userToken);
        setUserInfo(userInfo);
      }
      setUserToken(userToken);
      setIsLoading(false);
    } catch (e) {
      console.log(`isLogged in error ${e} `);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ loginNew, logoutNew, isLoading, userToken }}>
      {children}
    </AuthContext.Provider>
  );
};
