const db = require('./database');
const bcrypt = require('bcryptjs');

const products = [
    // ─────────────── MEN (10 products) ───────────────
    {
        name: 'Classic White Tee',
        description: 'A premium 100% cotton white t-shirt perfect for everyday wear.',
        price: 1999, category: 'men', sub_category: 't-shirts',
        image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop', stock: 50
    },
    {
        name: 'Oversized Black Hoodie',
        description: 'Ultra-soft fleece hoodie with kangaroo pocket for ultimate comfort.',
        price: 3499, category: 'men', sub_category: 'outerwear',
        image_url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop', stock: 25
    },
    {
        name: 'Slim Fit Blue Jeans',
        description: 'Durable denim with a modern slim silhouette for a sharp look.',
        price: 4499, category: 'men', sub_category: 'pants',
        image_url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&auto=format&fit=crop', stock: 30
    },
    {
        name: 'Flannel Check Shirt',
        description: 'Classic lumberjack-style flannel shirt for a rugged, casual look.',
        price: 2999, category: 'men', sub_category: 'shirts',
        image_url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop', stock: 40
    },
    {
        name: 'Navy Blue Chinos',
        description: 'Versatile chino pants that bridge smart and casual effortlessly.',
        price: 3999, category: 'men', sub_category: 'pants',
        image_url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop', stock: 35
    },
    {
        name: 'Striped Polo T-Shirt',
        description: 'Breathable pique cotton polo with bold horizontal stripes.',
        price: 2499, category: 'men', sub_category: 't-shirts',
        image_url: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=800&auto=format&fit=crop', stock: 45
    },
    {
        name: 'Leather Biker Jacket',
        description: 'Premium faux leather jacket with silver hardware and zip pockets.',
        price: 8999, category: 'men', sub_category: 'outerwear',
        image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop', stock: 12
    },
    {
        name: 'Formal White Dress Shirt',
        description: 'Crisp broadcloth shirt perfect for office and formal occasions.',
        price: 3299, category: 'men', sub_category: 'shirts',
        image_url: 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=800&auto=format&fit=crop', stock: 28
    },
    {
        name: 'Cargo Shorts',
        description: 'Multi-pocket cargo shorts in a relaxed summer fit.',
        price: 1799, category: 'men', sub_category: 'pants',
        image_url: 'https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=800&auto=format&fit=crop', stock: 55
    },
    {
        name: 'Graphic Print Tee',
        description: 'Oversized streetwear tee with bold graphic print on the chest.',
        price: 2199, category: 'men', sub_category: 't-shirts',
        image_url: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&auto=format&fit=crop', stock: 60
    },

    // ─────────────── WOMEN (10 products) ───────────────
    {
        name: 'Ribbed Crop Top',
        description: 'Versatile ribbed cotton top that pairs beautifully with anything.',
        price: 1499, category: 'women', sub_category: 'tops',
        image_url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop', stock: 60
    },
    {
        name: 'High-Waisted Mom Jeans',
        description: 'Retro-inspired fit with a comfortable high waist and tapered leg.',
        price: 3999, category: 'women', sub_category: 'pants',
        image_url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop', stock: 35
    },
    {
        name: 'Beige Trench Coat',
        description: 'Timeless double-breasted outerwear for sophisticated everyday styling.',
        price: 7999, category: 'women', sub_category: 'outerwear',
        image_url: 'https://images.unsplash.com/photo-1591047139829-d91aec16adbb?w=800&auto=format&fit=crop', stock: 15
    },
    {
        name: 'Floral Summer Dress',
        description: 'Breezy light dress with a delicate vintage floral print.',
        price: 4999, category: 'women', sub_category: 'dresses',
        image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop', stock: 20
    },
    {
        name: 'Wrap Midi Dress',
        description: 'Elegant wrap-style midi dress in a flattering silhouette.',
        price: 5499, category: 'women', sub_category: 'dresses',
        image_url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop', stock: 18
    },
    {
        name: 'Linen Wide-Leg Trousers',
        description: 'Relaxed breathable linen pants for a chic, easy look.',
        price: 3299, category: 'women', sub_category: 'pants',
        image_url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&auto=format&fit=crop', stock: 22
    },
    {
        name: 'Knitted Cardigan',
        description: 'Cozy open-front knit cardigan in a soft neutral palette.',
        price: 4299, category: 'women', sub_category: 'outerwear',
        image_url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&auto=format&fit=crop', stock: 30
    },
    {
        name: 'Satin Blouse',
        description: 'Sleek satin-finish blouse with a relaxed, flowing drape.',
        price: 2799, category: 'women', sub_category: 'tops',
        image_url: 'https://images.unsplash.com/photo-1578681994506-b8f463449011?w=800&auto=format&fit=crop', stock: 40
    },
    {
        name: 'Pleated Mini Skirt',
        description: 'Trendy pleated mini skirt perfect for casual and evening outfits.',
        price: 2199, category: 'women', sub_category: 'skirts',
        image_url: 'https://images.unsplash.com/photo-1577900232427-18219b9166a0?w=800&auto=format&fit=crop', stock: 25
    },
    {
        name: 'Printed Kurta Set',
        description: 'Elegant ethnic kurta and palazzo set with intricate block print.',
        price: 3999, category: 'women', sub_category: 'ethnic',
        image_url: 'https://images.unsplash.com/photo-1612965110667-4175024b0f44?w=800&auto=format&fit=crop', stock: 20
    },

    // ─────────────── KIDS (10 products) ───────────────
    {
        name: 'Cotton Dungarees',
        description: 'Soft cotton dungarees for maximum comfort during play time.',
        price: 1299, category: 'kids', sub_category: 'clothing',
        image_url: 'https://images.unsplash.com/photo-1519706332590-c675b7578ec3?w=800&auto=format&fit=crop', stock: 40
    },
    {
        name: 'Dinosaur Print Tee',
        description: 'Fun dino graphic t-shirt in 100% organic cotton.',
        price: 799, category: 'kids', sub_category: 'clothing',
        image_url: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&auto=format&fit=crop', stock: 100
    },
    {
        name: 'Rainbow Hoodie',
        description: 'Bright and cheerful rainbow-print hoodie for chilly days.',
        price: 1599, category: 'kids', sub_category: 'outerwear',
        image_url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop', stock: 50
    },
    {
        name: 'Floral Frock',
        description: 'Pretty floral cotton frock with a layered skirt and ribbon bow.',
        price: 1099, category: 'kids', sub_category: 'dresses',
        image_url: 'https://images.unsplash.com/photo-1476234251651-f353703a034d?w=800&auto=format&fit=crop', stock: 35
    },
    {
        name: 'Striped Pyjama Set',
        description: 'Super-soft jersey pyjama set for a good night\'s sleep.',
        price: 899, category: 'kids', sub_category: 'nightwear',
        image_url: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&auto=format&fit=crop', stock: 70
    },
    {
        name: 'Denim Jacket – Kids',
        description: 'Classic denim jacket that pairs with anything in the wardrobe.',
        price: 1999, category: 'kids', sub_category: 'outerwear',
        image_url: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop', stock: 28
    },
    {
        name: 'Cartoon Backpack',
        description: 'Lightweight school backpack with fun cartoon character print.',
        price: 1299, category: 'kids', sub_category: 'accessories',
        image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop', stock: 45
    },
    {
        name: 'Jogger Pants – Kids',
        description: 'Elastic-waist joggers in soft jersey, great for sports or play.',
        price: 999, category: 'kids', sub_category: 'clothing',
        image_url: 'https://images.unsplash.com/photo-1604671801908-6f0c6a092c05?w=800&auto=format&fit=crop', stock: 65
    },
    {
        name: 'Glow-in-the-Dark Tee',
        description: 'Novelty kids tee that glows in the dark — a bedtime favourite.',
        price: 899, category: 'kids', sub_category: 'clothing',
        image_url: 'https://images.unsplash.com/photo-1591047139829-d91aec16adbb?w=800&auto=format&fit=crop', stock: 80
    },
    {
        name: 'Sneakers – Kids',
        description: 'Lightweight velcro sneakers perfect for tiny active feet.',
        price: 1499, category: 'kids', sub_category: 'footwear',
        image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop', stock: 30
    },

    // ─────────────── BEAUTY (10 products) ───────────────
    {
        name: 'Hydrating Face Serum',
        description: 'Vitamin C and Hyaluronic acid serum for a radiant glow.',
        price: 1499, category: 'beauty', sub_category: 'skincare',
        image_url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop', stock: 25
    },
    {
        name: 'Matte Liquid Lipstick',
        description: 'Long-lasting, smudge-proof matte lipstick in 12 bold shades.',
        price: 999, category: 'beauty', sub_category: 'makeup',
        image_url: 'https://images.unsplash.com/photo-1586776191368-d39b4b07040d?auto=format&fit=crop&q=80&w=800', stock: 80
    },
    {
        name: 'Nourishing Hair Mask',
        description: 'Keratin-infused hair mask for silky smooth, frizz-free hair.',
        price: 799, category: 'beauty', sub_category: 'haircare',
        image_url: 'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=800&auto=format&fit=crop', stock: 50
    },
    {
        name: 'Rose Perfume 50ml',
        description: 'Delicate floral fragrance with notes of rose, jasmine and musk.',
        price: 2499, category: 'beauty', sub_category: 'fragrance',
        image_url: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=800&auto=format&fit=crop', stock: 20
    },
    {
        name: 'SPF 50 Sunscreen',
        description: 'Lightweight, non-greasy gel sunscreen with broad-spectrum SPF 50.',
        price: 699, category: 'beauty', sub_category: 'skincare',
        image_url: 'https://images.unsplash.com/photo-1542315204-b8d7ce4bdc18?w=800&auto=format&fit=crop', stock: 60
    },
    {
        name: 'Eyebrow Pencil Kit',
        description: 'Precision pencil and spoolie brush for perfectly shaped brows.',
        price: 599, category: 'beauty', sub_category: 'makeup',
        image_url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&auto=format&fit=crop', stock: 90
    },
    {
        name: 'Retinol Night Cream',
        description: 'Anti-aging retinol cream that repairs skin while you sleep.',
        price: 1999, category: 'beauty', sub_category: 'skincare',
        image_url: 'https://images.unsplash.com/photo-1601049676869-702ea24cfd58?w=800&auto=format&fit=crop', stock: 30
    },
    {
        name: 'Charcoal Face Wash',
        description: 'Deep-cleansing charcoal gel that removes impurities and unclogs pores.',
        price: 499, category: 'beauty', sub_category: 'skincare',
        image_url: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&auto=format&fit=crop', stock: 75
    },
    {
        name: 'Nail Polish Set (6 Colours)',
        description: 'Chip-resistant nail polish set in 6 trending pastel shades.',
        price: 799, category: 'beauty', sub_category: 'makeup',
        image_url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&auto=format&fit=crop', stock: 55
    },
    {
        name: 'Argan Oil Hair Serum',
        description: 'Pure argan oil serum for shiny, tangle-free, healthy-looking hair.',
        price: 1199, category: 'beauty', sub_category: 'haircare',
        image_url: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800&auto=format&fit=crop', stock: 40
    },

    // ─────────────── ACCESSORIES (5 products) ───────────────
    {
        name: 'Minimalist Leather Watch',
        description: 'Elegant timepiece with a genuine leather strap and Japanese movement.',
        price: 5999, category: 'accessories', sub_category: 'watches',
        image_url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&auto=format&fit=crop', stock: 15
    },
    {
        name: 'Classic Aviator Sunglasses',
        description: 'Timeless UV400 protection with a stylish metal frame.',
        price: 1950, category: 'accessories', sub_category: 'eyewear',
        image_url: 'https://images.unsplash.com/photo-1511499767390-90342f5b89a7?w=800&auto=format&fit=crop', stock: 60
    },
    {
        name: 'Canvas Tote Bag',
        description: 'Sturdy everyday tote in natural canvas with inner zip pocket.',
        price: 1299, category: 'accessories', sub_category: 'bags',
        image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop', stock: 45
    },
    {
        name: 'Stainless Steel Belt',
        description: 'Classic pin-buckle belt in matte stainless steel and leather.',
        price: 1499, category: 'accessories', sub_category: 'belts',
        image_url: 'https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?w=800&auto=format&fit=crop', stock: 35
    },
    {
        name: 'Silk Pocket Square',
        description: 'Woven silk pocket square in a classic paisley pattern.',
        price: 799, category: 'accessories', sub_category: 'formal',
        image_url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop', stock: 50
    }
];

