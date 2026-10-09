/**
 * VERDANTA WORLD - CLIENT APPLICATION LOGIC
 * Features:
 * - Exact 5 categories & items from handwritten notes
 * - Interactive Shopping Bag (Add/Remove, Quantity, Subtotal, Free Shipping threshold)
 * - Quick View Modal
 * - Proposal Request System (Corporate/Wholesale)
 * - Catalogue Download
 * - Live Search
 * - Category Filtering
 */

// =============================================================================
// 1. PRODUCT DATABASE (Matched Directly to User's Handwritten Notes)
// =============================================================================

const DEFAULT_CATEGORIES = [
  // --- 1. SHOP COLLECTIONS (RETAIL) ---
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
          try {
            localStorage.setItem('verdanta_categories', JSON.stringify(PRODUCT_CATEGORIES));
          } catch (e) {}
        }
        return;
      }
    } catch (e) {
      console.warn('Could not parse stored categories:', e);
    }
  }
  PRODUCT_CATEGORIES = [...DEFAULT_CATEGORIES];
  try {
    localStorage.setItem('verdanta_categories', JSON.stringify(PRODUCT_CATEGORIES));
  } catch (e) {}
}

loadCategories();

// Helper to normalize subcategory names across all channels
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

// Get all subtitle categories for a category
function getAllSubCategoriesForCategory(catId) {
  const cat = getCategoryById(catId);
  const defaultSubs = (cat && cat.subCategories) ? [...cat.subCategories] : [];
  const set = new Set(defaultSubs);

  if (Array.isArray(PRODUCTS_DATA)) {
    PRODUCTS_DATA.forEach(p => {
      const pCatId = p.categoryId || normalizeCategoryId(p.category);
      if (pCatId === catId && p.subItem) {
        set.add(normalizeSubCategory(catId, p.subItem));
      }
    });
  }

  return Array.from(set);
}

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
    image: 'images/wooden-gallery.jpg',
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

const DEFAULT_PRODUCTS = [
  // 1) Artisan Gallery: lamp, terracotta clay, natural grass and handwoven
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

  // 2) Wooden Gallery: clock, key chain, toys, tea light candle, decore products
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

  // 3) Premium Home Decor: table decor, wall hanging decore, decorative accessories
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

  // 4) ESG Corporate Solution: employee appreciation gift kit, customization kit
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

  // 5) Personalization Gifting
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
    badge: 'Wholesale B2B',
    image: 'images/wooden-gallery.jpg',
    material: 'Seasoned Sheesham Wood, Natural Teak Oil',
    origin: 'Saharanpur Woodcarving Hub',
    description: 'Wholesale assortment for boutiques and gift retailers with tiered quantity pricing.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'wh-wood-02',
    categoryId: 'wholesale-wood',
    category: 'Wholesale Wood Crafts',
    subItem: 'Tea-Light Holders',
    name: 'Cluster Jali Carved Wooden Tea-Light Lantern (Lot of 12)',
    title: 'Cluster Jali Carved Wooden Tea-Light Lantern (Lot of 12)',
    price: 2400,
    priceFormatted: '₹2,400',
    badge: 'Wholesale B2B',
    image: 'images/wooden-gallery.jpg',
    material: 'Handcrafted Mango Wood, Brass Ring Handle',
    origin: 'Nagina Craft Cluster',
    description: 'Master artisan carved open fretwork jali lantern creating dramatic amber light casts.',
    createdAt: new Date().toISOString()
  },

  // 8) Wholesale Metal Crafts
  {
    id: 'wh-metal-01',
    categoryId: 'wholesale-metal',
    category: 'Wholesale Metal Crafts',
    subItem: 'Radha Krishna',
    name: 'Lost-Wax Antique Brass Radha Krishna Murti (Bulk Lot)',
    title: 'Lost-Wax Antique Brass Radha Krishna Murti (Bulk Lot)',
    price: 5200,
    priceFormatted: '₹5,200',
    badge: 'Wholesale B2B',
    image: 'images/premium-decor.jpg',
    material: 'Pure Hand-cast Brass, Antique Olive Patina',
    origin: 'Moradabad Metal Guild',
    description: 'Finely sculpted divine couple icon with ornate lotus pedestal and flute details.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'wh-metal-02',
    categoryId: 'wholesale-metal',
    category: 'Wholesale Metal Crafts',
    subItem: 'Musician Sets',
    name: 'Tribal Dhokra Folk Musician Set (Pack of 3)',
    title: 'Tribal Dhokra Folk Musician Set (Pack of 3)',
    price: 3800,
    priceFormatted: '₹3,800',
    badge: 'Wholesale B2B',
    image: 'images/wholesale.jpg',
    material: 'Hand-molded Bell Metal Alloy, Raw Earth Patina',
    origin: 'Bastar Artisan Guild',
    description: 'Primitive lost-wax casting preserving ancient craft traditions for lifestyle boutiques.',
    createdAt: new Date().toISOString()
  },

  // 9) Export Wood Crafts
  {
    id: 'exp-wood-01',
    categoryId: 'export-wood',
    category: 'Export Wood Crafts',
    subItem: 'Wooden Decorative Trays',
    name: 'Export Grade Chevron Inlaid Sheesham Serving Tray',
    title: 'Export Grade Chevron Inlaid Sheesham Serving Tray',
    price: 3100,
    priceFormatted: '₹3,100',
    badge: 'Export Global',
    image: 'images/global-sourcing.jpg',
    material: 'Kiln-dried Sheesham & Natural Bone Inlay, Food-Safe Lacquer',
    origin: 'Jodhpur Export Cluster',
    description: 'Certified for international markets with moisture-controlled packaging and phytosanitary compliance.',
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

// Load dynamic products from localStorage or initialize with defaults
let PRODUCTS_DATA = [];
try {
  const stored = localStorage.getItem('verdanta_products');
  if (stored) {
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed) && parsed.length > 0) {
      PRODUCTS_DATA = parsed.map(normalizeProduct);
      const existingIds = new Set(PRODUCTS_DATA.map(p => p.id));
      let addedNew = false;
      DEFAULT_PRODUCTS.forEach(sp => {
        if (!existingIds.has(sp.id)) {
          PRODUCTS_DATA.push(normalizeProduct(sp));
          addedNew = true;
        }
      });
      if (addedNew) {
        try {
          localStorage.setItem('verdanta_products', JSON.stringify(PRODUCTS_DATA));
        } catch (e) {}
      }
    } else {
      PRODUCTS_DATA = DEFAULT_PRODUCTS.map(normalizeProduct);
    }
  } else {
    PRODUCTS_DATA = DEFAULT_PRODUCTS.map(normalizeProduct);
    localStorage.setItem('verdanta_products', JSON.stringify(PRODUCTS_DATA));
  }
} catch (e) {
  PRODUCTS_DATA = DEFAULT_PRODUCTS.map(normalizeProduct);
}

