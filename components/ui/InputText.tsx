import React from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import Icon from 'react-native-vector-icons/MaterialIcons'; 

interface InputTextProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  lightColor?: string;
  darkColor?: string;
  secureTextEntry?: boolean;
  style?: object;
  icon?: string; 
  onIconPress?: () => void; 
}

const InputText: React.FC<InputTextProps> = ({
  label,
  value,
  onChangeText,
  placeholder = '',
  lightColor,
  darkColor,
  secureTextEntry = false,
  style,
  icon,
  onIconPress,
}) => {
  const textColor = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: textColor }]}>{label}:</Text>
      <View style={styles.inputContainer}>
        {icon && (
          <TouchableOpacity onPress={onIconPress} style={styles.iconContainer}>
            <Icon name={icon} size={24} color={textColor} />
          </TouchableOpacity>
        )}
        <TextInput
          style={[styles.input, { color: textColor }, style]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    margin: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 12,
    height: 55,
  },
  iconContainer: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
});

export default InputText;