const seedDatabase = () => {
    return new Promise((resolve, reject) => {
        console.log('[SEED] Checking if database needs seeding...');
        db.get(`SELECT COUNT(*) as count FROM products`, (err, row) => {
            if (err) {
                console.error('[SEED] Error checking product count:', err.message);
                return reject(err);
            }

            if (row && row.count > 0) {
                console.log('[SEED] Database already contains products. Skipping seeding.');
                return resolve();
            }

            console.log('[SEED] Database is empty. Starting seeding...');
            db.serialize(() => {
                const stmt = db.prepare(`INSERT INTO products (name, description, price, category, sub_category, image_url, stock) VALUES (?, ?, ?, ?, ?, ?, ?)`);
                products.forEach(p => {
                    stmt.run(p.name, p.description, p.price, p.category, p.sub_category, p.image_url, p.stock);
                });
                stmt.finalize();

                db.get(`SELECT * FROM users WHERE username = 'admin'`, (err, row) => {
                    if (!row) {
                        const adminHash = bcrypt.hashSync('admin123', 10);
                        db.run(`INSERT INTO users (username, email, password_hash, is_admin) VALUES (?, ?, ?, ?)`, ['admin', 'admin@clothify.com', adminHash, 1]);
                    }
                    console.log('[SEED] Database seeding completed successfully.');
                    resolve();
                });
            });
        });
    });
};

module.exports = seedDatabase;
