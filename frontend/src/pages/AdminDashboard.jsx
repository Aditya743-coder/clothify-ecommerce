import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import useMobile from '../hooks/useMobile';

const AdminDashboard = () => {
    const { token, user } = useAuth();
    const isMobile = useMobile(768);
    const [activeTab, setActiveTab] = useState('users');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user && user.is_admin) {
            fetchData(activeTab);
        }
    }, [activeTab, user]);

    const fetchData = async (tab) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`/api/admin/${tab}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(response.data);
        } catch (err) {
            setError(err.response?.data?.error || `Failed to fetch ${tab}`);
        } finally {
            setLoading(false);
        }
    };

    if (!user || !user.is_admin) return <div className="container" style={{ padding: '40px', textAlign: 'center' }}>Unauthorized Access</div>;

    const TabBtn = ({ id, label }) => (
        <button 
            onClick={() => setActiveTab(id)}
            style={{
                padding: '12px 24px',
                border: 'none',
                background: activeTab === id ? '#000' : 'transparent',
                color: activeTab === id ? '#fff' : '#666',
                borderRadius: '12px',
                fontWeight: '900',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                marginRight: '10px'
            }}
        >
            {label.toUpperCase()}
        </button>
    );

    return (
        <div className="container" style={{ padding: isMobile ? '30px 16px' : '60px 40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
                <h1 style={{ fontSize: isMobile ? '28px' : '36px', fontWeight: '900', margin: 0 }}>ADMIN DASHBOARD</h1>
                <div style={{ display: 'flex', background: '#f5f5f5', padding: '6px', borderRadius: '16px' }}>
                    <TabBtn id="users" label="Users" />
                    <TabBtn id="products" label="Products" />
                    <TabBtn id="orders" label="Orders" />
                </div>
            </div>

            {loading ? (
                <div style={{ padding: '100px', textAlign: 'center', color: '#888' }}>Loading {activeTab}...</div>
            ) : error ? (
                <div style={{ padding: '40px', background: '#fff5f5', color: '#ff4d4d', borderRadius: '16px', textAlign: 'center' }}>{error}</div>
            ) : (
                <div style={{ 
                    background: '#fff', 
                    borderRadius: '24px', 
                    boxShadow: '0 20px 60px rgba(0,0,0,0.05)', 
                    overflowX: 'auto',
                    padding: isMobile ? '10px' : '20px'
                }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #f5f5f5' }}>
                                {activeTab === 'users' && <>
                                    <th style={thStyle}>ID</th>
                                    <th style={thStyle}>USERNAME</th>
                                    <th style={thStyle}>EMAIL</th>
                                    <th style={thStyle}>ROLE</th>
                                </>}
                                {activeTab === 'products' && <>
                                    <th style={thStyle}>ID</th>
                                    <th style={thStyle}>NAME</th>
                                    <th style={thStyle}>PRICE</th>
                                    <th style={thStyle}>STOCK</th>
                                    <th style={thStyle}>CATEGORY</th>
                                </>}
                                {activeTab === 'orders' && <>
                                    <th style={thStyle}>ID</th>
                                    <th style={thStyle}>CUSTOMER</th>
                                    <th style={thStyle}>TOTAL</th>
                                    <th style={thStyle}>STATUS</th>
                                    <th style={thStyle}>DATE</th>
                                </>}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid #f9f9f9', transition: 'background 0.2s' }}>
                                    {activeTab === 'users' && <>
                                        <td style={tdStyle}>{item.id}</td>
                                        <td style={{ ...tdStyle, fontWeight: '700' }}>{item.username}</td>
                                        <td style={tdStyle}>{item.email}</td>
                                        <td style={tdStyle}>{item.is_admin ? 'Admin' : 'User'}</td>
                                    </>}
                                    {activeTab === 'products' && <>
                                        <td style={tdStyle}>{item.id}</td>
                                        <td style={{ ...tdStyle, fontWeight: '700' }}>{item.name}</td>
                                        <td style={tdStyle}>₹{item.price}</td>
                                        <td style={tdStyle}>{item.stock}</td>
                                        <td style={tdStyle}>{item.category}</td>
                                    </>}
                                    {activeTab === 'orders' && <>
                                        <td style={tdStyle}>{item.id}</td>
                                        <td style={tdStyle}>
                                            <div style={{ fontWeight: '700' }}>{item.username}</div>
                                            <div style={{ fontSize: '11px', color: '#888' }}>{item.email}</div>
                                        </td>
                                        <td style={{ ...tdStyle, fontWeight: '700' }}>₹{item.total_price}</td>
                                        <td style={tdStyle}>
                                            <span style={{ 
                                                padding: '4px 10px', 
                                                borderRadius: '20px', 
                                                fontSize: '10px', 
                                                fontWeight: '900',
                                                background: item.status === 'completed' ? '#e6fffa' : '#fff5f5',
                                                color: item.status === 'completed' ? '#319795' : '#e53e3e'
                                            }}>
                                                {item.status?.toUpperCase().replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                        <td style={tdStyle}>{new Date(item.created_at).toLocaleDateString()}</td>
                                    </>}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

const thStyle = { padding: '20px 15px', fontSize: '11px', fontWeight: '900', color: '#aaa', letterSpacing: '1px' };
const tdStyle = { padding: '20px 15px', fontSize: '13px', color: '#1a1a1a' };

export default AdminDashboard;
