import { createContext, useReducer, useEffect } from 'react'

const initialState = {
    doctors: localStorage.getItem('doctors') ? JSON.parse(localStorage.getItem('doctors')) : null,
};

export const DoctorContext = createContext();

export const doctorReducer = (state, action) => {
    switch (action.type) {
        case 'SET_DOCTORS':
            return {
                ...state,
                doctors: action.payload.doctors,
            };
        default:
            return state;
    }
};

export const DoctorContextProvider = ({ children }) => {
    const [doctorState, dispatch] = useReducer(doctorReducer, initialState);

    useEffect(() => {
        localStorage.setItem('doctors', JSON.stringify(doctorState.doctors));
        console.log('DoctorContext state:', doctorState);
    }, [doctorState]);

    return (
        <DoctorContext.Provider value={{ doctors: doctorState.doctors, dispatch }}>
            {children}
        </DoctorContext.Provider>
    );
};