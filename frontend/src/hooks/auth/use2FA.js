import axios from 'axios';
import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import errorHandler from "../utils/errorHandler";

export const use2FA = () => {
    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(false);
    const { user, token, dispatch } = useAuthContext();

    const generate2FA = async (model) => {
        try {
            setIsLoading(true);

            const res = await axios.post(`http://localhost:3000/${model}/generate2FA/${user._id}`, {}, { withCredentials: true })

            if (res.status === 200) {
                setIsLoading(false);
                const updatedUser = { ...user, twoFactorSecret: res.data.tempSecret };
                dispatch({ type: 'LOGIN', payload: { user: updatedUser, token } });
                
                const otpauthURL = `otpauth://totp/MyClinic?secret=${res.data.tempSecret}`;
                return otpauthURL
            }
        } catch (error) {
            console.error('Error during the generation of 2FA Secret:', error);

            if (error.response && error.response.status === 401) {
                console.log('Token expired. Logging out...');
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                dispatch({ type: 'LOGOUT' });
                
                toast.warning('Session expired. Please log in again.');
            } else {
                errorHandler(error);
            }
            setIsLoading(false);
        } 
    };

    const verify2FA = async (tempSecretCode, model) => {
        try {
            setIsLoading(true);

            const res = await axios.post(`http://localhost:3000/${model}/verify2FA/${user._id}`, { tempSecretCode }, {
                headers: {
                    Authorization: `Bearer ${token.token}`,
                },
            });

            if (res.status === 200) {
                const updatedUser = { ...user, twoFactorEnabled: true };
                dispatch({ type: 'LOGIN', payload: { user: updatedUser, token } });
                setIsLoading(false);
                navigate('/');
                toast.success('2FA Enabled succesfully.')
            }
        } catch (error) {
            console.error('Error during 2FA verification:', error);
            setIsLoading(false);
            
            errorHandler(error)
        }
    };

    const disable2FA = async (password, confirmPassword, model) => {
        try {
            setIsLoading(true);

            const res = await axios.post(`http://localhost:3000/${model}/disable2FA/${user._id}`, { password, confirmPassword }, {
                headers: {
                    Authorization: `Bearer ${token.token}`,
                },
            });

            if (res.status === 200) {
                const updatedUser = { ...user, twoFactorSecret: "", twoFactorEnabled: false };
                dispatch({ type: 'LOGIN', payload: { user: updatedUser, token } });
                setIsLoading(false);
                navigate('/');
                toast.success('2FA Disabled succesfully.')
            }
        } catch (error) {
            console.error('Error during 2FA disable:', error);
            setIsLoading(false);
            
            errorHandler(error)
        }
    };

    return { generate2FA, verify2FA, disable2FA, isLoading };
};

