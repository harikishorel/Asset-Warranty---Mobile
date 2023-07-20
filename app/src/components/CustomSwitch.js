import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import COLORS from "../conts/colors";
import Feather from "react-native-vector-icons/Feather";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { Colors } from "react-native/Libraries/NewAppScreen";
export default function CustomSwitch({
  selectionMode,
  option1,
  option2,
  onSelectSwitch,
}) {
  const [getSelectionMode, setSelectionMode] = useState(selectionMode);

  const updateSwitchData = (value) => {
    setSelectionMode(value);
    onSelectSwitch(value);
  };

  return (
    // <View
    //   style={{
    //     height: 44,
    //     width: "100%",
    //     backgroundColor: "#e4e4e4",
    //     borderRadius: 10,
    //     borderColor: "#AD40AF",
    //     flexDirection: "row",
    //     justifyContent: "center",
    //   }}>
    //   <TouchableOpacity
    //     activeOpacity={1}
    //     onPress={() => updateSwitchData(1)}
    //     style={{
    //       flex: 1,
    //       backgroundColor: getSelectionMode == 1 ? COLORS.violet : "#e4e4e4",
    //       borderRadius: 10,
    //       justifyContent: "center",
    //       alignItems: "center",
    //     }}>
    //     <Text
    //       style={{
    //         color: getSelectionMode == 1 ? "white" : COLORS.violet,
    //         fontSize: 14,
    //       }}>
    //       {option1}
    //     </Text>
    //   </TouchableOpacity>
    //   <TouchableOpacity
    //     activeOpacity={1}
    //     onPress={() => updateSwitchData(2)}
    //     style={{
    //       flex: 1,
    //       backgroundColor: getSelectionMode == 2 ? COLORS.violet : "#e4e4e4",
    //       borderRadius: 10,
    //       justifyContent: "center",
    //       alignItems: "center",
    //     }}>
    //     <Text
    //       style={{
    //         color: getSelectionMode == 2 ? "white" : COLORS.violet,
    //         fontSize: 14,
    //       }}>
    //       {option2}
    //     </Text>
    //   </TouchableOpacity>
    // </View>
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
      }}>
      <View
        style={{
          height: 44,
          width: "48%",
          backgroundColor: "#e4e4e4",
          borderRadius: 100,
          borderColor: "#AD40AF",
          flexDirection: "row",
          justifyContent: "center",
        }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => updateSwitchData(1)}
          style={{
            flex: 1,
            backgroundColor: getSelectionMode == 1 ? COLORS.violet : "#e4e4e4",
            borderRadius: 100,
            justifyContent: "center",
            flexDirection: "row",
            alignItems: "center",
          }}>
          <Feather
            name="package"
            size={20}
            style={{
              padding: 5,
              color: getSelectionMode == 1 ? "white" : COLORS.violet,
            }}
          />
          <Text
            style={{
              color: getSelectionMode == 1 ? "white" : COLORS.violet,
              fontSize: 14,
            }}>
            {option1}
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          height: 44,
          width: "48%",
          backgroundColor: "#e4e4e4",
          borderRadius: 100,
          borderColor: "#AD40AF",
          flexDirection: "row",
          justifyContent: "center",
        }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => updateSwitchData(2)}
          style={{
            flex: 1,
            backgroundColor: getSelectionMode == 2 ? COLORS.violet : "#e4e4e4",
            borderRadius: 100,
            justifyContent: "center",
            flexDirection: "row",
            alignItems: "center",
          }}>
          {/* <Feather
            name="camera"
            size={20}
            style={{
              padding: 5,
              color: getSelectionMode == 2 ? "white" : COLORS.violet,
            }}
          /> */}
          <Icon
            name="qrcode-scan"
            size={20}
            style={{
              padding: 5,
              color: getSelectionMode == 2 ? "white" : COLORS.violet,
            }}
          />
          <Text
            style={{
              color: getSelectionMode == 2 ? "white" : COLORS.violet,
              fontSize: 14,
            }}>
            {option2}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
