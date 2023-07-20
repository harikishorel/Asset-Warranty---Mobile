import React, { useState, useContext, useEffect } from "react";

import {
  View,
  Text,
  Image,
  SafeAreaView,
  ScrollView,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Linking,
} from "react-native";

import Feather from "react-native-vector-icons/Feather";

import axios from "../axios.js";

import { windowWidth } from "../utils/Dimensions";

import CustomSwitch from "../components/CustomSwitch";

import ListItem from "../components/ListItem";

import { BarCodeScanner } from "expo-barcode-scanner";

import { Camera } from "expo-camera";

import * as DocumentPicker from "expo-document-picker";

import { AuthContext } from "../Context/AuthContext";

import jwtDecode from "jwt-decode";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import Torch from "react-native-torch";

export default function HomeScreen({ navigation }) {
  const { logoutNew, userToken } = useContext(AuthContext);

  const [refresh, setRefresh] = useState(false); // Track the refresh status

  const [isLoading, setIsLoading] = useState(false); // Track the refresh status

  const [selectionMode, setSelectionMode] = useState("Your Products");

  const [showScanner, setShowScanner] = useState(false);

  const [products, setProducts] = useState([]);

  const [scannerActive, setScannerActive] = useState(false);

  const [showScannerModal, setShowScannerModal] = useState(false);

  const [warranty, setWarranty] = useState("");

  const [flashEnabled, setFlashEnabled] = useState(false);

  const [isTorchON, setisTorchON] = useState(false);

  const [isPopupVisible, setPopupVisible] = useState(false);

  const togglePopup = () => {
    setPopupVisible(!isPopupVisible);
  };

  const handleClosePopup = () => {
    togglePopup();
  };

  const handleTurnOnOffTorch = () => {
    Torch.switchState(!isTorchON)

      .then(() => {
        setisTorchON(!isTorchON);
      })

      .catch((error) => {
        console.error("Error toggling torch state:", error);
      });
  };

  const decodedToken = jwtDecode(userToken);

  const name = decodedToken.name;

  const phone = decodedToken.phone;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/products/${name}/${phone}`);

        const products = response.data;

        setProducts(products);

        const warrantyData = products.map((product) => product.warranty);

        setWarranty(warrantyData);
      } catch (error) {
        console.error("Error retrieving products:", error);
      }
    };

    fetchData();
  }, [refresh]); // Include 'refresh' as a dependency of useEffect to trigger the fetch when it changes

  const onSelectSwitch = (value) => {
    if (value === "Your Products") {
      setSelectionMode("Your Products");

      setShowScanner(false);

      setShowScannerModal(false);
    } else {
      setSelectionMode("Scan QR");

      setShowScanner(true);

      setShowScannerModal(true);
    }
  };

  const onBarCodeScanned = (data) => {
    if (!scannerActive && showScannerModal) {
      setShowScannerModal(false);

      setScannerActive(true);

      const urlParts = data.data.split("/");

      const serialNumber = urlParts[urlParts.length - 1];

      axios

        .post(`/Homescreen/${serialNumber}`)

        .then((response) => {
          const productName = response.data[0];

          const modelName = response.data[1];

          const isSold = response.data[4];

          const purchaseDate = response.data[7];

          const number = response.data[6];

          if (isSold === false) {
            alert(`This ${productName} ${modelName} is not sold`);
          } else {
            const phoneNumber = number.slice(-10);

            if (phoneNumber == phone) {
              const product = {
                productName: productName,

                model: modelName,

                date: purchaseDate,

                warranty: response.data[8],

                serialNum: response.data[3],

                name: name,
              };

              axios

                .post("/Addproduct", product)

                .then((response) => {
                  if (response.data.message === "success") {
                    setProducts([...products, product]);

                    alert(`This ${productName} ${modelName} is Added`);
                  }
                })

                .catch((error) => {
                  if (error.response && error.response.status === 400) {
                    alert("Product has already been added");
                  } else {
                    console.error(error);
                  }
                });
            } else {
              alert("Phone Number does not match");
            }
          }
        })

        .catch((error) => {
          console.error(error);

          alert("Error fetching data");
        })

        .finally(() => {
          setScannerActive(false);

          setShowScanner(false);

          setShowScannerModal(true);
        });
    }
  };

  const handleCloseScannerModal = () => {
    setShowScannerModal(false);

    setShowScanner(false);

    setShowScanner(true);
  };

  const sendWarranty = async (file) => {
    const formData = new FormData();

    formData.append("warrantyFile", file);

    try {
      const response = await axios.post(`/warrantyView/${warranty}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Linking.openURL(response.data);
    } catch (error) {
      console.error("Error uploading warranty file:", error);
    }
  };

  const handleRefresh = () => {
    setIsLoading(true); // Show loading state

    setTimeout(() => {
      setRefresh(!refresh); // Toggle the refresh status after 2 seconds

      setIsLoading(false); // Hide loading state after 2 seconds
    }, 2000);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView style={{ marginTop: 50, padding: 20 }}>
        <View
          style={{
            flexDirection: "row",

            justifyContent: "space-between",

            marginBottom: 20,
          }}>
          <View
            style={{
              flex: 1,

              justifyContent: "flex-start",

              width: "50%",
            }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 5 }}>
              Hello {name.length > 12 ? name.substring(0, 9) + "..." : name}
            </Text>
          </View>

          <View
            style={{
              flex: 1,

              flexDirection: "row",

              justifyContent: "flex-end",

              marginBottom: 20,

              width: "50%",
            }}>
            <TouchableOpacity
              style={{ marginRight: 5 }}
              onPress={() => {
                setShowScanner(!showScanner);

                setShowScannerModal(!showScannerModal);
              }}>
              <Icon
                name="qrcode-scan"
                size={25}
                style={{
                  padding: 5,
                }}
              />
            </TouchableOpacity>

            {showScanner && (
              <Modal
                visible={showScannerModal}
                onRequestClose={handleCloseScannerModal}>
                <View
                  style={{
                    flexDirection: "row",

                    justifyContent: "space-between",

                    paddingLeft: 10,

                    paddingRight: 10,

                    height: 50,

                    backgroundColor: "#8200d6",

                    alignItems: "center",
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      setShowScanner(false);

                      setShowScannerModal(false);
                    }}>
                    <Icon name="arrow-left" size={25} color="white" />
                  </TouchableOpacity>

                  <Text style={{ fontSize: 17, color: "white" }}>Scan QR</Text>

                  <TouchableOpacity onPress={togglePopup}>
                    <Icon name="help-circle" size={25} color="white" />
                  </TouchableOpacity>

                  <Modal
                    animationType="fade"
                    transparent={true}
                    visible={isPopupVisible}
                    onRequestClose={togglePopup}>
                    <View style={styles.modalContainer}>
                      <View style={styles.popup}>
                        <Text style={styles.popupText}>
                          The purchased phone number and the registered phone
                          number should be the same.
                        </Text>

                        <TouchableOpacity
                          style={{ marginTop: 10 }}
                          onPress={handleClosePopup}>
                          <Text style={styles.popupButton}>OK</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Modal>
                </View>

                <BarCodeScanner
                  onBarCodeScanned={onBarCodeScanned}
                  style={{ height: 480 }}
                  flashMode={
                    flashEnabled
                      ? Camera.Constants.FlashMode.torch
                      : Camera.Constants.FlashMode.off
                  }>
                  <View style={styles.cameraOverlay}>
                    <View style={styles.captureButton} />
                  </View>
                </BarCodeScanner>

                <TouchableOpacity
                  onPress={handleTurnOnOffTorch}
                  style={{
                    position: "absolute",

                    bottom: 100,

                    alignSelf: "center",

                    backgroundColor: "#8200d6",

                    padding: 10,

                    borderRadius: 25,
                  }}>
                  <Icon name="flash" size={28} color="white" />
                </TouchableOpacity>
              </Modal>
            )}
          </View>

          <TouchableOpacity style={{ marginRight: 5 }}>
            <Icon
              name="bell-outline"
              size={25}
              style={{
                padding: 5,
              }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={{ marginRight: 5 }}
            onPress={() => navigation.openDrawer()}>
            <ImageBackground
              source={require("../assets/images/user-profile.jpg")}
              style={{ width: 35, height: 35 }}
              imageStyle={{ borderRadius: 25 }}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: "row",

            borderColor: "#C6C6C6",

            borderWidth: 1,

            borderRadius: 8,

            paddingHorizontal: 10,

            paddingVertical: 8,
          }}>
          <Feather
            name="search"
            size={20}
            color="#C6C6C6"
            style={{ marginRight: 5 }}
          />

          <TextInput placeholder="Search" />
        </View>

        <View style={{ marginVertical: 20, flexDirection: "row" }}>
          <TouchableOpacity
            style={{
              backgroundColor: "#8200d6",

              width: "100%",

              padding: 5,

              flex: 1,

              flexDirection: "row",

              justifyContent: "center",

              alignItems: "center",

              borderRadius: 20,
            }}
            onPress={() => {
              onSelectSwitch("Your Products");

              handleRefresh(); // Refresh when "Your Products" button is pressed
            }}>
            <Feather
              name="package"
              size={16}
              color="white"
              style={{ padding: 5 }}
            />

            <Text
              style={{
                color: selectionMode === "Your Products" ? "white" : "purple",

                fontSize: 16,

                marginRight: 5,
              }}>
              Your Products
            </Text>

            <TouchableOpacity onPress={handleRefresh}>
              <Feather
                name="refresh-cw"
                size={16}
                color="white"
                style={{ marginLeft: 130, marginTop: 3 }}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>

        {selectionMode === "Your Products" ? (
          <View>
            <Text style={{ margin: 15, fontSize: 20, fontWeight: "bold" }}>
              List of Products
            </Text>

            {isLoading ? (
              <View style={styles.centerImg}>
                <Image
                  source={require("../images/Block.gif")}
                  style={styles.Block}
                />

                <Text>Please wait your product is loading...</Text>
              </View>
            ) : products.length > 0 ? (
              [...products]

                .reverse()

                .map((product, index) => (
                  <ListItem
                    key={index}
                    productName={product.productName}
                    model={product.model}
                    date={product.date}
                    onWarrantyPress={() => sendWarranty(product.warranty)}
                  />
                ))
            ) : (
              <Text style={{ margin: 15, fontSize: 15 }}>
                No products found
              </Text>
            )}
          </View>
        ) : (
          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                margin: 30,

                fontSize: 16,
              }}>
              Get your product QR scanned here.
            </Text>

            {showScanner ? (
              <Modal
                visible={showScannerModal}
                onRequestClose={handleCloseScannerModal}>
                <BarCodeScanner
                  onBarCodeScanned={onBarCodeScanned}
                  style={{ flex: 1 }}>
                  <View style={styles.cameraOverlay}>
                    <View style={styles.captureButton} />

                    <TouchableOpacity
                      onPress={() => {
                        setShowScanner(false);

                        setShowScannerModal(false);
                      }}
                      style={{
                        position: "absolute",

                        top: 20,

                        left: 20,

                        backgroundColor: "#ccc",

                        padding: 10,

                        borderRadius: 5,
                      }}>
                      <Text style={{ color: "black", fontSize: 16 }}>Back</Text>
                    </TouchableOpacity>
                  </View>
                </BarCodeScanner>
              </Modal>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  setShowScanner(true);

                  setShowScannerModal(true);
                }}
                style={{
                  backgroundColor: "#6e6d73",

                  padding: 10,

                  borderRadius: 5,
                }}>
                <Text style={{ color: "#fff", fontSize: 16 }}>Scan QR</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cameraOverlay: {
    flex: 1,

    alignItems: "center",

    justifyContent: "center",

    // backgroundColor: "black",edd
  },

  captureButton: {
    width: 250,

    height: 250,

    backgroundColor: "rgba(255, 255, 255, 0.5)",

    borderWidth: 2,

    borderColor: "#fff",
  },

  centerImg: {
    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    zIndex: 10,

    marginTop: 150,
  },

  Block: {
    width: 70,

    height: 70,

    // marginLeft: 150,

    // marginTop: 250,
  },

  modalContainer: {
    flex: 1,

    justifyContent: "center",

    alignItems: "center",

    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  popup: {
    backgroundColor: "white",

    padding: 20,

    width: "70%",

    borderRadius: 10,

    flexDirection: "column",

    justifyContent: "flex-end",

    alignItems: "center",
  },

  popupText: {
    fontSize: 16,

    fontWeight: "600",

    // marginRight: 10,
  },

  popupButton: {
    // display: "flex",

    // justifyContent: "flex-end",

    fontSize: 16,

    fontWeight: "600",

    color: "blue",
  },
});
