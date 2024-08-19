import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import BootstrapCard from 'react-bootstrap/Card';
import { toast } from 'react-toastify';
import { apiCall } from '../../services/api';
import useUserData from '../../hooks/useUserData';
import { UserContext } from '../../context/UserContext';
import Styles from '../../styles/Cards.module.css';
import CardComp from '../Card';

function ThreadCard({ thread, onDelete }) {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const { username, isAdmin } = useUserData(user, navigate);

    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        if (thread.subscribed_usernames) {
            setIsSubscribed(thread.subscribed_usernames.includes(username));
        }
    }, [thread, username]);

    const handleSubscribeClick = async () => {
        try {
            const response = await apiCall('post', `/subscription/${thread.idthread}`);
            if (response.status === 201) {
                setIsSubscribed(true);
                toast.success('Subscribed to thread successfully', { hideProgressBar: true, autoClose: 2000 });
            } else {
                toast.error('Failed to subscribe to thread', { hideProgressBar: true, autoClose: 2000 });
            }
        } catch (error) {
            toast.error('A server side error has occurred.', { hideProgressBar: true, autoClose: 2000 });
        }
    };

    const handleUnsubscribeClick = async () => {
        try {
            const response = await apiCall('delete', `/subscription/${thread.idthread}`);
            if (response.status === 200) {
                setIsSubscribed(false);
                toast.success(response.data.message, { hideProgressBar: true, autoClose: 2000 });
            } else {
                toast.error('Failed to unsubscribe from thread', { hideProgressBar: true, autoClose: 2000 });
            }
        } catch (error) {
            toast.error('A server side error has occurred.', { hideProgressBar: true, autoClose: 2000 });
        }
    };

    const handleDeleteClick = async () => {
        try {
            const response = await apiCall('delete', `/threads/${thread.idthread}`);
            if (response.status === 200) {
                toast.success(response.data.message, { hideProgressBar: true, autoClose: 2000 });
                onDelete(thread.idthread);
            } else {
                toast.error('Failed to delete thread', { hideProgressBar: true, autoClose: 2000 });
            }
        } catch (error) {
            toast.error('An error occurred while deleting the thread.', { hideProgressBar: true, autoClose: 2000 });
        }
    };

    const content = (
        <>
            <div className={Styles['header-footer-container']}>
                <BootstrapCard.Link href="#" onClick={() => navigate(`/profile/${thread.thread_username}`)} className={Styles['card-link']}>
                    {thread.thread_username}
                </BootstrapCard.Link>

                {thread.thread_username === username ? (
                    <BootstrapCard.Link className={Styles['thread-title']}>
                        Created by you
                    </BootstrapCard.Link>
                ) : (
                    <BootstrapCard.Link
                        href="#"
                        onClick={isSubscribed ? handleUnsubscribeClick : handleSubscribeClick}
                        className={Styles['thread-title']}
                    >
                        {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
                    </BootstrapCard.Link>
                )}

            </div>
            <BootstrapCard.Title>{thread.title}</BootstrapCard.Title>
            <BootstrapCard.Text>{thread.textthread}</BootstrapCard.Text>
        </>
    );

    const footer = (
        <div>
            <BootstrapCard.Link href="#" onClick={() => navigate(`/posts/${thread.idthread}/${thread.title}`)} className={Styles['card-link']} style={{ textDecoration: 'underline' }}>
                Explore
            </BootstrapCard.Link>
            {isAdmin && <BootstrapCard.Link href="#" onClick={handleDeleteClick} className={Styles['card-link']}>
                <FontAwesomeIcon icon={faTrashAlt} />
            </BootstrapCard.Link>}
        </div>
    );

    return <CardComp content={content} footer={footer} />;
}

export default ThreadCard;
