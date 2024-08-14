import { Navbar, Nav } from 'react-bootstrap';

import Def_profile from '../img/default_ProfileImage.png';

import '../styles/BottomNav.css';

const BottomNav = () => {
    return (
        <Navbar fixed="bottom" bg="light" variant="light" className="bottom-nav">
            <Nav className="w-100 justify-content-around">
                <Nav.Item>
                    <Nav.Link href="#home">
                        <i className="fas fa-home"></i>
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="#explore">
                        <i className="fas fa-compass"></i>
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="#create">
                        <i className="fas fa-plus-square"></i>
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="#messages">
                        <i className="fas fa-envelope"></i>
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="#profile">
                        <img src={Def_profile} alt="Profile" className="profile-image" />
                    </Nav.Link>
                </Nav.Item>
            </Nav>
        </Navbar>
    );
};

export default BottomNav;
