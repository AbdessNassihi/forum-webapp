import React, { useContext, useState, useEffect } from 'react';
import ThreadCard from '../../components/threads/ThreadCard';
import Layout from '../../components/Layout';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { apiCall } from '../../services/api';
import { toast } from 'react-toastify';

function ExploreComponent() {
    const { user, loading } = useContext(UserContext);
    const navigate = useNavigate();
    const [threads, setThreads] = useState([]); // Initialize as an empty array
    const [loadingThreads, setloadingThreads] = useState(true);

    useEffect(() => {
        if (user) {
            const fetchThreads = async () => {
                try {
                    const response = await apiCall('get', '/threads');
                    setThreads(response.data.threads);
                } catch (error) {
                    toast.error('A server side error has occured.', { hideProgressBar: true, autoClose: 2000 });
                } finally {
                    setloadingThreads(false);
                }
            };
            fetchThreads();
        } else {
            setloadingThreads(false);
        }
    }, [user]);

    const handleDeleteThread = (threadId) => {
        setThreads(threads.filter(thread => thread.idthread !== threadId));
    };

    return (
        <Layout
            headerText="Explore the threads"
            isThread={true}
            Content={
                loading || loadingThreads ? (
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                ) : (
                    threads.length > 0 ? (
                        threads.map((thread) => {
                            return <ThreadCard key={thread.idthread} thread={thread} onDelete={handleDeleteThread} />;
                        })
                    ) : (
                        <div className="alert alert-light" role="alert">
                            Be the first to {' '}
                            <button
                                className="btn btn-link p-0 m-0 align-baseline"
                                onClick={() => navigate('/create/thread')}
                                style={{ textDecoration: 'none' }}
                            >
                                create
                            </button>
                            {' '} a thread.
                        </div>
                    )
                )
            }
        />
    );
}

export default ExploreComponent;
