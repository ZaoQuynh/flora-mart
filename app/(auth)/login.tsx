import React, { useState } from "react";
import { useRouter } from "expo-router";
import { View, Text, StyleSheet, SafeAreaView, Switch, Alert } from "react-native";
import { ThemedTitle } from '@/components/ThemedTitle';
import { ThemedText } from '@/components/ThemedText';
import InputText from '@/components/ui/InputText'; 
import PasswordInput from '@/components/ui/PasswordInput'; 
import Button from '@/components/ui/Button'; 
import Link from '@/components/ui/Link';
import useSettings from '@/hooks/useSettings'; 
import LottieView from 'lottie-react-native';
import { useAuth } from '@/hooks/useAuth';
import Toast from 'react-native-toast-message';
import ToastHelper from '@/utils/ToastHelper';
import { RoleEnum } from '@/constants/enums/RoleEnum';
import { StatusEnum } from '@/constants/enums/StatusEnum';

export default function LoginScreen() {
  const router = useRouter();
  const { handleLogin, loading, error } = useAuth();
  const { language, theme, translation, colors } = useSettings(); 
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  const validateForm = async () => {
    const [emailValid, passwordValid] = await Promise.all([
      validateEmail(email),
      validatePassword(password)
    ]);
    
    return emailValid && passwordValid;
  };

  const onLogin = async () => {
    const errorTitle = translation.loginFailed || 'Login Failed';

    try {
      if (!(await validateForm())) return;

      const data = await handleLogin(email, password);
      console.log('Login Success:', data);
      const user = data.user;

      const errorMessage = validateUser(user);
      if(errorMessage) {
        ToastHelper.showError(errorTitle, errorMessage);
        return;
      }

      if (user.status === StatusEnum.PENDING) {
        const message = translation.accountNotVerified || 'Your account is not verified. Please verify your email';
        ToastHelper.showInfo(errorTitle, message);
        router.replace({ pathname: "/(auth)/registerOtp", params: { email: user.email } });
        return;
      }

      // router.replace("/home");
      router.replace("/(tabs)/home")
    } catch (err) {
      const errorMessage = translation.loginFailedEmailOrPassword || 'Please check your email and password';
      ToastHelper.showError(errorTitle, errorMessage);
    }
  };

  const validateUser = (user: any) => {
    if (user.role === RoleEnum.ADMIN) 
      return translation.accessDenied || 'Access denied. Please contact support.';
    if(user.status === StatusEnum.DELETED)
      return translation.userDeleted || 'User is deleted';
    return null
  }

  const validateEmail = (email: string): Promise<boolean> => {
    return new Promise((resolve) => {
      let error: string | null = null;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if(!email.trim()) {
        error = translation.inputRequired || 'This field is required';
      } 
      else if (!emailRegex.test(email)) {
        error = translation.invalidEmail || 'Invalid email format';
      }
      
      setEmailError(error);
      resolve(error === null);
    });
  };

  const validatePassword = (password: string): Promise<boolean> => {
    return new Promise((resolve) => {
      let error: string | null = null;
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      
      if(!password.trim()) {
        error = translation.inputRequired || 'This field is required';
      }
      else if (password.length < 8) {
        error = translation.passwordLength || 'Password must be at least 8 characters';
      }
      else if (!passwordRegex.test(password)) {
        error = translation.passwordFormat || 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character';
      }
      
      setPasswordError(error);
      resolve(error === null);
    });
  };

  const onLoginWithGoogle = () => {
    console.log('Login with Google');
  }

  const onLoginWithFacebook = () => {
    console.log('Login with Facebook');
  }

  const handleSignUp = () => {
    router.replace("/(auth)/register");
  };

  const handleForgotPassword = () => {
    router.replace("/(auth)/forgetPassword");
  }

  return (
    <SafeAreaView style={styles.safeArea}>
        <View style={styles.background}>
            <LottieView  
              style={styles.lottie}
              source={require('../../assets/gifs/plant-background.json')} 
              autoPlay 
              loop />
            <ThemedTitle style={[styles.title, { color: colors.title }]}> 
                {translation.loginText || 'Login'}
            </ThemedTitle>
              
            <View style={styles.formContainer}>
                <InputText
                    label={translation.emailLabel || 'Email'}
                    value={email}
                    placeholder={translation.emailPlaceholder || 'Enter your email'}
                    lightColor="#333"
                    darkColor="#fff"
                    icon="email" 
                    onChangeText={(email) => {
                      setEmail(email.trim());
                      validateEmail(email);
                    }}
                />

                <Text style={{ color: 'red', textAlign: 'left', marginHorizontal: 15 }}>
                  {emailError}
                </Text>
                <PasswordInput
                    label={translation.passwordLabel || 'Password'}
                    value={password}
                    onChangeText={(password)=> {
                      setPassword(password);
                      validatePassword(password);
                    }}
                    placeholder={translation.passwordPlaceholder || 'Enter your password'}
                    lightColor="#333"
                    darkColor="#fff"
                />
                
                <Text style={{ color: 'red', textAlign: 'left', marginHorizontal: 15 }}>
                  {passwordError}
                </Text>
                <View style={styles.forgetAndRememberContainer}>
                <View style={styles.rememberMeContainer}>
                    <Switch 
                      value={rememberMe} 
                      onValueChange={setRememberMe} 
                      trackColor={{ false: "#767577", true: colors.tabIconSelected }}
                      thumbColor={rememberMe ? colors.tabIconSelected : colors.tabIconDefault} 
                    />
                    <Text style={{ color: colors.text2 }}>
                      {translation.rememberMeText || 'Remember me'}
                    </Text>
                  </View>

                  <Link
                      title={translation.forgetPasswordLabel || 'Forgot password?'}
                      textColor={colors.link}
                      onPress={handleForgotPassword}
                  />
                </View>

                <Button
                    title={translation.loginButtonText || 'Login'}
                    onPress={onLogin} 
                    color={colors.button} 
                    textColor={colors.text} 
                />
                <Text style={{textAlign: 'center'}}>{translation.or}</Text>
                
                <Button
                    title={translation.googleButtonText || 'Login with Google'}
                    onPress={onLoginWithGoogle} 
                    color={colors.button2} 
                    textColor={colors.text2} 
                    icon={require('../../assets/images/Google.png')}
                />
                
                <Button
                    title={translation.facebookButtonText || 'Login with Facebook'}
                    onPress={onLoginWithFacebook} 
                    color={colors.button2} 
                    textColor={colors.text2} 
                    icon={require('../../assets/images/Facebook.png')}
                />
                <View style={styles.signUpContainer}>
                  <ThemedText style={{ color: colors.text2 }}>
                    {translation.noAccountText || "Don't have an account?"}
                  </ThemedText>
                  <Link
                    title={translation.signUpText || 'Sign up here'}
                    onPress={handleSignUp}
                    textColor={colors.link}
                    style={styles.signUpLink}
                  />
                </View>
            </View>
        </View>
        <Toast/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  container: {
    paddingTop: 60,
    alignItems: 'center',
  },
  lottie: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  title: {
    bottom: 20,
    marginTop: 120
  },
  formContainer: {
    width: '90%',
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#ffffff80', 
    marginTop: 30,
    marginBottom: 20,
  },
  forgetAndRememberContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginVertical: 10,
    marginHorizontal: 15,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signUpContainer: {
    marginVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signUpLink: {
    marginLeft: 5,
  },
});
