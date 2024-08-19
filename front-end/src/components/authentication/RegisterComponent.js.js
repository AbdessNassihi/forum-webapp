import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apiCall } from '../../services/api';
import FormComponent from "../FormComponent";

const RegisterComponent = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        textuser: '',
    });

    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [alert, setAlert] = useState({
        message: 'Already a member?',
        class: "alert alert-light"
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: ''
        }));
    };

    const handleNavigateToLogin = () => {
        navigate('/login');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await apiCall('post', '/auth/register', formData);

            switch (response.status) {
                case 201:
                    setErrors({});
                    setSuccess(true);
                    setAlert({
                        message: 'Welcome! ',
                        class: "alert alert-success"
                    });
                    toast.success(response.data.message, { hideProgressBar: true, autoClose: 2000 });
                    break;
                case 400:
                    const errorObj = {};
                    response.data.errors.forEach(error => {
                        errorObj[error.path] = error.msg;
                    });
                    setErrors(errorObj);
                    break;
                case 500:
                    toast.error('A server side error has occured.', { hideProgressBar: true, autoClose: 2000 });
                    break;
                default:
                    toast.error('A server side error has occured.', { hideProgressBar: true, autoClose: 2000 });
                    break;
            }
        } catch (error) {
            toast.error('A server side error has occured.', { hideProgressBar: true, autoClose: 2000 });
        }
    };

    return (
        <form className="row g-3" onSubmit={handleSubmit}>
            <div className="col-12">
                <div className={alert.class} role="alert">
                    {alert.message} <span className="alert-link" style={{ cursor: 'pointer' }} onClick={handleNavigateToLogin}>navigate here to login.</span>
                </div>
            </div>

            <FormComponent
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                success={null}
                disabled={success}
            />

            <FormComponent
                placeholder="Username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                error={errors.username}
                success={null}
                disabled={success}
            />

            <FormComponent
                placeholder="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                error={errors.password}
                success={null}
                disabled={success}
            />

            <FormComponent
                placeholder="Describe yourself"
                name="textuser"
                value={formData.textuser}
                onChange={handleInputChange}
                error={errors.textuser}
                success={null}
                isTextarea
                disabled={success}
            />

            <div className="col-12 d-flex justify-content-center">
                <button className="btn btn-primary" type="submit" disabled={success}>Register</button>
            </div>
        </form>
    );
};

export default RegisterComponent;
