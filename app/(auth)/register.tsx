import React, { useState } from "react";
import { useRouter } from "expo-router";
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { ThemedTitle } from '@/components/ThemedTitle';
import { ThemedText } from '@/components/ThemedText';
import InputText from '@/components/ui/InputText'; 
import PasswordInput from '@/components/ui/PasswordInput'; 
import Button from '@/components/ui/Button'; 
import Link from '@/components/ui/Link';
import useSettings from '@/hooks/useSettings'; 
import LottieView from 'lottie-react-native';
import { useAuth } from '@/hooks/useAuth';

export default function RegisterScreen() {
  const router = useRouter();
  const { language, theme, translation, colors } = useSettings(); 
  const [fullName, setFullName] = useState('');
  const [fullNameError, setFullNameError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const { handleRegister, checkEmailExist, checkUsernameExist, loading, error } = useAuth();

  const emailIsExist = async (email: string): Promise<boolean> => {
    return new Promise(async (resolve) => {
      const data = await checkEmailExist(email);
      console.log('Email Exist:', data);
      if (data) {
        setEmailError(translation.emailExist || 'Email already exists');
      }
      resolve(!data);
    });
  }

  const usernameIsExist = async (username: string): Promise<boolean> => {
    return new Promise(async (resolve) => {
      const data = await checkUsernameExist(username);
      console.log('Username Exist:', data);
      if (data) {
        setUsernameError(translation.usernameExist || 'Username already exists');
      }
      resolve(!data);
    });
  }

  const validateEmail = (email: string): Promise<boolean> => {
    return new Promise((resolve) => {
      let error: string | null = null;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.trim()) {
        error = translation.inputRequired || "This field is required"
      }
      else if (!emailRegex.test(email)) {
        error = translation.invalidEmail || 'Invalid email format';
      }
      setEmailError(error);
      resolve(error == null);
    });
  };

  const validatePassword = (password: string): Promise<boolean> => {
    return new  Promise((resolve) => {
      let error: string | null = null;
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!password.trim()) {
        error = translation.inputRequired || "This field is required"
      }
      else if (password.length < 8) {
        error = translation.passwordLength || 'Password must be at least 8 characters';
      }
      else if (!passwordRegex.test(password)) {
        error = translation.passwordFormat || 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character';
      }
      setPasswordError(error);
      resolve(error == null);
    });
  };

  const validatePhoneNumber = (phoneNumber: string): Promise<boolean> => {
    return new Promise((resolve) => {
      let error: string | null = null;
      const phoneNumberRegex = /^\d{10}$/;
      if (!phoneNumber.trim()) {
        error = translation.inputRequired || "This field is required";
      } else if (!phoneNumberRegex.test(phoneNumber)) {
        error = translation.invalidPhoneNumber || 'Invalid phone number format';
      }
      setPhoneNumberError(error);
      resolve(error == null);
    });
  }

  const validateConfirmPassword = (confirmPassword: string): Promise<boolean> => {
    return new Promise((resolve) => {
      let error: string | null = null;
      if(!confirmPassword.trim()) {
        error = translation.inputRequired || "This field is required";
      } 
      else if (confirmPassword !== password) {
        error = translation.passwordMismatch || 'Passwords do not match';
      }
      setConfirmPasswordError(error);
      resolve(error == null);
    });
  };

  const validateField = (value: string, setError: React.Dispatch<React.SetStateAction<string | null>>): Promise<boolean> => {
    return new Promise((resolve) => {
      let error = true;
      if (!value.trim()) {
        setError(translation.inputRequired || 'This field is required');
      } else {
        setError(null);
        error = false;
      }
      resolve(!error);
    });
  };

  const validateForm = async () => {
    const [fullNameValid, emailValid, usernameValid, passwordValid, confirmPasswordValid, phoneNumberValid] = await Promise.all([
      validateField(fullName, setFullNameError),
      validateEmail(email),
      validateField(username, setUsernameError),
      validatePassword(password),
      validateConfirmPassword(confirmPassword),
      validatePhoneNumber(phoneNumber)
    ]);

    let emailIsExistValid, usernameIsExistValid = true;

    if(emailValid) 
      emailIsExistValid = await Promise.resolve(emailIsExist(email));
    if(usernameValid)
      usernameIsExistValid = await Promise.resolve(usernameIsExist(username));

    return fullNameValid && emailValid && usernameValid && passwordValid && confirmPasswordValid && phoneNumberValid && emailIsExistValid && usernameIsExistValid;
  };

  const onRegister = async () => {
    if (!(await validateForm())) return;

    try {
      const data = await handleRegister(fullName, email, username, phoneNumber, password);
      console.log('Register Success:', data);

      router.push({
        pathname: "/(auth)/registerOtp",
        params: { email }
      })
    } catch (err) {
      console.error('Register Failed');
      console.error(err);
    }
  };

  const handleSignIn = () => {
    router.replace("/(auth)/login");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.background} showsVerticalScrollIndicator={false}>
        <LottieView  
          style={styles.lottie}
          source={require('../../assets/gifs/plant-background.json')} 
          autoPlay 
          loop 
        />        
        <ThemedTitle style={[styles.title, { color: colors.title }]}> 
          {translation.registerText || 'Register'}
        </ThemedTitle>

        <View style={styles.formContainer}>
          <InputText
            label={translation.fullNameLabel || 'Full Name'}
            value={fullName}
            onChangeText={setFullName}
            placeholder={translation.fullNamePlaceholder || 'Enter your full name'}
            lightColor="#333"
            darkColor="#fff"
            icon="person"
          />              
          {fullNameError && <Text style={styles.errorText}>{fullNameError}</Text>}  

          <InputText
            label={translation.emailLabel || 'Email'}
            value={email}
            onChangeText={(newEmail) => {
              setEmail(newEmail);
              validateEmail(newEmail);
            }}
            placeholder={translation.emailPlaceholder || 'Enter your email'}
            lightColor="#333"
            darkColor="#fff"
            icon="email"
          />
          {emailError && <Text style={styles.errorText}>{emailError}</Text>}

          <InputText
            label={translation.phoneNumberLabel || 'Phone Number'}
            value={phoneNumber}
            onChangeText={(newPhone) => {
              setPhoneNumber(newPhone);
              validatePhoneNumber(newPhone);
            }}
            placeholder={translation.phoneNumberPlaceholder || 'Enter your phone number'}
            lightColor="#333"
            darkColor="#fff"
            icon="phone"
          />
          {phoneNumberError && <Text style={styles.errorText}>{phoneNumberError}</Text>}

          <InputText
            label={translation.usernameLabel || 'Username'}
            value={username}
            onChangeText={setUsername}
            placeholder={translation.usernamePlaceholder || 'Enter your username'}
            lightColor="#333"
            darkColor="#fff"
            icon="face"
          />
          {usernameError && <Text style={styles.errorText}>{usernameError}</Text>}

          <PasswordInput
            label={translation.passwordLabel || 'Password'}
            value={password}
            onChangeText={(newPassword) => {
              setPassword(newPassword);
              validatePassword(newPassword);
            }}
            placeholder={translation.passwordPlaceholder || 'Enter your password'}
            lightColor="#333"
            darkColor="#fff"
          />
          {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}

          <PasswordInput
            label={translation.confirmPasswordLabel || 'Confirm Password'}
            value={confirmPassword}
            onChangeText={(newConfirmPassword) => {
              setConfirmPassword(newConfirmPassword);
              validateConfirmPassword(newConfirmPassword);
            }}
            placeholder={translation.confirmPasswordPlaceholder || 'Enter your password again'}
            lightColor="#333"
            darkColor="#fff"
          />
          {confirmPasswordError && <Text style={styles.errorText}>{confirmPasswordError}</Text>}

          <Button
            title={translation.registerText || 'Register'}
            onPress={onRegister} 
            color={colors.button} 
            textColor="#fff" 
          />

          <View style={styles.signInContainer}>
            <ThemedText style={{ color: colors.text2 }}>
              {translation.haveAccountText || 'Already have an account?'}
            </ThemedText>
            <Link
              title={translation.signInText || 'Sign in here'}
              onPress={handleSignIn}
              textColor={colors.link}
              style={styles.signInLink}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  background: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 20,
  },
  lottie: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  title: {
    marginBottom: 20,
    marginTop: 120
  },
  formContainer: {
    width: '90%',
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#ffffff80', 
    marginTop: 20,
    marginBottom: 30,
    overflow: 'hidden',
  },
  signInContainer: {
    marginVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInLink: {
    marginLeft: 5,
  },
  errorText: {
    color: 'red',
    textAlign: 'left',
    marginHorizontal: 15,
  },
});
