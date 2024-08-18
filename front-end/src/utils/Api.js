import axios from 'axios';

const axiosInstance = axios.create({
    withCredentials: true,
    baseURL: 'http://localhost:8000',
    validateStatus: (status) => status >= 200 && status < 500,
});

export const apiCall = async (method, url, data = null, config = {}) => {
    try {
        const response = await axiosInstance({
            method,
            url,
            data,
            ...config
        });
        return response;
    } catch (error) {
        throw error;
    }
};
