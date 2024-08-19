import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faCommentAlt, faStar as faStarRegular, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import BootstrapCard from 'react-bootstrap/Card';
import { toast } from 'react-toastify';
import { formatDistanceToNow } from 'date-fns';
import { apiCall } from '../../services/api';
import useUserData from '../../hooks/useUserData';
import { UserContext } from '../../context/UserContext';
import Styles from '../../styles/Cards.module.css';
import CardComp from '../Card';

function PostCard({ post, onDelete }) {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const { username, isAdmin } = useUserData(user, navigate);

    const [likes, setLikes] = useState(post.num_likes);
    const [pinned, setPinned] = useState(post.pinned);
    const postDate = new Date(post.time);
    const timeAgo = formatDistanceToNow(postDate, { addSuffix: true });
    const date = `${postDate.toLocaleDateString().replace(/,/g, '')} ${postDate.toLocaleTimeString('en-US', { hour12: false, })}`;

    const handleLikeClick = async () => {
        try {
            const response = await apiCall('post', `/posts/${post.idpost}/like`);
            if (response.status === 200) {
                setLikes((prevLikes) => prevLikes + 1);
            } else {
                toast.info('Post already liked', { hideProgressBar: true, autoClose: 2000 });
            }
        } catch (error) {
            toast.error('A server side error has occured.', { hideProgressBar: true, autoClose: 2000 });
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
            toast.error('A server side error has occured.', { hideProgressBar: true, autoClose: 2000 });
        }
    };

    const handleDeleteClick = async () => {
        try {
            const response = await apiCall('delete', `/posts/${post.idpost}`);
            if (response.status === 200) {
                toast.success(response.data.message, { hideProgressBar: true, autoClose: 2000 });
                onDelete(post.idpost);
            } else {
                toast.error('Failed to delete post', { hideProgressBar: true, autoClose: 2000 });
            }
        } catch (error) {
            toast.error('A server side error has occured.', { hideProgressBar: true, autoClose: 2000 });
        }
    };

    const content = (
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
    );

    const footer = (
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
    );

    return <CardComp content={content} footer={footer} />;
}

export default PostCard;
