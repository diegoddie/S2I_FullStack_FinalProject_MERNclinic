import { Outlet, Navigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/authContext';

const PrivateRoutes = () => {
    const { user } = useAuth();
    const { id } = useParams();

    console.log(user._id)
    console.log(id)

    const validUser = user._id === id
    console.log(validUser)
    if (validUser === true){
        return <Outlet />
    }else{
        return <Navigate to='/' />
    }
};

export default PrivateRoutes;
