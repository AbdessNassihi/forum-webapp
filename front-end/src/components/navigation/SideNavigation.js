import { CDBSidebar, CDBSidebarHeader, CDBSidebarContent, CDBSidebarMenu, CDBSidebarFooter } from 'cdbreact';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';
import NavigationItem from './NavigationItems';
import useAuthNavigation from '../../hooks/useAuthNavigation';
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Logo from '../../img/logo.png';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/SideNav.css';


const SideNavigation = () => {
    const { user, handleAuth } = useAuthNavigation();
    const navigate = useNavigate();

    return (
        <div className="sidebar-container">
            <ToastContainer />
            <CDBSidebar textColor="#000" backgroundColor="#ffffff">
                <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large sidebar-header-icon"></i>} style={{ border: 'none' }}>
                    <div className="sidebar-logo" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}> {/* Use navigate for logo click */}
                        <img src={Logo} alt="Logo" className="logo-img" />
                        <span className="logo-text">Postit</span>
                    </div>
                </CDBSidebarHeader>

                <CDBSidebarContent className="sidebar-content">
                    <CDBSidebarMenu>
                        <NavigationItem icon="home" label="Home" path="/" user={user} isSidebar={true} onClick={() => navigate('/')} />
                        <NavigationItem icon="compass" label="Explore" path="/explore" user={user} isSidebar={true} onClick={() => navigate('/explore')} />
                        <NavigationItem
                            icon="plus-circle"
                            label="Create"
                            path="/create"
                            user={user}
                            isSidebar={true}
                            onClick={() => navigate('/create')}
                            subItems={[
                                { label: 'New Post', icon: 'fas fa-pencil-alt', path: '/create/post' },
                                { label: 'New Thread', icon: 'fas fa-comments', path: '/create/thread' }
                            ]}
                        />
                        <NavigationItem icon="user" label="Profile" path="/profile" user={user} isSidebar={true} onClick={() => navigate('/profile')} />
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

export default SideNavigation;
