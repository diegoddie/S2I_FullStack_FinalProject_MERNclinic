import { createContext, useReducer, useEffect, useState } from 'react'

export const AuthContext = createContext()

export const authReducer = (state,action) => {
    switch(action.type){
        case 'LOGIN':
            return { user: action.payload }
        case 'LOGOUT':
            return { user: null }
        default:
            return state
    }
}

export const AuthContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null
    });
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const user = JSON.parse(localStorage.getItem('user'))

        if(user){
            const currentTime = Date.now();
            const isTokenExpired = user.expiration && user.expiration < currentTime;

            if (isTokenExpired) {
                localStorage.removeItem('user');
                dispatch({type: 'LOGOUT'});
            } else {
                dispatch({type: 'LOGIN', payload: user});
            }
        }

        setLoading(false);
    }, [])

    console.log('AuthContext state: ', state)

    return (
        <AuthContext.Provider value={{...state, dispatch}}>
            {loading ? (
                 <div>Loading...</div>
            ) : (
                children 
            )}   
        </AuthContext.Provider>
    )
}