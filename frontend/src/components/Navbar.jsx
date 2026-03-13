import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, LogOut, User, Search, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const [searchInput, setSearchInput] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchInput.trim()) {
            navigate(`/?search=${searchInput}`);
            setIsMenuOpen(false);
            setIsSearchOpen(false); 
            setSearchInput('');
        }
    };

    const categories = ['men', 'women', 'kids', 'beauty'];

    return (
        <>
            <div style={{ backgroundColor: '#000', color: '#fff', textAlign: 'center', fontSize: '11px', padding: '10px 0', fontWeight: '700', letterSpacing: '2px', position: 'relative', zIndex: 1100 }}>
                FREE SHIPPING ON ALL ORDERS OVER ₹2,500 | LIMITED TIME OFFER
            </div>

            {/* Mobile Menu Overlay */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: isMenuOpen ? 0 : '-100%',
                width: 'clamp(280px, 80%, 350px)',
                height: '100%',
                backgroundColor: '#fff',
                zIndex: 1200,
                transition: 'left 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '4px 0 20px rgba(0,0,0,0.15)',
                padding: '30px 24px'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <span style={{ fontWeight: '900', fontSize: '20px' }}>MENU</span>
                    <X size={24} onClick={() => setIsMenuOpen(false)} style={{ cursor: 'pointer' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {categories.map(cat => (
                        <Link
                            key={cat}
                            to={`/?category=${cat}`}
                            onClick={() => setIsMenuOpen(false)}
                            style={{ fontSize: '18px', fontWeight: '700', textTransform: 'uppercase', color: '#282c3f', borderBottom: '1px solid #f5f5f6', paddingBottom: '10px' }}
                        >
                            {cat === 'home' ? 'HOME & LIVING' : cat.toUpperCase()}
                        </Link>
                    ))}
                    {user ? (
                        <div onClick={() => { logout(); setIsMenuOpen(false); }} style={{ fontSize: '18px', fontWeight: '700', color: '#ff3f6c', cursor: 'pointer' }}>LOGOUT</div>
                    ) : (
                        <Link to="/login" onClick={() => setIsMenuOpen(false)} style={{ fontSize: '18px', fontWeight: '700', color: '#282c3f' }}>LOGIN / SIGNUP</Link>
                    )}
                </div>
            </div>
            {isMenuOpen && <div onClick={() => setIsMenuOpen(false)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1150 }} />}

            <nav className={`glass ${isScrolled ? 'scrolled' : ''}`} style={{
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                backgroundColor: isScrolled ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.8)',
                padding: isScrolled ? 'clamp(8px, 2vh, 12px) 0' : 'clamp(12px, 3vh, 20px) 0',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                borderBottom: isScrolled ? '1px solid #eee' : '1px solid transparent'
            }}>
                <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: isScrolled ? 'clamp(50px, 8vh, 60px)' : 'clamp(60px, 10vh, 80px)' }}>
                    {/* Hamburger for Mobile */}
                    <div className="mobile-only" style={{ cursor: 'pointer' }} onClick={() => setIsMenuOpen(true)}>
                        <div style={{ width: '24px', height: '2px', backgroundColor: '#282c3f', marginBottom: '5px' }}></div>
                        <div style={{ width: '24px', height: '2px', backgroundColor: '#282c3f', marginBottom: '5px' }}></div>
                        <div style={{ width: '24px', height: '2px', backgroundColor: '#282c3f' }}></div>
                    </div>

                    {/* Logo */}
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 'clamp(4px, 1vw, 8px)' }}>
                        <div style={{ backgroundColor: '#ff3f6c', color: '#fff', width: 'clamp(28px, 4vw, 32px)', height: 'clamp(28px, 4vw, 32px)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: 'clamp(14px, 2vw, 18px)' }}>C</div>
                        <span style={{ fontWeight: '900', fontSize: 'clamp(16px, 3vw, 20px)', letterSpacing: '-0.5px', color: '#282c3f' }}>CLOTHIFY</span>
                    </Link>

                    {/* Navigation - Desktop */}
                    <div className="nav-menu desktop-only" style={{ display: 'flex', gap: '20px' }}>
                        {categories.map(cat => (
                            <Link
                                key={cat}
                                to={`/?category=${cat}`}
                                className="nav-link"
                                style={{
                                    textDecoration: 'none',
                                    fontSize: '12px',
                                    fontWeight: '700',
                                    color: '#282c3f',
                                    padding: '28px 0'
                                }}
                            >
                                {cat === 'home' ? 'HOME & LIVING' : cat.toUpperCase()}
                            </Link>
                        ))}
                    </div>

                    {/* Search - Desktop */}
                    <div className="search-container desktop-only" style={{ flex: 1, maxWidth: '300px', margin: '0 20px' }}>
                        <form onSubmit={handleSearch} style={{ position: 'relative' }}>
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '8px 10px 8px 35px',
                                    borderRadius: '4px',
                                    border: 'none',
                                    backgroundColor: '#f5f5f6',
                                    fontSize: '13px',
                                    outline: 'none'
                                }}
                            />
                            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#696e79' }} />
                        </form>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(10px, 2vw, 15px)' }}>
                        <div className="desktop-only" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/login')}>
                            <User size={18} color="#282c3f" />
                            <span style={{ fontSize: '10px', fontWeight: '700', marginTop: '2px' }}>Profile</span>
                        </div>

                        <Link to="/cart" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#282c3f' }}>
                            <ShoppingBag size={18} />
                            <span style={{ fontSize: '10px', fontWeight: '700', marginTop: '2px' }}>Bag</span>
                            {cartCount > 0 && (
                                <span style={{
                                    position: 'absolute', top: '-4px', right: '-4px',
                                    backgroundColor: '#ff3f6c', color: '#fff',
                                    borderRadius: '50%', width: '14px', height: '14px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '8px', fontWeight: '900'
                                }}>
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {user && (
                            <div className="desktop-only" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }} onClick={logout}>
                                <LogOut size={20} color="#282c3f" />
                                <span style={{ fontSize: '10px', fontWeight: '700', marginTop: '4px', color: '#282c3f' }}>Logout</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Search Overlay */}
                {isSearchOpen && (
                    <div className="fade-in" style={{
                        position: 'absolute', top: '0', left: 0, right: 0, height: '100vh',
                        backgroundColor: 'rgba(255,255,255,0.98)', padding: '100px 0', zIndex: 2000
                    }}>
                        <div className="container" style={{ position: 'relative' }}>
                            <button onClick={() => setIsSearchOpen(false)} style={{ position: 'absolute', top: '-60px', right: '0', background: 'none', border: 'none', cursor: 'pointer' }}>
                                <X size={40} />
                            </button>
                            <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: '30px', borderBottom: '4px solid #000', paddingBottom: '20px' }}>
                                <Search size={48} color="#000" />
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="SEARCH FOR MEN, WOMEN, OR COLLECTIONS..."
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    style={{
                                        width: '100%', border: 'none', fontSize: '48px',
                                        fontWeight: '900', outline: 'none', textTransform: 'uppercase', background: 'none'
                                    }}
                                />
                            </form>
                            <div style={{ marginTop: '40px', display: 'flex', gap: '30px', color: '#888', fontSize: '18px' }}>
                                <span>SUGGESTIONS:</span>
                                <Link to="/?category=Men" style={{ color: '#000', fontWeight: '700' }} onClick={() => setIsSearchOpen(false)}>MEN'S APPAREL</Link>
                                <Link to="/?category=Women" style={{ color: '#000', fontWeight: '700' }} onClick={() => setIsSearchOpen(false)}>WOMEN'S COLLECTION</Link>
                                <Link to="/?category=Accessories" style={{ color: '#000', fontWeight: '700' }} onClick={() => setIsSearchOpen(false)}>ESSENTIAL ACCESSORIES</Link>
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
};

export default Navbar;
