import { updateUserInfo } from "@/scripts/userApi";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Strings from "../constants/Strings";
import { User } from "@/models/User";

export const useUser = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleUpdateUser = async (id: number, fullName: string, username: string, phoneNumber: string, avatar: string) => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem(Strings.AUTH.TOKEN);
            if (!token) {
                throw new Error("No token found");
            }
    
            const response = await updateUserInfo(id, fullName, username, phoneNumber, avatar);
            console.log("Response từ API:", response);
    
            // Lấy thông tin user hiện tại từ AsyncStorage
            const userJson = await AsyncStorage.getItem(Strings.AUTH.USER_INFO);
            if (!userJson) throw new Error("No user info found");
    
            // Parse user hiện tại và cập nhật dữ liệu mới
            const currentUser: User = JSON.parse(userJson);
            const updatedUser = {
                ...currentUser,
                fullName,
                username,
                phoneNumber,
                avatar
            };
    
            // Lưu user mới vào AsyncStorage
            await AsyncStorage.setItem(Strings.AUTH.USER_INFO, JSON.stringify(updatedUser));
    
            setLoading(false);
            return response;
        } catch (err) {
            setLoading(false);
            setError("Failed to update user info");
            throw err;
        }
    };
    
    return { handleUpdateUser, loading, error };
};
