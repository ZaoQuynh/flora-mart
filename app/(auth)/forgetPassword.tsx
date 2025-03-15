import React, { useState } from "react";
import { useRouter } from "expo-router";
import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView, ScrollView } from "react-native";
import { ThemedTitle } from '@/components/ThemedTitle';
import { ThemedText } from '@/components/ThemedText';
import InputText from '@/components/ui/InputText'; 
import PasswordInput from '@/components/ui/PasswordInput'; 
import Button from '@/components/ui/Button'; 
import Link from '@/components/ui/Link';
import useSettings from '@/hooks/useSettings'; 
import { useAuth } from '@/hooks/useAuth';
import { generateOtp } from '@/utils/generateOtp';
import MailService, { MailEnum } from "@/utils/MailService";
import { useMail } from "@/hooks/useMail";

const emailService = new MailService();

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { language, theme, translation, colors } = useSettings();
  const [email, setEmail] = useState('');
  const [generatedOTP, setGeneratedOtp] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const { checkEmailExist, handleResetPassword, loading: authLoading } = useAuth();
  const { handleSendMail, loading: mailLoading } = useMail();
  const isLoading = authLoading || mailLoading;

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

  const emailIsNotExist = (email: string): Promise<boolean> => {
    return new Promise(async (resolve) => {
      const data = await checkEmailExist(email);
      console.log('Email Exist:', data);
      if (!data) {
        setEmailError(translation.emailNotExist || 'Email not found');
      }
      resolve(data === true);
    });
  }

  const validateEmailForm = async () => {
    const [emailValid, emailIsNotExistValid] = await Promise.all([
      validateEmail(email),
      emailIsNotExist(email)
    ]);
  
    return emailValid && emailIsNotExistValid;
  };

  const handleSendOtp = async () => {

    try {
      if (!(await validateEmailForm())) return;

      const generatedOTP = generateOtp();
      setGeneratedOtp(generatedOTP);

      const { subject, body } = emailService.getEmailContent(
        MailEnum.FORGET_PASSWORD_OTP,
        generatedOTP
      );
      await handleSendMail(email, subject, body);
      setOtpSent(true);
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  };

  
  const validatePassword = (password: string): Promise<boolean> => {
    return new Promise((resolve) => {
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
      resolve(error === null);
    });
  };

  const validateConfirmPassword = (confirmPassword: string): Promise<boolean> => {
    return new Promise((resolve) => {
      let error: string | null = null;
      if (!confirmPassword.trim()) {
        error = translation.inputRequired || "This field is required";
      } else if (confirmPassword !== newPassword) {
        error = translation.passwordMismatch || 'Passwords do not match';
      }
      setConfirmPasswordError(error);
      resolve(error === null);
    });
  }

  const validateOtp = (otp: string): Promise<boolean> => {
    return new Promise((resolve) => {
      let error: string | null = null;
      if (!otp.trim()) {
        error = translation.otpRequired || "OTP is required";
      } else if (otp !== generatedOTP) {
        error = translation.invalidOtp || "Invalid OTP";
      }
      setOtpError(error);
      resolve(error === null);
    });
  }


  const validateForm = async () => {
    const [otpValid, passwordValid, confirmPasswordValid] = await Promise.all([
      validateOtp(otp),
      validatePassword(newPassword),
      validateConfirmPassword(confirmPassword)
    ]);

    return otpValid && passwordValid && confirmPasswordValid;
  };


  const onResetPassword = async () => {
    if (!(await validateForm())) return;

    try {
      await handleResetPassword(email, newPassword);
      router.replace("/(auth)/login");
    } catch (err) {
      console.error("Reset Password Failed:", err);
    }
  };

  const validateField = (value: string, setError: React.Dispatch<React.SetStateAction<string | null>>) => {
        if (!value.trim()) {
          setError(translation.inputRequired || 'This field is required');
          return false;
        }
        setError(null);
        return true;
      };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.background} showsVerticalScrollIndicator={false}>
        <ThemedTitle style={[styles.title, { color: colors.title }]}>
          {translation.forgotPasswordText || 'Forgot Password'}
        </ThemedTitle>

        <View style={styles.formContainer}>
          {isLoading ? ( 
            <ActivityIndicator size="large" color={colors.appName} />
          ) : (
            !otpSent ? (
              <>
                <InputText
                  label={translation.emailLabel || "Email"}
                  value={email}
                  onChangeText={(email) => {
                    setEmail(email.trim());
                    validateEmail(email);
                  }}
                  placeholder={translation.emailPlaceholder || "Enter your email"}
                  icon="email"
                  lightColor="#333"
                  darkColor="#fff"
                />
                {emailError && <Text style={styles.errorText}>{emailError}</Text>}

                <Button
                  title={translation.sendOtpText || "Send OTP"}
                  onPress={handleSendOtp}
                  color={colors.button}
                  textColor="#fff"
                />
              </>
            ) : (
              <>
                <InputText
                  label={translation.otpLabel || "OTP"}
                  value={otp}
                  onChangeText={setOtp}
                  placeholder={translation.otpPlaceholder || "Enter OTP"}
                  icon="lock"
                  lightColor="#333"
                  darkColor="#fff"
                />
                {otpError && <Text style={styles.errorText}>{otpError}</Text>}

                <PasswordInput
                  label={translation.newPasswordLabel || "New Password"}
                  value={newPassword}
                  onChangeText={(newPassword) => {
                    setNewPassword(newPassword);
                    validatePassword(newPassword);
                  }}
                  placeholder={translation.newPasswordPlaceholder || "Enter new password"}
                  lightColor="#333"
                  darkColor="#fff"
                />
                {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}

                <PasswordInput
                  label={translation.confirmPasswordLabel || "Confirm Password"}
                  value={confirmPassword}
                  onChangeText={(confirmPassword) => {
                    setConfirmPassword(confirmPassword);
                    validateConfirmPassword(confirmPassword);
                  }}
                  placeholder={translation.confirmPasswordPlaceholder || "Confirm your new password"}
                  lightColor="#333"
                  darkColor="#fff"
                />
                {confirmPasswordError && <Text style={styles.errorText}>{confirmPasswordError}</Text>}

                <Button
                  title={translation.resetPasswordText || "Reset Password"}
                  onPress={onResetPassword}
                  color={colors.button}
                  textColor="#fff"
                />
              </>
            )
          )}

          <View style={styles.signInContainer}>
            <ThemedText style={{ color: colors.text2 }}>
              {translation.rememberPasswordText || "Remember your password?"}
            </ThemedText>
            <Link
              title={translation.signInText || "Sign in here"}
              onPress={() => router.replace("/(auth)/login")}
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
  title: {
    marginBottom: 20,
    marginTop: 120,
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
