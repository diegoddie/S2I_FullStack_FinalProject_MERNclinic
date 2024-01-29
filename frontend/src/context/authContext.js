import { createContext, useReducer, useEffect, useState } from 'react'

const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: JSON.parse(localStorage.getItem('token')) || null
};

export const AuthContext = createContext()

export const authReducer = (state,action) => {
    switch(action.type){
        case 'LOGIN':
            return { 
                user: action.payload.user,
                token: action.payload.token
            }
        case 'LOGOUT':
            return { 
                user: null,
                token: null
            }
        default:
            return state
    }
}

export const AuthContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(authReducer, initialState);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        localStorage.setItem('user', JSON.stringify(state.user))
        localStorage.setItem('token', JSON.stringify(state.token))

    }, [state])

    useEffect(() => {
        const storedToken = JSON.parse(localStorage.getItem('token'));
        const storedUser = JSON.parse(localStorage.getItem('user'));
    
        if (storedToken && storedUser) {
            const currentTime = Date.now();
            const isTokenExpired = storedToken.expiration && storedToken.expiration < currentTime;
    
            if (isTokenExpired) {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                dispatch({ type: 'LOGOUT' });
            } else {
                dispatch({ type: 'LOGIN', payload: { user: storedUser, token: storedToken } });
            }
        }
        setLoading(false);
    }, [dispatch]);

    return (
        <AuthContext.Provider value={{user:state.user, token:state.token, dispatch, loading}}>
            {children} 
        </AuthContext.Provider>
    )
}