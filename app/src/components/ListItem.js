import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { windowWidth } from "../utils/Dimensions";
import COLORS from "../conts/colors";

export default function ListItem({
  productName,
  model,
  onWarrantyPress,
  date,
}) {
  return (
    <View
      style={{
        flexDirection: "column",
        alignItems: "stretch",
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        overflow: "hidden",
      }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 10,
          backgroundColor: "#ede8e3",
        }}>
        <Text
          style={{
            fontSize: 14,
            textTransform: "uppercase",
            color: COLORS.violet,
            letterSpacing: 1,
          }}>
          Product
        </Text>
        <Text
          style={{
            fontSize: 14,
            textTransform: "uppercase",
            color: COLORS.violet,
            letterSpacing: 1,
          }}>
          Purchase Date
        </Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>
        <View style={{ width: windowWidth - 220 }}>
          <Text
            numberOfLines={1}
            style={{
              color: "#333",
              fontSize: 14,
              letterSpacing: 0.5,
              fontWeight: 600,
            }}>
            {productName}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              color: "#333",
              fontSize: 14,
              letterSpacing: 0.5,
              fontWeight: 600,
            }}>
            {model}
          </Text>
        </View>
        <Text
          style={{
            color: "#333",
            fontSize: 14,
            marginLeft: 60,
            fontWeight: 600,
          }}>
          {date}
        </Text>
      </View>
      <TouchableOpacity
        onPress={onWarrantyPress}
        style={{
          backgroundColor: "#8200d6",
          padding: 10,
          borderRadius: 10,
        }}>
        <Text
          style={{
            color: "#fff",
            textAlign: "center",
            fontSize: 14,
            letterSpacing: 1,
          }}>
          View Warranty
        </Text>
      </TouchableOpacity>
    </View>
  );
}
