import { Outlet, Navigate } from 'react-router-dom'
import { useAuthContext } from '../../hooks/useAuthContext'

const PrivateRoutes = () => {
    const {user} = useAuthContext()
    console.log(user)
    return user ? <Outlet/> : <Navigate to="/login"/>
}

export default PrivateRoutes