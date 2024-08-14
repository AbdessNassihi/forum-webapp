import React from 'react';
import BottomNav from '../components/BottomNav';
import SideNav from '../components/SideNav';
import { useMediaQuery } from 'react-responsive';


import '../styles/Layout.css';

function Layout({ Content, headerText }) {
    const isSidebar = useMediaQuery({ minWidth: 675 });

    return (
        <>
            <div className="app-container">
                <div className="sidebar-container">
                    {isSidebar && <SideNav />}
                </div>
                <div className='main-content'>
                    <div className='post-container'>
                        <header className='feed-header'>
                            <h5>{headerText}</h5>
                            <hr />
                        </header>
                        {Content}
                    </div>
                </div>
                {!isSidebar && <BottomNav />}
            </div>
        </>
    );
}

export default Layout;
