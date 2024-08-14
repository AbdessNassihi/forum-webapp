import React, { useState } from 'react';
import axios from 'axios';

const ServerStatusChecker = () => {
    const [status, setStatus] = useState('Unknown');
    const [loading, setLoading] = useState(false);

    const checkServerStatus = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8000/status'); // Ensure your server has a health endpoint
            if (response.status === 200) {
                setStatus('Running');
            } else {
                setStatus('Not Running');
            }
        } catch (error) {
            setStatus('Not Running');
            console.error('Error checking server status:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Server Status Checker</h1>
            <button onClick={checkServerStatus} disabled={loading}>
                {loading ? 'Checking...' : 'Check Server Status'}
            </button>
            <p>Server is: {status}</p>
        </div>
    );
};

export default ServerStatusChecker;
