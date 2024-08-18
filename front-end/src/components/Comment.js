import { useState, useContext } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { useNavigate } from 'react-router-dom';
import BootstrapCard from 'react-bootstrap/Card';
import Styles from '../styles/Cards.module.css';
import useUserData from '../hooks/useUserData';
import { apiCall } from '../utils/Api';
import { toast } from 'react-toastify';
import { UserContext } from '../context/UserContext';

const Comment = ({ comment, onDelete }) => {
    const navigate = useNavigate();
    const [likes, setLikes] = useState(comment.num_likes);
    const commentDate = new Date(comment.time);
    const timeAgo = formatDistanceToNow(commentDate, { addSuffix: true });
    const { user } = useContext(UserContext);
    const { isAdmin } = useUserData(user, navigate);

    const handleLikeClick = async () => {
        try {
            const response = await apiCall('post', `/comments/${comment.idcom}/like`);
            if (response.status === 200) {
                setLikes(likes + 1);
            } else {
                toast.info('Comment already liked', { hideProgressBar: true, autoClose: 2000 });
            }
        } catch (error) {
            toast.error('An error occurred, please try again later.', { hideProgressBar: true, autoClose: 2000 });
        }
    };

    const handleDeleteClick = async () => {
        try {
            const response = await apiCall('delete', `/comments/${comment.idcom}`);
            if (response.status === 200) {
                toast.success('Comment deleted successfully', { hideProgressBar: true, autoClose: 2000 });
                if (onDelete) onDelete(comment.idcom);
            } else {
                toast.error('Failed to delete comment', { hideProgressBar: true, autoClose: 2000 });
            }
        } catch (error) {
            toast.error('An error occurred while deleting the comment.', { hideProgressBar: true, autoClose: 2000 });
        }
    };

    const content = (
        <>
            <div className={Styles['header-footer-container']}>
                <BootstrapCard.Link href="#" onClick={() => navigate(`/profile/${comment.comment_username}`)} className={Styles['card-link']}>
                    {comment.comment_username}
                </BootstrapCard.Link>
            </div>
            <BootstrapCard.Text>{comment.content}</BootstrapCard.Text>
        </>
    );

    const footer = (
        <div className={Styles['header-footer-container']}>
            <div>
                <BootstrapCard.Link href="#" onClick={handleLikeClick} className={Styles['card-link']}>
                    <FontAwesomeIcon icon={faHeart} /> {likes}
                </BootstrapCard.Link>
                {isAdmin && (
                    <BootstrapCard.Link href="#" onClick={handleDeleteClick} className={Styles['card-link']}>
                        <FontAwesomeIcon icon={faTrashAlt} />
                    </BootstrapCard.Link>
                )}
            </div>
            <BootstrapCard.Text className={Styles['card-date']}>{timeAgo}</BootstrapCard.Text>
        </div>
    );

    return (
        <BootstrapCard className={Styles.commentcard}>
            <BootstrapCard.Body>
                {content}
                {footer}
            </BootstrapCard.Body>
        </BootstrapCard>
    );
};

export default Comment;
