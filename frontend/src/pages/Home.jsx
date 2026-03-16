import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { Search, ArrowRight, ShoppingBag, ChevronRight, ChevronLeft, Star, Flame, Sparkles, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import useMobile from '../hooks/useMobile';

/* ─────────────────────────────── helpers ─────────────────────────────── */
const useIntersection = (ref, opts = {}) => {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.15, ...opts });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, [ref]);
    return visible;
};

const useScrollProgress = () => {
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        const handleScroll = () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            setProgress(scrolled);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    return progress;
};

const Reveal = ({ children, delay = 0, style = {} }) => {
    const ref = useRef();
    const visible = useIntersection(ref);
    return (
        <div ref={ref} style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(36px)',
            transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
            ...style
        }}>
            {children}
        </div>
    );
};

/* ─────────────────────────────── data ─────────────────────────────── */
const HERO_SLIDES = [
    {
        img: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1800',
        eyebrow: 'NEW SEASON 2026',
        title: 'Dress\nFuture.',
        sub: 'Premium cotton silhouettes for the unapologetically you.',
        cta: 'Explore Collection',
        ctaLink: '/?category=women',
        accent: '#ff3f6c',
    },
    {
        img: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=1800',
        eyebrow: "MEN'S EDIT",
        title: 'Own\nEvery\nRoom.',
        sub: 'Refined basics meet statement pieces.',
        cta: 'Shop Men',
        ctaLink: '/?category=men',
        accent: '#1a1a2e',
    },
    {
        img: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1800',
        eyebrow: 'FLASH DEAL — 50% OFF',
        title: 'Limited\nDrops.',
        sub: 'Exclusive styles at impossible prices. Today only.',
        cta: 'Grab Now',
        ctaLink: '/?category=accessories',
        accent: '#f59e0b',
    },
];

