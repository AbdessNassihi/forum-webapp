import { useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import { UserContext } from "../context/UserContext";
import MenuItem from './MenuItem';
import '../styles/BottomNav.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { faSignOutAlt, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { apiCall } from '../utils/Api';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const BottomNav = () => {
    const { user, logout } = useContext(UserContext);
    const navigate = useNavigate();

    const location = useLocation();

    useEffect(() => {
        if (location.state?.showToast) {
            const { toastType, message } = location.state;
            toast[toastType](message, { hideProgressBar: true, autoClose: 2000 });
        }
    }, [location.state]);

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

    return (
        <>
            <ToastContainer />
            <Navbar fixed="bottom" bg="light" variant="light" className="bottom-nav">
                <Nav className="w-100 justify-content-around">
                    <MenuItem icon="fas fa-home" label="Home" path="/" user={user} />
                    <MenuItem icon="fas fa-compass" label="Explore" path="/explore" user={user} />
                    <MenuItem
                        icon="fas fa-plus-square"
                        label="Create"
                        path="/create"
                        user={user}
                        subItems={[
                            { label: 'Post', path: '/create/post' },
                            { label: 'Thread', path: '/create/thread' }
                        ]}
                    />
                    <MenuItem icon="fas fa-user" label="Profile" path="/profile" user={user} />
                    <div style={{ marginTop: '8px' }} >
                        <Button variant="dark" className="logout-button" onClick={handleAuth}>
                            <FontAwesomeIcon icon={user ? faSignOutAlt : faSignInAlt} />
                        </Button>
                    </div>
                </Nav>
            </Navbar>
        </>
    );
};

export default BottomNav;
