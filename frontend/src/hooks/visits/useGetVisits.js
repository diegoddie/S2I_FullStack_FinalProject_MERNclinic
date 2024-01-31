import { useState } from 'react';
import axios from 'axios';
import errorHandler from '../utils/errorHandler';
import { useAuthContext } from '../auth/useAuthContext';

export const useGetVisits = () =>{
    const [isLoading, setIsLoading] = useState(false);
    const { token } = useAuthContext()
    
    const getVisits = async (model, id) => {
        try {
            setIsLoading(true);
            const res = await axios.get(`http://localhost:3000/visit/${model}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token.token}`
                }
            });
            
            if(res.status === 200){
                setIsLoading(false)
                const visits = res.data;
                return visits
            }
        } catch (error) {
            console.error('Error getting visits:', error);
            setIsLoading(false)

            errorHandler(error)
        }
    }

    return {
        getVisits,
        isLoading
    }
}