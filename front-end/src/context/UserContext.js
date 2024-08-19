import { createContext, useState, useEffect } from 'react';
import { apiCall } from '../services/api';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserStatus = async () => {
            const storedUser = sessionStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
                setLoading(false);
            } else {
                try {
                    const response = await apiCall('get', '/auth/status');

                    if (response.status === 200) {
                        setUser(response.data.user.iduser);
                        sessionStorage.setItem('user', JSON.stringify(response.data.user.iduser));
                    }
                    setLoading(false);
                } catch (error) {
                    setLoading(false);
                }
            }
        };

        fetchUserStatus();
    }, []);

    const login = (newUserData) => {
        setUser(newUserData);
        sessionStorage.setItem('user', JSON.stringify(newUserData));
    };

    const logout = () => {
        setUser(null);
        sessionStorage.removeItem('user');
    };

    return (
        <UserContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};
