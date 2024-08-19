// src/hooks/useAuthNavigation.js
import { useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserContext } from '../context/UserContext';
import { apiCall } from '../services/api';

const useAuthNavigation = () => {
    const { user, logout } = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state?.showToast) {
            const { toastType, message } = location.state;
            toast[toastType](message, { hideProgressBar: true, autoClose: 2000 });
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state, navigate, location.pathname]);

    const handleAuth = async () => {
        if (user) {
            try {
                const response = await apiCall('get', '/auth/logout');
                if (response.status === 200) {
                    logout();
                    navigate('/login', { state: { showToast: true, message: response.data.message, toastType: 'success' } });
                }
            } catch (error) {
                toast.error('Failed to log out. Please try again.', { hideProgressBar: true, autoClose: 2000 });
            }
        } else {
            navigate('/login');
        }
    };

    return { user, handleAuth };
};

export default useAuthNavigation;
