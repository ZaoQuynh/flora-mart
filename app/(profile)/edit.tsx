import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Button from '@/components/ui/Button';
import { User } from '@/models/User';
import useSettings from '@/hooks/useSettings';
import InputText from '@/components/ui/InputText';
import { useUser } from '@/hooks/useUser';


const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/duvzhniw2/image/upload';
const UPLOAD_PRESET = 'flora-mart';

export default function ProfileEditScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { language, theme, translation, colors } = useSettings();
  const [user, setUser] = useState<User | null>(null);
  const [id, setId] = useState<number | null>(null);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [currentAvatar, setCurrentAvatar] = useState<string | null>(null);
  const [newAvatarUri, setNewAvatarUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const {handleUpdateUser} = useUser();

  useEffect(() => {
    try {
      const userParam = Array.isArray(params.user) ? params.user[0] : params.user;
      const theUser: User | null = userParam ? JSON.parse(userParam) : null;
      setUser(theUser);
      setId(theUser?.id);
      setFullName(theUser?.fullName || '');
      setUsername(theUser?.username || '');
      setPhoneNumber(theUser?.phoneNumber || '');
      setCurrentAvatar(theUser?.avatar || null);
    } catch (error) {
      console.error("Invalid user data:", error);
      setUser(null);
    }
  }, [params.user]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setNewAvatarUri(result.assets[0].uri);
    }
  };

  const uploadImage = async (imageUri: string): Promise<string | null> => {
    try {
      setUploading(true);
      let formData = new FormData();

      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: `${user?.id || 'profile'}.jpg`,
      } as any);

      formData.append('upload_preset', UPLOAD_PRESET);

      let response = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      let data = await response.json();
      if (data.secure_url) {
        return data.secure_url;
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload Error:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user || id === null) return;

    try {
      setUploading(true);
      let avatarUrl = currentAvatar;

      if (newAvatarUri) {
        try {
          avatarUrl = await uploadImage(newAvatarUri);
          if (!avatarUrl) {
            throw new Error('Failed to upload image');
          }
        } catch (error) {
          Alert.alert('Error', 'Failed to upload new profile picture. Try again later.');
          return;
        }
      }

      const updatedUser = await handleUpdateUser(id!, fullName, username, phoneNumber, avatarUrl || '');
      Alert.alert('Success', 'Profile updated successfully!');
      
      router.back()
    } catch (error) {
      console.error('Update failed', error);
      Alert.alert('Error', 'Could not update profile');
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <View style={[styles.headerSection, { backgroundColor: colors.button }]}>
            <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
              <Image
                source={
                  newAvatarUri 
                    ? { uri: newAvatarUri }
                    : currentAvatar 
                      ? { uri: currentAvatar }
                      : require('../../assets/images/temp-user.png')
                }
                style={styles.avatar}
              />
              <View style={styles.cameraIconContainer}>
                <Image 
                  source={require('../../assets/images/camera.png')}
                  style={styles.cameraIcon}
                />
              </View>
              <Text style={styles.changePhotoText}>
                {uploading 
                  ? translation.uploading || "Uploading..." 
                  : translation.changePhotoText || 'Change Photo'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formSection}>
            <InputText
              label={translation.fullNameLabel || 'Full Name'}
              value={fullName}
              onChangeText={setFullName}
              placeholder={translation.fullNamePlaceholder || 'Enter your full name'}
              lightColor="#333"
              darkColor="#fff"
            />

            <InputText
              label={translation.usernameLabel || 'Username'}
              value={username}
              onChangeText={setUsername}
              placeholder={translation.usernamePlaceholder || 'Enter your username'}
              lightColor="#333"
              darkColor="#fff"
            />

            <InputText
              label={translation.phoneNumberLabel || 'Phone Number'}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder={translation.phoneNumberPlaceholder || 'Enter your phone number'}
              lightColor="#333"
              darkColor="#fff"
            />

            <View style={styles.buttonContainer}>
              <Button
                title={translation.saveButtonText || "Save Changes"}
                onPress={handleSave}
                color={colors.button}
                textColor="#fff"
                style={styles.saveButton}
                disabled={uploading}
              />
              <Button
                title={translation.cancelButtonText || "Cancel"}
                onPress={() => router.back()}
                color="#f5f5f5"
                textColor={colors.text2}
                style={styles.cancelButton}
                disabled={uploading}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  headerSection: {
    paddingTop: 30,
    paddingBottom: 60,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 45,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cameraIcon: {
    width: 20,
    height: 20,
    tintColor: '#666',
  },
  changePhotoText: {
    color: '#fff',
    marginTop: 8,
    fontSize: 14,
  },
  formSection: {
    marginTop: -30,
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  buttonContainer: {
    marginTop: 10,
    gap: 10,
  },
  saveButton: {
    borderRadius: 12,
  },
  cancelButton: {
    borderRadius: 12,
  },
});