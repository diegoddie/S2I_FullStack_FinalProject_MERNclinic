import axios from "axios";
import { useAuthContext } from "./useAuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import errorHandler from "../utils/errorHandler";
import { toast } from 'react-toastify';

export const useLogout = () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const { dispatch } = useAuthContext()

    const logout = async() => {
        try {
            setIsLoading(true)

            const res = await axios.get('http://localhost:3000/sign-out', { withCredentials: true });

            if (res.status === 200) {
                setIsLoading(false)
                localStorage.removeItem('user')
                localStorage.removeItem('token')
                dispatch({ type: 'LOGOUT' })
                navigate('/');
                toast.success('Logout successful!');
            }
        } catch (error) {
            console.error('Error during logout:', error);

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
    }

    return { logout, isLoading }
}
