import axios from "axios";
import { useState } from "react";

export const useManageLeaveRequests = () => {
    const [error, setError] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const approveLeaveRequest = async(doctorId, leaveRequestId) => {
        try{
            setIsLoading(true);
            setError([]);
            const res = await axios.put(`http://localhost:3000/doctor/${doctorId}/approve/${leaveRequestId}`, {}, { withCredentials: true });

            if(res.status === 200){
                setIsLoading(false)
                window.location.reload();
            }
        }catch(error){
            console.error('Error approving leave request:', error);
            setIsLoading(false)

            if (error.response && error.response.data && error.response.data.errors) {
                setError(error.response.data.errors.map((err) => err.msg));
            } else if (error.response && error.response.data && error.response.data.message) {
                setError([error.response.data.message]);
            } else {
                setError(['Something went wrong.']);
            }
        }
    }

    const declineLeaveRequest = async(doctorId, leaveRequestId) => {
        try{
            setIsLoading(true);
            setError([]);
            const res = await axios.put(`http://localhost:3000/doctor/${doctorId}/decline/${leaveRequestId}`, {}, { withCredentials: true });

            if(res.status === 200){
                setIsLoading(false)
                window.location.reload();
            }
        }catch(error){
            console.error('Error declining leave request:', error);
            setIsLoading(false)

            if (error.response && error.response.data && error.response.data.errors) {
                setError(error.response.data.errors.map((err) => err.msg));
            } else if (error.response && error.response.data && error.response.data.message) {
                setError([error.response.data.message]);
            } else {
                setError(['Something went wrong.']);
            }
        }
    }

    return { approveLeaveRequest, declineLeaveRequest, isLoading, error };
}