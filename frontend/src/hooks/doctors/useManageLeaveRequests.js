import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../auth/useAuthContext";

export const useManageLeaveRequests = () => {
    const navigate = useNavigate()
    const { user, token, dispatch } = useAuthContext();
    const [error, setError] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const approveLeaveRequest = async(doctorId, leaveRequestId) => {
        try{
            setIsLoading(true);
            setError([]);
            const res = await axios.put(`http://localhost:3000/doctor/${doctorId}/approve/${leaveRequestId}`, {}, { withCredentials: true });

            if(res.status === 200){
                setIsLoading(false)
                window.location.reload()
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
                window.location.reload()
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

    const deleteLeaveRequest = async(doctorId, leaveRequestId) => {
        try{
            setIsLoading(true);
            setError([])
            const res = await axios.delete(`http://localhost:3000/doctor/${doctorId}/leave-requests/${leaveRequestId}`, { withCredentials: true });

            if(res.status === 200){
                setIsLoading(false)
                window.location.reload()
            }
        }catch(error){
            console.error('Error deleting leave request:', error);
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

    return { approveLeaveRequest, declineLeaveRequest, deleteLeaveRequest, isLoading, error };
}