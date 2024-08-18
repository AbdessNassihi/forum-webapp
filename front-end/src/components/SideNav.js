import { useContext, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import MenuItem from "./MenuItem";
import { CDBSidebar, CDBSidebarHeader, CDBSidebarContent, CDBSidebarMenu, CDBSidebarFooter } from 'cdbreact';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import '../styles/SideNav.css';
import Logo from '../img/logo.png';
import { UserContext } from "../context/UserContext";
import { apiCall } from '../utils/Api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SideNav = () => {
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

    return (
        <div className="sidebar-container">
            <ToastContainer />
            <CDBSidebar textColor="#000" backgroundColor="#ffffff">
                <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large sidebar-header-icon"></i>} style={{ border: 'none' }}>
                    <div className="sidebar-logo" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
                        <img src={Logo} alt="Logo" className="logo-img" />
                        <span className="logo-text">Postit</span>
                    </div>
                </CDBSidebarHeader>

                <CDBSidebarContent className="sidebar-content">
                    <CDBSidebarMenu>
                        <MenuItem icon="home" label="Home" path="/" user={user} isSidebar={true} />
                        <MenuItem icon="compass" label="Explore" path="/explore" user={user} isSidebar={true} />
                        <MenuItem
                            icon="plus-circle"
                            label="Create"
                            path="/create"
                            user={user}
                            isSidebar={true}
                            subItems={[
                                { label: 'New Post', icon: 'fas fa-pencil-alt', path: '/create/post' },
                                { label: 'New Thread', icon: 'fas fa-comments', path: '/create/thread' }
                            ]}
                        />
                        <MenuItem icon="user" label="Profile" path="/profile" user={user} isSidebar={true} />
                    </CDBSidebarMenu>
                </CDBSidebarContent>

                <CDBSidebarFooter className="sidebar-footer">
                    <div className="footer-content">
                        <Button variant="dark" className="logout-button" onClick={handleAuth}>
                            <FontAwesomeIcon icon={user ? faSignOutAlt : faSignInAlt} /> {user ? 'Logout' : 'Login'}
                        </Button>
                    </div>
                </CDBSidebarFooter>
            </CDBSidebar>
        </div>
    );
};

export default SideNav;
