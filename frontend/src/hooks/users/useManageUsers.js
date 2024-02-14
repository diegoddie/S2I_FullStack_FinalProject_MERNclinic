import axios from "axios";
import errorHandler from "../utils/errorHandler";
import { useState } from "react";
import { useAuthContext } from "../auth/useAuthContext";
import { toast } from 'react-toastify';

export const useManageUsers = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { user, token, dispatch } = useAuthContext()

    const baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://api.myclinic.tech';

    const getUsers = async () => {
        try {
            setIsLoading(true);
            const res = await axios.get(`${baseURL}/user`, {
                headers: {
                    'Authorization': `Bearer ${token.token}`
                }
            });

            if(res.status === 200){
                setIsLoading(false);
                return res.data
            }            
        } catch (error) {
            console.error('Error getting Users', error);
            setIsLoading(false);
            
            errorHandler(error)
        }
    };

    const signUp = async ({ formData }) => {
        try {
            setIsLoading(true);
            const res = await axios.post(`${baseURL}/sign-up`, formData);

            if(res.status === 201){
                setIsLoading(false)
                toast.success('Please check your email for verification.');
            }            
        } catch (error) {
            console.error('Error during sign-up:', error);
            setIsLoading(false);
            
            errorHandler(error)
        }
    };

    const updateUser = async ({ formData, model }) => {
        try {
            setIsLoading(true);

            const res = await axios.put(`${baseURL}/${model}/update/${user._id}`, formData, { withCredentials: true })

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

    const deleteUser = async (model, id) => {
        try{
            setIsLoading(false)

            const res = await axios.delete(`${baseURL}/${model}/delete/${id}`, { withCredentials: true });

            if (res.status === 200) {
                setIsLoading(false);
                dispatch({ type: 'LOGOUT' });
                toast.success('User deleted successfully.');
            }
        }catch(error){
            console.error('Error during deletion:', error);

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

    return { getUsers, signUp, updateUser, deleteUser, isLoading };
};

