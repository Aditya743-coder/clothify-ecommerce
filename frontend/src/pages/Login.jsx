import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useMobile from '../hooks/useMobile';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const isMobile = useMobile(768);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            alert(err.error || 'Login failed');
        }
    };

    return (
        <div style={{ 
            maxWidth: isMobile ? '100%' : '400px', 
            margin: isMobile ? '40px 16px' : '100px auto', 
            padding: isMobile ? '30px 20px' : '40px', 
            boxShadow: '0 20px 60px rgba(0,0,0,0.08)', 
            borderRadius: '24px',
            backgroundColor: '#fff'
        }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>Login</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: 'var(--radius)' }}
                        placeholder="admin@clothify.com"
                    />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: 'var(--radius)' }}
                        placeholder="admin123"
                    />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Sign In</button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '15px', color: 'var(--gray)' }}>
                Don't have an account? <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: '600' }}>Sign Up</Link>
            </p>
        </div>
    );
};

export default Login;
