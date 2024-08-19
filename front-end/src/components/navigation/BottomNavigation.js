import { Navbar, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';
import MenuItem from './NavigationItems';
import useAuthNavigation from '../../hooks/useAuthNavigation';
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/BottomNav.css';

const BottomNavigation = () => {
    const { user, handleAuth } = useAuthNavigation();
    const navigate = useNavigate();

    return (
        <>
            <ToastContainer />
            <Navbar fixed="bottom" bg="light" variant="light" className="bottom-nav">
                <Nav className="w-100 justify-content-around">
                    <MenuItem icon="fas fa-home" label="Home" path="/" user={user} onClick={() => navigate('/')} />
                    <MenuItem icon="fas fa-compass" label="Explore" path="/explore" user={user} onClick={() => navigate('/explore')} />
                    <MenuItem
                        icon="fas fa-plus-square"
                        label="Create"
                        path="/create"
                        user={user}
                        onClick={() => navigate('/create')}
                        subItems={[
                            { label: 'Post', path: '/create/post' },
                            { label: 'Thread', path: '/create/thread' }
                        ]}
                    />
                    <MenuItem icon="fas fa-user" label="Profile" path="/profile" user={user} onClick={() => navigate('/profile')} />
                    <div style={{ marginTop: '8px' }}>
                        <Button variant="dark" className="logout-button" onClick={handleAuth}>
                            <FontAwesomeIcon icon={user ? faSignOutAlt : faSignInAlt} />
                        </Button>
                    </div>
                </Nav>
            </Navbar>
        </>
    );
};

export default BottomNavigation;
