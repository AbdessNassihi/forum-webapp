import React, { useState, useEffect } from "react";
import PostCard from './PostCard';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apiCall } from '../utils/Api';

const ThreadPostsComp = ({ idthread }) => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loadingPosts, setLoadingPosts] = useState(true);

    useEffect(() => {

        const fetchPosts = async () => {
            try {
                const response = await apiCall('get', `/threads/${idthread}/posts`);
                setPosts(response.data.posts);
            } catch (error) {
                toast.error('An error occurred. Please try again later.', { hideProgressBar: true, autoClose: 2000 });
            } finally {
                setLoadingPosts(false);
            }
        };
        fetchPosts();

    }, [idthread]);

    const handleDeletePost = (postId) => {
        setPosts(posts.filter(post => post.idpost !== postId));
    };


    return (
        <div className="container">
            <div className="main-body">
                <div className="row">
                    <div className="col-12 mt-4">
                        {loadingPosts ? (
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        ) : (
                            <>{
                                posts.length > 0 ? (
                                    posts.map((post) => (
                                        <PostCard post={post} onDelete={handleDeletePost} />
                                    ))
                                ) : (
                                    <div className="alert alert-light" role="alert">
                                        No posts in this thread.
                                    </div>
                                )
                            }
                            </>)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThreadPostsComp;