// =============================================================================
// 2. STATE MANAGEMENT & SHOPPING BAG
// =============================================================================

let cartState = JSON.parse(localStorage.getItem('verdanta_cart')) || [];
let wishlistState = JSON.parse(localStorage.getItem('verdanta_wishlist')) || [];
let currentCategoryFilter = 'all';

// =============================================================================
// CATEGORY SYNCHRONIZATION: NAVBAR SHOP DROPDOWN, TABS, CARDS & CATALOG
// =============================================================================

// 1. Render Shop Mega Dropdown in Customer Navbar (Focuses on Shop collections)
function renderNavbarShopDropdown() {
  const grid = document.getElementById('shopMegaDropdownGrid');
  if (!grid) return;

  const shopCats = PRODUCT_CATEGORIES.filter(c => (c.channel || 'shop') === 'shop');

  grid.innerHTML = shopCats.map((cat, idx) => {
    const subCats = getAllSubCategoriesForCategory(cat.id);
    const catNum = idx + 1;
    const catTitle = `${catNum}. ${cat.name.toUpperCase()}`;

    return `
      <div class="mega-col">
        <h4 class="mega-title">${escapeHtml(catTitle)}</h4>
        <ul class="mega-list">
          ${subCats.slice(0, 8).map(sub => `
            <li>
              <a href="#categories" data-category="${escapeHtml(cat.name)}" data-sub="${escapeHtml(sub)}">
                <i class="fa-solid fa-angle-right"></i> ${escapeHtml(sub)}
              </a>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  }).join('');

  // Re-bind click handlers to smoothly filter & scroll
  grid.querySelectorAll('.mega-list a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const catName = link.getAttribute('data-category');
      const subName = link.getAttribute('data-sub');
      if (catName) {
        filterAndScroll(catName, subName);
      }
    });
  });
}

// 2. Render Category Filter Tabs
function renderCategoryTabs() {
  const container = document.querySelector('.category-tabs');
  if (!container) return;

  const tabsHtml = [
    `<button class="tab-btn ${currentCategoryFilter === 'all' ? 'active' : ''}" data-filter="all">All Collections</button>`,
    ...PRODUCT_CATEGORIES.map((cat, idx) => {
      const isAct = (currentCategoryFilter === cat.id || currentCategoryFilter === cat.name || normalizeCategoryId(currentCategoryFilter) === cat.id);
      return `<button class="tab-btn ${isAct ? 'active' : ''}" data-filter="${escapeHtml(cat.name)}">${escapeHtml(cat.displayName || `${idx + 1}. ${cat.name}`)}</button>`;
    })
  ].join('');

  container.innerHTML = tabsHtml;

  // Re-bind click events
  container.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      currentCategoryFilter = (filter === 'all') ? 'all' : normalizeCategoryId(filter);
      renderProductCatalog();
    });
  });
}

// 3. Render "Shop by Collection" Visual Cards
function renderCategoryCardsGrid() {
  const container = document.querySelector('.category-cards-grid');
  if (!container) return;

  container.innerHTML = PRODUCT_CATEGORIES.map((cat, idx) => {
    const subCats = getAllSubCategoriesForCategory(cat.id);
    const subListHtml = subCats.slice(0, 5).map(s => `<li>• ${escapeHtml(s)}</li>`).join('');
    const badgeText = cat.badge || `Collection ${idx + 1 < 10 ? '0' + (idx + 1) : idx + 1}`;
    const imgUrl = cat.image || 'images/wooden-gallery.jpg';
    const isEsg = cat.id === 'esg-corporate-solution' || cat.name.toLowerCase().includes('esg');

    return `
      <div class="category-card" data-category="${escapeHtml(cat.name)}">
        <div class="category-card-image-wrap">
          <img src="${imgUrl}" alt="${escapeHtml(cat.name)}" class="category-card-img" loading="lazy" onerror="this.src='images/wooden-gallery.jpg'">
          <div class="category-tag-badge">${escapeHtml(badgeText)}</div>
        </div>
        <div class="category-card-content">
          <h3 class="category-card-title">${escapeHtml(cat.name.toUpperCase())}</h3>
          <ul class="subcategories-tag-list">
            ${subListHtml}
          </ul>
          <p class="category-card-snippet">${escapeHtml(cat.description || `Artisanal handcrafted ${cat.name} creations.`)}</p>
          ${isEsg ? `
            <button class="category-card-btn" onclick="openProposalModal('${escapeHtml(cat.name)}')">REQUEST ESG PROPOSAL <i class="fa-solid fa-arrow-right"></i></button>
          ` : `
            <button class="category-card-btn" onclick="filterAndScroll('${escapeHtml(cat.name)}')">EXPLORE ${escapeHtml(cat.name.toUpperCase())} <i class="fa-solid fa-arrow-right"></i></button>
          `}
        </div>
      </div>
    `;
  }).join('');
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  loadCategories();
  renderNavbarShopDropdown();
  renderCategoryTabs();
  renderCategoryCardsGrid();
  renderProductCatalog();
  updateCartUI();
  updateWishlistBadge();
  setupEventListeners();
  setupHeaderScrollEffect();

  // Listen for admin changes in other tabs or local storage dispatch
  window.addEventListener('storage', (e) => {
    if (!e.key || e.key === 'verdanta_categories') {
      loadCategories();
      renderNavbarShopDropdown();
      renderCategoryTabs();
      renderCategoryCardsGrid();
      renderProductCatalog();
    }
    if (!e.key || e.key === 'verdanta_products') {
      try {
        const raw = JSON.parse(localStorage.getItem('verdanta_products'));
        PRODUCTS_DATA = Array.isArray(raw) ? raw.map(normalizeProduct) : DEFAULT_PRODUCTS.map(normalizeProduct);
      } catch (err) {
        PRODUCTS_DATA = DEFAULT_PRODUCTS.map(normalizeProduct);
      }
      renderProductCatalog();
    }
  });

  window.addEventListener('verdanta-products-updated', (e) => {
    if (e.detail && Array.isArray(e.detail)) {
      PRODUCTS_DATA = e.detail.map(normalizeProduct);
      renderProductCatalog();
    }
  });
});

