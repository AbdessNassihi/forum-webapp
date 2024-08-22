import { useState, useEffect } from "react";
import PostCard from "./PostCard";
import { toast } from 'react-toastify';
import { apiCall } from '../../services/api';

const PostsOfThread = ({ idthread }) => {
    const [posts, setPosts] = useState([]);
    const [loadingPosts, setLoadingPosts] = useState(true);

    useEffect(() => {

        const fetchPosts = async () => {
            try {
                const response = await apiCall('get', `/threads/${idthread}/posts`);
                setPosts(response.data.posts);
            } catch (error) {
                toast.error('A server side error has occured.', { hideProgressBar: true, autoClose: 2000 });
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
                                        <PostCard key={post.idpost} post={post} onDelete={handleDeletePost} />
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

export default PostsOfThread;
