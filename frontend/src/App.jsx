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
import useMobile from './hooks/useMobile';

const Footer = () => {
  const isMobile = useMobile(768);
  return (
    <footer style={{ backgroundColor: '#1a1a1a', color: '#fff', padding: isMobile ? '40px 0' : '60px 0', marginTop: isMobile ? '60px' : '100px' }}>
      <div className="container" style={{ 
        display: 'grid', 
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)', 
        gap: isMobile ? '30px' : '40px' 
      }}>
        <div>
          <h3 style={{ marginBottom: '15px', fontSize: '20px', fontWeight: '900' }}>CLOTHIFY</h3>
          <p style={{ color: '#888', fontSize: '13px' }}>Premium quality clothing for the modern individual.</p>
        </div>
        <div>
          <h4 style={{ marginBottom: '15px', fontSize: '14px', fontWeight: '900', letterSpacing: '1px' }}>SHOP</h4>
          <ul style={{ listStyle: 'none', color: '#888', fontSize: '13px', lineHeight: '2.4' }}>
            <li>T-Shirts</li>
            <li>Pants</li>
            <li>Outerwear</li>
            <li>Accessories</li>
          </ul>
        </div>
        <div>
          <h4 style={{ marginBottom: '15px', fontSize: '14px', fontWeight: '900', letterSpacing: '1px' }}>SUPPORT</h4>
          <ul style={{ listStyle: 'none', color: '#888', fontSize: '13px', lineHeight: '2.4' }}>
            <li>Contact Us</li>
            <li>Shipping Policy</li>
            <li>Returns & Exchanges</li>
            <li>FAQs</li>
          </ul>
        </div>
        <div>
          <h4 style={{ marginBottom: '15px', fontSize: '14px', fontWeight: '900', letterSpacing: '1px' }}>NEWSLETTER</h4>
          <p style={{ color: '#888', fontSize: '13px', marginBottom: '15px' }}>Subscribe to get latest updates.</p>
          <div style={{ display: 'flex' }}>
            <input type="email" placeholder="Email address" style={{ padding: '12px', background: '#222', border: '1px solid #333', color: '#fff', outline: 'none', flex: 1, fontSize: '13px' }} />
            <button style={{ backgroundColor: '#fff', color: '#1a1a1a', border: 'none', padding: '12px 20px', fontWeight: '900', fontSize: '11px', cursor: 'pointer' }}>JOIN</button>
          </div>
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: isMobile ? '40px' : '60px', borderTop: '1px solid #333', paddingTop: '30px', color: '#555', fontSize: '11px' }}>
        © 2026 CLOTHIFY E-COMMERCE. ALL RIGHTS RESERVED.
      </div>
    </footer>
  );
};

const ScrollToTop = () => {
  const [visible, setVisible] = React.useState(false);
  const isMobile = useMobile(768);
  React.useEffect(() => {
    const toggleVisible = () => setVisible(window.scrollY > 500);
    window.addEventListener('scroll', toggleVisible);
    return () => window.removeEventListener('scroll', toggleVisible);
  }, []);
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      style={{
        position: 'fixed', bottom: isMobile ? '20px' : '40px', right: isMobile ? '20px' : '40px', zIndex: 999,
        backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '50%',
        width: isMobile ? '40px' : '50px', height: isMobile ? '40px' : '50px', cursor: 'pointer', display: visible ? 'flex' : 'none',
        alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        transition: 'all 0.3s ease', fontSize: isMobile ? '16px' : '20px'
      }}
      onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
      onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      ↑
    </button>
  );
};

const ChatBubble = () => {
  const isMobile = useMobile(768);
  return (
    <div style={{
      position: 'fixed', bottom: isMobile ? '70px' : '110px', right: isMobile ? '20px' : '40px', zIndex: 999,
      backgroundColor: 'var(--accent)', color: '#fff', borderRadius: '50%',
      width: isMobile ? '48px' : '60px', height: isMobile ? '48px' : '60px', cursor: 'pointer', display: 'flex',
      alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 25px rgba(255,77,77,0.3)',
      animation: 'fadeIn 1s ease-out'
    }}>
      <svg width={isMobile ? '20' : '24'} height={isMobile ? '20' : '24'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
    </div>
  );
};

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
