import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, ScrollView, TextStyle } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import Button from '@/components/ui/Button';
import useSettings from '@/hooks/useSettings';
import { User } from '@/models/User';
import { useAuth } from '@/hooks/useAuth';
import IconButton from '@/components/ui/IconButton';

const tierImages: Record<string, any> = {
    BRONZE: require('../../assets/images/bronze-medal.png'),
    SILVER: require('../../assets/images/silver-medal.png'),
    GOLD: require('../../assets/images/gold-medal.png'),
    PLATINUM: require('../../assets/images/diamond.png'),
};

export default function ProfileScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { language, theme, translation, colors } = useSettings();
    const { handleLogout, userInfo } = useAuth();
    const [user, setUser] = useState<User | null>(null);

    const textStyle: TextStyle = {
        color: colors.text2,
      };
    useEffect(() => {
        const fetchUser = async () => {
          const data = await userInfo();
          setUser(data);
        };
    
        fetchUser();
      }, []);

    const navigateToEdit = () => {
        router.push({
            pathname: "/(profile)/edit",
            params: { user: JSON.stringify(user) }
        });
    }

    const changeContact = () => {
        router.push({
            pathname: "/(profile)/changeContact",
            params: { user: JSON.stringify(user) }
        });
    }

    const onLogout = async () => {
        try {
          await handleLogout();
  
          router.replace("/(auth)/login");
        } catch (err) {
          console.error('Logout Failed');
          console.error(err);
        }
      };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.background}>
                    <View style={[styles.headerSection, { backgroundColor: colors.button }]}>
                        <IconButton
                            iconName="edit"
                            onPress={navigateToEdit}
                            size={30}
                            color={colors.button2}
                            style={ styles.editButton}
                        />
                        
                        <View style={styles.avatarContainer}>
                            <Image
                                source={ user?.avatar ? { uri: user.avatar } : require('../../assets/images/temp-user.png') }
                                style={styles.avatar}
                            />
                            <ThemedText style={styles.fullName}>
                                {user?.fullName || 'N/A'}
                            </ThemedText>
                            <ThemedText style={styles.userName}>
                                @{user?.username || 'User Name'}
                            </ThemedText>
                            <View style={styles.tierBadge}>
                                <Image 
                                source={tierImages[user?.tier || 'BRONZE']} 
                                style={styles.tierImage} />
                            </View>
                        </View>
                    </View>

                    <View style={styles.statsContainer}>
                        <View style={styles.statBox}>
                            <ThemedText style={[styles.statValue, {color: colors.text2 }]}>
                                {user?.points || '0'}
                            </ThemedText>
                            <ThemedText style={styles.statLabel}>
                                {translation.pointsLabel || 'Points'}
                            </ThemedText>
                        </View>
                    </View>

                    <View style={styles.infoSection}>
                        <View style={styles.sectionTitle}>
                            <ThemedText style={[styles.sectionTitleText, { color: colors.text2 }]}>
                                {translation.personalInfo || 'Personal Information'}
                            </ThemedText>
                        </View>

                        <View style={styles.infoContainer}>
                            <View style={styles.infoRow}>
                                <ThemedText style={[styles.label, { color: colors.text2 }]}>
                                    {translation.emailLabel || 'Email'}
                                </ThemedText>
                                <ThemedText style={[styles.value, { color: colors.text2 }]}>
                                    {user?.email || '-'}
                                </ThemedText>
                            </View>

                            <View style={styles.infoRow}>
                                <ThemedText style={[styles.label, { color: colors.text2 }]}>
                                    {translation.phoneNumberLabel || 'Phone Number'}
                                </ThemedText>
                                <ThemedText style={[styles.value, { color: colors.text2 }]}>
                                    {user?.phoneNumber || '-'}
                                </ThemedText>
                            </View>
                        </View>

                        <Button
                            title={translation.changeContact || 'Change Contact'}
                            onPress={changeContact}
                            color={colors.button}
                            textColor="#fff"
                        />

                        <Button
                            title={translation.logoutButtonText || 'Logout'}
                            onPress={onLogout}
                            color={colors.button}
                            textColor="#fff"
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
        backgroundColor: '#f5f5f5',
    },
    scrollView: {
        flex: 1,
    },
    background: {
        flex: 1,
        width: '100%',
    },
    headerSection: {
        paddingTop: 70,
        paddingBottom: 80,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        padding: 10
    },
    avatarContainer: {
        alignItems: 'center',
        padding: 20
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#fff',
    },
    fullName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 10,
    },
    userName: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 10,
    },
    tierBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 15,
        marginTop: 8,
    },
    tierImage: {
        width: 40,
        height: 40,
        resizeMode: 'contain'
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: -40,
        paddingHorizontal: 20,
    },
    statBox: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        minWidth: 120,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
    },
    infoSection: {
        padding: 20,
        marginTop: 20,
    },
    sectionTitle: {
        marginBottom: 15,
    },
    sectionTitleText: {
        fontSize: 18,
        fontWeight: '600',
    },
    infoContainer: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    infoRow: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    label: {
        fontSize: 14,
        marginBottom: 4,
    },
    value: {
        fontSize: 16,
        fontWeight: '500',
    },
    editButton: {
        position: 'absolute',
        top: 40,
        right: 15,
        zIndex: 10,
    },
});