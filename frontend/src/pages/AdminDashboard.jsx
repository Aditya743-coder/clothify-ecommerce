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
    const [expandedRow, setExpandedRow] = useState(null);

    const tabs = [
        { id: 'users',    label: '👥 Users',    color: '#4361ee' },
        { id: 'products', label: '📦 Products', color: '#7209b7' },
        { id: 'orders',   label: '🛒 Orders',   color: '#f72585' },
        { id: 'cart',     label: '🛍️ Cart',     color: '#4cc9f0' },
    ];

    useEffect(() => {
        if (user && user.is_admin) fetchData(activeTab);
    }, [activeTab, user]);

    const fetchData = async (tab) => {
        setLoading(true);
        setError(null);
        setExpandedRow(null);
        try {
            const res = await axios.get(`/api/admin/${tab}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(res.data);
        } catch (err) {
            setError(err.response?.data?.error || `Failed to fetch ${tab}`);
        } finally {
            setLoading(false);
        }
    };

    if (!user || !user.is_admin) return (
        <div style={{ padding: '100px', textAlign: 'center', color: '#888' }}>
            ⛔ Unauthorized — Admin access only
        </div>
    );

    const activeColor = tabs.find(t => t.id === activeTab)?.color || '#000';

    // ----------- Per-table column definitions -----------
    const columns = {
        users: [
            { key: 'id',        label: 'ID' },
            { key: 'username',  label: 'Username' },
            { key: 'email',     label: 'Email' },
            { key: 'is_admin',  label: 'Role', render: v => v ? '🔑 Admin' : '👤 User' },
        ],
        products: [
            { key: 'id',           label: 'ID' },
            { key: 'name',         label: 'Name' },
            { key: 'category',     label: 'Category' },
            { key: 'sub_category', label: 'Sub Category' },
            { key: 'price',        label: 'Price (₹)', render: v => `₹${v}` },
            { key: 'stock',        label: 'Stock' },
            { key: 'description',  label: 'Description', truncate: true },
            { key: 'image_url',    label: 'Image URL', truncate: true },
        ],
        orders: [
            { key: 'id',             label: 'ID' },
            { key: 'username',       label: 'Customer' },
            { key: 'email',          label: 'Email' },
            { key: 'total_price',    label: 'Total', render: v => `₹${v}` },
            { key: 'status',         label: 'Status', render: v =>
                <span style={{
                    padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700',
                    background: v === 'completed' ? '#e6fffa' : '#fff5f5',
                    color: v === 'completed' ? '#2d9e8f' : '#e53e3e'
                }}>{v?.replace(/_/g, ' ').toUpperCase()}</span>
            },
            { key: 'transaction_id', label: 'Transaction ID' },
            { key: 'items',          label: 'Items', render: v => Array.isArray(v) ? v.map(i => `${i.name} x${i.quantity}`).join(', ') : v, truncate: true },
            { key: 'created_at',     label: 'Date', render: v => new Date(v).toLocaleString() },
        ],
        cart: [
            { key: 'id',           label: 'Cart ID' },
            { key: 'user_id',      label: 'User ID' },
            { key: 'username',     label: 'Username' },
            { key: 'email',        label: 'Email' },
            { key: 'product_id',   label: 'Product ID' },
            { key: 'product_name', label: 'Product Name' },
            { key: 'price',        label: 'Unit Price', render: v => `₹${v}` },
            { key: 'quantity',     label: 'Qty' },
        ],
    };

    const cols = columns[activeTab] || [];

    return (
        <div className="container" style={{ padding: isMobile ? '20px 12px' : '50px 40px' }}>
            {/* Header */}
            <div style={{ marginBottom: '30px' }}>
                <h1 style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: '900', margin: '0 0 4px' }}>ADMIN DASHBOARD</h1>
                <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>Full database viewer — all tables, all fields</p>
            </div>

            {/* Tab Bar */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
                {tabs.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                        padding: '10px 20px', border: 'none', borderRadius: '12px', cursor: 'pointer',
                        fontWeight: '700', fontSize: '13px', transition: 'all 0.2s',
                        background: activeTab === tab.id ? tab.color : '#f0f0f0',
                        color: activeTab === tab.id ? '#fff' : '#555',
                        boxShadow: activeTab === tab.id ? `0 4px 15px ${tab.color}55` : 'none'
                    }}>
                        {tab.label}
                    </button>
                ))}
                <button onClick={() => fetchData(activeTab)} style={{
                    marginLeft: 'auto', padding: '10px 16px', border: `1px solid ${activeColor}`,
                    borderRadius: '12px', background: 'transparent', color: activeColor,
                    fontWeight: '700', fontSize: '12px', cursor: 'pointer'
                }}>↻ Refresh</button>
            </div>

            {/* Stats Bar */}
            <div style={{ background: activeColor + '15', borderLeft: `4px solid ${activeColor}`, padding: '12px 20px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px', fontWeight: '700', color: activeColor }}>
                {loading ? 'Loading...' : `${data.length} record${data.length !== 1 ? 's' : ''} found in ${activeTab} table`}
            </div>

            {/* Table */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '80px', color: '#aaa' }}>Loading {activeTab}...</div>
            ) : error ? (
                <div style={{ padding: '30px', background: '#fff5f5', color: '#e53e3e', borderRadius: '12px' }}>{error}</div>
            ) : (
                <div style={{ background: '#fff', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.06)', overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                        <thead>
                            <tr style={{ background: '#fafafa', borderBottom: '2px solid #f0f0f0' }}>
                                {cols.map(col => (
                                    <th key={col.key} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '900', color: '#aaa', letterSpacing: '1px', whiteSpace: 'nowrap' }}>
                                        {col.label.toUpperCase()}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.length === 0 ? (
                                <tr><td colSpan={cols.length} style={{ textAlign: 'center', padding: '60px', color: '#bbb' }}>No records found</td></tr>
                            ) : data.map((row, idx) => (
                                <React.Fragment key={idx}>
                                    <tr
                                        onClick={() => setExpandedRow(expandedRow === idx ? null : idx)}
                                        style={{ borderBottom: '1px solid #f5f5f5', cursor: 'pointer', background: expandedRow === idx ? activeColor + '08' : idx % 2 === 0 ? '#fff' : '#fefefe', transition: 'background 0.15s' }}
                                    >
                                        {cols.map(col => {
                                            const val = row[col.key];
                                            const display = col.render ? col.render(val) : val;
                                            return (
                                                <td key={col.key} style={{ padding: '14px 16px', fontSize: '13px', color: '#1a1a1a', maxWidth: col.truncate ? '200px' : 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: col.truncate ? 'nowrap' : 'normal' }}>
                                                    {col.key === 'id' ? <span style={{ fontFamily: 'monospace', color: activeColor, fontWeight: '700' }}>#{val}</span> : display ?? <span style={{ color: '#ccc' }}>—</span>}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                    {expandedRow === idx && (
                                        <tr style={{ background: activeColor + '08' }}>
                                            <td colSpan={cols.length} style={{ padding: '20px 24px' }}>
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
                                                    {cols.map(col => (
                                                        <div key={col.key} style={{ background: '#fff', border: `1px solid ${activeColor}22`, borderRadius: '10px', padding: '12px 16px' }}>
                                                            <div style={{ fontSize: '10px', fontWeight: '900', color: '#aaa', letterSpacing: '1px', marginBottom: '6px' }}>{col.label.toUpperCase()}</div>
                                                            <div style={{ fontSize: '13px', wordBreak: 'break-all', color: '#1a1a1a' }}>
                                                                {col.render ? col.render(row[col.key]) : String(row[col.key] ?? '—')}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <p style={{ textAlign: 'center', marginTop: '16px', color: '#ccc', fontSize: '12px' }}>Click any row to expand all fields</p>
        </div>
    );
};

export default AdminDashboard;
