/**
 * VERDANTA WORLD - ADMIN PORTAL JAVASCRIPT
 * Full CRUD for Products, Proposals, Orders, and Live Storefront Synchronization
 */

// Central Category Taxonomy for Category-Wise Product Management
const DEFAULT_CATEGORIES = [
  // --- 1. SHOP COLLECTIONS ---
  {
    id: 'artisan-gallery',
    channel: 'shop',
    channelName: 'Shop Collections',
    name: 'Artisan Gallery',
    displayName: '1. Artisan Gallery',
    badge: 'Collection 01',
    description: 'Earthen terracotta vases, sculpted clay urns, ambient lamps, and organic sabai grass handwoven creations.',
    icon: 'fa-palette',
    image: 'images/artisan-gallery.jpg',
    subCategories: [
      'Lamps & Ambient Lighting',
      'Terracotta & Clay Crafts',
      'Handwoven',
      'Cane crafts',
      'Artisan Décor'
    ]
  },
  {
    id: 'wooden-gallery',
    channel: 'shop',
    channelName: 'Shop Collections',
    name: 'Wooden Crafts',
    displayName: '2. Wooden Crafts',
    badge: 'Collection 02',
    description: 'Artisanal carved teakwood clocks, keychains, traditional toys, tea-light candles & wooden décor.',
    icon: 'fa-tree',
    image: 'images/wooden-gallery.jpg',
    subCategories: [
      'Toys',
      'Keychains & Mini Gifts',
      'Tea-Light Candles',
      'Wooden Clocks',
      'Wooden Decor'
    ]
  },
  {
    id: 'premium-home-decor',
    channel: 'shop',
    channelName: 'Shop Collections',
    name: 'Premium Home Décor',
    displayName: '3. Premium Home Décor',
    badge: 'Collection 03',
    description: 'Sculptural brass accents, hammered urlis, wall tapestries, and tabletop statement pieces.',
    icon: 'fa-couch',
    image: 'images/premium-decor.jpg',
    subCategories: [
      'Table Décor',
      'Wall Décor',
      'Traditional & Heritage Décor',
      'Sculptures & Figurines'
    ]
  },
  {
    id: 'personalization-gifting',
    channel: 'shop',
    channelName: 'Shop Collections',
    name: 'Gifting',
    displayName: '4. Gifting',
    badge: 'Collection 04',
    description: 'Artisan return gifts, festive boxes, curated gift sets, eco-friendly gifts & bespoke keepsakes.',
    icon: 'fa-gift',
    image: 'images/personalization.jpg',
    subCategories: [
      'Return Gifts',
      'Festive Gifts',
      'Curated Gift Sets',
      'Eco-Friendly Gifts',
      'Occasion Gifts'
    ]
  },
  {
    id: 'esg-corporate-solution',
    channel: 'shop',
    channelName: 'Shop Collections',
    name: 'ESG Corporate Solutions',
    displayName: '5. ESG Corporate Solutions',
    badge: 'Collection 05',
    description: 'Sustainable, plastic-free employee appreciation kits and bespoke enterprise gifts.',
    icon: 'fa-briefcase',
    image: 'images/esg-corporate.jpg',
    subCategories: [
      'Employee Gifting & Welcome Hampers',
      'Executive & Leadership Gifts',
      'Desk Décor & Living',
      'Eco-Friendly & Sustainable Kits'
    ]
  },

  // --- 2. CORPORATE GIFTING (6 SUB-CATEGORIES) ---
  {
    id: 'corporate-gifting',
    channel: 'corporate',
    channelName: 'Corporate Gifting',
    name: 'Corporate Gifting',
    displayName: 'Corporate Gifting (6 Categories)',
    badge: 'Corporate B2B',
    description: 'Curated corporate gifting, employee onboarding, milestones, festive hampers & ESG sustainable partner gifts.',
    icon: 'fa-briefcase',
    image: 'images/corporate-lifestyle.jpg',
    subCategories: [
      'Employee Welcome & Onboarding',
      'Employee Recognition & Milestones',
      'Festive & Celebration Gifting',
      'Client, Partner & Executive Gifting',
      'Sustainable & ESG Gifting',
      'Curated & Custom Corporate Gift Sets'
    ]
  },

  // --- 3. WHOLESALE (WOOD & METAL) ---
  {
    id: 'wholesale-wood',
    channel: 'wholesale',
    channelName: 'Wholesale',
    name: 'Wholesale Wood Crafts',
    displayName: 'Wholesale - Wood Crafts',
    badge: 'Wholesale Wood',
    description: 'Bulk wholesale procurement for Indian boutiques, gift stores, lifestyle retailers and resellers.',
    icon: 'fa-tree',
    image: 'images/wholesale.jpg',
    subCategories: [
      'Elephant',
      'Buddha',
      'Tea-Light Holders',
      'Traditional Toys & Figurines',
      'Decorative Boxes & Trays'
    ]
  },
  {
    id: 'wholesale-metal',
    channel: 'wholesale',
    channelName: 'Wholesale',
    name: 'Wholesale Metal Crafts',
    displayName: 'Wholesale - Metal Crafts',
    badge: 'Wholesale Metal',
    description: 'Handcrafted solid brass and metal crafts for wholesale retailers, gift shops and interior designers.',
    icon: 'fa-gem',
    image: 'images/wholesale.jpg',
    subCategories: [
      'Radha Krishna',
      'Buddha',
      'Musician Sets',
      'Elephant & Animal',
      'Artistic Wall Décor'
    ]
  },

  // --- 4. EXPORT & GLOBAL (WOOD & METAL) ---
  {
    id: 'export-wood',
    channel: 'export',
    channelName: 'Export',
    name: 'Export Wood Crafts',
    displayName: 'Export - Wood Crafts',
    badge: 'Export Wood',
    description: 'International export supply for global retailers, distributors, hospitality and lifestyle brands.',
    icon: 'fa-earth-americas',
    image: 'images/global-sourcing.jpg',
    subCategories: [
      'Wooden Decorative Trays',
      'Wooden Boxes & Organisers',
      'Wooden Tea-Light Holders',
      'Figurines & Sculptural Décor',
      'Traditional Toys & Play Objects'
    ]
  },
  {
    id: 'export-metal',
    channel: 'export',
    channelName: 'Export',
    name: 'Export Metal Crafts',
    displayName: 'Export - Metal Crafts',
    badge: 'Export Metal',
    description: 'Global export consignments of handcrafted brass statues, wall art, and ambient tea-light holders.',
    icon: 'fa-plane-departure',
    image: 'images/global-sourcing.jpg',
    subCategories: [
      'Metal Sculptural Figurines',
      'Metal Table & Wall Décor',
      'Candle / Tea-Light Holders',
      'Indian Musician Sets'
    ]
  }
];

let PRODUCT_CATEGORIES = [...DEFAULT_CATEGORIES];
let currentAdminChannel = 'all';

function loadCategories() {
  const stored = localStorage.getItem('verdanta_categories');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure all DEFAULT_CATEGORIES exist in parsed list
        const existingIds = new Set(parsed.map(c => c.id));
        let added = false;
        DEFAULT_CATEGORIES.forEach(defCat => {
          if (!existingIds.has(defCat.id)) {
            parsed.push(defCat);
            added = true;
          }
        });
        PRODUCT_CATEGORIES = parsed;
        if (added) {
          saveCategories();
        }
        return;
      }
    } catch (e) {
      console.warn('Could not parse stored categories:', e);
    }
  }
  PRODUCT_CATEGORIES = [...DEFAULT_CATEGORIES];
  saveCategories();
}

function saveCategories() {
  localStorage.setItem('verdanta_categories', JSON.stringify(PRODUCT_CATEGORIES));
  window.dispatchEvent(new Event('storage'));
}


