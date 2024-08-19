import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import FormComponent from '../FormComponent';
import { apiCall } from '../../services/api';

const ThreadUpdating = ({ id, initialTitle }) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ threadTitle: initialTitle });
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
        setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.threadTitle) newErrors.title = 'Please enter a title';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await apiCall('put', `/threads/title/${id}`, {
                title: formData.threadTitle,
            });

            if (response.status === 200) {
                navigate('/profile', { state: { showToast: true, message: response.data.message, toastType: 'success' } });
            } else if (response.status === 400) {

                const errorObj = {};
                response.data.errors.forEach(error => {
                    errorObj[error.path] = error.msg;
                });
                setErrors(errorObj);
            } else {
                toast.error('Failed to update thread', { hideProgressBar: true, autoClose: 2000 });
            }
        } catch (error) {
            toast.error('A server side error has occured.', { hideProgressBar: true, autoClose: 2000 });
        }
    };

    return (
        <div className="container mt-5">
            <form onSubmit={handleSubmit}>
                <FormComponent
                    name="threadTitle"
                    value={formData.threadTitle}
                    onChange={handleInputChange}
                    error={errors.title}
                />
                <button type="submit" className="btn btn-primary">Update Thread</button>
            </form>
        </div>
    );
};

export default ThreadUpdating;
