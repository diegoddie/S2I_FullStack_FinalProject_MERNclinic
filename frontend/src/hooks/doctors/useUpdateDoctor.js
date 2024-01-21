import { useState } from "react";
import axios from "axios";
import { useAuthContext } from "../auth/useAuthContext";

export const useUpdateDoctor = () => {
    const [error, setError] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { user, token, dispatch } = useAuthContext();

    const updateDoctor = async ({ formData }) => {
        try {
            setIsLoading(true);
            setError([]);

            const res = await axios.put(`http://localhost:3000/doctor/update/${user._id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token.token}`
                },
            });

            if (res.status === 200) {
                window.location.reload();
                const updatedUser = res.data.user;
                dispatch({ type: 'LOGIN', payload: { user: updatedUser, token } });
                setIsLoading(false);
            }
        } catch (error) {
            setIsLoading(false);
            console.error('Error during update:', error);
            if (error.response && error.response.data && error.response.data.errors) {
                setError(error.response.data.errors.map((err) => err.msg));
            } else if (error.response && error.response.data && error.response.data.message) {
                setError([error.response.data.message]);
            } else {
                setError(['Something went wrong.']);
            }
        }
    };

    return { updateDoctor, isLoading, error };
};
