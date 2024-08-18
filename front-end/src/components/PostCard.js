import CardComp from './Card';
import { useState, useContext, useEffect } from 'react';
import { apiCall } from '../utils/Api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faCommentAlt, faStar as faStarRegular, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import Styles from '../styles/Cards.module.css';
import BootstrapCard from 'react-bootstrap/Card';
import useUserData from '../hooks/useUserData';
import { UserContext } from "../context/UserContext";
import { formatDistanceToNow } from 'date-fns';

function PostCard({ post, thread, onDelete }) {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const { username, isAdmin } = useUserData(user, navigate);

    const [likes, setLikes] = useState(post ? post.num_likes : 0);
    const [pinned, setPinned] = useState(post ? post.pinned : 0);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const postDate = post ? new Date(post.time) : new Date();
    const timeAgo = formatDistanceToNow(postDate, { addSuffix: true });
    const date = `${postDate.toLocaleDateString().replace(/,/g, '')} ${postDate.toLocaleTimeString('en-US', { hour12: false, })}`;

    useEffect(() => {
        if (thread && thread.subscribed_usernames) {
            setIsSubscribed(thread.subscribed_usernames.includes(username));
        }
    }, [thread, username]);

    const handleLikeClick = async () => {
        try {
            const response = await apiCall('post', `/posts/${post.idpost}/like`);
            if (response.status === 200) {
                setLikes((prevLikes) => prevLikes + 1);
            } else {
                toast.info('Post already liked', { hideProgressBar: true, autoClose: 2000 });
            }
        } catch (error) {
            toast.error('An error occurred, please try again later.', { hideProgressBar: true, autoClose: 2000 });
        }
    };

    const handlePinClick = async () => {
        try {
            const newPinnedState = pinned === 1 ? 0 : 1;
            const response = await apiCall('put', `/posts/${post.idpost}/pinned/${newPinnedState}`);
            if (response.status === 200) {
                setPinned(newPinnedState);
            } else {
                toast.error('Failed to update pin status', { hideProgressBar: true, autoClose: 2000 });
            }
        } catch (error) {
            toast.error('An server error occured.', { hideProgressBar: true, autoClose: 2000 });
        }
    };
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
            toast.error('An server error occured.', { hideProgressBar: true, autoClose: 2000 });
        }
    };
    const handleUnsubscribeClick = async () => {
        try {
            const response = await apiCall('delete', `/subscription/${thread.idthread}`);
            if (response.status === 200) {
                setIsSubscribed(false);
                toast.success(response.data.message, { hideProgressBar: true, autoClose: 2000 });
            } else {
                toast.error('Failed to unsubscribe to thread', { hideProgressBar: true, autoClose: 2000 });
            }
        } catch (error) {
            toast.error('An server error occured', { hideProgressBar: true, autoClose: 2000 });
        }
    };
    const handleDeleteClick = async () => {
        try {
            let response;
            if (post) response = await apiCall('delete', `/posts/${post.idpost}`);
            else {

                response = await apiCall('delete', `/threads/${thread.idthread}`)
            };
            if (response.status === 200) {
                toast.success(response.data.message, { hideProgressBar: true, autoClose: 2000 });

                if (onDelete) {
                    if (post) {
                        onDelete(post.idpost);
                    } else if (thread) {
                        onDelete(thread.idthread);
                    }
                }
            } else {
                toast.error(post ? 'Failed to delete post' : 'Failed to delete thread', { hideProgressBar: true, autoClose: 2000 });
            }
        } catch (error) {
            toast.error('An error occurred while deleting the comment.', { hideProgressBar: true, autoClose: 2000 });
        }
    };


    const content = post ? (
        <>
            <div className={Styles['header-footer-container']}>

                {post.post_username ? (<BootstrapCard.Link href="#" onClick={() => navigate(`/profile/${post.post_username}`)} className={Styles['card-link']}> {post.post_username}</BootstrapCard.Link>) : `Posted on ${date}`}

                {username === post.thread_username ? (
                    <FontAwesomeIcon icon={pinned === 1 ? faStarSolid : faStarRegular} onClick={handlePinClick} style={{ cursor: 'pointer' }} />
                ) : (
                    post.thread_username ? (
                        <FontAwesomeIcon icon={pinned === 1 ? faStarSolid : faStarRegular} />

                    ) : (<BootstrapCard.Link href="#" onClick={() => navigate(`/posts/${post.idthread}/${post.thread_title}`)} className={Styles['thread-title']}>
                        {post.thread_title}
                    </BootstrapCard.Link>)
                )}
            </div>
            <BootstrapCard.Title>{post.title}</BootstrapCard.Title>
            <BootstrapCard.Text>{post.content}</BootstrapCard.Text>
        </>
    ) : (
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

    const footer = post ? (
        <div className={Styles['header-footer-container']}>
            <div>
                <BootstrapCard.Link onClick={handleLikeClick} className={Styles['card-link']}>
                    <FontAwesomeIcon icon={faHeart} /> {likes}
                </BootstrapCard.Link>
                <BootstrapCard.Link href="#" onClick={() => navigate(`/post/${post.idpost}/${post.title}`)} className={Styles['card-link']}>
                    <FontAwesomeIcon icon={faCommentAlt} /> {post.num_commentaries}
                </BootstrapCard.Link>
                {isAdmin && <BootstrapCard.Link href="#" onClick={handleDeleteClick} className={Styles['card-link']}>
                    <FontAwesomeIcon icon={faTrashAlt} />
                </BootstrapCard.Link>}
            </div>
            {post.post_username ? (
                <BootstrapCard.Text className={Styles['card-date']}>{timeAgo}</BootstrapCard.Text>
            ) : (
                <a
                    href="#"
                    style={{ textDecoration: 'underline', color: "blue", position: 'absolute', right: '0', paddingRight: '20px' }}
                    onClick={() => navigate(`/edit-post/${post.idpost}/${post.title}/${post.content}`)}
                >
                    Edit
                </a>
            )}
        </div>
    ) : (
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

export default PostCard;
