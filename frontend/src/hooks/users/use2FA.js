import axios from 'axios';
import { useState } from 'react';
import { useAuthContext } from '../auth/useAuthContext';
import { useNavigate } from "react-router-dom";

export const use2FA = () => {
    const navigate = useNavigate()

    const [error, setError] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { user, token, dispatch } = useAuthContext();

    const generate2FA = async () => {
        try {
            setIsLoading(true);
            setError([]);

            const res = await axios.post(`http://localhost:3000/user/generate2FA/${user._id}`, {},
                {
                    headers: {
                        Authorization: `Bearer ${token.token}`
                    },
                }
            );

            if (res.status === 200) {
                setIsLoading(false);
                const updatedUser = { ...user, twoFactorSecret: res.data.tempSecret };
                dispatch({ type: 'LOGIN', payload: { user: updatedUser, token } });
                
                const otpauthURL = `otpauth://totp/MyClinic?secret=${res.data.tempSecret}`;
                return otpauthURL
            }
        } catch (error) {
            setIsLoading(false);
            console.error('Error during the generation of 2FA Secret:', error);
            if (error.response && error.response.data && error.response.data.errors) {
                setError(error.response.data.errors.map((err) => err.msg));
            } else if (error.response && error.response.data && error.response.data.message) {
                setError([error.response.data.message]);
            } else {
                setError(['Something went wrong.']);
            }
        } 
    };

    const verify2FA = async (tempSecretCode) => {
        try {
            setIsLoading(true);
            setError([]);

            const res = await axios.post(`http://localhost:3000/user/verify2FA/${user._id}`, { tempSecretCode }, {
                headers: {
                    Authorization: `Bearer ${token.token}`,
                },
            });

            if (res.status === 200) {
                const updatedUser = { ...user, twoFactorEnabled: true };
                dispatch({ type: 'LOGIN', payload: { user: updatedUser, token } });
                setIsLoading(false);
                navigate('/');
            }
        } catch (error) {
            setIsLoading(false);
            console.error('Error during 2FA verification:', error);
            if (error.response && error.response.data && error.response.data.errors) {
                setError(error.response.data.errors.map((err) => err.msg));
            } else if (error.response && error.response.data && error.response.data.message) {
                setError([error.response.data.message]);
            } else {
                setError(['Something went wrong.']);
            }
        }
    };

    const disable2FA = async (password, confirmPassword) => {
        try {
            setIsLoading(true);
            setError([]);

            const res = await axios.post(`http://localhost:3000/user/disable2FA/${user._id}`, { password, confirmPassword }, {
                headers: {
                    Authorization: `Bearer ${token.token}`,
                },
            });

            if (res.status === 200) {
                const updatedUser = { ...user, twoFactorSecret: "", twoFactorEnabled: false };
                dispatch({ type: 'LOGIN', payload: { user: updatedUser, token } });
                setIsLoading(false);
                navigate('/');
            }
        } catch (error) {
            setIsLoading(false);
            console.error('Error during 2FA disable:', error);
            if (error.response && error.response.data && error.response.data.errors) {
                setError(error.response.data.errors.map((err) => err.msg));
            } else if (error.response && error.response.data && error.response.data.message) {
                setError([error.response.data.message]);
            } else {
                setError(['Something went wrong.']);
            }
        }
    };

    return { generate2FA, verify2FA, disable2FA, isLoading, error };
};

