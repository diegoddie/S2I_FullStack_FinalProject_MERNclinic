import { useState } from "react";
import axios from "axios";
import { useAuthContext } from "../auth/useAuthContext";
import errorHandler from "../utils/errorHandler";
import { toast } from 'react-toastify';

export const useUpdateUser = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { user, token, dispatch } = useAuthContext();

    const updateUser = async ({ formData, model }) => {
        try {
            setIsLoading(true);

            const res = await axios.put(`http://localhost:3000/${model}/update/${user._id}`, formData, { withCredentials: true })

            if (res.status === 200) {
                setIsLoading(false);
                const updatedUser = res.data.user;
                console.log(updatedUser)
                dispatch({ type: 'LOGIN', payload: { user: updatedUser, token } });

                toast.success('User updated successfully.');
            }
        } catch (error) {
            console.error('Error during update:', error);

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

    return { updateUser, isLoading };
};