// Helper to normalize subcategory names to canonical taxonomy
function normalizeSubCategory(catId, subItem) {
  if (!subItem) return 'Featured Creations';
  const clean = String(subItem).trim();
  const lower = clean.toLowerCase();
  
  if (catId === 'artisan-gallery') {
    if (lower.includes('lamp') || lower.includes('light')) return 'Lamps & Ambient Lighting';
    if (lower.includes('terracotta') || lower.includes('clay') || lower.includes('pot') || lower.includes('urn')) return 'Terracotta & Clay Crafts';
    if (lower.includes('woven') || lower.includes('grass') || lower.includes('basket') || lower.includes('sabai')) return 'Handwoven';
    if (lower.includes('cane')) return 'Cane crafts';
    if (lower.includes('artisan') || lower.includes('decor') || lower.includes('décor')) return 'Artisan Décor';
  } else if (catId === 'wooden-gallery') {
    if (lower.includes('toy') || lower.includes('bird')) return 'Toys';
    if (lower.includes('key')) return 'Keychains & Mini Gifts';
    if (lower.includes('candle') || lower.includes('light') || lower.includes('tea-light')) return 'Tea-Light Candles';
    if (lower.includes('clock')) return 'Wooden Clocks';
    if (lower.includes('decor') || lower.includes('plaque') || lower.includes('wood') || lower.includes('box')) return 'Wooden Decor';
  } else if (catId === 'premium-home-decor') {
    if (lower.includes('table') || lower.includes('urli') || lower.includes('bowl')) return 'Table Décor';
    if (lower.includes('wall') || lower.includes('hanging') || lower.includes('tapestry')) return 'Wall Décor';
    if (lower.includes('traditional') || lower.includes('heritage') || lower.includes('accessory') || lower.includes('fluted')) return 'Traditional & Heritage Décor';
    if (lower.includes('sculpt') || lower.includes('figurine')) return 'Sculptures & Figurines';
  } else if (catId === 'personalization-gifting') {
    if (lower.includes('return') || lower.includes('monogram')) return 'Return Gifts';
    if (lower.includes('festive')) return 'Festive Gifts';
    if (lower.includes('set') || lower.includes('keepsake') || lower.includes('hamper')) return 'Curated Gift Sets';
    if (lower.includes('eco')) return 'Eco-Friendly Gifts';
    if (lower.includes('occasion') || lower.includes('personal')) return 'Occasion Gifts';
  } else if (catId === 'esg-corporate-solution') {
    if (lower.includes('employee') || lower.includes('welcome') || lower.includes('appreciation')) return 'Employee Gifting & Welcome Hampers';
    if (lower.includes('executive') || lower.includes('custom') || lower.includes('client')) return 'Executive & Leadership Gifts';
    if (lower.includes('desk') || lower.includes('living')) return 'Desk Décor & Living';
    if (lower.includes('eco') || lower.includes('sustainable') || lower.includes('kit')) return 'Eco-Friendly & Sustainable Kits';
  }
  // Corporate Gifting (6 subcategories)
  else if (catId === 'corporate-gifting') {
    if (lower.includes('welcome') || lower.includes('onboard')) return 'Employee Welcome & Onboarding';
    if (lower.includes('recogni') || lower.includes('milestone')) return 'Employee Recognition & Milestones';
    if (lower.includes('festive') || lower.includes('celebrat')) return 'Festive & Celebration Gifting';
    if (lower.includes('partner') || lower.includes('executive') || lower.includes('client')) return 'Client, Partner & Executive Gifting';
    if (lower.includes('sustain') || lower.includes('esg')) return 'Sustainable & ESG Gifting';
    if (lower.includes('curated') || lower.includes('custom')) return 'Curated & Custom Corporate Gift Sets';
  }
  // Wholesale Wood
  else if (catId === 'wholesale-wood') {
    if (lower.includes('elephant')) return 'Elephant';
    if (lower.includes('buddha')) return 'Buddha';
    if (lower.includes('tea-light') || lower.includes('candle') || lower.includes('holder')) return 'Tea-Light Holders';
    if (lower.includes('toy') || lower.includes('figurine')) return 'Traditional Toys & Figurines';
    if (lower.includes('box') || lower.includes('tray')) return 'Decorative Boxes & Trays';
  }
  // Wholesale Metal
  else if (catId === 'wholesale-metal') {
    if (lower.includes('radha') || lower.includes('krishna')) return 'Radha Krishna';
    if (lower.includes('buddha')) return 'Buddha';
    if (lower.includes('music') || lower.includes('set')) return 'Musician Sets';
    if (lower.includes('elephant') || lower.includes('animal')) return 'Elephant & Animal';
    if (lower.includes('wall') || lower.includes('decor') || lower.includes('décor')) return 'Artistic Wall Décor';
  }
  // Export Wood
  else if (catId === 'export-wood') {
    if (lower.includes('tray')) return 'Wooden Decorative Trays';
    if (lower.includes('box') || lower.includes('organis')) return 'Wooden Boxes & Organisers';
    if (lower.includes('tea-light') || lower.includes('holder')) return 'Wooden Tea-Light Holders';
    if (lower.includes('figurine') || lower.includes('sculpt')) return 'Figurines & Sculptural Décor';
    if (lower.includes('toy') || lower.includes('play')) return 'Traditional Toys & Play Objects';
  }
  // Export Metal
  else if (catId === 'export-metal') {
    if (lower.includes('sculpt') || lower.includes('figurine')) return 'Metal Sculptural Figurines';
    if (lower.includes('table') || lower.includes('wall')) return 'Metal Table & Wall Décor';
    if (lower.includes('candle') || lower.includes('tea-light') || lower.includes('holder')) return 'Candle / Tea-Light Holders';
    if (lower.includes('music') || lower.includes('set')) return 'Indian Musician Sets';
  }
  
  return clean;
}

// Get all subtitle categories for a category (default list + any extra custom subcategories)
function getAllSubCategoriesForCategory(catId) {
  const cat = getCategoryById(catId);
  const defaultSubs = (cat && cat.subCategories) ? [...cat.subCategories] : [];
  const set = new Set(defaultSubs);

  if (Array.isArray(adminProducts)) {
    adminProducts.forEach(p => {
      const pCatId = p.categoryId || normalizeCategoryId(p.category);
      if (pCatId === catId && p.subItem) {
        set.add(normalizeSubCategory(catId, p.subItem));
      }
    });
  }

  return Array.from(set);
}


