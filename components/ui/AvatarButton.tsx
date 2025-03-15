import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  Image,
  ImageSourcePropType,
} from "react-native";

interface AvatarButtonProps {
  onPress: () => void;
  avatar?: ImageSourcePropType;
  size?: number;
  style?: ViewStyle;
}

const AvatarButton: React.FC<AvatarButtonProps> = ({
  onPress,
  avatar = require("../../assets/images/temp-user.png"),
  size = 50,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, { width: size, height: size, borderRadius: size / 2 }, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image
        source={avatar}
        style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: "#ddd",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
});

export default AvatarButton;
