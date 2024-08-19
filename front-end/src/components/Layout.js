import React from 'react';
import BottomNavigation from './navigation/BottomNavigation';
import SideNavigation from './navigation/SideNavigation';
import PostCard from './posts/PostCard';
import ThreadCard from './threads/ThreadCard';
import { useMediaQuery } from 'react-responsive';
import '../styles/Layout.css';

function Layout({ Content, headerText, isThread }) {
    const isSidebar = useMediaQuery({ minWidth: 675 });

    return (
        <div className="app-container">
            <div className="sidebar-container">
                {isSidebar && <SideNavigation />}
            </div>
            <div className="main-content">
                <div className="post-container">
                    <header className="feed-header">
                        <h5>{headerText}</h5>
                        <hr />
                    </header>
                    {Array.isArray(Content) ? (
                        Content.map((item) => {
                            if (isThread && item.props.thread) {
                                return (
                                    <ThreadCard
                                        key={item.props.thread.idthread}
                                        thread={item.props.thread}
                                        onDelete={item.props.onDelete}
                                    />
                                );
                            } else if (item.props.post) {
                                return (
                                    <PostCard
                                        key={item.props.post.idpost}
                                        post={item.props.post}
                                        onDelete={item.props.onDelete}
                                    />
                                );
                            } else {
                                return null;
                            }
                        })
                    ) : (
                        Content
                    )}
                </div>
            </div>
            {!isSidebar && <BottomNavigation />}
        </div>
    );
}

export default Layout;
