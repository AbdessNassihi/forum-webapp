import { useContext, useState, useEffect } from 'react';
import PostCard from '../components/posts/PostCard';
import Layout from '../components/Layout';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { apiCall } from '../services/api';

function Home() {
    const { user, loading } = useContext(UserContext);
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loadingPosts, setLoadingPosts] = useState(true);

    useEffect(() => {
        if (user) {
            const fetchPosts = async () => {
                try {
                    const response = await apiCall('get', '/posts');
                    setPosts(response.data.posts);
                } catch (error) {
                    toast.error('An server side error has occured.', { hideProgressBar: true, autoClose: 2000 });
                } finally {
                    setLoadingPosts(false);
                }
            };
            fetchPosts();
        } else {
            setLoadingPosts(false);
        }
    }, [user]);

    const handleDeletePost = (postId) => {
        setPosts(posts.filter(post => post.idpost !== postId));
    };


    return (
        <Layout
            headerText="Your Feed"
            Content={
                loading || loadingPosts ? (
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                ) : user ? (
                    posts.length > 0 ? (
                        posts.map((post) => {
                            return <PostCard post={post} onDelete={handleDeletePost} />;
                        })
                    ) : (
                        <div className="alert alert-light" role="alert">
                            <button
                                className="btn btn-link p-0 m-0 align-baseline"
                                onClick={() => navigate('/explore')}
                                style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}
                            >
                                Subscribe
                            </button>
                            {' '}to threads or follow a user to see some posts.
                        </div>

                    )
                ) : (
                    <div className="alert alert-light" role="alert">
                        Please {' '}
                        <button
                            className="btn btn-link p-0 m-0 align-baseline"
                            onClick={() => navigate('/login')}
                            style={{ textDecoration: 'none' }}
                        >
                            Login
                        </button>
                        {' '} into your account.
                    </div>
                )
            }
        />
    );
}

export default Home;
