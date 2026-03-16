import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Package, Clock, CheckCircle, Truck, ExternalLink, Calendar, CreditCard } from 'lucide-react';
import useMobile from '../hooks/useMobile';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();
    const isMobile = useMobile(1024);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get('/api/orders/my', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrders(res.data);
            } catch (err) {
                console.error('Error fetching orders:', err);
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchOrders();
    }, [token]);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'waiting_for_admin_verification':
                return { bg: '#fffbeb', color: '#b45309', icon: <Clock size={16} />, label: 'Wait for Verification' };
            case 'confirmed':
                return { bg: '#f0fdf4', color: '#166534', icon: <CheckCircle size={16} />, label: 'Order Confirmed' };
            case 'shipped':
                return { bg: '#eff6ff', color: '#1d4ed8', icon: <Truck size={16} />, label: 'Shipped' };
            default:
                return { bg: '#f9fafb', color: '#374151', icon: <Package size={16} />, label: status.toUpperCase() };
        }
    };

    if (loading) return (
        <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
            <div className="loader" style={{ margin: '0 auto' }}></div>
            <p style={{ marginTop: '20px', color: '#666' }}>Loading your orders...</p>
        </div>
    );

    if (orders.length === 0) return (
        <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
            <Package size={80} style={{ marginBottom: '30px', opacity: 0.1 }} />
            <h1 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '20px' }}>NO ORDERS YET</h1>
            <p style={{ color: '#666', marginBottom: '40px' }}>Your premium wardrobe is waiting to be filled.</p>
            <a href="/" className="btn btn-primary" style={{ padding: '18px 40px' }}>Explore Collection</a>
        </div>
    );

    return (
        <div className="container" style={{ padding: 'clamp(40px, 6vh, 80px) clamp(16px, 4vw, 40px)' }}>
            <h1 style={{ fontSize: 'clamp(32px, 8vw, 42px)', fontWeight: '950', marginBottom: '50px', letterSpacing: '-1.5px' }}>MY ORDERS</h1>

            <div style={{ display: 'grid', gap: '30px' }}>
                {orders.map(order => {
                    const status = getStatusStyle(order.status);
                    return (
                        <div key={order.id} className="glass" style={{
                            padding: 'clamp(20px, 4vw, 40px)',
                            borderRadius: '24px',
                            border: '1px solid rgba(0,0,0,0.05)',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.03)'
                        }}>
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'flex-start', 
                                marginBottom: '25px',
                                flexWrap: 'wrap',
                                gap: '15px'
                            }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                                        <span style={{ fontSize: '12px', fontWeight: '900', color: '#888', letterSpacing: '1px' }}>ORDER #{order.id}</span>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            padding: '4px 12px',
                                            borderRadius: '50px',
                                            fontSize: '11px',
                                            fontWeight: '800',
                                            backgroundColor: status.bg,
                                            color: status.color,
                                            textTransform: 'uppercase'
                                        }}>
                                            {status.icon} {status.label}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: '#666', fontSize: '13px' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={14} /> {new Date(order.created_at).toLocaleDateString()}</span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><CreditCard size={14} /> {order.transaction_id ? `Ref: ${order.transaction_id.slice(0, 8)}...` : 'No Ref ID'}</span>
                                    </div>
                                </div>
                                <div style={{ fontSize: '24px', fontWeight: '950', color: 'var(--accent)' }}>
                                    ₹{order.total_price}
                                </div>
                            </div>

                            <div style={{ 
                                display: 'grid', 
                                gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))', 
                                gap: '20px',
                                padding: '20px 0',
                                borderTop: '1px solid #f5f5f6',
                                borderBottom: '1px solid #f5f5f6'
                            }}>
                                {order.items.map((item, idx) => (
                                    <Link key={idx} to={`/product/${item.product_id}`} style={{ display: 'flex', gap: '15px', alignItems: 'center', color: 'inherit', textDecoration: 'none' }}>
                                        <div style={{ width: '60px', height: '80px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#f5f5f6', flexShrink: 0 }}>
                                            <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <div>
                                            <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>{item.name}</h4>
                                            <p style={{ fontSize: '12px', color: '#888' }}>Qty: {item.quantity} × ₹{item.price}</p>
                                        </div>
                                </Link>
                                ))}
                            </div>

                            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                                <button 
                                    className="btn" 
                                    onClick={() => alert(`Details for Order #${order.id}\nStatus: ${status.label}\nTransaction ID: ${order.transaction_id || 'N/A'}`)}
                                    style={{ 
                                        padding: '10px 20px', 
                                        fontSize: '12px', 
                                        fontWeight: '800', 
                                        backgroundColor: '#000', 
                                        color: '#fff',
                                        borderRadius: '50px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    View Details <ExternalLink size={14} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MyOrders;
