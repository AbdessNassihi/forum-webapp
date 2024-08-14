import { useContext, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';

import { CDBSidebar, CDBSidebarHeader, CDBSidebarContent, CDBSidebarMenu, CDBSidebarMenuItem, CDBSidebarFooter } from 'cdbreact';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faSignInAlt } from '@fortawesome/free-solid-svg-icons';

import '../styles/SideNav.css';
import Logo from '../img/logo.png';

import { UserContext } from "../context/UserContext";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SideNav = () => {
    const { user, logout } = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        if (location.state?.showToast) {
            if (location.state.toastType === 'success') {
                toast.success(location.state.message, { hideProgressBar: true, autoClose: 2000 });
            } else if (location.state.toastType === 'error') {
                toast.error(location.state.message, { hideProgressBar: true, autoClose: 2000 });
            }
        }
    }, [location.state]);

    const handleAuth = () => {
        if (user) {
            axios.get('http://localhost:8000/auth/logout', {
                withCredentials: true,
                validateStatus: function (status) {
                    return status >= 200 && status < 500;
                }
            })
                .then(response => {
                    if (response.status === 200) {
                        logout();
                        navigate('/login', { state: { showToast: true, message: response.data.message, toastType: 'success', } });
                    }
                })
        }
        navigate('/login');
    }

    const handleNavigation = (path) => {
        if (user) { navigate(path); }
        else {
            navigate('/login', { state: { showToast: true, message: 'You need to be logged in to access this page.', toastType: 'error', } });
        }

    };



    return (
        <div className='sidebar-container' style={{ display: 'flex', height: '100vh', overflow: 'hidden', border: '1px solid #dfdfdf' }}>
            <ToastContainer />
            <CDBSidebar textColor="#000" backgroundColor="#ffffff">
                <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large sidebar-header-icon"></i>} style={{ border: 'none' }}>
                    <a href="/" className="sidebar-logo">
                        <img src={Logo} alt="Logo" className="logo-img" />
                        <span className="logo-text">Postit</span>
                    </a>
                </CDBSidebarHeader>

                <CDBSidebarContent className="sidebar-content">
                    <CDBSidebarMenu>
                        <div onClick={() => navigate('/')}>
                            <CDBSidebarMenuItem icon="home" className="sidebar-item">Home</CDBSidebarMenuItem>
                        </div>
                        <div onClick={() => handleNavigation('/explore')}>
                            <CDBSidebarMenuItem icon="compass" className="sidebar-item">Explore</CDBSidebarMenuItem>
                        </div>
                        <div onClick={(user) => handleNavigation('/create')}>
                            <CDBSidebarMenuItem icon="plus-circle" className="sidebar-item">Create</CDBSidebarMenuItem>
                        </div>
                        <div onClick={() => handleNavigation('/messages')}>
                            <CDBSidebarMenuItem icon="envelope" className="sidebar-item">
                                Messages
                                <Badge className="badge-spacing" bg="secondary">5</Badge>
                            </CDBSidebarMenuItem>
                        </div>
                        <div onClick={() => handleNavigation('/profile')}>
                            <CDBSidebarMenuItem
                                icon='user'
                                className="sidebar-item">
                                Profile
                            </CDBSidebarMenuItem>
                        </div>
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
