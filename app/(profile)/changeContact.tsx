import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
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

export default function ChangeContactScreen() {
  const router = useRouter();
  const { language, theme, translation, colors } = useSettings();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOTP, setGeneratedOtp] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const { handleSendMail } = useMail();
  const { handleVerify, loading, error } = useAuth();

  const validateForm = () => {
    if (!otp.trim()) {
      setOtpError(translation.otpRequired || "OTP is required");
      return false;
    }
    return true;
  }

  const handleVerifyOtp = async () => {
    if (!validateForm()) return;

    if (otp === generatedOTP) {
      await handleVerify(email);
      console.log('OTP verified successfully');
      router.replace("/(profile)/information");
    } else {
      setOtpError("Invalid OTP");
    }
  };

  const handleSendOtp = async () => {
    if (!email) return;
    const generatedOTP = generateOtp();
    setGeneratedOtp(generatedOTP);

    const { subject, body } = emailService.getEmailContent(
      MailEnum.UPDATE_INFO_OTP,
      generatedOTP
    );
    await handleSendMail(email, subject, body);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.background}>
        <ThemedTitle style={[styles.title, { color: colors.title }]}> 
          {translation.changeContact || 'Change Contact'}
        </ThemedTitle>

        <View style={styles.formContainer}>
          <InputText
            label="New Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter new email"
            icon="mail"
            lightColor="#333"
            darkColor="#fff"
          />

          <InputText
            label="New Phone Number"
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter new phone number"
            icon="phone"
            lightColor="#333"
            darkColor="#fff"
          />

          <Button title="Send OTP" onPress={handleSendOtp} color={colors.button} textColor="#fff" />

          {generatedOTP && (
            <>
              <InputText
                label="OTP"
                value={otp}
                onChangeText={setOtp}
                placeholder="Enter OTP"
                icon="lock"
                lightColor="#333"
                darkColor="#fff"
              />
              {otpError && <Text style={styles.errorText}>{otpError}</Text>}
              <Button title="Verify OTP" onPress={handleVerifyOtp} color={colors.button} textColor="#fff" />
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  background: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', width: '100%', paddingVertical: 20 },
  title: { marginBottom: 20, marginTop: 120 },
  formContainer: { width: '90%', padding: 10, borderRadius: 12, backgroundColor: '#ffffff80', marginTop: 20, marginBottom: 30 },
  errorText: { color: 'red', textAlign: 'left', marginHorizontal: 15 },
});
