import React, { useContext } from 'react';
import PostCard from '../components/PostCard';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

function Home() {

    const { user, loading } = useContext(UserContext);
    const navigate = useNavigate();

    return (
        <Layout
            headerText="Your Feed"
            Content={
                loading ? (
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                ) : user ? (
                    <PostCard />
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
