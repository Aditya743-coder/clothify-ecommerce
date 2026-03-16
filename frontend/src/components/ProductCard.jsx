import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import useMobile from '../hooks/useMobile';

const BRANDS = ['Roadster', 'HRX', 'WROGN', 'Mast & Harbour', 'Anouk', 'Puma', 'H&M', 'Zara', 'Nike', 'Levis'];

// Pseudo-random ratings seeded by product id
const getRating = (id) => (3.8 + (id % 12) * 0.1).toFixed(1);
const getReviews = (id) => `${((id * 137 + 500) % 4500 + 300).toLocaleString()}`;

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const isMobile = useMobile(768);
    
    if (!product) return null;

    const brand = BRANDS[product.id % BRANDS.length];
    const originalPrice = Math.round((product.price || 0) * 1.5);
    const discount = Math.round((1 - (product.price || 0) / (originalPrice || 1)) * 100);
    const rating = getRating(product.id || 0);
    const reviews = getReviews(product.id || 0);

    const [hovered, setHovered] = useState(false);
    const [wishlisted, setWishlisted] = useState(false);
    const [added, setAdded] = useState(false);

    const handleAdd = async (e) => {
        e.preventDefault();
        const success = await addToCart(product.id);
        if (success) {
            setAdded(true);
            setTimeout(() => setAdded(false), 1800);
        }
    };

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                backgroundColor: '#fff',
                borderRadius: '16px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                boxShadow: hovered
                    ? '0 20px 50px rgba(0,0,0,0.13)'
                    : '0 2px 12px rgba(0,0,0,0.06)',
                transition: 'box-shadow 0.35s ease, transform 0.35s ease',
                transform: hovered ? 'translateY(-6px)' : 'none',
                cursor: 'pointer',
                position: 'relative',
                minWidth: '160px',
            }}
        >
            {/* ── Image ── */}
            <div style={{ position: 'relative', height: '300px', overflow: 'hidden', flexShrink: 0 }}>
                <Link to={`/product/${product.id}`}>
                    <img
                        src={product.image_url}
                        alt={product.name}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.5s ease',
                            transform: hovered ? 'scale(1.08)' : 'scale(1)',
                            display: 'block',
                        }}
                    />
                </Link>

                {/* Discount badge */}
                <span style={{
                    position: 'absolute', top: '12px', left: '12px',
                    background: '#ff3f6c', color: '#fff',
                    fontSize: '11px', fontWeight: 900,
                    padding: '4px 10px', borderRadius: '20px',
                    letterSpacing: '0.5px',
                }}>
                    {discount}% OFF
                </span>

                {/* Wishlist */}
                <button
                    onClick={(e) => { e.preventDefault(); setWishlisted(w => !w); }}
                    style={{
                        position: 'absolute', top: '12px', right: '12px',
                        background: 'rgba(255,255,255,0.92)',
                        border: 'none', borderRadius: '50%',
                        width: '36px', height: '36px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        transition: 'transform 0.2s ease',
                        transform: wishlisted ? 'scale(1.2)' : 'scale(1)',
                    }}
                >
                    <Heart
                        size={17}
                        fill={wishlisted ? '#ff3f6c' : 'none'}
                        color={wishlisted ? '#ff3f6c' : '#555'}
                        style={{ transition: 'all 0.2s ease' }}
                    />
                </button>

                {/* Rating chip */}
                <div style={{
                    position: 'absolute', bottom: '12px', left: '12px',
                    background: 'rgba(255,255,255,0.95)',
                    padding: '3px 10px', borderRadius: '20px',
                    fontSize: '11px', fontWeight: 700,
                    display: 'flex', alignItems: 'center', gap: '4px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    color: '#282c3f',
                }}>
                    ⭐ {rating} <span style={{ color: '#aaa', fontWeight: 400 }}>({reviews})</span>
                </div>

                <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    transform: (hovered || isMobile) ? 'translateY(0)' : 'translateY(100%)',
                    transition: 'transform 0.32s cubic-bezier(0.4, 0, 0.2, 1)',
                    background: added
                        ? 'linear-gradient(135deg, #00b09b, #22c55e)'
                        : 'linear-gradient(135deg, #ff3f6c, #ff6b35)',
                    padding: 'clamp(8px, 2vh, 13px) 16px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                }}>
                    <button
                        onClick={handleAdd}
                        style={{
                            background: 'transparent', border: 'none',
                            color: '#fff', fontWeight: 900, fontSize: '13px',
                            letterSpacing: '1.5px', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '8px',
                            width: '100%', justifyContent: 'center',
                        }}
                    >
                        {added ? (
                            <>✓ ADDED TO BAG</>
                        ) : (
                            <><ShoppingBag size={15} /> QUICK ADD</>
                        )}
                    </button>
                </div>
            </div>

            {/* ── Info ── */}
            <div style={{ padding: 'clamp(10px, 2vh, 14px) clamp(10px, 2vw, 16px) clamp(14px, 3vh, 18px)', display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                <span style={{
                    fontSize: '10px', fontWeight: 900, letterSpacing: '2px',
                    color: '#aaa', textTransform: 'uppercase',
                }}>
                    {brand}
                </span>
                <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
                    <p style={{
                        fontSize: '14px', fontWeight: 600, color: '#1a1a1a',
                        margin: 0, overflow: 'hidden', textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap', lineHeight: 1.4,
                    }}>
                        {product.name}
                    </p>
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 900, fontSize: '16px', color: '#0f0f0f' }}>
                        ₹{(product.price || 0).toLocaleString()}
                    </span>
                    <span style={{ fontSize: '13px', color: '#bbb', textDecoration: 'line-through' }}>
                        ₹{originalPrice.toLocaleString()}
                    </span>
                    <span style={{ fontSize: '12px', color: '#22c55e', fontWeight: 800 }}>
                        ₹{(originalPrice - (product.price || 0)).toLocaleString()} off
                    </span>
                </div>

                {/* Free delivery tag */}
                {product.price > 499 && (
                    <span style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
                        🚚 <strong>Free delivery</strong>
                    </span>
                )}
            </div>
        </div>
    );
};

export default ProductCard;
