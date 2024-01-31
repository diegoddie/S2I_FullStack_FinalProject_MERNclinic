import axios from "axios";
import errorHandler from "../utils/errorHandler";
import { useState } from "react";
import { useAuthContext } from "../auth/useAuthContext";

export const useGetUsers = () => {
    const [loading, setLoading] = useState(false);
    const { token } = useAuthContext()

    const getUsers = async () => {
        try {
            setLoading(true);
            const res = await axios.get('http://localhost:3000/user', {
                headers: {
                    'Authorization': `Bearer ${token.token}`
                }
            });

            if(res.status === 200){
                setLoading(false);
                return res.data
            }            
        } catch (error) {
            console.error('Error getting Users', error);
            setLoading(false);
            
            errorHandler(error)
        }
    };

    return { getUsers, loading };
};

