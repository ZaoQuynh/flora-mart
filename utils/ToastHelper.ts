import Toast from 'react-native-toast-message';

class ToastHelper {
  static showError(text1: string, text2: string) {
    Toast.show({
      type: 'error',
      text1,
      text2,
      visibilityTime: 4000,
      autoHide: true,
    });
  }

  static showSuccess(text1: string, text2: string) {
    Toast.show({
      type: 'success',
      text1,
      text2,
      visibilityTime: 4000,
      autoHide: true,
    });
  }

  static showInfo(text1: string, text2: string) {
    Toast.show({
      type: 'info',
      text1,
      text2,
      visibilityTime: 4000,
      autoHide: true,
    });
  }
}

export default ToastHelper;
