import { useState } from 'react';
import axios from 'axios';

export const useGetDoctors = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState([]);

    const getDoctors = async () => {
        try {
            setLoading(true);
            setError([])
            const res = await axios.get('http://localhost:3000/doctor');
            if(res.status === 200){
                setLoading(false)
                const doctors = res.data;
                return doctors
            }
        } catch (error) {
            console.error('Error getting doctors:', error);
            setLoading(false)
            
            if (error.response && error.response.data && error.response.data.errors) {
                setError(error.response.data.errors.map((err) => err.msg));
            } else if (error.response && error.response.data && error.response.data.message) {
                setError([error.response.data.message]);
            } else {
                setError(['Something went wrong.']);
            }
        }
    };

    return {
        loading,
        error,
        getDoctors
    };
};
