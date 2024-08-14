import { useState, createContext, useContext } from "react";
import axios from 'axios';


const RegisterComponent = () => {

    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        textuser: '',
    });

    const [errors, setErrors] = useState({});
    const [succes, setSucces] = useState(false);
    const [alert, setAlert] = useState({ message: 'Already a member?', class: "alert alert-light", href: 'http://localhost:3000/login' });


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post('http://localhost:8000/auth/register', formData, {
            validateStatus: function (status) {
                return status >= 200 && status < 500;
            }
        })
            .then(response => {
                switch (response.status) {
                    case 201:
                        setErrors({});
                        setSucces(true);
                        setAlert({ message: 'Welcome! ', class: "alert alert-success", href: 'http://localhost:3000/login' });
                        break;
                    case 400:
                        const errorObj = {};
                        response.data.errors.forEach(error => {
                            errorObj[error.path] = error.msg;
                        });
                        setErrors(errorObj);
                        break;
                    case 500:
                        setAlert({ message: 'An error occurred. Please try again later.', class: "alert alert-light", href: '' });
                        break;
                }
            }).catch(error => {
                setAlert({ message: 'An error occurred. Please try again later.', href: '' });
            });
    };

    return (
        <form className="row g-3" onSubmit={handleSubmit}>

            <div className="col-12">
                <div className={alert.class} role="alert">
                    {alert.message} {alert.href && <a href={alert.href} className="alert-link">navigate here to login.</a>}
                </div>
            </div>


            <div className="col-12">
                <label htmlFor="validationServerEmail" className="form-label">Email</label>
                <input
                    type="text"
                    className={`form-control ${errors.email ? 'is-invalid' : 'is-valid'}`}
                    id="validationServerEmail"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={succes}
                    readonly={succes}

                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
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
                    disabled={succes}
                    readonly={succes}
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
                    disabled={succes}
                    readonly={succes}
                />
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>
            <div className="col-12">
                <label htmlFor="validationServerUserText" className="form-label">About you</label>
                <textarea
                    className="form-control"
                    id="validationServerUserText"
                    name="textuser"
                    value={formData.textuser}
                    onChange={handleChange}
                    disabled={succes}
                    readonly={succes}
                />
            </div>
            <div className="col-12 d-flex justify-content-center">
                <button className="btn btn-primary" type="submit">Register</button>
            </div>

        </form>

    );
};

export default RegisterComponent;
