import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import FormComponent from '../FormComponent';
import { apiCall } from '../../services/api';

const PostUpdating = ({ id, title, initialContent }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ postContent: initialContent });
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
        setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.postContent) newErrors.content = 'Please enter a content';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await apiCall('put', `/posts/content/${id}`, {
                content: formData.postContent,
            });

            if (response.status === 200) {
                navigate('/profile', { state: { showToast: true, message: response.data.message, toastType: 'success' } });
            } else {
                toast.error('Failed to update thread', { hideProgressBar: true, autoClose: 2000 });
            }
        } catch (error) {
            toast.error('A server side error has occured', { hideProgressBar: true, autoClose: 2000 });
        }
    };

    return (
        <div className="container mt-5">
            <form onSubmit={handleSubmit}>
                <FormComponent
                    name="threadTitle"
                    placeholder={title}
                    disabled
                />
                <FormComponent
                    name="postContent"
                    value={formData.postContent}
                    onChange={handleInputChange}
                    error={errors.content}
                    isTextarea
                />
                <button type="submit" className="btn btn-primary">Update Post</button>
            </form>
        </div>
    );
};

export default PostUpdating;
