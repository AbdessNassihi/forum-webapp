import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FormElement from './FormGroup';
import useUserData from '../hooks/useUserData';
import { apiCall } from '../utils/Api';

const PostCreationForm = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const { followedThreads, createdThreads, isLoading } = useUserData(user, navigate);

    const [formData, setFormData] = useState({
        selectedThread: '',
        postTitle: '',
        postContent: '',
    });
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
        setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.selectedThread) newErrors.selectedThread = 'Please select a thread';
        if (!formData.postTitle) newErrors.postTitle = 'Please enter a title';
        if (!formData.postContent) newErrors.postContent = 'Please enter content';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await apiCall('post', `threads/${formData.selectedThread}/posts`, {
                title: formData.postTitle,
                content: formData.postContent,
            });

            if (response.status === 201) {
                navigate('/', { state: { showToast: true, message: response.data.message, toastType: 'success' } });
            } else {
                toast.error('Failed to create post', { hideProgressBar: true, autoClose: 2000 });
            }
        } catch (error) {
            toast.error('An error occurred. Please try again later.', { hideProgressBar: true, autoClose: 2000 });
        }
    };

    if (isLoading) {
        return <div className="d-flex justify-content-center mt-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>;
    }

    return (
        <div className="container mt-5">
            <form onSubmit={handleSubmit}>
                <FormElement
                    placeholder="Select Thread"
                    name="selectedThread"
                    value={formData.selectedThread}
                    onChange={handleInputChange}
                    error={errors.selectedThread}
                    isSelect={true}
                    options={[
                        ...followedThreads.map(thread => ({
                            value: thread.idthread,
                            label: thread.title
                        })),
                        ...createdThreads.map(thread => ({
                            value: thread.idthread,
                            label: thread.title
                        }))
                    ]}
                />

                <FormElement
                    placeholder="Post Title"
                    name="postTitle"
                    value={formData.postTitle}
                    onChange={handleInputChange}
                    error={errors.postTitle}
                />

                <FormElement
                    placeholder="Content"
                    name="postContent"
                    value={formData.postContent}
                    onChange={handleInputChange}
                    error={errors.postContent}
                    isTextarea={true}
                />

                <button type="submit" className="btn btn-primary">Create Post</button>
            </form>
        </div>
    );
};

export default PostCreationForm;
