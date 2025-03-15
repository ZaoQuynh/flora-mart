import { View, type ViewProps, SafeAreaView } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={[{ backgroundColor, flex: 1 }, style]} {...otherProps} />
    </SafeAreaView>
  );
}
