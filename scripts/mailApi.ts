import axios from 'axios';
import { API_BASE_URL } from '../constants/apiConfig';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });


export const sendMail = async (email: string, subject: string, body: string) => {
    const response = await api.post('/mail/send', { email, subject, body });
    return response.data;
}