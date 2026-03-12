import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import AdminAddProduct from './pages/AdminAddProduct';

const Footer = () => (
  <footer style={{ backgroundColor: '#1a1a1a', color: '#fff', padding: '60px 0', marginTop: '100px' }}>
    <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px' }}>
      <div>
        <h3 style={{ marginBottom: '20px' }}>CLOTHIFY</h3>
        <p style={{ color: '#888', fontSize: '14px' }}>Premium quality clothing for the modern individual.</p>
      </div>
      <div>
        <h4 style={{ marginBottom: '20px' }}>Shop</h4>
        <ul style={{ listStyle: 'none', color: '#888', fontSize: '14px', lineHeight: '2' }}>
          <li>T-Shirts</li>
          <li>Pants</li>
          <li>Outerwear</li>
          <li>Accessories</li>
        </ul>
      </div>
      <div>
        <h4 style={{ marginBottom: '20px' }}>Support</h4>
        <ul style={{ listStyle: 'none', color: '#888', fontSize: '14px', lineHeight: '2' }}>
          <li>Contact Us</li>
          <li>Shipping Policy</li>
          <li>Returns & Exchanges</li>
          <li>FAQs</li>
        </ul>
      </div>
      <div>
        <h4 style={{ marginBottom: '20px' }}>Newsletter</h4>
        <p style={{ color: '#888', fontSize: '14px', marginBottom: '15px' }}>Subscribe to get latest updates.</p>
        <div style={{ display: 'flex' }}>
          <input type="email" placeholder="Email address" style={{ padding: '10px', background: '#333', border: 'none', color: '#fff', outline: 'none', flex: 1 }} />
          <button style={{ backgroundColor: '#fff', color: '#1a1a1a', border: 'none', padding: '10px 15px', fontWeight: 'bold' }}>JOIN</button>
        </div>
      </div>
    </div>
    <div style={{ textAlign: 'center', marginTop: '60px', borderTop: '1px solid #333', paddingTop: '30px', color: '#555', fontSize: '12px' }}>
      © 2026 Clothify E-commerce. All rights reserved.
    </div>
  </footer>
);

const ScrollToTop = () => {
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    const toggleVisible = () => setVisible(window.scrollY > 500);
    window.addEventListener('scroll', toggleVisible);
    return () => window.removeEventListener('scroll', toggleVisible);
  }, []);
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      style={{
        position: 'fixed', bottom: '40px', right: '40px', zIndex: 999,
        backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '50%',
        width: '50px', height: '50px', cursor: 'pointer', display: visible ? 'flex' : 'none',
        alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        transition: 'all 0.3s ease'
      }}
      onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
      onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      ↑
    </button>
  );
};

const ChatBubble = () => (
  <div style={{
    position: 'fixed', bottom: '110px', right: '40px', zIndex: 999,
    backgroundColor: 'var(--accent)', color: '#fff', borderRadius: '50%',
    width: '60px', height: '60px', cursor: 'pointer', display: 'flex',
    alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 25px rgba(255,77,77,0.3)',
    animation: 'fadeIn 1s ease-out'
  }}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
  </div>
);

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div style={{ flex: '1' }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/admin/add-product" element={<AdminAddProduct />} />
              </Routes>
            </div>
            <Footer />
            <ScrollToTop />
            <ChatBubble />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
