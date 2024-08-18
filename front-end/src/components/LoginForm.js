import React, { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../context/UserContext";
import { toast } from 'react-toastify';
import { apiCall } from '../utils/Api';
import FormElement from "./FormGroup";

const LoginComponent = () => {
    const { login } = useContext(UserContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const [errors, setErrors] = useState({});
    const [alert] = useState({
        message: 'Not a member yet?',
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

    const handleNavigateToRegister = () => {
        navigate('/register');
    };
    const validateForm = () => {
        const newErrors = {};
        if (!formData.username) newErrors.username = 'Please provide a username';
        if (!formData.password) newErrors.password = 'Please provide a password';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await apiCall('post', '/auth/login', formData);

            switch (response.status) {
                case 200:
                    setErrors({});
                    login(response.data.user.iduser);
                    navigate('/', {
                        state: {
                            showToast: true,
                            message: response.data.message,
                            toastType: 'success'
                        }
                    });
                    break;

                case 401:
                    const errorObj = {};
                    response.data.errors.forEach(error => {
                        errorObj[error.path] = error.msg;
                    });
                    setErrors(errorObj);
                    if (errorObj.username) {
                        setFormData((prevData) => ({
                            ...prevData,
                            password: '',
                        }));
                    }
                    break;

                case 500:
                    toast.error('An error occurred, please try again later', {
                        hideProgressBar: true,
                        autoClose: 2000
                    });
                    break;

                default:
                    toast.error('Unexpected error, please try again later', {
                        hideProgressBar: true,
                        autoClose: 2000
                    });
                    break;
            }
        } catch (error) {
            toast.error('An error occurred, please try again later', {
                hideProgressBar: true,
                autoClose: 2000
            });
        }
    };

    return (
        <>
            <form className="row g-3" onSubmit={handleSubmit}>
                <div className="col-12">
                    <div className={alert.class} role="alert">
                        {alert.message} <span className="alert-link" style={{ cursor: 'pointer' }} onClick={handleNavigateToRegister}>navigate here to register.</span>
                    </div>
                </div>

                <FormElement
                    placeholder="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    error={errors.username}

                />

                <FormElement
                    placeholder="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    error={errors.password}

                />

                <div className="col-12 d-flex justify-content-center">
                    <button className="btn btn-primary" type="submit">Login</button>
                </div>
            </form>
        </>
    );
};

export default LoginComponent;
