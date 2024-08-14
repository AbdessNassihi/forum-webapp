import { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../context/UserContext";
import axios from 'axios';


const LoginComponent = () => {

    const { login } = useContext(UserContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const [errors, setErrors] = useState({});
    const [alert, setAlert] = useState({ message: 'Not a member yet?', class: "alert alert-light", href: 'http://localhost:3000/register' });



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post('http://localhost:8000/auth/login', formData, {
            withCredentials: true,
            validateStatus: function (status) {
                return status >= 200 && status < 500;
            }
        })
            .then(response => {
                switch (response.status) {
                    case 200:
                        setErrors({});
                        login(response.data.user.iduser);
                        navigate('/', { state: { showToast: true, message: response.data.message, toastType: 'success', } });
                        break;
                    case 401:
                        const errorObj = {};
                        response.data.errors.forEach(error => {
                            errorObj[error.path] = error.msg;
                        });
                        setErrors(errorObj);
                        if (errorObj.username) {
                            setFormData({
                                ...formData,
                                password: '',
                            });
                        }
                        break;
                    case 500:
                        setAlert({ message: 'An error occurred. Please try again later.', class: "alert alert-light", href: '' });
                        break;
                }
            }).catch(error => {
                setAlert({ message: 'An error occurred. Please try again later.', class: "alert alert-light", href: '' });
            });
    };

    return (
        <>

            <form className="row g-3" onSubmit={handleSubmit}>
                <div className="col-12">
                    <div className={alert.class} role="alert">
                        {alert.message} {alert.href && <a href={alert.href} className="alert-link">navigate here to register.</a>}
                    </div>
                </div>

                <div className="col-12">
                    <label htmlFor="validationServerUsername" className="form-label">Username</label>
                    <input
                        type="text"
                        className={`form-control ${errors.username ? 'is-invalid' : 'is-valid'}`}
                        id="validationServerUsername"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                    {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                </div>
                <div className="col-12">
                    <label htmlFor="validationServerPassword" className="form-label">Password</label>
                    <input
                        type="password"
                        className={`form-control ${errors.password ? 'is-invalid' : 'is-valid'}`}
                        id="validationServerPassword"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>
                <div className="col-12 d-flex justify-content-center">
                    <button className="btn btn-primary" type="submit">Login</button>
                </div>
            </form>
        </>
    );
};

export default LoginComponent;
