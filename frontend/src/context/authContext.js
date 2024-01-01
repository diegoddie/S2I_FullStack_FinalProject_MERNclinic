import { createContext, useReducer, useEffect, useState } from 'react'

const initialState = {
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
    token: localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')) : null
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

    useEffect(()=>{
        const token = JSON.parse(localStorage.getItem('token'))
        const user = JSON.parse(localStorage.getItem('user'))

        if(token){
            const currentTime = Date.now();
            const isTokenExpired = token.expiration && token.expiration < currentTime;

            if (isTokenExpired) {
                localStorage.setItem('token', null);
                localStorage.setItem('user', null);
                dispatch({type: 'LOGOUT'});
            } else {
                dispatch({type: 'LOGIN', payload: {user, token}});
            }
        }

        setLoading(false);
    }, [])

    console.log('AuthContext state: ', state)

    return (
        <AuthContext.Provider value={{user:state.user, token:state.token, dispatch, loading}}>
            {children} 
        </AuthContext.Provider>
    )
}