// Default Seed Products with reliable categoryId and name references
const SEED_PRODUCTS = [
  {
    id: 'art-01',
    categoryId: 'artisan-gallery',
    category: 'Artisan Gallery',
    subItem: 'Lamp',
    name: 'Carved Teak & Linen Artisan Table Lamp',
    title: 'Carved Teak & Linen Artisan Table Lamp',
    price: 4899,
    priceFormatted: '₹4,899',
    badge: 'Artisan Signature',
    image: 'images/hero.jpg',
    material: 'Reclaimed Teak Wood, Hand-loomed Linen Shade, Brass Fittings',
    origin: 'Jaipur, Rajasthan',
    description: 'Masterfully hand-carved acanthus scroll wooden base paired with an organic textured linen drum shade that casts a warm, soothing ambient glow.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'art-02',
    categoryId: 'artisan-gallery',
    category: 'Artisan Gallery',
    subItem: 'Terracotta Clay',
    name: 'Heritage Peacock Handpainted Terracotta Urn',
    title: 'Heritage Peacock Handpainted Terracotta Urn',
    price: 2450,
    priceFormatted: '₹2,450',
    badge: 'Bestseller',
    image: 'images/terracotta-pot.jpg',
    material: 'Natural Red Clay, Mineral Pigments, Hand-burnished',
    origin: 'Molela Cluster, Rajasthan',
    description: 'Wheel-thrown natural earthen clay pot featuring traditional miniature peacock and lotus floral patterns painted with mineral pigments.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'art-03',
    categoryId: 'artisan-gallery',
    category: 'Artisan Gallery',
    subItem: 'Natural Grass and Handwoven Gallery',
    name: 'Sabai Grass Lidded Handwoven Basket',
    title: 'Sabai Grass Lidded Handwoven Basket',
    price: 1850,
    priceFormatted: '₹1,850',
    badge: 'Eco Certified',
    image: 'images/grass-basket.jpg',
    material: 'Wild Harvested Sabai Grass, Cotton Thread',
    origin: 'Mayurbhanj, Odisha',
    description: 'Tight coiling technique handwoven by indigenous women artisans. Durable, fragrant natural grass with minimalist geometric weave.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'wood-01',
    categoryId: 'wooden-gallery',
    category: 'Wooden Gallery',
    subItem: 'Clock',
    name: 'Artisanal Carved Teakwood Desk Clock',
    title: 'Artisanal Carved Teakwood Desk Clock',
    price: 3200,
    priceFormatted: '₹3,200',
    badge: 'Limited Edition',
    image: 'images/wooden-gallery.jpg',
    material: 'Solid Indian Teak, Brass Hands & Roman Numerals',
    origin: 'Saharanpur, Uttar Pradesh',
    description: 'Carved from single-source aged teak wood with paisley borders, Roman brass numbering, and silent sweeping quartz movement.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'wood-02',
    categoryId: 'wooden-gallery',
    category: 'Wooden Gallery',
    subItem: 'Key Chain',
    name: 'Hand-Carved Wooden Elephant & Leather Keychain',
    title: 'Hand-Carved Wooden Elephant & Leather Keychain',
    price: 490,
    priceFormatted: '₹490',
    badge: 'Craft Accessory',
    image: 'images/wooden-gallery.jpg',
    material: 'Rosewood, Vegetable-Tanned Leather, Antique Brass Ring',
    origin: 'Saharanpur Wood Craft Guild',
    description: 'Delicate relief-carved elephant medallion symbolising wisdom and prosperity, finished with genuine leather fringe and sturdy brass clip.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'wood-03',
    categoryId: 'wooden-gallery',
    category: 'Wooden Gallery',
    subItem: 'Toys',
    name: 'Traditional Handpainted Wooden Bird Figurine',
    title: 'Traditional Handpainted Wooden Bird Figurine',
    price: 950,
    priceFormatted: '₹950',
    badge: 'Generational Craft',
    image: 'images/wooden-gallery.jpg',
    material: 'Wrightia Tinctoria Wood, Non-toxic Lacquer Colors',
    origin: 'Channapatna, Karnataka',
    description: 'Crafted following 200-year-old GI-tagged lacquerware woodturning techniques. Safe, smooth, and vibrant decorative toy figurine.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'wood-04',
    categoryId: 'wooden-gallery',
    category: 'Wooden Gallery',
    subItem: 'Tea Light Candle',
    name: 'Turned Rosewood Tea Light Candle Holder',
    title: 'Turned Rosewood Tea Light Candle Holder',
    price: 750,
    priceFormatted: '₹750',
    badge: 'Warm Ambiance',
    image: 'images/wooden-gallery.jpg',
    material: 'Indian Sheesham / Rosewood, Natural Wax Coating',
    origin: 'Hoshiarpur Woodturners',
    description: 'Gracefully turned wooden holder displaying rich natural wood grain. Includes a complimentary pure soy tea light.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'wood-05',
    categoryId: 'wooden-gallery',
    category: 'Wooden Gallery',
    subItem: 'Decor Products',
    name: 'Hand-Carved Teakwood Floral Wall & Table Plaque',
    title: 'Hand-Carved Teakwood Floral Wall & Table Plaque',
    price: 2150,
    priceFormatted: '₹2,150',
    badge: 'Artisan Decor',
    image: 'images/wooden-gallery.jpg',
    material: 'Seasoned Teakwood, Natural Matte Wax Finish',
    origin: 'Kashmir Woodcraft Cluster',
    description: 'Intricate deep jali relief carving depicting traditional chinar and vine motifs, versatile for console or wall display.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'decor-01',
    categoryId: 'premium-home-decor',
    category: 'Premium Home Decor',
    subItem: 'Table Decor',
    name: 'Hammered Brass Tabletop Floating Urli Bowl',
    title: 'Hammered Brass Tabletop Floating Urli Bowl',
    price: 3800,
    priceFormatted: '₹3,800',
    badge: 'Luxury Tabletop',
    image: 'images/premium-decor.jpg',
    material: 'Pure Hand-hammered Solid Brass',
    origin: 'Moradabad Metalcraft, UP',
    description: 'Heirloom-grade brass urli bowl designed for floating flower blossoms and tea light candles. Timeless Indian festive opulence.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'decor-02',
    categoryId: 'premium-home-decor',
    category: 'Premium Home Decor',
    subItem: 'Wall Hanging Decor',
    name: 'Geometric Brass & Natural Jute Wall Hanging Tapestry',
    title: 'Geometric Brass & Natural Jute Wall Hanging Tapestry',
    price: 6400,
    priceFormatted: '₹6,400',
    badge: 'Curator Choice',
    image: 'images/premium-decor.jpg',
    material: 'Burnished Brass Plates, Hand-spun Golden Jute, Wooden Dowel',
    origin: 'Bengal Handloom & Metal Atelier',
    description: 'A contemporary dialogue between raw tactile jute fibers and warm reflective brass plates, creating an architectural statement piece.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'decor-03',
    categoryId: 'premium-home-decor',
    category: 'Premium Home Decor',
    subItem: 'Decorative Accessories',
    name: 'Fluted Ceramic & Brushed Brass Accent Ensemble',
    title: 'Fluted Ceramic & Brushed Brass Accent Ensemble',
    price: 2950,
    priceFormatted: '₹2,950',
    badge: 'Contemporary Heritage',
    image: 'images/premium-decor.jpg',
    material: 'Fluted Ceramic Stoneware, Machined Brass',
    origin: 'Khurja Pottery Cluster',
    description: 'A minimal silhouette accent piece blending tactile ceramic fluting with warm brass accents for modern credenzas and mantels.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'esg-01',
    categoryId: 'esg-corporate-solution',
    category: 'ESG Corporate Solution',
    subItem: 'Employee Appreciation Gift Kit',
    name: 'Eco-Growth Employee Appreciation Gift Kit',
    title: 'Eco-Growth Employee Appreciation Gift Kit',
    price: 1950,
    priceFormatted: '₹1,950',
    badge: 'ESG Certified',
    image: 'images/esg-corporate.jpg',
    material: 'Plantable Seed Paper, Pure Copper, Bamboo, Beeswax',
    origin: 'Verdanta Sustainable Labs',
    description: 'Complete sustainable kit containing an embossed seed-paper journal, hand-hammered pure copper tumbler, bamboo pen, and fragrant beeswax candle.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'esg-02',
    categoryId: 'esg-corporate-solution',
    category: 'ESG Corporate Solution',
    subItem: 'Customization Kit',
    name: 'Executive Client Customization Hamper',
    title: 'Executive Client Customization Hamper',
    price: 3600,
    priceFormatted: '₹3,600',
    badge: 'Corporate Bespoke',
    image: 'images/corporate-lifestyle.jpg',
    material: 'Recycled Kraft Gift Box, Forest Green Ribbon, Custom Branding',
    origin: 'Verdanta Corporate Atelier',
    description: 'Designed for enterprise partners. Includes custom corporate logo debossing, personalized executive greeting card, and zero-plastic packaging.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'pers-01',
    categoryId: 'personalization-gifting',
    category: 'Personalization Gifting',
    subItem: 'Personalization Gifting',
    name: 'Bespoke Monogram Laser-Engraved Keepsake Box & Leather Set',
    title: 'Bespoke Monogram Laser-Engraved Keepsake Box & Leather Set',
    price: 4200,
    priceFormatted: '₹4,200',
    badge: 'Custom Engraved',
    image: 'images/personalization.jpg',
    material: 'Solid Indian Walnut, Top-grain Vegetable Leather, Hand-Hammered Brass',
    origin: 'Jaipur Bespoke Studio',
    description: 'Personalized keepsake slide-lid box with custom botanical calligraphy engraving, monogrammed leather passport sleeve, and hammered brass bookmark.',
    createdAt: new Date().toISOString()
  },

  // 6) Corporate Gifting
  {
    id: 'corp-01',
    categoryId: 'corporate-gifting',
    category: 'Corporate Gifting',
    subItem: 'Employee Welcome & Onboarding',
    name: 'Executive Employee Onboarding Artisan Hamper',
    title: 'Executive Employee Onboarding Artisan Hamper',
    price: 3499,
    priceFormatted: '₹3,499',
    badge: 'Enterprise Best',
    image: 'images/corporate-lifestyle.jpg',
    material: 'Natural Bamboo, Pure Copper Tumbler, Reclaimed Wood Desk Clock',
    origin: 'Verdanta Corporate Studio',
    description: 'Heirloom welcome gift set designed to welcome new leaders and celebrate team loyalty.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'corp-02',
    categoryId: 'corporate-gifting',
    category: 'Corporate Gifting',
    subItem: 'Festive & Celebration Gifting',
    name: 'Heirloom Brass Deepam & Confectionery Festive Box',
    title: 'Heirloom Brass Deepam & Confectionery Festive Box',
    price: 4200,
    priceFormatted: '₹4,200',
    badge: 'Festive B2B',
    image: 'images/premium-decor.jpg',
    material: 'Pure Hand-Cast Brass, Hand-burnished Finish',
    origin: 'Moradabad Metal Guild',
    description: 'Opulent Diwali and festive celebration corporate gift box with traditional brass deepams.',
    createdAt: new Date().toISOString()
  },

  // 7) Wholesale Wood Crafts
  {
    id: 'wh-wood-01',
    categoryId: 'wholesale-wood',
    category: 'Wholesale Wood Crafts',
    subItem: 'Elephant',
    name: 'Hand-Carved Sheesham Wood Elephant Figurine (Bulk Lot)',
    title: 'Hand-Carved Sheesham Wood Elephant Figurine (Bulk Lot)',
    price: 1850,
    priceFormatted: '₹1,850',
    badge: 'Wholesale Volume',
    image: 'images/wooden-gallery.jpg',
    material: 'Seasoned Sheesham Wood, Natural Matte Wax',
    origin: 'Saharanpur Craft Guild',
    description: 'Bulk wholesale pack for Indian boutiques and gift stores. Intricate trunk-up luck symbol.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'wh-wood-02',
    categoryId: 'wholesale-wood',
    category: 'Wholesale Wood Crafts',
    subItem: 'Buddha',
    name: 'Teakwood Meditative Buddha Relief Plaque',
    title: 'Teakwood Meditative Buddha Relief Plaque',
    price: 2450,
    priceFormatted: '₹2,450',
    badge: 'Wholesale Volume',
    image: 'images/wooden-gallery.jpg',
    material: 'Single-source Reclaimed Teakwood',
    origin: 'Varanasi Carving Cluster',
    description: 'Serene meditative Buddha carved panel for retail partners and lifestyle boutiques.',
    createdAt: new Date().toISOString()
  },

  // 8) Wholesale Metal Crafts
  {
    id: 'wh-metal-01',
    categoryId: 'wholesale-metal',
    category: 'Wholesale Metal Crafts',
    subItem: 'Radha Krishna',
    name: 'Heirloom Brass Radha Krishna Handcrafted Idol',
    title: 'Heirloom Brass Radha Krishna Handcrafted Idol',
    price: 5200,
    priceFormatted: '₹5,200',
    badge: 'Wholesale Brass',
    image: 'images/premium-decor.jpg',
    material: 'Solid Virgin Brass, Antique Patina Finish',
    origin: 'Swamimalai Bronze & Brass Atelier',
    description: 'Lost-wax cast devotional and interior art sculpture for domestic retail stockists.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'wh-metal-02',
    categoryId: 'wholesale-metal',
    category: 'Wholesale Metal Crafts',
    subItem: 'Artistic Wall Décor',
    name: 'Hammered Brass Tree of Life Wall Medallion',
    title: 'Hammered Brass Tree of Life Wall Medallion',
    price: 4900,
    priceFormatted: '₹4,900',
    badge: 'Wholesale Brass',
    image: 'images/premium-decor.jpg',
    material: 'Pure Brass Sheet, Hand-embossed & Chiseled',
    origin: 'Moradabad Metal Guild',
    description: 'Architectural wall decor centerpiece with intricate generational leaf work.',
    createdAt: new Date().toISOString()
  },

  // 9) Export Wood Crafts
  {
    id: 'exp-wood-01',
    categoryId: 'export-wood',
    category: 'Export Wood Crafts',
    subItem: 'Wooden Decorative Trays',
    name: 'Inlaid Rosewood Geometric Serving Tray (Export Standard)',
    title: 'Inlaid Rosewood Geometric Serving Tray (Export Standard)',
    price: 3600,
    priceFormatted: '₹3,600',
    badge: 'Export Global',
    image: 'images/global-sourcing.jpg',
    material: 'Indian Rosewood, Brass Inlay, Food-Safe Oil Finish',
    origin: 'Hoshiarpur Wood Atelier',
    description: 'Phytosanitary certified export tray for international department stores and museum gift shops.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'exp-wood-02',
    categoryId: 'export-wood',
    category: 'Export Wood Crafts',
    subItem: 'Wooden Boxes & Organisers',
    name: 'Solid Teak Lidded Keepsake Organizer Box',
    title: 'Solid Teak Lidded Keepsake Organizer Box',
    price: 2950,
    priceFormatted: '₹2,950',
    badge: 'Export Global',
    image: 'images/wooden-gallery.jpg',
    material: 'Seasoned Plantation Teak, Antiqued Brass Hinges',
    origin: 'Saharanpur Export Hub',
    description: 'Export-grade packaging and drop-tested luxury wooden organizer box.',
    createdAt: new Date().toISOString()
  },

  // 10) Export Metal Crafts
  {
    id: 'exp-metal-01',
    categoryId: 'export-metal',
    category: 'Export Metal Crafts',
    subItem: 'Metal Sculptural Figurines',
    name: 'Contemporary Lost-Wax Cast Dancing Figurine',
    title: 'Contemporary Lost-Wax Cast Dancing Figurine',
    price: 6800,
    priceFormatted: '₹6,800',
    badge: 'Export Global',
    image: 'images/global-sourcing.jpg',
    material: 'Bell Metal / Brass Alloy, Burnished Patina',
    origin: 'Bastar Dhokra Art Circle',
    description: 'Export consignment figurine celebrating tribal geometry and ancestral metallurgy.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'exp-metal-02',
    categoryId: 'export-metal',
    category: 'Export Metal Crafts',
    subItem: 'Candle / Tea-Light Holders',
    name: 'Perforated Brass Ambient Moroccan / Indian Lantern',
    title: 'Perforated Brass Ambient Moroccan / Indian Lantern',
    price: 2650,
    priceFormatted: '₹2,650',
    badge: 'Export Global',
    image: 'images/premium-decor.jpg',
    material: 'Fine Gauge Sheet Brass, Hand-punched Jali',
    origin: 'Moradabad Metal Atelier',
    description: 'Export compliant lighting accessory casting enchanting shadow patterns.',
    createdAt: new Date().toISOString()
  }
];

