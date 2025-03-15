import React, { useEffect, useState } from "react";
import { useRouter, useLocalSearchParams  } from "expo-router";
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { ThemedTitle } from '@/components/ThemedTitle';
import { ThemedText } from '@/components/ThemedText';
import InputText from '@/components/ui/InputText';
import Button from '@/components/ui/Button';
import useSettings from '@/hooks/useSettings';
import MailService, { MailEnum } from '@/utils/MailService';
import { generateOtp } from '@/utils/generateOtp';
import { useMail } from '@/hooks/useMail';
import { useAuth } from '@/hooks/useAuth';

const emailService = new MailService();

export default function RegisterOtpScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { language, theme, translation, colors } = useSettings();
  const [generatedOTP, setGeneratedOtp] = useState('');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const { email } = params;
  const { handleSendMail } = useMail();
  const { handleVerify , loading, error } = useAuth();

  const validateForm = async () => {
    if (!otp.trim()) {
      setOtpError(translation.otpRequired || "OTP is required");
      return true;
    }
  }

  const handleVerifyOtp = async () => {
    if(await validateForm()  != null) return;

    console.log('OTP entered:', otp);
    console.log('Generated OTP:', generatedOTP);
    console.log('Email:', email);

    if(otp === generatedOTP) {
      await handleVerify(Array.isArray(email) ? email[0] : email);
      console.log('OTP verified successfully');
      router.replace("/(auth)/login");
    }
  };

  const handleResendOtp = () => {
    console.log('Resending OTP...');
  };

  const handleSendOtp = async () => {
    console.log('Sending OTP...');

    try {
      const generatedOTP = generateOtp();
      setGeneratedOtp(generatedOTP);

      const {subject, body} = emailService.getEmailContent(
        MailEnum.REGISTER_OTP,
        generatedOTP
      );

      console.log('Email content:', {subject, body});
      await handleSendMail(Array.isArray(email) ? email[0] : email, subject, body);
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  }

  useEffect(() => {
    handleSendOtp();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.background} showsVerticalScrollIndicator={false}>
        <ThemedTitle style={[styles.title, { color: colors.title }]}>
          {translation.otpVerificationText || 'OTP Verification'}
        </ThemedTitle>

        <View style={styles.formContainer}>
          <ThemedText style={{ color: colors.text2 }}>
            {translation.enterOtpText || 'Please enter the OTP sent to your email.'}
          </ThemedText>

          <InputText
            label={translation.otpLabel || 'OTP'}
            value={otp}
            onChangeText={setOtp}
            placeholder={translation.otpPlaceholder || 'Enter OTP'}
            lightColor="#333"
            darkColor="#fff"
            icon="lock"
          />

          {otpError && <Text style={styles.errorText}>{otpError}</Text>}

          <Button
            title={translation.verifyButtonText || 'Verify OTP'}
            onPress={handleVerifyOtp}
            color={colors.button}
            textColor="#fff"
          />

          <Button
            title={translation.resendOtpText || 'Resend OTP'}
            onPress={handleResendOtp}
            color={colors.link}
            textColor="#fff"
            style={styles.resendButton}
          />
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
  resendButton: {
    marginTop: 15,
    backgroundColor: 'transparent',
  },
  errorText: {
    color: 'red',
    textAlign: 'left',
    marginHorizontal: 15,
  },
});
