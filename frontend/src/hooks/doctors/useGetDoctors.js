import { useState } from 'react';
import axios from 'axios';
import errorHandler from '../utils/errorHandler';

export const useGetDoctors = () => {
    const [loading, setLoading] = useState(false);

    const getDoctors = async () => {
        try {
            setLoading(true);
            const res = await axios.get('http://localhost:3000/doctor');
            if(res.status === 200){
                setLoading(false)
                const doctors = res.data;
                return doctors
            }
        } catch (error) {
            console.error('Error getting doctors:', error);
            setLoading(false)

            errorHandler(error)
        }
    };

    return {
        loading,
        getDoctors
    };
};
