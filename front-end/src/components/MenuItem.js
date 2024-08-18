import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import { CDBSidebarMenuItem } from 'cdbreact';
import '../styles/BottomNav.css';

const MenuItem = ({ icon, label, path, user, isSidebar, subItems = [] }) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
        if (subItems.length > 0) {
            setIsOpen(!isOpen);
        } else {
            if (user || path === '/') {
                navigate(path);
            } else {
                navigate('/login', { state: { showToast: true, message: 'You need to be logged in to access this page.', toastType: 'error' } });
            }
        }
    };

    const handleClickSubItem = (subItemPath) => {
        if (user) {
            navigate(subItemPath);
        } else {
            navigate('/login', { state: { showToast: true, message: 'You need to be logged in to access this page.', toastType: 'error' } });
        }
    };

    return (
        <div style={{ position: 'relative' }}>
            <div onClick={handleClick}>
                {isSidebar ? (
                    <CDBSidebarMenuItem icon={icon} className="sidebar-item">
                        {label}
                    </CDBSidebarMenuItem>
                ) : (
                    <Nav.Item>
                        <Nav.Link>
                            <i className={icon}></i>
                        </Nav.Link>
                    </Nav.Item>
                )}
            </div>

            {isOpen && !isSidebar && (
                <div className="bottom-nav-submenu">
                    {subItems.map((subItem, index) => (
                        <div key={index} className="bottom-nav-subitem" onClick={() => handleClickSubItem(subItem.path)}>
                            {subItem.label}
                        </div>
                    ))}
                </div>
            )}

            {isOpen && isSidebar && (
                <div style={{ paddingLeft: '20px' }}>
                    {subItems.map((subItem, index) => (
                        <div key={index} onClick={() => handleClickSubItem(subItem.path)}>
                            <CDBSidebarMenuItem icon={subItem.icon} className="sidebar-item">
                                {subItem.label}
                            </CDBSidebarMenuItem>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MenuItem;
