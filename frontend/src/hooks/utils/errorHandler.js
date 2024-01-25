import { toast } from 'react-toastify';

const errorHandler = (error) => {
    if (error.response && error.response.data) {
        if (error.response.data.errors) {
            error.response.data.errors.forEach((err) => toast.error(err.msg));
        } else if (error.response.data.message) {
            toast.error(error.response.data.message);
        }
    } else {
        toast.error('Something went wrong.');
    }
}

export default errorHandler;
