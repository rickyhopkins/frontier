import * as React from 'react';
import { createContext, FC, useEffect, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Login } from '../pages/Login';
import jwt_decode from 'jwt-decode';

export const USER_TOKEN_KEY = 'frontier_user_token';

export interface IUser {
    _id: string;
    name: string;
}

export const AuthenticationContext = createContext<{ user: IUser } | undefined>(
    undefined
);

export const AuthenticationWrapper: FC = ({ children }) => {
    const [token, setToken, loading] = useLocalStorage(USER_TOKEN_KEY, '');

    const [user, setUser] = useState();

    useEffect(() => {
        if (!token) return;
        const decodedToken = jwt_decode<{ user: any }>(token);
        setUser(decodedToken.user);
    }, [token]);

    if (loading) {
        return <div>Loading</div>;
    }

    if (!user) {
        return <Login setToken={setToken} />;
    }

    return (
        <AuthenticationContext.Provider value={{ user }}>
            {children}
        </AuthenticationContext.Provider>
    );
};