// Seed proposals if empty
const SAMPLE_PROPOSALS = [
  {
    id: 'PRP-90214',
    name: 'Ananya Deshmukh',
    company: 'Tata Consultancy Services',
    email: 'ananya.d@tcs-sample.com',
    phone: '+91 98201 12345',
    type: 'Employee Appreciation Gift Kit',
    units: '250 Gift Boxes',
    notes: 'Looking for Diwali corporate appreciation hampers for our tech leadership team. Custom debossed company logo required.',
    status: 'New',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'PRP-88412',
    name: 'Marcus Vance',
    company: 'Nordic Heritage Living (Stockholm)',
    email: 'marcus@nordicheritage.se',
    phone: '+46 8 123 4567',
    type: 'Export International Buyers',
    units: 'FOB Consignment / €18,000',
    notes: 'Interested in exporting terracotta clay urns and sabai grass baskets for our 4 Scandinavian lifestyle boutiques.',
    status: 'Under Review',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];

// Sample Orders if empty
const SAMPLE_ORDERS = [
  {
    id: 'ORD-548192',
    customerName: 'Pooja Singhania',
    itemCount: 2,
    total: 8699,
    totalFormatted: '₹8,699',
    status: 'Confirmed',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    items: [
      { title: 'Carved Teak & Linen Artisan Table Lamp', quantity: 1, price: 4899 },
      { title: 'Hammered Brass Tabletop Floating Urli Bowl', quantity: 1, price: 3800 }
    ]
  }
];

// App State
let adminProducts = [];
let adminProposals = [];
let adminOrders = [];
let currentProposalFilter = 'all';

// Helper utilities for safe rendering and reliable category mapping
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function normalizeCategoryId(catNameOrId) {
  if (!catNameOrId) return 'artisan-gallery';
  const clean = String(catNameOrId).toLowerCase().trim();
  const directMatch = PRODUCT_CATEGORIES.find(c => c.id === clean || c.name.toLowerCase() === clean);
  if (directMatch) return directMatch.id;
  // Specific channel matchers first
  if (clean.includes('corporate-gifting') || clean.includes('corporate gifting') || (clean.includes('corporate') && clean.includes('gifting'))) return 'corporate-gifting';
  if (clean.includes('wholesale-wood') || (clean.includes('wholesale') && clean.includes('wood'))) return 'wholesale-wood';
  if (clean.includes('wholesale-metal') || (clean.includes('wholesale') && clean.includes('metal')) || clean.includes('wholesale')) return 'wholesale-metal';
  if (clean.includes('export-wood') || (clean.includes('export') && clean.includes('wood'))) return 'export-wood';
  if (clean.includes('export-metal') || (clean.includes('export') && clean.includes('metal')) || clean.includes('export')) return 'export-metal';
  // General shop collection matchers
  if (clean.includes('artisan')) return 'artisan-gallery';
  if (clean.includes('wood')) return 'wooden-gallery';
  if (clean.includes('decor') || clean.includes('décor')) return 'premium-home-decor';
  if (clean.includes('esg')) return 'esg-corporate-solution';
  if (clean.includes('person') || clean.includes('gift')) return 'personalization-gifting';
  return clean.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'artisan-gallery';
}

function getCategoryById(catIdOrName) {
  const normId = normalizeCategoryId(catIdOrName);
  const found = PRODUCT_CATEGORIES.find(c => c.id === normId || c.name.toLowerCase() === String(catIdOrName).toLowerCase());
  if (found) return found;
  return {
    id: normId,
    name: catIdOrName || 'General Collection',
    displayName: catIdOrName || 'General Collection',
    badge: 'Custom Collection',
    description: 'Artisan handcrafted creations belonging to this collection.',
    icon: 'fa-boxes-stacked',
    subCategories: []
  };
}

function normalizeProduct(p) {
  if (!p) return p;
  const cat = getCategoryById(p.categoryId || p.category);
  p.categoryId = cat.id;
  p.category = cat.name;
  if (!p.title && p.name) p.title = p.name;
  if (!p.name && p.title) p.name = p.title;
  if (!p.priceFormatted) {
    p.priceFormatted = (p.price && p.price > 0) ? '₹' + Number(p.price).toLocaleString('en-IN') : '₹0';
  }
  return p;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  renderDashboard();
  renderCategoryJumpPills();
  renderCategoryProductSections();
  renderProposalsTable();
  renderOrdersTable();
  updateSidebarCounts();
});

// Load Data from LocalStorage
function loadData() {
  loadCategories();
  const storedProd = localStorage.getItem('verdanta_products');
  if (storedProd) {
    try {
      const parsed = JSON.parse(storedProd);
      if (Array.isArray(parsed) && parsed.length > 0) {
        adminProducts = parsed.map(normalizeProduct);
        const existingIds = new Set(adminProducts.map(p => p.id));
        let addedNew = false;
        SEED_PRODUCTS.forEach(sp => {
          if (!existingIds.has(sp.id)) {
            adminProducts.push(normalizeProduct(sp));
            addedNew = true;
          }
        });
        if (addedNew) {
          saveProducts();
        }
      } else {
        adminProducts = SEED_PRODUCTS.map(normalizeProduct);
      }
    } catch (e) {
      adminProducts = SEED_PRODUCTS.map(normalizeProduct);
    }
  } else {
    adminProducts = SEED_PRODUCTS.map(normalizeProduct);
    saveProducts();
  }

  const storedProp = localStorage.getItem('verdanta_proposals');
  if (storedProp) {
    try {
      adminProposals = JSON.parse(storedProp);
    } catch (e) {
      adminProposals = [...SAMPLE_PROPOSALS];
    }
  } else {
    adminProposals = [...SAMPLE_PROPOSALS];
    saveProposals();
  }

  const storedOrders = localStorage.getItem('verdanta_orders');
  if (storedOrders) {
    try {
      adminOrders = JSON.parse(storedOrders);
    } catch (e) {
      adminOrders = [...SAMPLE_ORDERS];
    }
  } else {
    adminOrders = [...SAMPLE_ORDERS];
    saveOrders();
  }
}

function saveProducts() {
  try {
    localStorage.setItem('verdanta_products', JSON.stringify(adminProducts));
  } catch (err) {
    console.warn('LocalStorage quota limit reached, optimizing photo data...', err);
    // Safety fallback: if storage is tight, strip excessively large base64 photos to keep products functioning
    adminProducts.forEach(p => {
      if (p.image && p.image.startsWith('data:image') && p.image.length > 180000) {
        p.image = 'images/artisan-gallery.jpg';
      }
    });
    try {
      localStorage.setItem('verdanta_products', JSON.stringify(adminProducts));
    } catch (e2) {
      console.error('Critical localStorage error:', e2);
      alert('Browser local storage limit reached. Please remove unnecessary items or use web image URLs.');
    }
  }
  updateSidebarCounts();

  // Notify other tabs and storefront listeners
  try {
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('verdanta-products-updated', { detail: adminProducts }));
  } catch (e) {}
}

function saveProposals() {
  localStorage.setItem('verdanta_proposals', JSON.stringify(adminProposals));
  updateSidebarCounts();
}

function saveOrders() {
  localStorage.setItem('verdanta_orders', JSON.stringify(adminOrders));
  updateSidebarCounts();
}

// =============================================================================
// TAB NAVIGATION
// =============================================================================

