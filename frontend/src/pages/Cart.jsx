import React from 'react';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { Trash2, ShoppingBag, ArrowRight, CreditCard, ShieldCheck, Truck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import useMobile from '../hooks/useMobile';

import PaymentScanner from '../components/PaymentScanner';

const Cart = () => {
    const { cartItems, totalPrice, refreshCart, removeFromCart, updateQuantity } = useCart();
    const { token } = useAuth();
    const [checkoutStep, setCheckoutStep] = React.useState('bag'); // 'bag' or 'payment'
    const isMobile = useMobile(1024);

    const shipping = totalPrice > 2500 ? 0 : 250;
    const tax = Math.round(totalPrice * 0.12); // 12% GST
    const finalTotal = totalPrice + shipping + tax;

    const handleCheckout = async () => {
        if (!token) {
            alert('Please login to checkout');
            return;
        }
        setCheckoutStep('payment');
    };

    const confirmPayment = async (txnId) => {
        try {
            await axios.post('/api/orders', {
                total_price: finalTotal,
                items: cartItems,
                transaction_id: txnId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Order placed successfully! We will verify your payment shortly.');
            refreshCart();
            setCheckoutStep('bag');
            navigate('/my-orders');
        } catch (err) {
            alert('Checkout failed');
        }
    };

    if (cartItems.length === 0) return (
        <div className="container" style={{ padding: '150px 0', textAlign: 'center' }}>
            <div className="fade-in">
                <ShoppingBag size={80} style={{ marginBottom: '30px', opacity: 0.1 }} />
                <h1 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '20px' }}>YOUR BAG IS EMPTY</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '40px', fontSize: '18px' }}>Explore our latest collections and find something you love.</p>
                <Link to="/" className="btn btn-primary" style={{ padding: '18px 40px' }}>Start Shopping</Link>
            </div>
        </div>
    );

    return (
        <div className="container" style={{ padding: 'clamp(40px, 6vh, 80px) clamp(16px, 4vw, 40px)' }}>
            <h1 style={{ fontSize: 'clamp(32px, 8vw, 42px)', fontWeight: '900', marginBottom: 'clamp(30px, 5vh, 60px)', letterSpacing: '-1.5px' }}>
                {checkoutStep === 'payment' ? 'SECURE PAYMENT' : 'YOUR SHOPPING BAG'}
            </h1>

            {checkoutStep === 'payment' ? (
                <PaymentScanner 
                    amount={finalTotal} 
                    onConfirm={confirmPayment} 
                    onBack={() => setCheckoutStep('bag')} 
                />
            ) : (
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: isMobile ? '1fr' : '1.6fr 1fr', 
                    gap: 'clamp(30px, 5vw, 80px)', 
                    alignItems: 'start' 
                }}>
                    {/* Items */}
                    <div style={{ display: 'grid', gap: '40px' }}>
                        {cartItems.map(item => (
                            <div key={item.id} className="reveal active" style={{ display: 'flex', gap: 'clamp(15px, 3vw, 30px)', paddingBottom: 'clamp(20px, 4vh, 40px)', borderBottom: '1px solid #eee' }}>
                                <div style={{ width: 'clamp(100px, 25vw, 180px)', height: 'clamp(140px, 35vw, 240px)', borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid #eee', flexShrink: 0 }}>
                                    <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', gap: '10px' }}>
                                            <h3 style={{ fontSize: 'clamp(16px, 3vw, 22px)', fontWeight: '700' }}>{item.name}</h3>
                                            <span style={{ fontWeight: '900', fontSize: 'clamp(16px, 3vw, 22px)' }}>₹{item.price * item.quantity}</span>
                                        </div>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Premium Collection</p>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(20px, 4vw, 40px)', flexWrap: 'wrap' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '50px', padding: '4px 12px', gap: '12px' }}>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: '900', fontSize: '16px' }}>-</button>
                                            <span style={{ fontWeight: '900', minWidth: '15px', textAlign: 'center', fontSize: '14px' }}>{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: '900', fontSize: '16px' }}>+</button>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '700' }}
                                            onMouseOver={e => e.currentTarget.style.color = 'var(--accent)'}
                                            onMouseOut={e => e.currentTarget.style.color = '#888'}
                                        >
                                            <Trash2 size={16} /> REMOVE
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="glass" style={{ 
                        padding: 'clamp(24px, 5vw, 50px)', 
                        borderRadius: 'var(--radius)', 
                        position: isMobile ? 'static' : 'sticky', 
                        top: '120px', 
                        boxShadow: 'var(--shadow-md)', 
                        border: '1px solid rgba(0,0,0,0.05)' 
                    }}>
                        <h2 style={{ fontSize: 'clamp(20px, 4vw, 26px)', fontWeight: '900', marginBottom: 'clamp(20px, 4vh, 40px)', letterSpacing: '-0.5px' }}>ORDER SUMMARY</h2>

                        <div style={{ display: 'grid', gap: '20px', marginBottom: '40px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)', fontSize: '16px' }}>Subtotal</span>
                                <span style={{ fontWeight: '700', fontSize: '16px' }}>₹{totalPrice}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)', fontSize: '16px' }}>Estimated Shipping</span>
                                <span style={{ fontWeight: '700', fontSize: '16px', color: shipping === 0 ? '#10b981' : '#000' }}>
                                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                                </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)', fontSize: '16px' }}>Estimated Tax (GST 12%)</span>
                                <span style={{ fontWeight: '700', fontSize: '16px' }}>₹{tax}</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '50px', borderTop: '1px solid #eee', paddingTop: '30px' }}>
                            <span style={{ fontSize: '24px', fontWeight: '950' }}>TOTAL</span>
                            <span style={{ fontSize: '28px', fontWeight: '950', color: 'var(--accent)' }}>₹{finalTotal}</span>
                        </div>

                        <button
                            onClick={handleCheckout}
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '22px', display: 'flex', justifyContent: 'center', gap: '15px', fontSize: '14px' }}>
                            PROCESS TO CHECKOUT <ArrowRight size={20} />
                        </button>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px', opacity: 0.3 }}>
                            <CreditCard size={32} />
                            <ShieldCheck size={32} />
                            <Truck size={32} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
