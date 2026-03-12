import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AdminAddProduct = () => {
    const { token, user } = useAuth();
    const [productData, setProductData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Men',
        sub_category: 'T-Shirts',
        image_url: '',
        stock: ''
    });

    if (!user || !user.is_admin) return <div className="container">Unauthorized</div>;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/products', productData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Product added successfully!');
            setProductData({ name: '', description: '', price: '', category: 'Men', sub_category: 'T-Shirts', image_url: '', stock: '' });
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to add product');
        }
    };

    return (
        <div className="container" style={{ padding: '60px 40px', maxWidth: '800px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '40px' }}>ADD NEW PRODUCT</h1>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '25px', backgroundColor: '#fff', padding: '40px', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-md)' }}>
                <div>
                    <label style={{ fontSize: '12px', fontWeight: '900', marginBottom: '10px', display: 'block' }}>PRODUCT NAME</label>
                    <input
                        type="text" placeholder="e.g. Premium Cotton Polo" required
                        value={productData.name} onChange={(e) => setProductData({ ...productData, name: e.target.value })}
                        style={{ width: '100%', padding: '15px', border: '1px solid #eee', borderRadius: 'var(--radius)', outline: 'none' }}
                    />
                </div>
                <div>
                    <label style={{ fontSize: '12px', fontWeight: '900', marginBottom: '10px', display: 'block' }}>DESCRIPTION</label>
                    <textarea
                        placeholder="Detail about the product..." required
                        value={productData.description} onChange={(e) => setProductData({ ...productData, description: e.target.value })}
                        style={{ width: '100%', padding: '15px', border: '1px solid #eee', borderRadius: 'var(--radius)', outline: 'none', minHeight: '120px' }}
                    />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                        <label style={{ fontSize: '12px', fontWeight: '900', marginBottom: '10px', display: 'block' }}>PRICE (₹)</label>
                        <input
                            type="number" placeholder="2999" required
                            value={productData.price} onChange={(e) => setProductData({ ...productData, price: e.target.value })}
                            style={{ width: '100%', padding: '15px', border: '1px solid #eee', borderRadius: 'var(--radius)', outline: 'none' }}
                        />
                    </div>
                    <div>
                        <label style={{ fontSize: '12px', fontWeight: '900', marginBottom: '10px', display: 'block' }}>MAIN CATEGORY</label>
                        <select
                            value={productData.category}
                            onChange={(e) => setProductData({ ...productData, category: e.target.value })}
                            style={{ width: '100%', padding: '15px', border: '1px solid #eee', borderRadius: 'var(--radius)', outline: 'none' }}>
                            <option value="Men">Men</option>
                            <option value="Women">Women</option>
                            <option value="Accessories">Accessories</option>
                        </select>
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                        <label style={{ fontSize: '12px', fontWeight: '900', marginBottom: '10px', display: 'block' }}>SUB CATEGORY</label>
                        <input
                            type="text" placeholder="e.g. T-Shirts, Pants..." required
                            value={productData.sub_category} onChange={(e) => setProductData({ ...productData, sub_category: e.target.value })}
                            style={{ width: '100%', padding: '15px', border: '1px solid #eee', borderRadius: 'var(--radius)', outline: 'none' }}
                        />
                    </div>
                    <div>
                        <label style={{ fontSize: '12px', fontWeight: '900', marginBottom: '10px', display: 'block' }}>INITIAL STOCK</label>
                        <input
                            type="number" placeholder="50" required
                            value={productData.stock} onChange={(e) => setProductData({ ...productData, stock: e.target.value })}
                            style={{ width: '100%', padding: '15px', border: '1px solid #eee', borderRadius: 'var(--radius)', outline: 'none' }}
                        />
                    </div>
                </div>
                <div>
                    <label style={{ fontSize: '12px', fontWeight: '900', marginBottom: '10px', display: 'block' }}>IMAGE URL</label>
                    <input
                        type="url" placeholder="https://images.unsplash.com/..." required
                        value={productData.image_url} onChange={(e) => setProductData({ ...productData, image_url: e.target.value })}
                        style={{ width: '100%', padding: '15px', border: '1px solid #eee', borderRadius: 'var(--radius)', outline: 'none' }}
                    />
                </div>
                <button type="submit" className="btn btn-primary" style={{ padding: '20px', fontSize: '14px' }}>PUBLISH PRODUCT</button>
            </form>
        </div>
    );
};

export default AdminAddProduct;
