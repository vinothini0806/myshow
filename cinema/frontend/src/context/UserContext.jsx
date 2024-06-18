import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

import * as userService from "../services/UserService";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = (tokenObject) => {
        if (!tokenObject || typeof tokenObject.token !== 'string') {
            console.error('Invalid token specified');
            return;
        }

        const token = tokenObject.token;
        localStorage.setItem('token', token);

        try {
            const decodedUser = jwtDecode(token);
            setUser(decodedUser);
        } catch (error) {
            console.error('Failed to decode token:', error);
        }
    };

    const logout = async () => {
        const token = localStorage.getItem('token');
        console.log("I am inside logout");
        console.log(token);
        if (token) {
            try {
                await userService.logout(token); // Use the AuthService to invalidate the token
            } catch (error) {
                console.error('Failed to invalidate token:', error);
            }

        }
        localStorage.removeItem('token');
        setUser(null);
    };



    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedUser = jwtDecode(token);
                setUser(decodedUser);
            } catch (error) {
                console.error('Invalid token on mount:', error);
                localStorage.removeItem('token');
            }
        }
    }, []);


    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(UserContext);
};
