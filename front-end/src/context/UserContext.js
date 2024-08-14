import { createContext, useState, useEffect } from 'react';
import axios from 'axios';


export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            setLoading(false);
        } else {
            axios.get('http://localhost:8000/auth/status', {
                withCredentials: true,
                validateStatus: function (status) {
                    return status >= 200 && status < 500;
                }
            })
                .then(response => {
                    if (response.status == 200) {
                        setUser(response.data.user.iduser);
                        sessionStorage.setItem('user', JSON.stringify(response.data.user.iduser));
                    }
                    setLoading(false);
                })
        }
    }, [user]);

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