const LOOKBOOK = [
    { img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800', label: 'Street Ready', tag: 'Up to 40% OFF', cat: 'women' },
    { img: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800', label: 'Urban Luxe', tag: 'New Arrivals', cat: 'men' },
    { img: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800', label: 'Party Edit', tag: 'Flat 30% OFF', cat: 'women' },
    { img: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800', label: 'Casual Drops', tag: 'Min 50% OFF', cat: 'men' },
    { img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800', label: 'Boho Vibes', tag: 'Trending', cat: 'women' },
];

const STYLE_DROPS = [
    { img: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600', name: 'Oversized Essentials', price: '₹799', old: '₹1,599', cat: 'men' },
    { img: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=600', name: 'Floral Summer Dress', price: '₹1,199', old: '₹2,499', cat: 'women' },
    { img: 'https://images.unsplash.com/photo-1614676471928-2ed0ad1061a4?w=600', name: 'Mini Crossbody Bag', price: '₹599', old: '₹1,299', cat: 'accessories' },
    { img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600', name: 'Glow Skincare Set', price: '₹999', old: '₹1,899', cat: 'beauty' },
];

const BRANDS = ['NIKE', 'LEVIS', 'ZARA', 'H&M', 'PUMA', 'GUCCI', 'ADIDAS', 'VERSACE', 'CALVIN KLEIN', 'MANGO'];

const QUIZ_OPTIONS = [
    { emoji: '🌸', label: 'Soft & Feminine', cat: 'women' },
    { emoji: '🖤', label: 'Dark & Edgy', cat: 'men' },
    { emoji: '🌿', label: 'Earthy & Calm', cat: 'beauty' },
    { emoji: '✨', label: 'Bold & Glam', cat: 'accessories' },
];

const CIRCULAR_CATEGORIES = [
    { name: 'Men', img: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=200', cat: 'men' },
    { name: 'Women', img: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200', cat: 'women' },
    { name: 'Kids', img: 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=200', cat: 'kids' },
    { name: 'Beauty', img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=200', cat: 'beauty' },
    { name: 'Accessories', img: 'https://images.unsplash.com/photo-1523779105320-d1cd346ff52b?w=200', cat: 'accessories' },
];

/* ─────────────────────────────── sub-components ─────────────────────────────── */

/** Animated infinite text marquee */
const Marquee = ({ items }) => {
    const doubled = [...items, ...items];
    return (
        <div style={{ overflow: 'hidden', background: '#0f0f0f', padding: 'clamp(12px, 2vh, 18px) 0', borderTop: '1px solid #222', borderBottom: '1px solid #222' }}>
            <div style={{ display: 'flex', gap: 'clamp(40px, 5vw, 80px)', animation: 'marquee 25s linear infinite', whiteSpace: 'nowrap', alignItems: 'center' }}>
                {doubled.map((b, i) => (
                    <span key={i} style={{ fontSize: 'clamp(16px, 3vw, 22px)', fontWeight: 900, color: i % 2 === 0 ? '#fff' : '#ff3f6c', letterSpacing: 'clamp(2px, 1vw, 4px)', flexShrink: 0 }}>
                        {b} <span style={{ color: '#333', fontSize: '12px' }}>✦</span>
                    </span>
                ))}
            </div>
        </div>
    );
};

/** Lookbook horizontal-scroll strip */
const LookbookStrip = ({ navigate }) => {
    const isMobile = useMobile(768);
    const ref = useRef();
    const scroll = (dir) => { ref.current.scrollBy({ left: dir * 320, behavior: 'smooth' }); };
    return (
        <div style={{ position: 'relative' }}>
            <button onClick={() => scroll(-1)} style={arrowBtn('left', isMobile)}><ChevronLeft size={20} /></button>
            <div ref={ref} style={{ display: 'flex', gap: '16px', overflowX: 'auto', scrollbarWidth: 'none', padding: '0 4px 8px' }}>
                {LOOKBOOK.map((item, i) => (
                    <div key={i} onClick={() => navigate(`/?category=${item.cat}`)}
                        style={{ flexShrink: 0, width: '260px', borderRadius: '16px', overflow: 'hidden', position: 'relative', cursor: 'pointer', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', transition: 'transform 0.3s ease' }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <img src={item.img} alt={item.label} style={{ width: '100%', height: '360px', objectFit: 'cover', display: 'block' }} />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 50%)' }} />
                        <div style={{ position: 'absolute', bottom: '20px', left: '18px', right: '18px' }}>
                            <span style={{ background: '#ff3f6c', color: '#fff', fontSize: '10px', fontWeight: 900, padding: '3px 10px', borderRadius: '20px', letterSpacing: '1px', textTransform: 'uppercase' }}>{item.tag}</span>
                            <p style={{ color: '#fff', fontWeight: 900, fontSize: '18px', marginTop: '8px' }}>{item.label}</p>
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={() => scroll(1)} style={arrowBtn('right', isMobile)}><ChevronRight size={20} /></button>
        </div>
    );
};

const arrowBtn = (side, isMobile) => ({
    position: 'absolute', [side]: isMobile ? '4px' : '-18px', top: '50%', transform: 'translateY(-50%)',
    zIndex: 5, background: '#fff', border: 'none', borderRadius: '50%',
    width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 14px rgba(0,0,0,0.15)', cursor: 'pointer',
});

/** Style drops cards */
const StyleDropCard = ({ item, navigate }) => {
    const [hovered, setHovered] = useState(false);
    const disc = Math.round((1 - parseInt(item.price.replace(/\D/g, '')) / parseInt(item.old.replace(/\D/g, ''))) * 100);
    return (
        <div onClick={() => navigate(`/?category=${item.cat}`)}
            onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
            style={{ cursor: 'pointer', borderRadius: '16px', overflow: 'hidden', background: '#fff', boxShadow: hovered ? '0 16px 40px rgba(0,0,0,0.14)' : '0 4px 16px rgba(0,0,0,0.06)', transition: 'box-shadow 0.3s ease, transform 0.3s ease', transform: hovered ? 'translateY(-6px)' : 'none' }}>
            <div style={{ position: 'relative', overflow: 'hidden' }}>
                <img src={item.img} alt={item.name} style={{ width: '100%', height: '280px', objectFit: 'cover', transition: 'transform 0.4s ease', transform: hovered ? 'scale(1.06)' : 'scale(1)' }} />
                <span style={{ position: 'absolute', top: '14px', left: '14px', background: '#ff3f6c', color: '#fff', fontSize: '11px', fontWeight: 900, padding: '4px 10px', borderRadius: '20px' }}>{disc}% OFF</span>
            </div>
            <div style={{ padding: '16px' }}>
                <p style={{ fontWeight: 700, fontSize: '14px', color: '#1a1a1a', marginBottom: '6px' }}>{item.name}</p>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontWeight: 900, fontSize: '16px', color: '#ff3f6c' }}>{item.price}</span>
                    <span style={{ fontSize: '13px', color: '#aaa', textDecoration: 'line-through' }}>{item.old}</span>
                </div>
            </div>
        </div>
    );
};

/** Style Quiz mini-section */
const StyleQuiz = ({ navigate }) => {
    const [chosen, setChosen] = useState(null);
    const ref = useRef();
    const visible = useIntersection(ref);
    return (
        <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(40px)', transition: 'all 0.8s ease', background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 100%)', color: '#fff', borderRadius: '24px', padding: 'clamp(40px, 8vw, 70px)', textAlign: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 900, letterSpacing: '3px', color: '#ff3f6c', textTransform: 'uppercase' }}>✦ Find Your Vibe</span>
            <h2 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, marginTop: '12px', marginBottom: '14px', lineHeight: 1.1 }}>What's Your Style?</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', marginBottom: '36px' }}>Pick a mood and we'll show you the perfect picks.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '14px', maxWidth: '640px', margin: '0 auto 36px' }}>
                {QUIZ_OPTIONS.map((opt, i) => (
                    <div key={i} onClick={() => setChosen(i)}
                        style={{ padding: '22px 12px', borderRadius: '16px', border: `2px solid ${chosen === i ? '#ff3f6c' : 'rgba(255,255,255,0.12)'}`, background: chosen === i ? 'rgba(255,63,108,0.15)' : 'rgba(255,255,255,0.04)', cursor: 'pointer', transition: 'all 0.25s ease', transform: chosen === i ? 'scale(1.05)' : 'scale(1)' }}>
                        <div style={{ fontSize: '32px', marginBottom: '10px' }}>{opt.emoji}</div>
                        <div style={{ fontWeight: 700, fontSize: '13px', letterSpacing: '0.5px' }}>{opt.label}</div>
                    </div>
                ))}
            </div>
            {chosen !== null && (
                <button onClick={() => navigate(`/?category=${QUIZ_OPTIONS[chosen].cat}`)}
                    style={{ background: '#ff3f6c', color: '#fff', border: 'none', borderRadius: '50px', padding: '14px 36px', fontWeight: 900, fontSize: '14px', letterSpacing: '1.5px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '10px', animation: 'fadeIn 0.4s ease' }}>
                    SHOW MY PICKS <ArrowRight size={16} />
                </button>
            )}
        </div>
    );
};

const ShopTheLook = ({ navigate }) => {
    const isMobile = useMobile(768);
    return (
        <div style={{ 
            display: 'grid', 
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
            gridTemplateRows: isMobile ? 'auto auto auto' : 'auto auto', 
            gap: 'clamp(10px, 2vw, 14px)' 
        }}>
            {/* Big left card */}
            <div onClick={() => navigate('/?category=women')} style={{ gridRow: isMobile ? 'auto' : '1 / 3', borderRadius: '20px', overflow: 'hidden', position: 'relative', cursor: 'pointer', minHeight: 'clamp(300px, 50vh, 460px)' }}
            onMouseEnter={e => e.currentTarget.querySelector('img').style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.querySelector('img').style.transform = 'scale(1)'}>
            <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900" alt="Women" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 55%)' }} />
            <div style={{ position: 'absolute', bottom: '28px', left: '28px', color: '#fff' }}>
                <span style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '3px', opacity: 0.8 }}>WOMEN'S EDIT</span>
                <h3 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 900, marginTop: '6px', lineHeight: 1.1 }}>This Season's Must-Haves</h3>
                <button style={{ marginTop: '16px', background: '#fff', color: '#000', border: 'none', borderRadius: '50px', padding: '10px 22px', fontWeight: 900, fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>SHOP NOW <ArrowRight size={13} /></button>
            </div>
        </div>
        {/* Top right */}
        <div onClick={() => navigate('/?category=men')} style={{ borderRadius: '20px', overflow: 'hidden', position: 'relative', cursor: 'pointer', minHeight: '216px' }}
            onMouseEnter={e => e.currentTarget.querySelector('img').style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.querySelector('img').style.transform = 'scale(1)'}>
            <img src="https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=700" alt="Men" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)' }} />
            <div style={{ position: 'absolute', bottom: '20px', left: '20px', color: '#fff' }}>
                <span style={{ fontSize: '10px', fontWeight: 900, letterSpacing: '2px', opacity: 0.8 }}>MEN'S COLLECTION</span>
                <h4 style={{ fontSize: '20px', fontWeight: 900, marginTop: '4px' }}>Sharp & Minimal</h4>
            </div>
        </div>
        {/* Bottom right */}
        <div onClick={() => navigate('/?category=beauty')} style={{ borderRadius: '20px', overflow: 'hidden', position: 'relative', cursor: 'pointer', minHeight: '216px', background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' }}
            onMouseEnter={e => e.currentTarget.querySelector('img').style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.querySelector('img').style.transform = 'scale(1)'}>
            <img src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=700" alt="Beauty" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)' }} />
            <div style={{ position: 'absolute', bottom: '20px', left: '20px', color: '#fff' }}>
                <span style={{ fontSize: '10px', fontWeight: 900, letterSpacing: '2px', opacity: 0.8 }}>BEAUTY & GLOW</span>
                <h4 style={{ fontSize: '20px', fontWeight: 900, marginTop: '4px' }}>Your Glow-Up Starts Here</h4>
            </div>
        </div>
    </div>
    );
};

/** Stats strip */
const StatsBadges = () => {
    const isMobile = useMobile(768);
    return (
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1px', background: '#eee', border: '1px solid #eee', borderRadius: '16px', overflow: 'hidden' }}>
            {[
                { icon: '🚀', num: '2M+', label: 'Happy Customers' },
                { icon: '📦', num: '50K+', label: 'Products' },
                { icon: '⚡', num: '24hr', label: 'Express Delivery' },
                { icon: '🔒', num: '100%', label: 'Secure Payments' },
            ].map((s, i) => (
                <div key={i} style={{ background: '#fff', padding: 'clamp(20px, 4vh, 28px) clamp(10px, 2vw, 20px)', textAlign: 'center' }}>
                    <div style={{ fontSize: 'clamp(22px, 4vw, 28px)', marginBottom: '6px' }}>{s.icon}</div>
                    <div style={{ fontSize: 'clamp(18px, 3vw, 24px)', fontWeight: 900, color: '#0f0f0f' }}>{s.num}</div>
                    <div style={{ fontSize: '10px', color: '#888', fontWeight: 600, marginTop: '4px', letterSpacing: '0.5px' }}>{s.label}</div>
                </div>
            ))}
        </div>
    );
};

/** Premium Scroll Progress Bar */
const ScrollProgress = () => {
    const progress = useScrollProgress();
    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '3px', background: 'rgba(0,0,0,0.05)', zIndex: 9999 }}>
            <div style={{ width: `${progress}%`, height: '100%', background: 'var(--accent)', transition: 'width 0.1s ease-out', boxShadow: '0 0 10px var(--accent)' }} />
        </div>
    );
};

/** Floating glassmorphic ornaments */
const FloatingBackground = () => (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: -1, overflow: 'hidden', opacity: 0.4 }}>
        <div style={{ position: 'absolute', top: '10%', left: '-5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(255,63,108,0.1) 0%, transparent 70%)', filter: 'blur(60px)', animation: 'float 20s infinite alternate' }} />
        <div style={{ position: 'absolute', bottom: '15%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(26,26,46,0.05) 0%, transparent 70%)', filter: 'blur(80px)', animation: 'float 25s infinite alternate-reverse' }} />
    </div>
);

/** Editorial Designer Spotlight */
const DesignerSpotlight = () => {
    const isMobile = useMobile(992);
    return (
        <div className="glass" style={{
            marginTop: '100px',
            borderRadius: '32px',
            overflow: 'hidden',
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
            border: '1px solid rgba(0,0,0,0.05)',
            boxShadow: '0 30px 60px rgba(0,0,0,0.04)'
        }}>
            <div style={{ padding: 'clamp(40px, 8vw, 80px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 900, letterSpacing: '4px', color: '#ff3f6c', textTransform: 'uppercase', display: 'block', marginBottom: '16px' }}>✦ DESIGNER SPOTLIGHT</span>
                <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 950, lineHeight: 1, marginBottom: '24px', letterSpacing: '-2px' }}>Aya <br/> Takano</h2>
                <p style={{ fontSize: 'clamp(15px, 2vw, 18px)', color: '#555', lineHeight: 1.6, marginBottom: '32px', fontStyle: 'italic', position: 'relative', paddingLeft: '20px', borderLeft: '4px solid #ff3f6c' }}>
                    "Fashion is the armor to survive the reality of everyday life. We design for the dreamers who walk among us."
                </p>
                <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
                    <div>
                        <div style={{ fontSize: '24px', fontWeight: 900 }}>2026</div>
                        <div style={{ fontSize: '11px', color: '#888', fontWeight: 700, letterSpacing: '1px' }}>WINTER DROP</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '24px', fontWeight: 900 }}>PARIS</div>
                        <div style={{ fontSize: '11px', color: '#888', fontWeight: 700, letterSpacing: '1px' }}>STUDIO</div>
                    </div>
                </div>
            </div>
            <div style={{ height: 'clamp(400px, 60vh, 600px)', position: 'relative' }}>
                <img src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1200" alt="Designer" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(255,255,255,0.1), transparent)' }} />
            </div>
        </div>
    );
};

/* ─────────────────────────────── MAIN HOME ─────────────────────────────── */
const Home = () => {
    const { user } = useAuth();
    const isMobile = useMobile(768);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('search') || '';
    const categoryFilter = searchParams.get('category') || '';
    const [sort, setSort] = useState('recommended');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [activeSlide, setActiveSlide] = useState(0);

    // Hero auto-play
    useEffect(() => {
        const t = setInterval(() => setActiveSlide(p => (p + 1) % HERO_SLIDES.length), 5000);
        return () => clearInterval(t);
    }, []);

    // Sort
    useEffect(() => {
        let result = [...products];
        if (sort === 'priceLow') result.sort((a, b) => a.price - b.price);
        else if (sort === 'priceHigh') result.sort((a, b) => b.price - a.price);
        setFilteredProducts(result);
    }, [products, sort]);

    // Fetch
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (query) params.append('search', query);
                if (categoryFilter) params.append('category', categoryFilter);
                const res = await axios.get(`/api/products?${params.toString()}`);
                setProducts(res.data);
            } catch (err) {
                console.error('Error fetching products', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [query, categoryFilter]);

    useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [query, categoryFilter]);

    const slide = HERO_SLIDES[activeSlide];

    // ── CATEGORY / SEARCH VIEW ──
    if (query || categoryFilter) {
        const banner = {
            men: { img: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=1600', title: "MEN'S COLLECTION", sub: 'Elevate your style with our premium essentials.' },
            women: { img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600', title: "WOMEN'S EDIT", sub: 'Curated styles for the modern woman.' },
            kids: { img: 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=1600', title: 'THE KIDS CLUB', sub: 'Playful designs for every little adventure.' },
            beauty: { img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1600', title: 'BEAUTY & BEYOND', sub: 'Discover your glow with our latest finds.' },
            accessories: { img: 'https://images.unsplash.com/photo-1523779105320-d1cd346ff52b?w=1600', title: 'ACCESSORIES', sub: 'Finish every look with the perfect piece.' },
        }[categoryFilter?.toLowerCase()];

        return (
            <div style={{ backgroundColor: '#fff' }}>
                {/* Category hero banner */}
                {banner && !query && (
                    <div className="container" style={{ marginBottom: '30px', borderRadius: '16px', overflow: 'hidden', position: 'relative' }}>
                        <div style={{ paddingBottom: '32%', minHeight: '300px', position: 'relative' }}>
                            <img src={banner.img} alt={banner.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.65) 0%, transparent 70%)', display: 'flex', alignItems: 'center', padding: '0 5%' }}>
                                <div style={{ color: '#fff' }}>
                                    <h2 style={{ fontSize: 'clamp(22px, 5vw, 48px)', fontWeight: 900 }}>{banner.title}</h2>
                                    <p style={{ fontSize: 'clamp(13px, 2vw, 18px)', opacity: 0.85, marginTop: 8 }}>{banner.sub}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Product grid */}
                <div className="container" style={{ padding: '0 0 60px' }}>
                    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #eaeaec', paddingBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
                        <div>
                            <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#282c3f', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                {categoryFilter ? (categoryFilter.toUpperCase() === 'BEAUTY' ? 'Beauty & Personal Care' : categoryFilter.toUpperCase() === 'ACCESSORIES' ? 'Accessories' : `${categoryFilter.toUpperCase()}'S WEAR`) : `RESULTS FOR "${query.toUpperCase()}"`}
                            </h2>
                            <p style={{ fontSize: '13px', color: '#7e818c', marginTop: 3 }}>{filteredProducts.length} items</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '13px', color: '#7e818c' }}>Sort by:</span>
                            <select className="sort-dropdown" value={sort} onChange={e => setSort(e.target.value)}>
                                <option value="recommended">Recommended</option>
                                <option value="priceLow">Price: Low to High</option>
                                <option value="priceHigh">Price: High to Low</option>
                            </select>
                        </div>
                    </header>
                    {loading ? (
                        <div className="text-center py-20"><ShoppingBag size={48} className="text-flash-sale opacity-50" /></div>
                    ) : filteredProducts.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '100px 0' }}>
                            <Search size={64} color="#eaeaec" style={{ marginBottom: 20 }} />
                            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#3e4152' }}>WE COULD NOT FIND ANYTHING</h3>
                            <p style={{ color: '#7e818c', fontSize: '14px', marginTop: '10px' }}>Try different keywords or browse our categories.</p>
                            <button onClick={() => navigate('/')} className="btn" style={{ marginTop: '30px', backgroundColor: '#ff3f6c', color: '#fff' }}>CLEAR FILTERS</button>
                        </div>
                    ) : (
                        <div className="product-grid">
                            {filteredProducts.map(product => <ProductCard key={product.id} product={product} />)}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // ── HOME VIEW ──
    return (
        <div style={{ backgroundColor: '#fff', position: 'relative' }}>
            <ScrollProgress />
            <FloatingBackground />

            {/* ── HERO ── */}
            <div style={{ position: 'relative', overflow: 'hidden', height: 'clamp(400px, 75vh, 800px)' }}>
                {HERO_SLIDES.map((s, i) => (
                    <div key={i} style={{ position: 'absolute', inset: 0, opacity: i === activeSlide ? 1 : 0, transition: 'opacity 0.9s ease', pointerEvents: i === activeSlide ? 'auto' : 'none' }}>
                        <img src={s.img} alt={s.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(100deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 60%)' }} />
                    </div>
                ))}
                {/* Text */}
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', padding: '0 clamp(16px, 6vw, 120px)' }}>
                    <div key={activeSlide} style={{ color: '#fff', animation: 'fadeIn 0.7s ease', maxWidth: '100%' }}>
                        <span style={{ fontSize: 'clamp(9px, 2vw, 11px)', fontWeight: 900, letterSpacing: 'clamp(2px, 1vw, 4px)', color: slide.accent, textTransform: 'uppercase' }}>✦ {slide.eyebrow}</span>
                        <h1 style={{ fontSize: 'clamp(32px, 8vw, 100px)', fontWeight: 900, lineHeight: 0.95, marginTop: 'clamp(8px, 2vh, 12px)', whiteSpace: 'pre-line', textShadow: '0 4px 30px rgba(0,0,0,0.3)' }}>{slide.title}</h1>
                        <p style={{ fontSize: 'clamp(13px, 3vw, 20px)', opacity: 0.85, marginTop: '16px', maxWidth: '440px', lineHeight: 1.5 }}>{slide.sub}</p>
                        <button onClick={() => navigate(slide.ctaLink)}
                            style={{ marginTop: 'clamp(20px, 4vh, 28px)', background: slide.accent === '#ff3f6c' ? '#ff3f6c' : '#fff', color: slide.accent === '#ff3f6c' ? '#fff' : '#000', border: 'none', borderRadius: '50px', padding: 'clamp(10px, 2vh, 14px) clamp(24px, 4vw, 32px)', fontWeight: 900, fontSize: 'clamp(11px, 2vw, 13px)', letterSpacing: '1.5px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                            {slide.cta} <ArrowRight size={15} />
                        </button>
                    </div>
                </div>
                {/* Indicators */}
                <div style={{ position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px' }}>
                    {HERO_SLIDES.map((_, i) => (
                        <button key={i} onClick={() => setActiveSlide(i)} style={{ width: i === activeSlide ? '28px' : '8px', height: '8px', borderRadius: '4px', border: 'none', background: i === activeSlide ? '#ff3f6c' : 'rgba(255,255,255,0.5)', cursor: 'pointer', transition: 'all 0.3s ease', padding: 0 }} />
                    ))}
                </div>
                {/* Arrows */}
                <button onClick={() => setActiveSlide(p => (p - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)} className="desktop-only" style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '50%', width: '46px', height: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}><ChevronLeft size={22} /></button>
                <button onClick={() => setActiveSlide(p => (p + 1) % HERO_SLIDES.length)} className="desktop-only" style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '50%', width: '46px', height: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}><ChevronRight size={22} /></button>
            </div>

            {/* ── BRAND MARQUEE ── */}
            <Marquee items={BRANDS} />

            {/* ── CATEGORY CIRCLES ── */}
            <div className="container" style={{ padding: '50px 0 10px' }}>
                <Reveal>
                    <div style={{ display: 'flex', gap: 'clamp(20px, 4vw, 50px)', overflowX: 'auto', justifyContent: isMobile ? 'flex-start' : 'center', paddingBottom: '12px', paddingLeft: isMobile ? '16px' : '0' }} className="hide-scrollbar">
                        {CIRCULAR_CATEGORIES.map((item, i) => (
                            <div key={i} onClick={() => navigate(`/?category=${item.cat}`)} style={{ textAlign: 'center', cursor: 'pointer', flexShrink: 0 }} className="category-circle">
                                <div style={{ width: 'clamp(64px, 12vw, 90px)', height: 'clamp(64px, 12vw, 90px)', borderRadius: '50%', overflow: 'hidden', marginBottom: 8, border: '2px solid #f0f0f0', boxShadow: '0 4px 14px rgba(0,0,0,0.08)' }}>
                                    <img src={item.img} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <span style={{ fontSize: 'clamp(10px, 2vw, 11px)', fontWeight: 700, color: '#282c3f', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.name}</span>
                            </div>
                        ))}
                    </div>
                </Reveal>
            </div>

            {/* ── LOOKBOOK STRIP ── */}
            <div className="container" style={{ padding: '50px 0' }}>
                <Reveal>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
                        <div>
                            <span style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '3px', color: '#ff3f6c' }}>✦ CURATED FOR YOU</span>
                            <h2 style={{ fontSize: 'clamp(20px, 4vw, 36px)', fontWeight: 900, color: '#0f0f0f', marginTop: '6px' }}>Lookbook 2026</h2>
                        </div>
                        <button onClick={() => navigate('/?category=women')} style={{ background: 'transparent', border: '2px solid #0f0f0f', borderRadius: '50px', padding: '8px 18px', fontWeight: 900, fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', letterSpacing: '1px' }}>VIEW ALL <ArrowRight size={13} /></button>
                    </div>
                </Reveal>
                <LookbookStrip navigate={navigate} />
            </div>

            {/* ── STYLE DROPS ── */}
            <div style={{ background: '#f9f9f9', padding: '60px 0' }}>
                <div className="container">
                    <Reveal>
                        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                            <span style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '3px', color: '#ff3f6c' }}>✦ HANDPICKED</span>
                            <h2 style={{ fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 900, color: '#0f0f0f', marginTop: '6px' }}>Style Drops 🔥</h2>
                            <p style={{ color: '#888', fontSize: '14px', marginTop: '8px' }}>Curated picks across every category — changing every day.</p>
                        </div>
                    </Reveal>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                        {STYLE_DROPS.map((item, i) => (
                            <Reveal key={i} delay={i * 0.1}>
                                <StyleDropCard item={item} navigate={navigate} />
                            </Reveal>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── STATS ── */}
            <div className="container" style={{ padding: '60px 0' }}>
                <Reveal><StatsBadges /></Reveal>
            </div>

            {/* ── SHOP THE LOOK BENTO ── */}
            <div className="container" style={{ padding: '0 0 60px' }}>
                <Reveal>
                    <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '3px', color: '#ff3f6c' }}>✦ EDITORIAL</span>
                        <h2 style={{ fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 900, color: '#0f0f0f', marginTop: '6px' }}>Shop The Look</h2>
                    </div>
                </Reveal>
                <Reveal delay={0.1}>
                    <ShopTheLook navigate={navigate} />
                </Reveal>

                {/* ── DESIGNER SPOTLIGHT ── */}
                <Reveal delay={0.2}>
                    <DesignerSpotlight />
                </Reveal>
            </div>

            {/* ── STYLE QUIZ ── */}
            <div className="container" style={{ padding: '0 0 70px' }}>
                <StyleQuiz navigate={navigate} />
            </div>

            {/* ── NEWSLETTER ── */}
            <div style={{ background: '#0f0f0f', padding: 'clamp(50px, 8vw, 90px) 0' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <Reveal>
                        <span style={{ fontSize: '11px', color: '#ff3f6c', fontWeight: 900, letterSpacing: '3px' }}>✦ STAY IN THE LOOP</span>
                        <h2 style={{ fontSize: 'clamp(22px, 5vw, 42px)', fontWeight: 900, color: '#fff', marginTop: '12px', marginBottom: '8px' }}>Drop Alerts. Exclusive Deals.</h2>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '32px' }}>No spam. Just the hottest drops, straight to your inbox.</p>
                        <form onSubmit={e => { e.preventDefault(); alert('You\'re in! 🎉'); }} style={{ display: 'flex', gap: '12px', maxWidth: '480px', margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' }}>
                            <input type="email" required placeholder="Enter your email" style={{ flex: 1, minWidth: '240px', padding: '14px 20px', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.07)', color: '#fff', outline: 'none', fontSize: '14px' }} />
                            <button type="submit" style={{ background: '#ff3f6c', color: '#fff', border: 'none', borderRadius: '50px', padding: '14px 32px', fontWeight: 900, fontSize: '13px', letterSpacing: '1.5px', cursor: 'pointer', whiteSpace: 'nowrap' }}>SUBSCRIBE</button>
                        </form>
                    </Reveal>
                </div>
            </div>
        </div>
    );
};

export default Home;
