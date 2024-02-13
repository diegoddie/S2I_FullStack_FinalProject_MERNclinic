import { useState } from 'react';
import axios from 'axios';
import errorHandler from '../utils/errorHandler';
import { useAuthContext } from '../auth/useAuthContext';
import { toast } from 'react-toastify';

export const useManageDoctors = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { user, token, dispatch } = useAuthContext();

    const getDoctors = async () => {
        try {
            setIsLoading(true);
            const res = await axios.get('https://myclinic-backend.onrender.com/doctor');
            if(res.status === 200){
                setIsLoading(false)
                const doctors = res.data;
                return doctors
            }
        } catch (error) {
            console.error('Error getting doctors:', error);
            setIsLoading(false)

            errorHandler(error)
        }
    };

    const createDoctor = async ({ formData }) => {
        try {
            setIsLoading(true);

            const res = await axios.post('http://localhost:3000/doctor/create', formData, { withCredentials: true });

            if(res.status === 201){
                setIsLoading(false)
                toast.success('Doctor created succesfully.')
            }            
        } catch (error) {
            console.error('Error adding a doctor:', error);

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

    const updateDoctor = async ({ formData }) => {
        try {
            setIsLoading(true);

            const res = await axios.put(`http://localhost:3000/doctor/update/${user._id}`, formData, { withCredentials: true })

            if (res.status === 200) {
                setIsLoading(false);
                const updatedUser = res.data.user;
                
                dispatch({ type: 'LOGIN', payload: { user: updatedUser, token } });
                
                toast.success('Doctor updated successfully.');
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

    const deleteDoctor = async (id) => {
        try {
            setIsLoading(true);

            const res = await axios.delete(`http://localhost:3000/doctor/delete/${id}`, { withCredentials: true });

            if (res.status === 200) {
                setIsLoading(false);
                toast.success('Doctor deleted successfully.');
            }
        } catch (error) {
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

    return {
        isLoading,
        getDoctors,
        createDoctor,
        updateDoctor,
        deleteDoctor
    };
};