window.switchTab = function(tabName) {
  document.querySelectorAll('.nav-tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));

  const tabIndex = {
    dashboard: 0,
    products: 1,
    proposals: 2,
    orders: 3
  }[tabName] || 0;

  const btn = document.querySelectorAll('.nav-tab-btn')[tabIndex];
  if (btn) btn.classList.add('active');

  const pane = document.getElementById('tab-' + tabName);
  if (pane) pane.classList.add('active');

  const titleMap = {
    dashboard: 'Dashboard Overview',
    products: 'Products & Collections Inventory',
    proposals: 'Customer B2B Proposals & Requests',
    orders: 'Customer Orders & Checkouts'
  };
  const titleEl = document.getElementById('currentPageTitle');
  if (titleEl) titleEl.textContent = titleMap[tabName] || 'Dashboard';

  // Close mobile sidebar if open
  document.getElementById('adminSidebar').classList.remove('open');

  if (tabName === 'dashboard') renderDashboard();
  if (tabName === 'products') renderCategoryProductSections();
  if (tabName === 'proposals') renderProposalsTable();
  if (tabName === 'orders') renderOrdersTable();
};

window.toggleSidebar = function() {
  document.getElementById('adminSidebar').classList.toggle('open');
};

function updateSidebarCounts() {
  const prodBadge = document.getElementById('sidebarProductCount');
  const propBadge = document.getElementById('sidebarProposalCount');
  const ordBadge = document.getElementById('sidebarOrderCount');

  if (prodBadge) prodBadge.textContent = adminProducts.length;
  if (propBadge) propBadge.textContent = adminProposals.filter(p => p.status === 'New').length || adminProposals.length;
  if (ordBadge) ordBadge.textContent = adminOrders.length;
}

// =============================================================================
// DASHBOARD
// =============================================================================

function renderDashboard() {
  document.getElementById('dashTotalProducts').textContent = adminProducts.length;
  document.getElementById('dashTotalProposals').textContent = adminProposals.length;
  document.getElementById('dashTotalOrders').textContent = adminOrders.length;

  const revenue = adminOrders.reduce((sum, ord) => sum + (ord.total || 0), 0);
  document.getElementById('dashTotalRevenue').textContent = '₹' + revenue.toLocaleString('en-IN');

  // Recent Proposals in Dashboard
  const recentPropEl = document.getElementById('dashRecentProposals');
  if (recentPropEl) {
    if (adminProposals.length === 0) {
      recentPropEl.innerHTML = '<p style="color: #888; font-size: 0.9rem;">No proposal inquiries received yet.</p>';
    } else {
      recentPropEl.innerHTML = adminProposals.slice(0, 4).map(prop => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #f0ede6;">
          <div>
            <strong style="color: var(--color-primary); font-size: 0.9rem; display: block;">${prop.name} (${prop.company})</strong>
            <span style="font-size: 0.78rem; color: #888;">${prop.type} • ${new Date(prop.createdAt).toLocaleDateString()}</span>
          </div>
          <span class="status-pill ${getStatusClass(prop.status)}">${prop.status}</span>
        </div>
      `).join('');
    }
  }

  // Categories Breakdown
  const catListEl = document.getElementById('categoryBreakdownList');
  if (catListEl) {
    catListEl.innerHTML = PRODUCT_CATEGORIES.map(cat => {
      const count = adminProducts.filter(p => (p.categoryId || normalizeCategoryId(p.category)) === cat.id).length;
      return `
        <li class="breakdown-row">
          <span class="breakdown-name">${escapeHtml(cat.name)}</span>
          <span class="breakdown-count">${count} items</span>
        </li>
      `;
    }).join('');
  }
}

// =============================================================================
// CATEGORY-WISE PRODUCTS MANAGEMENT (SEPARATE SECTION FOR EACH CATEGORY)
// =============================================================================

let pendingDeleteProductId = null;
let uploadedPhotoDataUrl = '';

// =============================================================================
// PHOTO UPLOAD & PREVIEW HANDLERS
// =============================================================================

// Handle drag & drop photo directly onto dropzone
window.handleDropFile = function(event) {
  event.preventDefault();
  const dropzone = document.getElementById('photoDropzone');
  if (dropzone) dropzone.style.borderColor = '';
  if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length > 0) {
    const fakeEvent = { target: { files: event.dataTransfer.files } };
    window.handleImageFileUpload(fakeEvent);
  }
};

// Handle local device photo file upload (JPG, PNG, WEBP)
window.handleImageFileUpload = function(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  if (file.size > 8 * 1024 * 1024) {
    alert('Please choose a photo under 8MB.');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      // Auto-scale to max 800px for web efficiency, crisp retina clarity, and lightweight saving
      const maxDim = 800;
      let width = img.width;
      let height = img.height;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.80);

      uploadedPhotoDataUrl = dataUrl;
      showPhotoPreview(dataUrl, 'Uploaded from Computer');

      // Clear custom URL and preset radio selection
      const customInput = document.getElementById('prodCustomImage');
      if (customInput) customInput.value = '';
      document.querySelectorAll('input[name="prodImgPreset"]').forEach(r => r.checked = false);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
};

window.handleCustomImageUrlInput = function(val) {
  const url = (val || '').trim();
  if (url) {
    uploadedPhotoDataUrl = '';
    const fileInput = document.getElementById('prodFileInput');
    if (fileInput) fileInput.value = '';
    document.querySelectorAll('input[name="prodImgPreset"]').forEach(r => r.checked = false);
    showPhotoPreview(url, 'Custom Photo URL');
  }
};

window.handlePresetSelect = function(val) {
  uploadedPhotoDataUrl = '';
  const fileInput = document.getElementById('prodFileInput');
  if (fileInput) fileInput.value = '';
  const customInput = document.getElementById('prodCustomImage');
  if (customInput) customInput.value = '';
  showPhotoPreview(val, 'Preset Photo Selected');
};

function showPhotoPreview(src, label) {
  const wrap = document.getElementById('photoPreviewWrap');
  const img = document.getElementById('photoPreviewImg');
  const tag = document.getElementById('previewSourceTag');
  const prompt = document.getElementById('dropzonePrompt');
  if (wrap && img) {
    img.src = src;
    if (tag) tag.textContent = label || 'Photo Preview';
    wrap.style.display = 'flex';
    if (prompt) prompt.style.display = 'none';
  }
}

window.removeUploadedImage = function(e) {
  if (e) e.stopPropagation();
  uploadedPhotoDataUrl = '';
  const fileInput = document.getElementById('prodFileInput');
  if (fileInput) fileInput.value = '';
  const customInput = document.getElementById('prodCustomImage');
  if (customInput) customInput.value = '';

  const wrap = document.getElementById('photoPreviewWrap');
  const prompt = document.getElementById('dropzonePrompt');
  if (wrap) wrap.style.display = 'none';
  if (prompt) prompt.style.display = 'flex';

  // Fallback to first preset
  const firstPreset = document.querySelector('input[name="prodImgPreset"]');
  if (firstPreset) {
    firstPreset.checked = true;
    showPhotoPreview(firstPreset.value, 'Preset Photo Selected');
  }
};

// =============================================================================
// CATEGORY & SUBTITLE CATEGORY PRODUCT MANAGEMENT
// =============================================================================

// Helper to escape attribute string safely
function escapeAttr(str) {
  if (!str) return '';
  return String(str).replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

// Prompt admin to add a new subtitle category on the fly
window.quickAddSubCategoryPrompt = function(categoryId) {
  const cat = getCategoryById(categoryId);
  const newSub = prompt(`Enter new Subtitle Category name for "${cat.name}":`);
  if (!newSub || !newSub.trim()) return;

  const cleanSub = newSub.trim();
  if (!cat.subCategories) cat.subCategories = [];
  if (!cat.subCategories.includes(cleanSub)) {
    cat.subCategories.push(cleanSub);
  }

  showToast(`Subtitle category "${cleanSub}" added to ${cat.name}!`);
  renderCategoryProductSections();

  // Prompt to add photo right away
  setTimeout(() => {
    openAddProductModalForCategory(cat.id, cleanSub);
  }, 300);
};

function switchAdminChannel(channel) {
  currentAdminChannel = channel;
  document.querySelectorAll('.channel-pill-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-channel') === channel);
  });
  renderCategoryProductSections();
  renderCategoryJumpPills();
}
window.switchAdminChannel = switchAdminChannel;

// Render each product category with its distinct Subtitle Categories and photos
function renderCategoryProductSections(searchQuery = '') {
  const container = document.getElementById('categorySectionsContainer');
  if (!container) return;

  const query = (searchQuery || '').toLowerCase().trim();

  // Collect all active categories (core categories + any dynamic ones in products)
  const allCatIds = new Set(PRODUCT_CATEGORIES.map(c => c.id));
  adminProducts.forEach(p => {
    if (p.categoryId) allCatIds.add(p.categoryId);
    else if (p.category) allCatIds.add(normalizeCategoryId(p.category));
  });

  let categoriesList = Array.from(allCatIds).map(id => getCategoryById(id));

  // Filter by channel if selected
  if (currentAdminChannel !== 'all') {
    categoriesList = categoriesList.filter(c => (c.channel || 'shop') === currentAdminChannel);
  }

  // Update category stats badge in intro header
  const badgeEl = document.getElementById('totalCategoryCountBadge');
  if (badgeEl) {
    const channelLabels = {
      all: 'All 4 Departments',
      shop: 'Shop Collections',
      corporate: 'Corporate Gifting',
      wholesale: 'Wholesale B2B',
      export: 'Export & Global'
    };
    badgeEl.innerHTML = `<span>${categoriesList.length} Categories in ${channelLabels[currentAdminChannel] || 'Active'} • ${adminProducts.length} Total Photos / Items</span>`;
  }

  if (categoriesList.length === 0) {
    container.innerHTML = `
      <div style="padding: 60px 20px; text-align: center; color: var(--color-text-muted); background: #ffffff; border-radius: 8px; border: 1px dashed var(--color-border); margin-top: 20px;">
        <i class="fa-solid fa-folder-open" style="font-size: 2.2rem; color: var(--color-gold); margin-bottom: 12px; display: inline-block;"></i>
        <h4 style="color: var(--color-primary); font-size: 1.1rem; margin-bottom: 6px;">No categories found in this department</h4>
        <p style="font-size: 0.9rem; margin-bottom: 18px;">Click "+ Add New Category" to create a new category in this department.</p>
        <button class="btn btn-primary" onclick="openAddCategoryModal()">+ Add Category</button>
      </div>
    `;
    return;
  }

  container.innerHTML = categoriesList.map(cat => {
    // Strictly isolate products belonging to this main category
    const allCatProducts = adminProducts.filter(p => {
      const pCatId = p.categoryId || normalizeCategoryId(p.category);
      return pCatId === cat.id;
    });

    // Subtitle categories belonging to this category
    const subCategories = getAllSubCategoriesForCategory(cat.id);
    const channel = cat.channel || 'shop';
    const channelLabels = {
      shop: 'Shop Collections',
      corporate: 'Corporate Gifting',
      wholesale: 'Wholesale B2B',
      export: 'Export & Global'
    };
    const channelLabel = cat.channelName || channelLabels[channel] || channel.toUpperCase();

    return `
      <section class="admin-category-section" id="cat-sec-${cat.id}">
        <!-- Category Section Header with Dedicated "+ Add Product" Button -->
        <div class="admin-cat-header">
          <div class="admin-cat-title-block">
            <div class="admin-cat-pill-row">
              <span class="cat-channel-tag tag-${channel}"><i class="fa-solid fa-tag"></i> ${escapeHtml(channelLabel)}</span>
              <span class="admin-cat-badge">${escapeHtml(cat.badge || 'Collection')}</span>
              <span class="admin-cat-count-pill">${allCatProducts.length} Total Photos</span>
              <span class="admin-cat-sub-count-pill" style="background:#f4efe6; color:var(--color-primary); font-size:0.74rem; font-weight:700; padding:3px 10px; border-radius:12px;">${subCategories.length} Subtitle Categories</span>
            </div>
            <h3 class="admin-cat-title">${escapeHtml(cat.displayName || cat.name)}</h3>
            <p class="admin-cat-description">${escapeHtml(cat.description || 'Artisan handcrafted creations.')}</p>
          </div>
          
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <!-- Dedicated Add Product/Photo button for THIS main category -->
            <button class="btn btn-add-cat-product" onclick="openAddProductModalForCategory('${cat.id}')">
              <i class="fa-solid fa-plus"></i> + Add Photo to ${escapeHtml(cat.name)}
            </button>
            <!-- Quick button to add new Subtitle Category -->
            <button class="btn btn-sm btn-outline-cat" onclick="quickAddSubCategoryPrompt('${cat.id}')" style="background:#ffffff; border:1px solid var(--color-border); padding:8px 14px; font-weight:600; font-size:0.8rem; border-radius:4px; display:inline-flex; align-items:center; gap:6px;">
              <i class="fa-solid fa-folder-plus"></i> + Add Subtitle
            </button>
          </div>
        </div>

        <!-- Subtitle Category Quick Jump Navigation Pills -->
        <div class="admin-subcat-nav-pills">
          <span class="subcat-nav-label"><i class="fa-solid fa-tags"></i> Subtitle Categories:</span>
          ${subCategories.map(subName => {
            const count = allCatProducts.filter(p => normalizeSubCategory(cat.id, p.subItem) === subName).length;
            const subSlug = subName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            return `
              <a href="#subcat-${cat.id}-${subSlug}" class="subcat-pill-link">
                ${escapeHtml(subName)} (${count})
              </a>
            `;
          }).join('')}
        </div>

        <!-- Section Divider -->
        <div class="admin-cat-divider">
          <span class="admin-cat-divider-title">Subtitle Categories in ${escapeHtml(cat.name)}</span>
          <div class="admin-cat-divider-line"></div>
        </div>

        <!-- Vertical Stack of Subtitle Categories with Separate Add Photo Sections -->
        <div class="admin-subcategories-vertical">
          ${subCategories.map(subName => {
            // Products strictly belonging to this subtitle category
            let subProducts = allCatProducts.filter(p => normalizeSubCategory(cat.id, p.subItem) === subName);

            // Filter if search query active
            if (query !== '') {
              subProducts = subProducts.filter(p => 
                (p.title && p.title.toLowerCase().includes(query)) ||
                (p.name && p.name.toLowerCase().includes(query)) ||
                (p.subItem && p.subItem.toLowerCase().includes(query)) ||
                (p.material && p.material.toLowerCase().includes(query)) ||
                (p.origin && p.origin.toLowerCase().includes(query))
              );
            }

            const subSlug = subName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

            return `
              <div class="admin-subcat-section-card" id="subcat-${cat.id}-${subSlug}">
                <div class="admin-subcat-card-header">
                  <div class="admin-subcat-header-left">
                    <div class="admin-subcat-icon-badge">
                      <i class="fa-solid fa-layer-group"></i>
                    </div>
                    <div>
                      <h4 class="admin-subcat-name">${escapeHtml(subName)}</h4>
                      <span class="admin-subcat-meta">${subProducts.length} Photo${subProducts.length === 1 ? '' : 's'} in ${escapeHtml(subName)}</span>
                    </div>
                  </div>

                  <!-- Dedicated SEPARATE Add Photo button for THIS subtitle category -->
                  <button class="btn btn-add-subcat-photo" onclick="openAddProductModalForCategory('${cat.id}', '${escapeAttr(subName)}')">
                    <i class="fa-solid fa-camera"></i> + Add Photo to ${escapeHtml(subName)}
                  </button>
                </div>

                <div class="admin-subcat-body">
                  ${subProducts.length === 0 ? `
                    <div class="admin-subcat-empty">
                      <div class="empty-icon"><i class="fa-regular fa-image"></i></div>
                      <div class="empty-text">
                        <strong>No photos added yet in ${escapeHtml(subName)}</strong>
                        <span>Click "+ Add Photo to ${escapeHtml(subName)}" to add photos separately for this subtitle category.</span>
                      </div>
                      <button class="btn btn-sm btn-primary-soft" onclick="openAddProductModalForCategory('${cat.id}', '${escapeAttr(subName)}')">
                        <i class="fa-solid fa-plus"></i> Add First Photo
                      </button>
                    </div>
                  ` : `
                    <div class="admin-subcat-photos-grid">
                      ${subProducts.map(prod => `
                        <div class="admin-product-card" id="admin-prod-${prod.id}">
                          <div class="admin-prod-thumb-wrap">
                            <img src="${prod.image || 'images/wooden-gallery.jpg'}" alt="${escapeHtml(prod.title || prod.name)}" class="admin-prod-thumb" onerror="this.src='images/wooden-gallery.jpg'">
                            <span class="admin-prod-badge">${escapeHtml(prod.badge || 'Artisan Signature')}</span>
                          </div>
                          <div class="admin-prod-details">
                            <span class="admin-prod-sub-tag"><i class="fa-solid fa-tag"></i> ${escapeHtml(subName)}</span>
                            <h4 class="admin-prod-title">${escapeHtml(prod.title || prod.name)}</h4>
                            <div class="admin-prod-price-row">
                              <span class="admin-prod-price">${prod.priceFormatted || (prod.price > 0 ? '₹' + Number(prod.price).toLocaleString('en-IN') : '₹0')}</span>
                              ${prod.origin ? `<span class="admin-prod-origin"><i class="fa-solid fa-location-dot"></i> ${escapeHtml(prod.origin)}</span>` : ''}
                            </div>
                            ${prod.description ? `<p class="admin-prod-desc-snippet">${escapeHtml(prod.description)}</p>` : ''}
                          </div>
                          <div class="admin-prod-actions">
                            <button class="btn-card-action btn-card-edit" onclick="editProduct('${prod.id}')" title="Edit Photo / Product">
                              <i class="fa-solid fa-pen-to-square"></i> Edit
                            </button>
                            <button class="btn-card-action btn-card-delete" onclick="confirmDeleteProduct('${prod.id}')" title="Delete Photo">
                              <i class="fa-solid fa-trash-can"></i> Delete
                            </button>
                          </div>
                        </div>
                      `).join('')}
                    </div>
                  `}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </section>
    `;
  }).join('');
}

// Populate Category & Subtitle values and banner displays in Product Modal
function populateModalCategoryDropdown(selectedCatId, targetSubName = '') {
  const currentCatId = selectedCatId || (PRODUCT_CATEGORIES[0] && PRODUCT_CATEGORIES[0].id) || 'artisan-gallery';
  const catSelect = document.getElementById('prodCategorySelect');
  if (catSelect) {
    catSelect.innerHTML = PRODUCT_CATEGORIES.map(c => `
      <option value="${c.id}" ${c.id === currentCatId ? 'selected' : ''}>
        ${escapeHtml(c.name)} (${(c.channel || 'shop').toUpperCase()})
      </option>
    `).join('');
  }

  handleModalCategorySelect(currentCatId, targetSubName);
}

window.handleModalCategorySelect = function(catId, targetSubName = '') {
  const cat = getCategoryById(catId);
  if (!cat) return;

  const catIdEl = document.getElementById('prodCategoryId');
  const catNameEl = document.getElementById('prodCategory');
  if (catIdEl) catIdEl.value = cat.id;
  if (catNameEl) catNameEl.value = cat.name;

  const bannerCat = document.getElementById('modalCategoryDisplay');
  if (bannerCat) bannerCat.textContent = cat.name;

  // Determine target subtitle category
  const subCats = getAllSubCategoriesForCategory(cat.id);
  const chosenSub = targetSubName || (subCats && subCats[0]) || 'Featured Creations';

  const subItemEl = document.getElementById('prodSubItem');
  if (subItemEl) subItemEl.value = chosenSub;

  const subHiddenEl = document.getElementById('prodSubItemHidden');
  if (subHiddenEl) subHiddenEl.value = chosenSub;

  const bannerSub = document.getElementById('modalSubCategoryDisplay');
  if (bannerSub) bannerSub.textContent = chosenSub;

  // Update dropdowns if present in the DOM
  const subSelect = document.getElementById('prodSubItemSelect');
  const customInput = document.getElementById('prodSubItemCustom');
  if (subSelect) {
    let html = subCats.map(sub => `<option value="${escapeHtml(sub)}">${escapeHtml(sub)}</option>`).join('');
    html += `<option value="__custom__">+ Add Custom Subtitle Category...</option>`;
    subSelect.innerHTML = html;

    if (subCats.includes(chosenSub)) {
      subSelect.value = chosenSub;
      if (customInput) customInput.style.display = 'none';
    } else {
      subSelect.value = '__custom__';
      if (customInput) {
        customInput.style.display = 'block';
        customInput.value = chosenSub;
      }
    }
  }
};

window.handleModalSubCategorySelect = function(val) {
  const customInput = document.getElementById('prodSubItemCustom');
  const bannerSub = document.getElementById('modalSubCategoryDisplay');
  
  if (val === '__custom__') {
    if (customInput) {
      customInput.style.display = 'block';
      customInput.focus();
      document.getElementById('prodSubItem').value = customInput.value || 'Custom Craft';
      if (bannerSub) bannerSub.textContent = customInput.value || 'Custom Craft';
    }
  } else {
    if (customInput) customInput.style.display = 'none';
    document.getElementById('prodSubItem').value = val;
    if (bannerSub) bannerSub.textContent = val;
  }
};

// Open Add Product / Photo Modal for a specific category and subtitle category
window.openAddProductModalForCategory = function(categoryId, subCategoryName = '') {
  const cat = getCategoryById(categoryId);
  if (!cat) return;

  const form = document.getElementById('productForm');
  if (form) form.reset();

  // Reset uploaded file state
  uploadedPhotoDataUrl = '';
  const fileInput = document.getElementById('prodFileInput');
  if (fileInput) fileInput.value = '';

  document.getElementById('editProductId').value = '';
  document.getElementById('prodCategoryId').value = cat.id;
  document.getElementById('prodCategory').value = cat.name;

  // Determine target subtitle category
  const activeSubName = subCategoryName || (cat.subCategories && cat.subCategories[0]) || 'Featured Creations';
  document.getElementById('prodSubItem').value = activeSubName;
  const hiddenSub = document.getElementById('prodSubItemHidden');
  if (hiddenSub) hiddenSub.value = activeSubName;

  document.getElementById('productModalTitle').textContent = `Add Photo to ${cat.name}`;
  populateModalCategoryDropdown(cat.id, activeSubName);
  
  document.getElementById('saveProductBtn').textContent = `Save Photo to ${activeSubName}`;

  // Reset custom image text
  document.getElementById('prodCustomImage').value = '';

  // Select appropriate default preset and show preview
  const defaultPresets = {
    'artisan-gallery': 'images/artisan-gallery.jpg',
    'wooden-gallery': 'images/wooden-gallery.jpg',
    'premium-home-decor': 'images/premium-decor.jpg',
    'personalization-gifting': 'images/personalization.jpg',
    'esg-corporate-solution': 'images/esg-corporate.jpg',
    'corporate-gifting': 'images/corporate-lifestyle.jpg',
    'wholesale-wood': 'images/wholesale.jpg',
    'wholesale-metal': 'images/wholesale.jpg',
    'export-wood': 'images/global-sourcing.jpg',
    'export-metal': 'images/global-sourcing.jpg'
  };
  const presetVal = defaultPresets[cat.id] || 'images/artisan-gallery.jpg';
  const defaultRadio = document.querySelector(`input[name="prodImgPreset"][value="${presetVal}"]`) || document.querySelector('input[name="prodImgPreset"]');
  if (defaultRadio) {
    defaultRadio.checked = true;
    showPhotoPreview(presetVal, 'Craft Preset Selected');
  }

  document.getElementById('productModal').classList.add('active');
};

// Fallback/Generic Add Product (defaults to currently active channel or first category)
window.openAddProductModal = function() {
  let targetCatId = 'artisan-gallery';
  if (currentAdminChannel !== 'all') {
    const channelCat = PRODUCT_CATEGORIES.find(c => (c.channel || 'shop') === currentAdminChannel);
    if (channelCat) targetCatId = channelCat.id;
  }
  openAddProductModalForCategory(targetCatId);
};

// Edit Product (Preserves existing category & subtitle category, updates in place)
window.editProduct = function(productId) {
  const prod = adminProducts.find(p => p.id === productId);
  if (!prod) return;

  const cat = getCategoryById(prod.categoryId || prod.category);
  const currentSub = prod.subItem || (cat && cat.subCategories && cat.subCategories[0]) || 'Featured Creations';

  document.getElementById('editProductId').value = prod.id;
  document.getElementById('prodCategoryId').value = cat ? cat.id : (prod.categoryId || 'artisan-gallery');
  document.getElementById('prodCategory').value = cat ? cat.name : (prod.category || 'Artisan Gallery');

  document.getElementById('prodTitle').value = prod.title || prod.name || '';
  document.getElementById('prodPrice').value = (prod.price !== undefined && prod.price !== null) ? prod.price : '';
  document.getElementById('prodSubItem').value = currentSub;
  const hiddenSub = document.getElementById('prodSubItemHidden');
  if (hiddenSub) hiddenSub.value = currentSub;

  populateModalCategoryDropdown(cat ? cat.id : 'artisan-gallery', currentSub);

  document.getElementById('prodBadge').value = prod.badge || 'Artisan Signature';
  document.getElementById('prodOrigin').value = prod.origin || '';
  document.getElementById('prodMaterial').value = prod.material || '';
  document.getElementById('prodDescription').value = prod.description || '';
  document.getElementById('prodCustomImage').value = prod.image || '';

  // Setup photo preview
  uploadedPhotoDataUrl = '';
  const fileInput = document.getElementById('prodFileInput');
  if (fileInput) fileInput.value = '';

  if (prod.image) {
    showPhotoPreview(prod.image, 'Current Product Photo');
  }

  // Select matching preset radio if matches
  const radios = document.querySelectorAll('input[name="prodImgPreset"]');
  radios.forEach(r => {
    r.checked = (r.value === prod.image);
  });

  const catName = cat ? cat.name : (prod.category || 'Category');
  document.getElementById('productModalTitle').textContent = `Edit Photo — ${prod.title || prod.name}`;
  document.getElementById('saveProductBtn').textContent = 'Update Product Photo';

  document.getElementById('productModal').classList.add('active');
};

window.closeProductModal = function() {
  document.getElementById('productModal').classList.remove('active');
};

// Handle Add / Edit Submission
window.handleProductSubmit = function(event) {
  event.preventDefault();
  const editId = document.getElementById('editProductId').value;
  const title = document.getElementById('prodTitle').value.trim();
  const categorySelect = document.getElementById('prodCategorySelect');
  let categoryId = document.getElementById('prodCategoryId').value;
  let category = document.getElementById('prodCategory').value;
  if (categorySelect && categorySelect.value) {
    categoryId = categorySelect.value;
    const foundCat = getCategoryById(categoryId);
    category = foundCat.name;
  }

  const priceVal = document.getElementById('prodPrice').value;
  const price = priceVal !== '' ? parseInt(priceVal, 10) : 0;

  const subSelect = document.getElementById('prodSubItemSelect');
  const customInput = document.getElementById('prodSubItemCustom');
  let subItem = document.getElementById('prodSubItem').value.trim();
  if (subSelect && subSelect.value === '__custom__' && customInput && customInput.value.trim()) {
    subItem = customInput.value.trim();
  } else if (subSelect && subSelect.value && subSelect.value !== '__custom__') {
    subItem = subSelect.value;
  }
  if (!subItem) subItem = 'Featured Creations';

  // Ensure subtitle category is saved to category taxonomy
  const targetCat = getCategoryById(categoryId);
  if (targetCat) {
    if (!targetCat.subCategories) targetCat.subCategories = [];
    if (!targetCat.subCategories.includes(subItem)) {
      targetCat.subCategories.push(subItem);
      if (typeof saveCategories === 'function') saveCategories();
    }
  }

  const badge = document.getElementById('prodBadge').value;
  const origin = document.getElementById('prodOrigin').value.trim();
  const material = document.getElementById('prodMaterial').value.trim();
  const description = document.getElementById('prodDescription').value.trim();

  // Determine final image source:
  // 1. Uploaded File (Base64 data URL)
  // 2. Custom Image URL/Path
  // 3. Selected Preset Radio
  let image = uploadedPhotoDataUrl || '';
  if (!image) {
    const customImg = document.getElementById('prodCustomImage').value.trim();
    if (customImg) {
      image = customImg;
    } else {
      const selectedRadio = document.querySelector('input[name="prodImgPreset"]:checked');
      image = selectedRadio ? selectedRadio.value : 'images/artisan-gallery.jpg';
    }
  }

  if (editId) {
    // Update existing product in place without creating a duplicate
    const index = adminProducts.findIndex(p => p.id === editId);
    if (index !== -1) {
      adminProducts[index] = {
        ...adminProducts[index],
        name: title,
        title: title,
        categoryId: categoryId || adminProducts[index].categoryId,
        category: category || adminProducts[index].category,
        subItem: subItem,
        price: price,
        priceFormatted: price > 0 ? '₹' + price.toLocaleString('en-IN') : '₹0',
        badge: badge,
        image: image,
        origin: origin,
        material: material,
        description: description,
        updatedAt: new Date().toISOString()
      };
      showToast(`Photo for "${title}" updated successfully! Synchronized with storefront.`);
    }
  } else {
    // Add new product assigned to categoryId and subItem
    const newProduct = {
      id: 'prod-' + Date.now(),
      name: title,
      title: title,
      categoryId: categoryId,
      category: category,
      subItem: subItem,
      price: price,
      priceFormatted: price > 0 ? '₹' + price.toLocaleString('en-IN') : '₹0',
      badge: badge,
      image: image,
      origin: origin || 'Handcrafted in India',
      material: material || 'Natural Materials',
      description: description || '',
      createdAt: new Date().toISOString()
    };
    adminProducts.unshift(newProduct);
    showToast(`New product "${title}" with photo added to live customer store!`);
  }

  saveProducts();
  renderCategoryProductSections();
  renderDashboard();
  closeProductModal();
};

// Delete Product Confirmation
window.confirmDeleteProduct = function(productId) {
  const prod = adminProducts.find(p => p.id === productId);
  if (!prod) return;

  pendingDeleteProductId = productId;
  const previewEl = document.getElementById('deleteProductPreview');
  if (previewEl) {
    previewEl.innerHTML = `
      <img src="${prod.image || 'images/wooden-gallery.jpg'}" alt="${escapeHtml(prod.title || prod.name)}" class="delete-preview-thumb" onerror="this.src='images/wooden-gallery.jpg'">
      <div class="delete-preview-info">
        <span class="delete-preview-title">${escapeHtml(prod.title || prod.name)}</span>
        <span class="delete-preview-cat"><i class="fa-solid fa-folder"></i> ${escapeHtml(prod.category || 'Category')}</span>
      </div>
    `;
  }
  document.getElementById('deleteConfirmModal').classList.add('active');
};

window.closeDeleteConfirmModal = function() {
  pendingDeleteProductId = null;
  document.getElementById('deleteConfirmModal').classList.remove('active');
};

window.executeDeleteProduct = function() {
  if (!pendingDeleteProductId) return;
  const prod = adminProducts.find(p => p.id === pendingDeleteProductId);
  const title = prod ? (prod.title || prod.name) : 'Product';

  adminProducts = adminProducts.filter(p => p.id !== pendingDeleteProductId);
  pendingDeleteProductId = null;

  saveProducts();
  renderCategoryProductSections();
  renderDashboard();
  closeDeleteConfirmModal();
  showToast(`Product "${title}" removed from catalog.`);
};

// Legacy deleteProduct wrapper
window.deleteProduct = function(productId) {
  confirmDeleteProduct(productId);
};

// Reset to Default Products
window.confirmResetCatalog = function() {
  if (confirm('This will restore the original 14 curated artisan products from the notebook. Are you sure?')) {
    adminProducts = SEED_PRODUCTS.map(normalizeProduct);
    saveProducts();
    renderCategoryProductSections();
    renderDashboard();
    showToast('Product catalog reset to default seed data.');
  }
};

// Jump / Filter Category Sections
window.jumpToCategory = function(catId) {
  document.querySelectorAll('.cat-jump-pill').forEach(btn => btn.classList.remove('active'));
  const allBtns = Array.from(document.querySelectorAll('.cat-jump-pill'));
  const activeBtn = allBtns.find(b => b.getAttribute('onclick')?.includes(`'${catId}'`));
  if (activeBtn) activeBtn.classList.add('active');

  if (catId === 'all') {
    document.querySelectorAll('.admin-category-section').forEach(sec => sec.style.display = 'block');
  } else {
    document.querySelectorAll('.admin-category-section').forEach(sec => {
      if (sec.id === `cat-sec-${catId}`) {
        sec.style.display = 'block';
        sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        sec.style.display = 'none';
      }
    });
  }
};

function renderCategoryJumpPills() {
  const container = document.getElementById('categoryJumpPills');
  if (!container) return;

  let cats = PRODUCT_CATEGORIES;
  if (currentAdminChannel !== 'all') {
    cats = cats.filter(c => (c.channel || 'shop') === currentAdminChannel);
  }

  container.innerHTML = `
    <button class="cat-jump-pill active" onclick="jumpToCategory('all')">All in View (${cats.length})</button>
    ${cats.map(cat => `
      <button class="cat-jump-pill" onclick="jumpToCategory('${cat.id}')">${escapeHtml(cat.displayName || cat.name)}</button>
    `).join('')}
  `;
}
window.renderCategoryJumpPills = renderCategoryJumpPills;

// Open Add Category Modal
window.openAddCategoryModal = function() {
  const form = document.getElementById('categoryForm');
  if (form) form.reset();
  document.getElementById('editCategoryId').value = '';
  document.getElementById('categoryModalTitle').textContent = 'Add New Product Category';
  document.getElementById('saveCategoryBtn').textContent = 'Create Category';

  // Preset channel to active filter if not 'all'
  const channelSelect = document.getElementById('newCatChannel');
  if (channelSelect && currentAdminChannel !== 'all') {
    channelSelect.value = currentAdminChannel;
  }

  const nextNum = PRODUCT_CATEGORIES.length + 1;
  const numStr = nextNum < 10 ? '0' + nextNum : String(nextNum);
  document.getElementById('newCatBadge').value = `Collection ${numStr}`;

  document.getElementById('categoryModal').classList.add('active');
};

window.closeCategoryModal = function() {
  const modal = document.getElementById('categoryModal');
  if (modal) modal.classList.remove('active');
};

window.handleCategorySubmit = function(event) {
  event.preventDefault();
  const name = document.getElementById('newCatName').value.trim();
  const channel = document.getElementById('newCatChannel')?.value || 'shop';
  const badge = document.getElementById('newCatBadge').value.trim();
  const description = document.getElementById('newCatDescription').value.trim();
  const subCatsRaw = document.getElementById('newCatSubCategories').value.trim();
  const image = document.getElementById('newCatImage')?.value.trim() || 'images/wooden-gallery.jpg';

  if (!name) return;

  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || ('cat-' + Date.now());

  let subCategories = [];
  if (subCatsRaw) {
    subCategories = subCatsRaw.split(',').map(s => s.trim()).filter(Boolean);
  }
  if (subCategories.length === 0) {
    subCategories = ['General Collection', 'Artisan Creations'];
  }

  const channelLabels = {
    shop: 'Shop Collections',
    corporate: 'Corporate Gifting',
    wholesale: 'Wholesale B2B',
    export: 'Export & Global'
  };
  const channelName = channelLabels[channel] || 'Shop Collections';

  const existingIdx = PRODUCT_CATEGORIES.findIndex(c => c.id === id || c.name.toLowerCase() === name.toLowerCase());
  const newCatObj = {
    id: id,
    name: name,
    displayName: name,
    channel: channel,
    channelName: channelName,
    badge: badge || `${channelName}`,
    description: description || `Artisanal handcrafted ${name} creations.`,
    icon: 'fa-boxes-stacked',
    image: image,
    subCategories: subCategories
  };

  if (existingIdx !== -1) {
    PRODUCT_CATEGORIES[existingIdx] = {
      ...PRODUCT_CATEGORIES[existingIdx],
      ...newCatObj
    };
    showToast(`Category "${name}" updated!`);
  } else {
    PRODUCT_CATEGORIES.push(newCatObj);
    showToast(`New category "${name}" added to ${channelName} and synced with customer storefront!`);
  }

  saveCategories();

  // If newly created category is in a different channel than current filter, switch filter
  if (currentAdminChannel !== 'all' && currentAdminChannel !== channel) {
    currentAdminChannel = channel;
    document.querySelectorAll('.channel-pill-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-channel') === channel);
    });
  }

  renderCategoryProductSections();
  renderCategoryJumpPills();
  renderDashboard();
  closeCategoryModal();

  // Scroll to the new category section
  setTimeout(() => {
    jumpToCategory(id);
  }, 200);
};

window.filterCategorySections = function() {
  const query = (document.getElementById('productSearchInput').value || '').toLowerCase().trim();
  renderCategoryProductSections(query);
};

// Compatibility aliases
window.renderProductsTable = function() {
  renderCategoryProductSections();
};

window.filterProductsTable = function() {
  filterCategorySections();
};


// =============================================================================
// PROPOSALS MANAGEMENT (VIEW, STATUS UPDATE, EXPORT)
// =============================================================================

function renderProposalsTable() {
  const tbody = document.getElementById('proposalsTableBody');
  if (!tbody) return;

  let list = adminProposals;
  if (currentProposalFilter !== 'all') {
    list = list.filter(p => p.status === currentProposalFilter);
  }

  if (list.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; padding: 40px; color: #888;">
          No proposal requests in this category.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = list.map(prop => `
    <tr>
      <td><strong style="color: var(--color-primary);">${prop.id}</strong></td>
      <td>
        <span style="font-weight: 600; color: var(--color-primary); display: block;">${prop.name}</span>
        <span style="font-size: 0.78rem; color: #888;">${prop.company}</span>
      </td>
      <td style="font-size: 0.8rem;">
        <div><i class="fa-solid fa-envelope" style="color: var(--color-gold);"></i> ${prop.email}</div>
        <div><i class="fa-solid fa-phone" style="color: var(--color-gold);"></i> ${prop.phone}</div>
      </td>
      <td>
        <span class="badge-tag">${prop.type}</span>
      </td>
      <td style="font-size: 0.84rem; font-weight: 600; color: var(--color-primary);">
        ${prop.units || 'N/A'}
      </td>
      <td style="font-size: 0.78rem; color: #888;">
        ${new Date(prop.createdAt).toLocaleDateString()}
      </td>
      <td>
        <select onchange="updateProposalStatus('${prop.id}', this.value)" style="padding: 4px 8px; font-size: 0.76rem; border-radius: 4px; border: 1px solid #ddd; background: #fff;">
          <option value="New" ${prop.status === 'New' ? 'selected' : ''}>🟡 New</option>
          <option value="Under Review" ${prop.status === 'Under Review' ? 'selected' : ''}>🔵 Under Review</option>
          <option value="Proposal Sent" ${prop.status === 'Proposal Sent' ? 'selected' : ''}>🟢 Proposal Sent</option>
          <option value="Closed" ${prop.status === 'Closed' ? 'selected' : ''}>⚪ Closed</option>
        </select>
      </td>
      <td>
        <div class="action-btns">
          <button class="btn-icon" onclick="viewProposalDetail('${prop.id}')" title="View Details">
            <i class="fa-solid fa-eye"></i>
          </button>
          <button class="btn-icon btn-icon-delete" onclick="deleteProposal('${prop.id}')" title="Delete Inquiry">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

window.filterProposalsByStatus = function(status) {
  currentProposalFilter = status;
  document.querySelectorAll('.filter-tabs-pills .pill-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.textContent.trim().toLowerCase() === status.toLowerCase() || (status === 'all' && btn.textContent.includes('All'))) {
      btn.classList.add('active');
    }
  });
  renderProposalsTable();
};

window.updateProposalStatus = function(propId, newStatus) {
  const prop = adminProposals.find(p => p.id === propId);
  if (!prop) return;

  prop.status = newStatus;
  saveProposals();
  renderProposalsTable();
  renderDashboard();
  showToast(`Inquiry #${propId} status marked as "${newStatus}"`);
};

window.deleteProposal = function(propId) {
  if (confirm(`Delete inquiry request #${propId}?`)) {
    adminProposals = adminProposals.filter(p => p.id !== propId);
    saveProposals();
    renderProposalsTable();
    renderDashboard();
    showToast('Inquiry removed.');
  }
};

window.viewProposalDetail = function(propId) {
  const prop = adminProposals.find(p => p.id === propId);
  if (!prop) return;

  document.getElementById('propDetailTitle').textContent = `Inquiry #${prop.id} — ${prop.name}`;
  document.getElementById('propDetailStatus').textContent = prop.status;

  document.getElementById('proposalDetailBody').innerHTML = `
    <div style="background: #faf8f5; padding: 18px; border-radius: 8px; margin-bottom: 20px; font-size: 0.9rem; line-height: 1.8;">
      <div><strong>Company / Entity:</strong> ${prop.company}</div>
      <div><strong>Contact Person:</strong> ${prop.name}</div>
      <div><strong>Email:</strong> ${prop.email}</div>
      <div><strong>Phone:</strong> ${prop.phone}</div>
      <div><strong>Inquiry Discipline:</strong> ${prop.type}</div>
      <div><strong>Volume / Budget:</strong> ${prop.units}</div>
      <div><strong>Submitted On:</strong> ${new Date(prop.createdAt).toLocaleString()}</div>
    </div>
    <div>
      <h4 style="font-family: var(--font-serif); font-size: 1.15rem; color: var(--color-primary); margin-bottom: 8px;">Client Customization Notes:</h4>
      <p style="background: #fff; border: 1px solid #e0dbd0; padding: 14px; border-radius: 6px; font-size: 0.88rem; color: #444; line-height: 1.6;">
        ${prop.notes || 'No specific notes provided.'}
      </p>
    </div>
  `;

  document.getElementById('proposalDetailModal').classList.add('active');
};

window.closeProposalDetailModal = function() {
  document.getElementById('proposalDetailModal').classList.remove('active');
};

// Export Proposals as CSV
window.exportProposalsToCSV = function() {
  if (adminProposals.length === 0) {
    alert('No proposals to export.');
    return;
  }

  const headers = ['Request ID', 'Client Name', 'Company', 'Email', 'Phone', 'Inquiry Type', 'Quantity Budget', 'Status', 'Date', 'Notes'];
  const rows = adminProposals.map(p => [
    p.id,
    `"${p.name}"`,
    `"${p.company}"`,
    p.email,
    p.phone,
    `"${p.type}"`,
    `"${p.units}"`,
    p.status,
    new Date(p.createdAt).toLocaleDateString(),
    `"${(p.notes || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Verdanta_Proposals_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('Proposals exported to CSV successfully!');
};

// =============================================================================
// ORDERS MANAGEMENT
// =============================================================================

function renderOrdersTable() {
  const tbody = document.getElementById('ordersTableBody');
  if (!tbody) return;

  if (adminOrders.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 40px; color: #888;">
          No customer orders placed yet.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = adminOrders.map(ord => `
    <tr>
      <td><strong style="color: var(--color-primary);">${ord.id}</strong></td>
      <td style="font-size: 0.8rem; color: #888;">${new Date(ord.createdAt).toLocaleString()}</td>
      <td>${ord.customerName || 'Online Shopper'}</td>
      <td style="font-size: 0.82rem;">
        ${(ord.items || []).map(i => `${i.quantity}x ${i.title}`).join(', ') || ord.itemCount + ' items'}
      </td>
      <td><strong style="color: var(--color-primary);">${ord.totalFormatted || '₹' + ord.total.toLocaleString('en-IN')}</strong></td>
      <td><span class="status-pill status-sent">${ord.status}</span></td>
      <td>
        <button class="btn-icon btn-icon-delete" onclick="deleteOrder('${ord.id}')" title="Delete Order">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

window.deleteOrder = function(orderId) {
  if (confirm(`Remove order record #${orderId}?`)) {
    adminOrders = adminOrders.filter(o => o.id !== orderId);
    saveOrders();
    renderOrdersTable();
    renderDashboard();
    showToast('Order record removed.');
  }
};

// Status Helpers
function getStatusClass(status) {
  switch (status) {
    case 'New': return 'status-new';
    case 'Under Review': return 'status-review';
    case 'Proposal Sent': return 'status-sent';
    case 'Closed': return 'status-closed';
    default: return 'status-new';
  }
}

// Toast
function showToast(message) {
  const toast = document.getElementById('adminToast');
  const msgEl = document.getElementById('adminToastMessage');
  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}
