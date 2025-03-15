import React from 'react';
import { Colors } from '@/constants/Colors';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, View, Image, ImageSourcePropType } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  color?: string;
  textColor?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  icon?: ImageSourcePropType; 
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  color = Colors.light.button,
  textColor = Colors.light.text,
  style,
  textStyle,
  disabled = false,
  icon,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: color },
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <View style={styles.buttonContent}>
        {icon && (
          <Image
            source={icon}
            style={styles.icon}
            resizeMode="contain"
          />
        )}
        <Text style={[styles.text, { color: textColor }, textStyle]}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    marginHorizontal: 7,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default Button;