import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { ShoppingBag, ArrowLeft, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const navigate = useNavigate();

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
                style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '700', cursor: 'pointer', marginBottom: '40px', color: '#000' }}>
                <ArrowLeft size={18} /> BACK TO COLLECTION
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '80px', alignItems: 'start' }}>
                {/* Image Gallery */}
                <div style={{ position: 'sticky', top: '120px' }}>
                    <div style={{ borderRadius: 'var(--radius)', overflow: 'hidden', height: '700px', backgroundColor: '#fff' }}>
                        <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                </div>

                {/* Info */}
                <div className="fade-in">
                    <span style={{ color: 'var(--accent)', fontWeight: '900', letterSpacing: '2px', fontSize: '12px', textTransform: 'uppercase', marginBottom: '15px', display: 'block' }}>
                        {product.category}
                    </span>
                    <h1 style={{ fontSize: '48px', fontWeight: '900', marginBottom: '20px', letterSpacing: '-1px', lineHeight: '1.1' }}>{product.name}</h1>
                    <p style={{ fontSize: '32px', fontWeight: '300', marginBottom: '30px', color: 'var(--text-main)' }}>₹{product.price}</p>

                    <div style={{ borderTop: '1px solid #eee', borderBottom: '1px solid #eee', padding: '30px 0', marginBottom: '40px' }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '18px', lineHeight: '1.8' }}>{product.description}</p>
                    </div>

                    <div style={{ display: 'flex', gap: '20px', marginBottom: '50px' }}>
                        <button
                            onClick={() => addToCart(product.id)}
                            className="btn btn-primary"
                            style={{ flex: 1, padding: '20px' }}>
                            ADD TO BAG <ShoppingBag size={20} />
                        </button>
                    </div>

                    {/* Features */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', textAlign: 'center' }}>
                        <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: 'var(--radius)' }}>
                            <Truck size={24} style={{ marginBottom: '10px', color: 'var(--accent)' }} />
                            <p style={{ fontSize: '10px', fontWeight: '900' }}>FREE SHIPPING</p>
                        </div>
                        <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: 'var(--radius)' }}>
                            <RefreshCw size={24} style={{ marginBottom: '10px', color: 'var(--accent)' }} />
                            <p style={{ fontSize: '10px', fontWeight: '900' }}>30-DAY RETURNS</p>
                        </div>
                        <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: 'var(--radius)' }}>
                            <ShieldCheck size={24} style={{ marginBottom: '10px', color: 'var(--accent)' }} />
                            <p style={{ fontSize: '10px', fontWeight: '900' }}>SECURE PAYMENT</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
