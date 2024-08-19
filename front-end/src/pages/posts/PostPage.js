import React, { useState, useEffect } from 'react';
import PostCard from '../../components/posts/PostCard';
import { apiCall } from '../../services/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';
import Comment from '../../components/comments/CommentCard';
import Layout from '../../components/Layout';

function Post() {
    const { idpost, title } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [updateComments, setUpdateComments] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPostAndComments = async () => {
            try {
                const postResponse = await apiCall('get', `/posts/${idpost}`);
                setPost(postResponse.data.post);

                const commentsResponse = await apiCall('get', `/posts/${idpost}/comments`);
                setComments(commentsResponse.data.comments);
            } catch (error) {
                toast.error('A server side error has occured.', { hideProgressBar: true, autoClose: 2000 });
            } finally {
                setLoading(false);
                setUpdateComments(false);
            }
        };
        fetchPostAndComments();
    }, [idpost, updateComments]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        if (!newComment.trim()) {
            toast.error('Comment cannot be empty.', { hideProgressBar: true, autoClose: 2000 });
            return;
        }

        try {
            const response = await apiCall('post', `/posts/${idpost}/comments`, { content: newComment });
            if (response.status === 201) {
                setUpdateComments(true);
                setNewComment('');
            } else {
                toast.error('A server side error has occured.', { hideProgressBar: true, autoClose: 2000 });
            }
        } catch (error) {
            toast.error('A server side error has occured.', { hideProgressBar: true, autoClose: 2000 });
        }
    };

    const handleDeleteComment = (commentId) => {
        setComments(comments.filter(comment => comment.idcom !== commentId));
    };

    let content;

    if (loading) {
        content = (
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        );
    } else {
        content = (
            <>
                <PostCard post={post} thread={null} />

                <form onSubmit={handleCommentSubmit} className="mb-4 d-flex align-items-center" style={{ width: '100%', marginTop: '10px' }}>
                    <input
                        id="comment"
                        className="form-control"
                        placeholder="Leave a Comment"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        style={{ marginRight: '10px' }}
                    />
                    <button type="submit" className="btn btn-primary">
                        post
                    </button>
                </form>

                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <Comment key={comment.idcom} comment={comment} onDelete={handleDeleteComment} />
                    ))
                ) : (
                    <p>No comments yet. Be the first to comment!</p>
                )}
            </>
        );
    }

    return (
        <Layout
            headerText={`Post: ${title}`}
            Content={content}
        />
    );
}

export default Post;
