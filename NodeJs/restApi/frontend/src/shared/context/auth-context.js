import { createContext, useContext } from 'react';

export const AuthContext = createContext({
    isLoggedIn: false,
    token: null,
    userId: null,
    login: () => { },
    logout: () => { }
});

const useAppContext = () => {
    const value = useContext(AuthContext);
    return value; 
};

export default useAppContext; 