// Setup Events
function setupEventListeners() {
  // Mobile navigation toggle
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const mainNav = document.getElementById('mainNavigation');
  if (mobileBtn && mainNav) {
    mobileBtn.addEventListener('click', () => {
      mainNav.classList.toggle('mobile-active');
    });
  }

  // Cart trigger
  const cartTrigger = document.getElementById('cartTriggerBtn');
  if (cartTrigger) {
    cartTrigger.addEventListener('click', openCart);
  }

  // Search trigger
  const searchTrigger = document.getElementById('searchTriggerBtn');
  if (searchTrigger) {
    searchTrigger.addEventListener('click', openSearch);
  }

  // Wishlist trigger
  const wishlistTrigger = document.getElementById('wishlistTriggerBtn');
  if (wishlistTrigger) {
    wishlistTrigger.addEventListener('click', () => {
      showToast(`You have ${wishlistState.length} saved items in your craft wishlist.`);
    });
  }

  // Search input live handler
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      performSearch(e.target.value);
    });
  }
}

// Sticky header styling on scroll
function setupHeaderScrollEffect() {
  const header = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// =============================================================================
// 3. PRODUCT CATALOG RENDERING
// =============================================================================

function renderProductCardHtml(product) {
  return `
    <article class="product-card" id="card-${product.id}">
      <div class="product-img-box">
        <img src="${product.image}" alt="${escapeHtml(product.title || product.name)}" class="product-img" loading="lazy" onerror="this.src='images/wooden-gallery.jpg'">
        <span class="product-badge">${escapeHtml(product.badge || 'Artisan Creation')}</span>
        <div class="product-quick-actions">
          <button class="quick-action-btn" onclick="openQuickView('${product.id}')">
            <i class="fa-regular fa-eye"></i> QUICK VIEW
          </button>
          <button class="quick-action-btn" onclick="addToCart('${product.id}')">
            <i class="fa-solid fa-plus"></i> ADD TO BAG
          </button>
        </div>
      </div>
      <div class="product-info">
        <span class="product-category-meta">${escapeHtml(product.category)}</span>
        <h4 class="product-title">${escapeHtml(product.title || product.name)}</h4>
        ${product.subItem ? `<span class="product-sub-item-tag"><i class="fa-solid fa-tag"></i> ${escapeHtml(product.subItem)}</span>` : ''}
        <div class="product-price-row">
          <span class="product-price">${product.priceFormatted || '₹' + (product.price || 0).toLocaleString('en-IN')}</span>
          <button class="add-cart-mini-btn" onclick="addToCart('${product.id}')" title="Add to bag">
            <i class="fa-solid fa-bag-shopping"></i>
          </button>
        </div>
      </div>
    </article>
  `;
}

function renderCategorySubBlocksHtml(cat, catProducts) {
  const subCats = getAllSubCategoriesForCategory(cat.id);
  const groups = [];
  subCats.forEach(subName => {
    const items = catProducts.filter(p => normalizeSubCategory(cat.id, p.subItem) === subName);
    if (items.length > 0) {
      groups.push({ subName, items });
    }
  });

  const matchedIds = new Set(groups.flatMap(g => g.items.map(i => i.id)));
  const remaining = catProducts.filter(p => !matchedIds.has(p.id));
  if (remaining.length > 0) {
    groups.push({ subName: 'Curated Creations', items: remaining });
  }

  if (groups.length <= 1) {
    return `
      <div class="product-cards-grid">
        ${catProducts.map(renderProductCardHtml).join('')}
      </div>
    `;
  }

  return `
    <div class="public-subcategories-wrap">
      ${groups.map(g => `
        <div class="public-subcat-group">
          <div class="public-subcat-heading-bar">
            <h4 class="public-subcat-title"><i class="fa-solid fa-layer-group"></i> ${escapeHtml(g.subName)}</h4>
            <span class="public-subcat-count-pill">${g.items.length} ${g.items.length === 1 ? 'Creation' : 'Creations'}</span>
          </div>
          <div class="product-cards-grid">
            ${g.items.map(renderProductCardHtml).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderProductCatalog() {
  const container = document.getElementById('productCatalogGrid');
  const countLabel = document.getElementById('productsCountText');
  if (!container) return;

  if (currentCategoryFilter === 'all') {
    // Collect all active categories in taxonomy order
    const categoriesToRender = [...PRODUCT_CATEGORIES];

    // Also include any custom categories that might only exist on products
    const existingIds = new Set(categoriesToRender.map(c => c.id));
    PRODUCTS_DATA.forEach(p => {
      const pCatId = p.categoryId || normalizeCategoryId(p.category);
      if (!existingIds.has(pCatId)) {
        existingIds.add(pCatId);
        categoriesToRender.push(getCategoryById(pCatId));
      }
    });

    if (countLabel) {
      countLabel.textContent = `Showing all ${PRODUCTS_DATA.length} handcrafted creations across ${categoriesToRender.length} collections`;
    }

    container.innerHTML = categoriesToRender.map(cat => {
      // Products belonging exclusively to this category
      const catProducts = PRODUCTS_DATA.filter(p => {
        const pCatId = p.categoryId || normalizeCategoryId(p.category);
        return pCatId === cat.id;
      });

      return `
        <div class="public-category-block" id="pub-cat-${cat.id}">
          <div class="public-cat-header">
            <div class="public-cat-title-wrap">
              <span class="public-cat-eyebrow">${escapeHtml(cat.badge || 'Collection')}</span>
              <h3 class="public-cat-title">${escapeHtml(cat.name.toUpperCase())}</h3>
            </div>
            <span class="public-cat-count">${catProducts.length} Artisan Creation${catProducts.length === 1 ? '' : 's'}</span>
          </div>
          ${catProducts.length === 0 ? `
            <div style="padding: 24px; text-align: center; color: var(--color-text-muted); background: #faf9f6; border-radius: 8px; margin-bottom: 24px; border: 1px dashed var(--color-border);">
              <p style="margin: 0; font-size: 0.92rem;"><i class="fa-solid fa-sparkles" style="color:var(--color-gold); margin-right: 6px;"></i>New artisan creations for ${escapeHtml(cat.name)} arriving soon. Inquire directly for bespoke requests.</p>
            </div>
          ` : renderCategorySubBlocksHtml(cat, catProducts)}
        </div>
      `;
    }).join('');
  } else {
    // Single category filtered
    const targetCat = getCategoryById(currentCategoryFilter);
    const filtered = PRODUCTS_DATA.filter(p => {
      const pCatId = p.categoryId || normalizeCategoryId(p.category);
      return pCatId === targetCat.id || (p.category && p.category.toLowerCase() === targetCat.name.toLowerCase());
    });

    if (countLabel) {
      countLabel.textContent = `Showing ${filtered.length} artisan creation${filtered.length === 1 ? '' : 's'} in ${targetCat.name}`;
    }

    container.innerHTML = `
      <div class="public-category-block" id="pub-cat-${targetCat.id}">
        <div class="public-cat-header">
          <div class="public-cat-title-wrap">
            <span class="public-cat-eyebrow">${escapeHtml(targetCat.badge || 'Collection')}</span>
            <h3 class="public-cat-title">${escapeHtml(targetCat.name.toUpperCase())}</h3>
          </div>
          <span class="public-cat-count">${filtered.length} Artisan Creation${filtered.length === 1 ? '' : 's'}</span>
        </div>
        ${filtered.length === 0 ? `
          <div style="padding: 40px; text-align: center; color: var(--color-text-muted); background: #faf9f6; border-radius: 8px; border: 1px dashed var(--color-border);">
            <p style="margin: 0 0 16px; font-size: 1rem;"><i class="fa-solid fa-sparkles" style="color:var(--color-gold); margin-right: 6px;"></i>No creations currently listed in ${escapeHtml(targetCat.name)}.</p>
            <button class="btn btn-outline btn-sm" onclick="filterAndScroll('all')">View All Collections</button>
          </div>
        ` : renderCategorySubBlocksHtml(targetCat, filtered)}
      </div>
    `;
  }
}

// Filter and scroll smoothly to catalog
window.filterAndScroll = function(categoryName, subCategory) {
  const normId = normalizeCategoryId(categoryName);
  const targetCat = getCategoryById(normId);

  const tabBtns = document.querySelectorAll('.category-tabs .tab-btn');
  tabBtns.forEach(btn => {
    const btnFilter = btn.getAttribute('data-filter');
    if (categoryName === 'all' && btnFilter === 'all') {
      btn.classList.add('active');
    } else if (btnFilter === categoryName || btnFilter === targetCat.name || (btnFilter !== 'all' && normalizeCategoryId(btnFilter) === normId)) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  currentCategoryFilter = (categoryName === 'all') ? 'all' : normId;
  renderProductCatalog();

  const catalogElem = document.getElementById('categories');
  if (catalogElem) {
    catalogElem.scrollIntoView({ behavior: 'smooth' });
  }

  if (subCategory) {
    setTimeout(() => {
      const headers = document.querySelectorAll('.public-subcat-title');
      for (const h of headers) {
        if (h.textContent.toLowerCase().includes(subCategory.toLowerCase())) {
          h.scrollIntoView({ behavior: 'smooth', block: 'center' });
          break;
        }
      }
    }, 450);
  }
};

window.toggleAllProducts = function() {
  filterAndScroll('all');
};

// =============================================================================
// 4. SHOPPING CART SYSTEM
// =============================================================================

window.addToCart = function(productId, quantity = 1) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  const existing = cartState.find(item => item.id === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cartState.push({
      id: product.id,
      title: product.title,
      price: product.price,
      priceFormatted: product.priceFormatted,
      image: product.image,
      category: product.category,
      subItem: product.subItem,
      quantity: quantity
    });
  }

  saveCart();
  updateCartUI();
  showToast(`"${product.title}" added to your shopping bag!`);
  openCart();
};

window.removeFromCart = function(productId) {
  cartState = cartState.filter(item => item.id !== productId);
  saveCart();
  updateCartUI();
};

window.updateItemQuantity = function(productId, delta) {
  const item = cartState.find(i => i.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  saveCart();
  updateCartUI();
};

function saveCart() {
  localStorage.setItem('verdanta_cart', JSON.stringify(cartState));
}

function updateCartUI() {
  const countEl = document.getElementById('cartCount');
  const drawerCountEl = document.getElementById('drawerCartCount');
  const cartListEl = document.getElementById('cartItemsList');
  const subtotalEl = document.getElementById('cartSubtotal');
  const footerEl = document.getElementById('cartDrawerFooter');
  const shippingText = document.getElementById('shippingProgressText');
  const shippingFill = document.getElementById('shippingProgressFill');

  const totalItems = cartState.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartState.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (countEl) countEl.textContent = totalItems;
  if (drawerCountEl) drawerCountEl.textContent = `(${totalItems})`;

  if (cartState.length === 0) {
    cartListEl.innerHTML = `
      <div class="cart-empty-state">
        <i class="fa-solid fa-bag-shopping empty-cart-icon"></i>
        <p>Your shopping bag is currently empty.</p>
        <button class="btn btn-primary" onclick="closeCart(); filterAndScroll('all')">EXPLORE CREATIONS</button>
      </div>
    `;
    if (footerEl) footerEl.style.opacity = '0.5';
    if (subtotalEl) subtotalEl.textContent = '₹0';
    if (shippingFill) shippingFill.style.width = '0%';
    if (shippingText) shippingText.textContent = 'Add ₹2,499 more for Complimentary Shipping';
    return;
  }

  if (footerEl) footerEl.style.opacity = '1';

  // Free shipping progress logic (Threshold ₹2,499)
  const threshold = 2499;
  if (subtotal >= threshold) {
    if (shippingText) shippingText.innerHTML = `<strong><i class="fa-solid fa-check"></i> Congratulations! You've unlocked Complimentary Shipping</strong>`;
    if (shippingFill) {
      shippingFill.style.width = '100%';
      shippingFill.style.backgroundColor = '#2c4e3e';
    }
  } else {
    const diff = threshold - subtotal;
    const pct = Math.min(100, Math.round((subtotal / threshold) * 100));
    if (shippingText) shippingText.textContent = `Add ₹${diff.toLocaleString('en-IN')} more for Complimentary Shipping`;
    if (shippingFill) {
      shippingFill.style.width = `${pct}%`;
      shippingFill.style.backgroundColor = 'var(--color-gold)';
    }
  }

  if (subtotalEl) {
    subtotalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
  }

  cartListEl.innerHTML = cartState.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.title}" class="cart-item-img">
      <div class="cart-item-details">
        <h4 class="cart-item-title">${item.title}</h4>
        <span class="cart-item-meta">${item.category} • ${item.subItem}</span>
        <div class="cart-item-price">₹${(item.price * item.quantity).toLocaleString('en-IN')}</div>
        <div class="cart-item-actions">
          <div class="quantity-stepper">
            <button class="qty-btn" onclick="updateItemQuantity('${item.id}', -1)" aria-label="Decrease quantity">-</button>
            <span class="qty-number">${item.quantity}</span>
            <button class="qty-btn" onclick="updateItemQuantity('${item.id}', 1)" aria-label="Increase quantity">+</button>
          </div>
          <button class="cart-item-remove-btn" onclick="removeFromCart('${item.id}')">Remove</button>
        </div>
      </div>
    </div>
  `).join('');
}

window.openCart = function() {
  document.getElementById('cartDrawer').classList.add('active');
  document.getElementById('cartOverlay').classList.add('active');
};

window.closeCart = function() {
  document.getElementById('cartDrawer').classList.remove('active');
  document.getElementById('cartOverlay').classList.remove('active');
};

window.simulateCheckout = function() {
  if (cartState.length === 0) {
    alert('Your shopping bag is empty.');
    return;
  }
  const subtotal = cartState.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalQty = cartState.reduce((sum, item) => sum + item.quantity, 0);
  
  const orderRecord = {
    id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
    items: [...cartState],
    itemCount: totalQty,
    total: subtotal,
    totalFormatted: '₹' + subtotal.toLocaleString('en-IN'),
    status: 'Confirmed',
    customerName: 'Online Shopper',
    createdAt: new Date().toISOString()
  };

  const orders = JSON.parse(localStorage.getItem('verdanta_orders')) || [];
  orders.unshift(orderRecord);
  localStorage.setItem('verdanta_orders', JSON.stringify(orders));

  alert(`Thank you for choosing authentic Indian artisan crafts!\n\nOrder #${orderRecord.id} Confirmed!\nTotal: ₹${subtotal.toLocaleString('en-IN')}\n\nOur artisan concierge will proceed with dispatch and tracking.`);
  cartState = [];
  saveCart();
  updateCartUI();
  closeCart();
};

function updateWishlistBadge() {
  const el = document.getElementById('wishlistCount');
  if (el) el.textContent = wishlistState.length;
}

// =============================================================================
// 5. QUICK VIEW MODAL
// =============================================================================

window.openQuickView = function(productId) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  const content = document.getElementById('quickViewContent');
  content.innerHTML = `
    <div>
      <img src="${product.image}" alt="${product.title}" class="quick-view-img">
    </div>
    <div class="quick-view-details">
      <span class="modal-eyebrow">${product.category} • ${product.subItem}</span>
      <h2>${product.title}</h2>
      <div class="quick-view-price">${product.priceFormatted}</div>
      <p style="color: var(--color-text-muted); font-size: 0.95rem; line-height: 1.7;">${product.description}</p>
      
      <div class="quick-view-specs">
        <div><strong>Origin:</strong> ${product.origin}</div>
        <div><strong>Materials:</strong> ${product.material}</div>
        <div><strong>Impact:</strong> Directly supports 10+ artisan craft families</div>
      </div>

      <div style="display: flex; gap: 14px; margin-top: 24px;">
        <button class="btn btn-primary" style="flex: 1;" onclick="addToCart('${product.id}'); closeQuickView();">
          <i class="fa-solid fa-bag-shopping"></i> ADD TO SHOPPING BAG
        </button>
        <button class="btn btn-secondary" style="color: var(--color-primary); border-color: var(--color-primary);" onclick="openProposalModal('${product.title}')">
          BULK INQUIRY
        </button>
      </div>
    </div>
  `;

  document.getElementById('quickViewModal').classList.add('active');
};

window.closeQuickView = function() {
  document.getElementById('quickViewModal').classList.remove('active');
};

// =============================================================================
// 6. PROPOSAL & B2B MODAL
// =============================================================================

window.openProposalModal = function(inquiryTitle = 'General Inquiry') {
  const modal = document.getElementById('proposalModal');
  const typeSelect = document.getElementById('partnershipType');
  const modalTitle = document.getElementById('proposalModalTitle');

  if (modalTitle) {
    modalTitle.textContent = `Request a Proposal — ${inquiryTitle}`;
  }

  if (typeSelect) {
    const title = inquiryTitle.toLowerCase();
    if (title.includes('occasion')) {
      typeSelect.value = 'Occasion Kits';
    } else if (title.includes('executive')) {
      typeSelect.value = 'Executive Gifting';
    } else if (title.includes('bespoke')) {
      typeSelect.value = 'Bespoke Sourcing';
    } else if (title.includes('branded')) {
      typeSelect.value = 'Branded Gifting';
    } else if (title.includes('employee') || title.includes('onboarding') || title.includes('desk') || title.includes('anniversary') || title.includes('wellness') || title.includes('commute')) {
      typeSelect.value = 'Employee Appreciation Gift Kit';
    } else if (title.includes('festive') || title.includes('diwali') || title.includes('pooja') || title.includes('confectionery') || title.includes('accents') || title.includes('solstice')) {
      typeSelect.value = 'Festive Gifting';
    } else if (title.includes('custom') || title.includes('leadership') || title.includes('conference') || title.includes('appreciation') || title.includes('fusion') || title.includes('monogram')) {
      typeSelect.value = 'Custom Gift Kits';
    } else if (title.includes('esg') || title.includes('impact') || title.includes('zero-waste') || title.includes('women') || title.includes('revival') || title.includes('biodegradable') || title.includes('carbon')) {
      typeSelect.value = 'ESG & Impact Gifting';
    } else if (title.includes('boutique')) {
      typeSelect.value = 'Wholesale - Indian Boutiques';
    } else if (title.includes('gift store') || title.includes('stores')) {
      typeSelect.value = 'Wholesale - Gift Stores';
    } else if (title === 'lifestyle' || title.includes('wholesale - lifestyle')) {
      typeSelect.value = 'Wholesale - Lifestyle';
    } else if (title === 'retailers' || title.includes('wholesale - retailers')) {
      typeSelect.value = 'Wholesale - Retailers';
    } else if (title.includes('reseller')) {
      typeSelect.value = 'Wholesale - Resellers';
    } else if (title.includes('international') || title.includes('export - international')) {
      typeSelect.value = 'Export - International Retailers';
    } else if (title.includes('distributor')) {
      typeSelect.value = 'Export - Distributors';
    } else if (title.includes('hospitality')) {
      typeSelect.value = 'Export - Hospitality';
    } else if (title.includes('lifestyle brand') || title.includes('brand')) {
      typeSelect.value = 'Export - Lifestyle Brands';
    } else if (title.includes('personalization')) {
      typeSelect.value = 'Personalization Gifting';
    } else {
      typeSelect.value = 'General Inquiry';
    }
  }

  modal.classList.add('active');
};

window.closeProposalModal = function() {
  document.getElementById('proposalModal').classList.remove('active');
};

window.handleProposalSubmit = function(event) {
  event.preventDefault();
  const name = document.getElementById('contactName').value;
  const company = document.getElementById('companyName').value;
  const email = document.getElementById('workEmail').value;
  const phone = document.getElementById('phoneNumber').value;
  const type = document.getElementById('partnershipType').value;
  const units = document.getElementById('estimatedUnits').value || 'Not specified';
  const notes = document.getElementById('projectNotes').value || 'No additional notes';

  const newProposal = {
    id: 'PRP-' + Date.now().toString().slice(-6),
    name: name,
    company: company,
    email: email,
    phone: phone,
    type: type,
    units: units,
    notes: notes,
    status: 'New',
    createdAt: new Date().toISOString()
  };

  const proposals = JSON.parse(localStorage.getItem('verdanta_proposals')) || [];
  proposals.unshift(newProposal);
  localStorage.setItem('verdanta_proposals', JSON.stringify(proposals));

  alert(`Thank you, ${name}! Your proposal request for "${company}" (${type}) has been logged successfully (ID: ${newProposal.id}). Our B2B partnership director will respond within 24 hours.`);
  
  document.getElementById('proposalForm').reset();
  closeProposalModal();
};

// =============================================================================
// 7. CATALOGUE & SHOWROOM VISIT MODALS
// =============================================================================

window.openCatalogueModal = function() {
  document.getElementById('catalogueModal').classList.add('active');
};

window.closeCatalogueModal = function() {
  document.getElementById('catalogueModal').classList.remove('active');
};

window.simulateDownload = function(filename) {
  showToast(`Preparing download for: ${filename}`);
  setTimeout(() => {
    alert(`Downloading "${filename}"\n\nThank you for exploring Verdanta World export collections!`);
    closeCatalogueModal();
  }, 600);
};

window.openVisitModal = function() {
  document.getElementById('visitModal').classList.add('active');
};

window.closeVisitModal = function() {
  document.getElementById('visitModal').classList.remove('active');
};

// =============================================================================
// 8. LIVE SEARCH SYSTEM
// =============================================================================

window.openSearch = function() {
  const overlay = document.getElementById('searchOverlay');
  overlay.classList.add('active');
  const input = document.getElementById('searchInput');
  if (input) {
    input.value = '';
    input.focus();
  }
  performSearch('');
};

window.closeSearch = function() {
  document.getElementById('searchOverlay').classList.remove('active');
};

window.performSearch = function(query) {
  const grid = document.getElementById('searchResultsGrid');
  const input = document.getElementById('searchInput');
  if (input && query !== input.value) {
    input.value = query;
  }

  const q = (query || '').toLowerCase().trim();
  const results = q === '' 
    ? PRODUCTS_DATA.slice(0, 6)
    : PRODUCTS_DATA.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.subItem.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q)
      );

  if (results.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; color: rgba(255,255,255,0.7); padding: 40px 0;">
        <p style="font-size: 1.2rem;">No creations found matching "${query}"</p>
        <span style="font-size: 0.9rem;">Try searching for lamp, clock, terracotta, tea light, or ESG kit</span>
      </div>
    `;
    return;
  }

  grid.innerHTML = results.map(p => `
    <div style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; overflow: hidden; padding: 12px; display: flex; gap: 12px; align-items: center; cursor: pointer;" onclick="closeSearch(); openQuickView('${p.id}')">
      <img src="${p.image}" alt="${p.title}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;">
      <div>
        <h5 style="color: #ffffff; font-size: 0.95rem; font-family: var(--font-serif);">${p.title}</h5>
        <span style="color: var(--color-gold); font-size: 0.75rem;">${p.subItem} • ${p.priceFormatted}</span>
      </div>
    </div>
  `).join('');
};

// =============================================================================
// 9. TOAST NOTIFICATION
// =============================================================================

function showToast(message) {
  const toast = document.getElementById('toastNotification');
  const msgEl = document.getElementById('toastMessage');
  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

// =============================================================================
// 10. CUSTOMER STOREFRONT ADD PRODUCT PHOTO MODAL & LIVE SYNCHRONIZATION
// =============================================================================

let custUploadedPhotoDataUrl = '';

window.openCustomerAddProductModal = function(preselectedCatId = '') {
  const modal = document.getElementById('customerProductModal');
  const form = document.getElementById('customerProductForm');
  if (form) form.reset();

  custUploadedPhotoDataUrl = '';
  const fileInput = document.getElementById('custFileInput');
  if (fileInput) fileInput.value = '';
  const urlInput = document.getElementById('custProdCustomImage');
  if (urlInput) urlInput.value = '';

  // Populate category dropdown
  const catSelect = document.getElementById('custProdCategory');
  if (catSelect) {
    const currentCatId = preselectedCatId || (PRODUCT_CATEGORIES[0] && PRODUCT_CATEGORIES[0].id) || 'artisan-gallery';
    catSelect.innerHTML = PRODUCT_CATEGORIES.map(c => `
      <option value="${c.id}" ${c.id === currentCatId ? 'selected' : ''}>
        ${escapeHtml(c.name)} (${(c.channel || 'shop').toUpperCase()})
      </option>
    `).join('');
    handleCustomerCategoryChange(currentCatId);
  }

  // Default preset photo
  const defaultRadio = document.querySelector('input[name="custImgPreset"][value="images/artisan-gallery.jpg"]');
  if (defaultRadio) {
    defaultRadio.checked = true;
    showCustomerPhotoPreview('images/artisan-gallery.jpg', 'Craft Preset: Pottery');
  }

  if (modal) modal.classList.add('active');
};

window.closeCustomerAddProductModal = function() {
  const modal = document.getElementById('customerProductModal');
  if (modal) modal.classList.remove('active');
};

window.handleCustomerCategoryChange = function(catId) {
  const cat = getCategoryById(catId);
  if (!cat) return;

  const subCats = getAllSubCategoriesForCategory(cat.id);
  const subSelect = document.getElementById('custProdSubItem');
  const customInput = document.getElementById('custProdSubItemCustom');

  if (subSelect) {
    let html = subCats.map(sub => `<option value="${escapeHtml(sub)}">${escapeHtml(sub)}</option>`).join('');
    html += `<option value="__custom__">+ Add Custom Subtitle Category...</option>`;
    subSelect.innerHTML = html;
    if (customInput) customInput.style.display = 'none';
  }
};

window.handleCustomerSubCategoryChange = function(val) {
  const customInput = document.getElementById('custProdSubItemCustom');
  if (val === '__custom__') {
    if (customInput) {
      customInput.style.display = 'block';
      customInput.focus();
    }
  } else {
    if (customInput) customInput.style.display = 'none';
  }
};

window.handleCustomerDropFile = function(event) {
  event.preventDefault();
  const dropzone = document.getElementById('custPhotoDropzone');
  if (dropzone) dropzone.style.borderColor = '';
  if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length > 0) {
    const fakeEvent = { target: { files: event.dataTransfer.files } };
    window.handleCustomerImageUpload(fakeEvent);
  }
};

window.handleCustomerImageUpload = function(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  if (file.size > 8 * 1024 * 1024) {
    alert('Please choose an image file under 8MB.');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
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

      custUploadedPhotoDataUrl = dataUrl;
      showCustomerPhotoPreview(dataUrl, 'Uploaded from Computer');

      const customInput = document.getElementById('custProdCustomImage');
      if (customInput) customInput.value = '';
      document.querySelectorAll('input[name="custImgPreset"]').forEach(r => r.checked = false);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
};

window.handleCustomerImageUrlInput = function(val) {
  const url = (val || '').trim();
  if (url) {
    custUploadedPhotoDataUrl = '';
    const fileInput = document.getElementById('custFileInput');
    if (fileInput) fileInput.value = '';
    document.querySelectorAll('input[name="custImgPreset"]').forEach(r => r.checked = false);
    showCustomerPhotoPreview(url, 'Custom Image Link');
  }
};

window.handleCustomerPresetSelect = function(val) {
  custUploadedPhotoDataUrl = '';
  const fileInput = document.getElementById('custFileInput');
  if (fileInput) fileInput.value = '';
  const customInput = document.getElementById('custProdCustomImage');
  if (customInput) customInput.value = '';
  showCustomerPhotoPreview(val, 'Craft Preset Selected');
};

function showCustomerPhotoPreview(src, label) {
  const wrap = document.getElementById('custPhotoPreviewWrap');
  const img = document.getElementById('custPhotoPreviewImg');
  const tag = document.getElementById('custPreviewSourceTag');
  const prompt = document.getElementById('custDropzonePrompt');
  if (wrap && img) {
    img.src = src;
    if (tag) tag.textContent = label || 'Photo Preview';
    wrap.style.display = 'flex';
    if (prompt) prompt.style.display = 'none';
  }
}

window.removeCustomerUploadedImage = function() {
  custUploadedPhotoDataUrl = '';
  const fileInput = document.getElementById('custFileInput');
  if (fileInput) fileInput.value = '';
  const customInput = document.getElementById('custProdCustomImage');
  if (customInput) customInput.value = '';

  const wrap = document.getElementById('custPhotoPreviewWrap');
  const prompt = document.getElementById('custDropzonePrompt');
  if (wrap) wrap.style.display = 'none';
  if (prompt) prompt.style.display = 'block';

  // Fallback to first preset
  const firstPreset = document.querySelector('input[name="custImgPreset"]');
  if (firstPreset) {
    firstPreset.checked = true;
    showCustomerPhotoPreview(firstPreset.value, 'Craft Preset: Pottery');
  }
};

window.handleCustomerProductSubmit = function(event) {
  event.preventDefault();

  const title = document.getElementById('custProdTitle').value.trim();
  const categoryId = document.getElementById('custProdCategory').value;
  const categoryObj = getCategoryById(categoryId);
  const category = categoryObj.name;

  const priceVal = document.getElementById('custProdPrice').value;
  const price = priceVal !== '' ? parseInt(priceVal, 10) : 0;

  const subSelect = document.getElementById('custProdSubItem');
  const customInput = document.getElementById('custProdSubItemCustom');
  let subItem = (subSelect && subSelect.value !== '__custom__') ? subSelect.value : '';
  if (subSelect && subSelect.value === '__custom__' && customInput && customInput.value.trim()) {
    subItem = customInput.value.trim();
  }
  if (!subItem) subItem = 'Featured Creations';

  // Persist new subcategory if novel
  if (categoryObj) {
    if (!categoryObj.subCategories) categoryObj.subCategories = [];
    if (!categoryObj.subCategories.includes(subItem)) {
      categoryObj.subCategories.push(subItem);
      try {
        localStorage.setItem('verdanta_categories', JSON.stringify(PRODUCT_CATEGORIES));
      } catch (e) {}
    }
  }

  // Determine image source
  let image = custUploadedPhotoDataUrl || '';
  if (!image) {
    const customImg = document.getElementById('custProdCustomImage').value.trim();
    if (customImg) {
      image = customImg;
    } else {
      const selectedRadio = document.querySelector('input[name="custImgPreset"]:checked');
      image = selectedRadio ? selectedRadio.value : 'images/artisan-gallery.jpg';
    }
  }

  const badge = document.getElementById('custProdBadge').value || 'New Arrival';
  const origin = document.getElementById('custProdOrigin').value.trim() || 'Handcrafted in India';
  const description = document.getElementById('custProdDescription').value.trim() || '';

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
    origin: origin,
    material: 'Natural Materials',
    description: description,
    createdAt: new Date().toISOString()
  };

  PRODUCTS_DATA.unshift(newProduct);

  // Save to localStorage safely
  try {
    localStorage.setItem('verdanta_products', JSON.stringify(PRODUCTS_DATA));
  } catch (err) {
    console.warn('LocalStorage limit reached on storefront, optimizing...', err);
    PRODUCTS_DATA.forEach(p => {
      if (p.image && p.image.startsWith('data:image') && p.image.length > 180000) {
        p.image = 'images/artisan-gallery.jpg';
      }
    });
    try {
      localStorage.setItem('verdanta_products', JSON.stringify(PRODUCTS_DATA));
    } catch (e2) {}
  }

  // Re-render storefront catalog & category tabs
  renderCategoryTabs();
  renderCategoryCardsGrid();
  renderProductCatalog();
  closeCustomerAddProductModal();

  showToast(`✨ "${title}" added with photo! Visible live in the customer catalog.`);

  // Scroll to new product card with glowing outline
  setTimeout(() => {
    const card = document.getElementById(`card-${newProduct.id}`);
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      card.classList.add('product-card-highlight');
      setTimeout(() => card.classList.remove('product-card-highlight'), 3500);
    }
  }, 350);

  // Notify other tabs
  try {
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('verdanta-products-updated', { detail: PRODUCTS_DATA }));
  } catch (e) {}
};
