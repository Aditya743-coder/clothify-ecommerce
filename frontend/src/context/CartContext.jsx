import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const { token } = useAuth();

    const fetchCart = async () => {
        if (!token) return;
        try {
            const res = await axios.get('/api/cart', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCartItems(res.data);
        } catch (err) {
            console.error('Error fetching cart', err);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [token]);

    const addToCart = async (product_id, quantity = 1) => {
        console.log(`[FRONTEND] addToCart called: product_id=${product_id}, token exists: ${!!token}`);
        if (!token) {
            alert('Please login to add to cart');
            return false;
        }
        try {
            console.log(`[FRONTEND] Sending POST /api/cart with token: ${token.substring(0, 10)}...`);
            const res = await axios.post('/api/cart', { product_id, quantity }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('[FRONTEND] addToCart SUCCESS:', res.data);
            fetchCart();
            return true;
        } catch (err) {
            console.error('[FRONTEND] addToCart ERROR:', err.response ? err.response.status : err.message);
            if (err.response) {
                console.error('[FRONTEND] Error Data:', err.response.data);
            }
            alert('Failed to add to cart. Please try again.');
            return false;
        }
    };

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const removeFromCart = async (cartItemId) => {
        try {
            await axios.delete(`/api/cart/${cartItemId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchCart();
        } catch (err) {
            console.error('Error removing from cart', err);
        }
    };

    const updateQuantity = async (cartItemId, quantity) => {
        if (quantity < 1) return;
        try {
            await axios.patch(`/api/cart/${cartItemId}`, { quantity }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchCart();
        } catch (err) {
            console.error('Error updating quantity', err);
        }
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            refreshCart: fetchCart,
            cartCount,
            totalPrice
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
