import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const ProtectedRoute = ({ element }) => {
    const { user, loading } = useContext(UserContext);

    if (loading) {
        return <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>;
    }

    if (!user) {
        return <Navigate to="/login" state={{ showToast: true, message: 'You need to be logged in to access this page.', toastType: 'error' }} />;
    }

    return element;
};

export default ProtectedRoute;
