import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor'; // Nếu cần
import Icon from 'react-native-vector-icons/MaterialIcons'; // Thêm dòng này

type PasswordInputProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  lightColor?: string;
  darkColor?: string;
};

const PasswordInput = ({ label, value, onChangeText, placeholder, lightColor, darkColor }: PasswordInputProps) => {
  const [isSecure, setIsSecure] = useState(true);

  const togglePasswordVisibility = () => {
    setIsSecure((prevState) => !prevState);
  };

  const textColor = useThemeColor({ light: lightColor, dark: darkColor }, 'text'); 

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: textColor }]}>{label}:</Text>
      <View style={styles.inputContainer}>
        <Icon name="lock" size={24} color={textColor} style={styles.lockIcon} />
        
        <TextInput
          style={[styles.input, { color: textColor }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#A3A3A3"
          secureTextEntry={isSecure}
        />
        
        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
          <Icon name={isSecure ? 'visibility-off' : 'visibility'} size={24} color={textColor} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    backgroundColor: 'transparent',
    margin: 10
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  inputContainer: {
    position: 'relative',
    flexDirection: 'row',  
    alignItems: 'center',
  },
  lockIcon: {
    position: 'absolute',
    left: 12,  
    zIndex: 1, 
  },
  input: {
    width: '100%',
    height: 55,
    borderWidth: 1,
    borderRadius: 15,
    paddingLeft: 40,  
    paddingRight: 40, 
    fontSize: 16
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -12 }],
    zIndex: 2,  
  },
});

export default PasswordInput;
