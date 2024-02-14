import { useState } from 'react';
import axios from 'axios';
import errorHandler from '../utils/errorHandler';
import { useAuthContext } from '../auth/useAuthContext';
import { toast } from 'react-toastify';

export const useManageDoctors = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { user, token, dispatch } = useAuthContext();

    const baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://myclinic-backend.onrender.com';

    const getDoctors = async () => {
        try {
            setIsLoading(true);
            const res = await axios.get(`${baseURL}/doctor`);
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

    const getDoctorById = async (id) => {
        try{
            setIsLoading(true)

            const res = await axios.get(`${baseURL}/doctor/${id}`);

            if(res.status === 200){
                setIsLoading(false)
                const doctor = res.data;
                return doctor
            }  
        }catch (error) {
            console.error('Error getting doctor details:', error);
            setIsLoading(false)

            errorHandler(error)
        }
    }

    const getDoctorWeeklyAvailability = async(id) => {
        try{
            setIsLoading(true)

            const res = await axios.get(`${baseURL}/doctor/${id}/weeklyAvailability`);

            if(res.status === 200){
                setIsLoading(false)
                const availableSlots = res.data;
                return availableSlots
            }
        }catch(error){
            console.error("Error getting doctor's weekly availability:", error);
            setIsLoading(false)

            errorHandler(error)
        }
    }

    const createDoctor = async ({ formData }) => {
        try {
            setIsLoading(true);

            const res = await axios.post(`${baseURL}/doctor/create`, formData, { withCredentials: true });

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

            const res = await axios.put(`${baseURL}/doctor/update/${user._id}`, formData, { withCredentials: true })

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

            const res = await axios.delete(`${baseURL}/doctor/delete/${id}`, { withCredentials: true });

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
        getDoctorById,
        getDoctorWeeklyAvailability,
        createDoctor,
        updateDoctor,
        deleteDoctor
    };
};
