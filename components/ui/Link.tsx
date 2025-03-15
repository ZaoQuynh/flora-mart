import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import {Colors} from '@/constants/Colors';

interface LinkProps {
  title: string; 
  onPress: () => void; 
  textColor?: string; 
  style?: object;
  underline?: boolean; 
}

const Link: React.FC<LinkProps> = ({
  title,
  onPress,
  textColor = Colors.light.link , 
  style,
  underline = true, 
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={style}>
      <Text style={[styles.text, { color: textColor, textDecorationLine: underline ? 'underline' : 'none' }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default Link;
