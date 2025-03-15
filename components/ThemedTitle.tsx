import { Text, type TextProps, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTitleProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedTitle({
  style,
  lightColor,
  darkColor,
  ...rest
}: ThemedTitleProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'title');

  return (
    <Text
      style={[
        { color },
        styles.title,  
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 40, 
  },
});
