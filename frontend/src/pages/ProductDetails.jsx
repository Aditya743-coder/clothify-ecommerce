import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { ShoppingBag, ArrowLeft, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import useMobile from '../hooks/useMobile';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const isMobile = useMobile(768);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`/api/products/${id}`);
                setProduct(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return (
        <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
            <p style={{ letterSpacing: '2px', fontWeight: '600' }}>LOADING PRODUCT DETAILS...</p>
        </div>
    );

    if (!product) return <div className="container">Product not found</div>;

    return (
        <div className="container" style={{ padding: '80px 40px' }}>
            <button
                onClick={() => navigate(-1)}
                style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', cursor: 'pointer', marginBottom: 'clamp(20px, 4vh, 40px)', color: '#000', fontSize: '14px' }}>
                <ArrowLeft size={16} /> BACK TO COLLECTION
            </button>

            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1fr', 
                gap: 'clamp(30px, 5vw, 80px)', 
                alignItems: 'start' 
            }}>
                {/* Image Gallery */}
                <div style={{ position: isMobile ? 'static' : 'sticky', top: '120px' }}>
                    <div style={{ borderRadius: 'var(--radius)', overflow: 'hidden', height: 'clamp(350px, 60vh, 700px)', backgroundColor: '#fff' }}>
                        <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                </div>

                {/* Info */}
                <div className="fade-in">
                    <span style={{ color: 'var(--accent)', fontWeight: '900', letterSpacing: '2px', fontSize: '11px', textTransform: 'uppercase', marginBottom: '10px', display: 'block' }}>
                        {product.category}
                    </span>
                    <h1 style={{ fontSize: 'clamp(32px, 8vw, 48px)', fontWeight: '900', marginBottom: '15px', letterSpacing: '-1px', lineHeight: '1.1' }}>{product.name}</h1>
                    <p style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: '300', marginBottom: '25px', color: 'var(--text-main)' }}>₹{product.price}</p>

                    <div style={{ borderTop: '1px solid #eee', borderBottom: '1px solid #eee', padding: 'clamp(20px, 3vh, 30px) 0', marginBottom: 'clamp(30px, 4vh, 40px)' }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: 'clamp(15px, 2.5vw, 18px)', lineHeight: '1.6' }}>{product.description}</p>
                    </div>

                    <div style={{ display: 'flex', gap: '20px', marginBottom: '50px' }}>
                        <button
                            onClick={async () => {
                                const success = await addToCart(product.id);
                                if (success) {
                                    alert('Added to bag!');
                                }
                            }}
                            className="btn btn-primary"
                            style={{ flex: 1, padding: '20px' }}>
                            ADD TO BAG <ShoppingBag size={20} />
                        </button>
                    </div>

                    {/* Features */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'clamp(10px, 2vw, 20px)', textAlign: 'center' }}>
                        <div style={{ padding: 'clamp(10px, 2vh, 20px)', backgroundColor: '#fff', borderRadius: 'var(--radius)', border: '1px solid #f5f5f5' }}>
                            <Truck size={20} style={{ marginBottom: '8px', color: 'var(--accent)' }} />
                            <p style={{ fontSize: '9px', fontWeight: '900' }}>FREE SHIPPING</p>
                        </div>
                        <div style={{ padding: 'clamp(10px, 2vh, 20px)', backgroundColor: '#fff', borderRadius: 'var(--radius)', border: '1px solid #f5f5f5' }}>
                            <RefreshCw size={20} style={{ marginBottom: '8px', color: 'var(--accent)' }} />
                            <p style={{ fontSize: '9px', fontWeight: '900' }}>30-DAY RETURNS</p>
                        </div>
                        <div style={{ padding: 'clamp(10px, 2vh, 20px)', backgroundColor: '#fff', borderRadius: 'var(--radius)', border: '1px solid #f5f5f5' }}>
                            <ShieldCheck size={20} style={{ marginBottom: '8px', color: 'var(--accent)' }} />
                            <p style={{ fontSize: '9px', fontWeight: '900' }}>SECURE PAYMENT</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
