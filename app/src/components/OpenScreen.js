import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  StyleSheet,
  ImageBackground,
} from "react-native";
import COLORS from "../conts/colors";

const OpenScreen = ({ loading }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.scrollViewContent}>
        <View style={styles.titleContainer}>
          <View style={styles.centerImg}>
            <Image
              source={require("../images/awlogo.png")}
              style={styles.logoImage}
            />
          </View>
          <Text style={styles.title}>Asset Warranty</Text>
        </View>
      </View>

      {/* //end content */}
      <View style={styles.endCont}>
        <View style={styles.centerImg}>
          <Image
            source={require("../images/Block.gif")}
            style={styles.Block}></Image>
        </View>
        <Text style={styles.footer}> Powered by Blockchain</Text>
        <View style={styles.centerImg}>
          <Image
            source={require("../images/xdc.png")}
            style={styles.xdcBlock}></Image>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    flex: 1,
    paddingTop: 30,
  },
  titleContainer: {
    marginBottom: 20,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 25,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  title: {
    color: COLORS.black,
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: -40,
  },

  logoImage: {
    width: 180,
    height: 180,
    // resizeMode: "cover",
    // marginLeft: 90,
    // marginTop: 210,
  },
  footer: {
    color: COLORS.black,
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 0,
  },
  footerXDC: {
    alignItems: "center",
    marginTop: 0,
  },
  Block: {
    width: 50,
    height: 50,
    // marginLeft: 150,
    // marginTop: 250,
  },
  xdcBlock: {
    width: 40,
    height: 20,
  },
  centerImg: {
    alignItems: "center",
  },
  endCont: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: 20,
  },
});

export default OpenScreen;
