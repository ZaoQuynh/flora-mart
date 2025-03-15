import { useState } from 'react';
import { sendMail } from '../scripts/mailApi';

export const useMail = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const handleSendMail = async (email: string, subject: string, body: string) => {
        setLoading(true);
        try {
            const data = await sendMail(email, subject, body);
            setLoading(false);
            return data;
        } catch (err) {
            setLoading(false);
            setError('Failed to send mail');
            throw err;
        }
    };
    
    return { handleSendMail, loading, error };
};
