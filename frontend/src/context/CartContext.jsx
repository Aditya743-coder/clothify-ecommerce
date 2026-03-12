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
        if (!token) {
            alert('Please login to add to cart');
            return;
        }
        try {
            await axios.post('/api/cart', { product_id, quantity }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchCart();
        } catch (err) {
            console.error('Error adding to cart', err);
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
