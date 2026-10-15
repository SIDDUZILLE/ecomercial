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

// Multi-origin API resolver (works on http://localhost:3000, 127.0.0.1, or file://)
function getApiUrl(path) {
  if (window.location.protocol === 'file:') {
    return 'http://localhost:3000' + path;
  }
  return path;
}

const storeBroadcastChannel = (typeof BroadcastChannel !== 'undefined') ? new BroadcastChannel('verdanta_store_channel') : null;

// Configured WhatsApp Number for customer enquiries (Default: +91 88676 88699)
let VERDANTA_WHATSAPP_NUMBER = '918867688699';

// Fetch configured WhatsApp number from backend config
fetch(getApiUrl('/api/config'))
  .then(res => res.json())
  .then(cfg => {
    if (cfg && cfg.whatsapp_number) {
      VERDANTA_WHATSAPP_NUMBER = String(cfg.whatsapp_number).replace(/\D/g, '');
    }
  })
  .catch(() => { });

// Permanent Photo Storage: Cloudinary (if configured) or Hostinger Server Storage (uploads/products/)
async function uploadImageToServer(dataUrl) {
  if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image')) {
    return dataUrl;
  }

  // 1. Check if Cloudinary is configured
  const cloudName = (localStorage.getItem('verdanta_cloudinary_cloud_name') || '').trim();
  const uploadPreset = (localStorage.getItem('verdanta_cloudinary_upload_preset') || '').trim();
  if (cloudName && uploadPreset) {
    try {
      const formData = new FormData();
      formData.append('file', dataUrl);
      formData.append('upload_preset', uploadPreset);
      const cRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData
      });
      if (cRes.ok) {
        const cData = await cRes.json();
        if (cData && cData.secure_url) {
          return cData.secure_url;
        }
      }
    } catch (cErr) {
      console.warn('Cloudinary upload failed, using server fallback:', cErr);
    }
  }

  // 2. Default: Hostinger Server Storage (uploads/products/)
  try {
    const res = await fetch(getApiUrl('/api/upload-image'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: dataUrl })
    });
    if (res.ok) {
      const result = await res.json();
      if (result && result.success && result.url) {
        return result.url;
      }
    }
  } catch (err) {
    console.warn('Server storage error, using local fallback:', err);
  }
  return dataUrl;
}

function loadCategories() {
  const stored = localStorage.getItem('verdanta_categories');
  if (stored) {
    try {
      let parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Explicitly remove ESG corporate solutions from shop categories
        parsed = parsed.filter(c => c.id !== 'esg-corporate-solution' && !c.name.toLowerCase().includes('esg corporate'));
        PRODUCT_CATEGORIES = parsed;
        if (typeof renderNavbarShopDropdown === 'function') renderNavbarShopDropdown();
        if (typeof renderNavbarWholesaleDropdown === 'function') renderNavbarWholesaleDropdown();
        if (typeof renderNavbarExportDropdown === 'function') renderNavbarExportDropdown();
        if (typeof renderCategoryTabs === 'function') renderCategoryTabs();
        if (typeof renderCategoryCardsGrid === 'function') renderCategoryCardsGrid();
        if (typeof renderProductCatalog === 'function') renderProductCatalog();
        if (typeof renderCorporateProducts === 'function') renderCorporateProducts();
        if (typeof populateSearchCategoryDropdown === 'function') populateSearchCategoryDropdown();
      } else {
        PRODUCT_CATEGORIES = [...DEFAULT_CATEGORIES];
      }
    } catch (e) {
      PRODUCT_CATEGORIES = [...DEFAULT_CATEGORIES];
    }
  } else {
    PRODUCT_CATEGORIES = [...DEFAULT_CATEGORIES];
  }

  // Also fetch categories from server
  fetch(getApiUrl('/api/categories'))
    .then(res => res.json())
    .then(serverCats => {
      if (Array.isArray(serverCats) && serverCats.length > 0) {
        PRODUCT_CATEGORIES = serverCats.filter(c => c.id !== 'esg-corporate-solution');
        try {
          localStorage.setItem('verdanta_categories', JSON.stringify(PRODUCT_CATEGORIES));
        } catch (e) { }
        if (typeof renderNavbarShopDropdown === 'function') renderNavbarShopDropdown();
        if (typeof renderNavbarWholesaleDropdown === 'function') renderNavbarWholesaleDropdown();
        if (typeof renderNavbarExportDropdown === 'function') renderNavbarExportDropdown();
        if (typeof renderCategoryTabs === 'function') renderCategoryTabs();
        if (typeof renderCategoryCardsGrid === 'function') renderCategoryCardsGrid();
        if (typeof renderProductCatalog === 'function') renderProductCatalog();
        if (typeof renderCorporateProducts === 'function') renderCorporateProducts();
        if (typeof populateSearchCategoryDropdown === 'function') populateSearchCategoryDropdown();
      }
    })
    .catch(() => { });
}

loadCategories();

// Helper to normalize subcategory names across all channels
function normalizeSubCategory(catId, subItem) {
  if (!subItem) return 'Featured Creations';
  const clean = String(subItem).trim();

  // If clean exact matches an existing defined subcategory, keep it pristine
  const cat = PRODUCT_CATEGORIES.find(c => c.id === catId);
  if (cat && Array.isArray(cat.subCategories) && cat.subCategories.includes(clean)) {
    return clean;
  }

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
  }
  // Corporate Gifting (6 subcategories)
  else if (catId === 'corporate-gifting') {
    const exactList = [
      'Employee Welcome & Onboarding',
      'Employee Recognition & Milestones',
      'Festive & Celebration Gifting',
      'Client, Partner & Executive Gifting',
      'Sustainable & ESG Gifting',
      'Curated & Custom Corporate Gift Sets'
    ];
    const direct = exactList.find(s => s.toLowerCase() === lower);
    if (direct) return direct;

    if (lower.includes('welcome') || lower.includes('onboard')) return 'Employee Welcome & Onboarding';
    if (lower.includes('milestone') || lower.includes('recogni') || lower.includes('trophy') || lower.includes('plaque')) return 'Employee Recognition & Milestones';
    if (lower.includes('festive') || lower.includes('celebrat') || lower.includes('diwali') || lower.includes('deepam')) return 'Festive & Celebration Gifting';
    if (lower.includes('partner') || (lower.includes('client') && lower.includes('executive')) || lower.includes('urli')) return 'Client, Partner & Executive Gifting';
    if (lower.includes('sustain') || lower.includes('esg')) return 'Sustainable & ESG Gifting';
    if (lower.includes('curated') || lower.includes('custom') || lower.includes('hamper')) return 'Curated & Custom Corporate Gift Sets';
    return clean;
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

function escapeAttr(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

window.escapeHtml = escapeHtml;
window.escapeAttr = escapeAttr;


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
  if (clean.includes('esg')) return 'corporate-gifting';
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
  if (p.categoryId === 'esg-corporate-solution' || (p.category && p.category.toLowerCase().includes('esg corporate'))) {
    p.categoryId = 'corporate-gifting';
    p.category = 'Corporate Gifting';
    p.subItem = 'Sustainable & ESG Gifting';
  }
  const cat = getCategoryById(p.categoryId || p.category);
  p.categoryId = cat.id;
  p.category = cat.name;
  if (!p.title && p.name) p.title = p.name;
  if (!p.name && p.title) p.name = p.title;

  p.price = (p.price !== undefined && p.price !== null) ? Number(p.price) : 0;

  // Ensure every product has both MRP and Discount Selling Price
  if (p.mrp !== undefined && p.mrp !== null && p.mrp !== '' && Number(p.mrp) > p.price) {
    p.mrp = Number(p.mrp);
  } else if (p.price > 0) {
    // Generate realistic MRP so both prices appear consistently on customer dashboard
    let autoMrp = Math.round((p.price * 1.35) / 50) * 50;
    if (autoMrp <= p.price) autoMrp = p.price + 500;
    p.mrp = autoMrp;
  } else {
    p.mrp = 0;
  }

  p.mrpFormatted = p.mrp > 0 ? '₹' + p.mrp.toLocaleString('en-IN') : null;
  p.priceFormatted = (p.price && p.price > 0) ? '₹' + p.price.toLocaleString('en-IN') : '₹0';

  if (p.mrp && p.mrp > p.price && p.price > 0) {
    p.discountPercent = Math.round(((p.mrp - p.price) / p.mrp) * 100);
  } else {
    p.discountPercent = 0;
  }
  p.outOfStock = Boolean(p.outOfStock);
  return p;
}

const DEFAULT_PRODUCTS = [
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

  // Export Wood Crafts
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

// List of legacy mock IDs that should never be shown or re-injected
const LEGACY_REMOVED_IDS = new Set([
  'art-01', 'art-02', 'art-03',
  'wood-01', 'wood-02', 'wood-03', 'wood-04', 'wood-05',
  'decor-01', 'decor-02', 'decor-03',
  'corp-01', 'corp-02', 'corp-03', 'corp-04', 'esg-01', 'esg-02', 'pers-01', 'wh-metal-01', 'wh-metal-02'
]);

// Load dynamic products from localStorage or initialize with defaults
let PRODUCTS_DATA = [];
try {
  const stored = localStorage.getItem('verdanta_products');
  if (stored) {
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Purge any legacy dummy products from cache
      PRODUCTS_DATA = parsed
        .filter(p => !LEGACY_REMOVED_IDS.has(p.id))
        .map(normalizeProduct);
      try {
        localStorage.setItem('verdanta_products', JSON.stringify(PRODUCTS_DATA));
      } catch (e) { }
    } else {
      PRODUCTS_DATA = DEFAULT_PRODUCTS.filter(p => !LEGACY_REMOVED_IDS.has(p.id)).map(normalizeProduct);
    }
  } else {
    PRODUCTS_DATA = DEFAULT_PRODUCTS.filter(p => !LEGACY_REMOVED_IDS.has(p.id)).map(normalizeProduct);
    try {
      localStorage.setItem('verdanta_products', JSON.stringify(PRODUCTS_DATA));
    } catch (e) { }
  }
} catch (e) {
  PRODUCTS_DATA = DEFAULT_PRODUCTS.filter(p => !LEGACY_REMOVED_IDS.has(p.id)).map(normalizeProduct);
}

// =============================================================================
// 2. STATE MANAGEMENT & SHOPPING BAG
// =============================================================================

let cartState = JSON.parse(localStorage.getItem('verdanta_cart')) || [];
let wishlistState = JSON.parse(localStorage.getItem('verdanta_wishlist')) || [];
let currentCategoryFilter = 'all';
let currentSubCategoryFilter = null;
let currentSearchQuery = '';

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
        <h4 class="mega-title" style="cursor:pointer;" onclick="filterAndScroll('${escapeHtml(cat.name)}')">${escapeHtml(catTitle)}</h4>
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

// 1b. Render Wholesale Dropdown in Customer Navbar (Dynamic B2B Wood & Metal Categories)
function renderNavbarWholesaleDropdown() {
  const grid = document.getElementById('wholesaleDropdownGrid');
  if (!grid) return;

  const wholesaleCats = PRODUCT_CATEGORIES.filter(c => (c.channel || '').toLowerCase() === 'wholesale');
  if (wholesaleCats.length === 0) return;

  grid.innerHTML = wholesaleCats.map(cat => {
    const subCats = getAllSubCategoriesForCategory(cat.id);
    let colHeader = cat.name.toUpperCase();
    if (colHeader.includes('WOOD')) colHeader = 'WOOD';
    else if (colHeader.includes('METAL')) colHeader = 'METAL';

    return `
      <div class="split-menu-col">
        <h4 class="split-menu-header">
          <a href="#categories" class="split-header-link" data-category="${escapeHtml(cat.name)}" onclick="event.preventDefault(); filterAndScroll('${escapeHtml(cat.name)}');">
            ${escapeHtml(colHeader)}
          </a>
        </h4>
        <ul class="split-menu-list">
          ${subCats.map((sub, sIdx) => `
            <li>
              <a href="#categories" data-category="${escapeHtml(cat.name)}" data-sub="${escapeHtml(sub)}">
                ${sIdx + 1}. ${escapeHtml(sub)}
              </a>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  }).join('');

  grid.querySelectorAll('.split-header-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const catName = link.getAttribute('data-category');
      if (catName) {
        filterAndScroll(catName);
      }
    });
  });

  grid.querySelectorAll('.split-menu-list a').forEach(link => {
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

// 1c. Render Export Dropdown in Customer Navbar (Dynamic Global Export Wood & Metal Categories)
function renderNavbarExportDropdown() {
  const grid = document.getElementById('exportDropdownGrid');
  if (!grid) return;

  const exportCats = PRODUCT_CATEGORIES.filter(c => (c.channel || '').toLowerCase() === 'export');
  if (exportCats.length === 0) return;

  grid.innerHTML = exportCats.map(cat => {
    const subCats = getAllSubCategoriesForCategory(cat.id);
    let colHeader = cat.name.toUpperCase();
    if (colHeader.includes('WOOD')) colHeader = 'WOOD';
    else if (colHeader.includes('METAL')) colHeader = 'METAL';

    return `
      <div class="split-menu-col">
        <h4 class="split-menu-header">
          <a href="#categories" class="split-header-link" data-category="${escapeHtml(cat.name)}" onclick="event.preventDefault(); filterAndScroll('${escapeHtml(cat.name)}');">
            ${escapeHtml(colHeader)}
          </a>
        </h4>
        <ul class="split-menu-list">
          ${subCats.map((sub, sIdx) => `
            <li>
              <a href="#categories" data-category="${escapeHtml(cat.name)}" data-sub="${escapeHtml(sub)}">
                ${sIdx + 1}. ${escapeHtml(sub)}
              </a>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  }).join('');

  grid.querySelectorAll('.split-header-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const catName = link.getAttribute('data-category');
      if (catName) {
        filterAndScroll(catName);
      }
    });
  });

  grid.querySelectorAll('.split-menu-list a').forEach(link => {
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
    `<button class="tab-btn ${currentCategoryFilter === 'all' && !currentSubCategoryFilter ? 'active' : ''}" data-filter="all">All Collections</button>`,
    ...PRODUCT_CATEGORIES.map((cat, idx) => {
      const isAct = (!currentSubCategoryFilter && (currentCategoryFilter === cat.id || currentCategoryFilter === cat.name || normalizeCategoryId(currentCategoryFilter) === cat.id));
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
      currentSubCategoryFilter = null;
      currentSearchQuery = '';
      const catInput = document.getElementById('catalogSearchInput');
      if (catInput) catInput.value = '';
      const banner = document.getElementById('catalogActiveFilterBanner');
      if (banner) banner.style.display = 'none';
      currentCategoryFilter = (filter === 'all') ? 'all' : normalizeCategoryId(filter);
      renderProductCatalog();
    });
  });
}

// Helper to resolve the best cover image for a category
function getCategoryCoverImage(cat) {
  if (cat && cat.image && typeof cat.image === 'string' && cat.image.trim()) {
    return cat.image.trim();
  }
  // Dynamic fallback: look for the first/latest product photo belonging to this category
  if (Array.isArray(PRODUCTS_DATA)) {
    const catProd = PRODUCTS_DATA.find(p => {
      const pCatId = p.categoryId || normalizeCategoryId(p.category);
      return pCatId === cat.id && p.image && typeof p.image === 'string' && p.image.trim();
    });
    if (catProd && catProd.image) {
      return catProd.image.trim();
    }
  }
  return 'images/wooden-gallery.jpg';
}

// 3. Render "Shop by Collection" Visual Cards (Exclusively Shop Collections)
function renderCategoryCardsGrid() {
  const container = document.querySelector('.category-cards-grid');
  if (!container) return;

  const shopCats = PRODUCT_CATEGORIES.filter(c => (c.channel || 'shop') === 'shop');

  container.innerHTML = shopCats.map((cat, idx) => {
    const subCats = getAllSubCategoriesForCategory(cat.id);
    const subListHtml = subCats.slice(0, 6).map(s => `
      <li>
        <button type="button" class="subcategory-pill-btn" onclick="event.stopPropagation(); filterAndScroll('${escapeHtml(cat.name)}', '${escapeHtml(s)}')">
          <i class="fa-solid fa-angle-right"></i> ${escapeHtml(s)}
        </button>
      </li>
    `).join('');
    const badgeText = cat.badge || `Collection 0${idx + 1}`;
    const imgUrl = getCategoryCoverImage(cat);

    return `
      <div class="category-card" data-category="${escapeHtml(cat.name)}" onclick="filterAndScroll('${escapeHtml(cat.name)}')">
        <div class="category-card-image-wrap">
          <img src="${imgUrl}" alt="${escapeHtml(cat.name)}" class="category-card-img" loading="lazy" onerror="this.src='images/wooden-gallery.jpg'">
          <div class="category-tag-badge">${escapeHtml(badgeText)}</div>
        </div>
        <div class="category-card-content">
          <h3 class="category-card-title">${escapeHtml(cat.name.toUpperCase())}</h3>
          <ul class="subcategories-tag-list" onclick="event.stopPropagation()">
            ${subListHtml}
          </ul>
          <p class="category-card-snippet">${escapeHtml(cat.description || `Artisanal handcrafted ${cat.name} creations.`)}</p>
          <button type="button" class="category-card-btn" onclick="event.stopPropagation(); filterAndScroll('${escapeHtml(cat.name)}')">EXPLORE ${escapeHtml(cat.name.toUpperCase())} <i class="fa-solid fa-arrow-right"></i></button>
        </div>
      </div>
    `;
  }).join('');
}

let lastSyncedProductsJson = '';
let lastSyncedCategoriesJson = '';

// Storefront dynamic reloader for immediate synchronization with disk & server
async function syncStorefrontWithServer() {
  let hasChanges = false;

  // 1. Sync Categories from server
  try {
    const catRes = await fetch(getApiUrl('/api/categories'));
    if (catRes.ok) {
      const serverCats = await catRes.json();
      if (Array.isArray(serverCats) && serverCats.length > 0) {
        const catStr = JSON.stringify(serverCats);
        if (catStr !== lastSyncedCategoriesJson) {
          lastSyncedCategoriesJson = catStr;
          PRODUCT_CATEGORIES = serverCats.filter(c => c.id !== 'esg-corporate-solution');
          try {
            localStorage.setItem('verdanta_categories', JSON.stringify(PRODUCT_CATEGORIES));
          } catch (e) { }
          hasChanges = true;
        }
      }
    }
  } catch (cErr) { }

  // 2. Sync Products from server
  try {
    let res = await fetch(getApiUrl('/api/products'));
    if (!res.ok) {
      res = await fetch('products.json');
    }
    if (res.ok) {
      const serverProducts = await res.json();
      if (Array.isArray(serverProducts) && serverProducts.length > 0) {
        const cleanedProds = serverProducts.filter(p => !LEGACY_REMOVED_IDS.has(p.id)).map(normalizeProduct);
        const prodStr = JSON.stringify(cleanedProds);
        if (prodStr !== lastSyncedProductsJson) {
          lastSyncedProductsJson = prodStr;
          PRODUCTS_DATA = cleanedProds;
          try {
            localStorage.setItem('verdanta_products', JSON.stringify(PRODUCTS_DATA));
          } catch (e) { }
          hasChanges = true;
        }
      }
    }
  } catch (err) {
    try {
      const fb = await fetch('products.json');
      if (fb.ok) {
        const serverProducts = await fb.json();
        if (Array.isArray(serverProducts) && serverProducts.length > 0) {
          const cleanedProds = serverProducts.filter(p => !LEGACY_REMOVED_IDS.has(p.id)).map(normalizeProduct);
          const prodStr = JSON.stringify(cleanedProds);
          if (prodStr !== lastSyncedProductsJson) {
            lastSyncedProductsJson = prodStr;
            PRODUCTS_DATA = cleanedProds;
            try {
              localStorage.setItem('verdanta_products', JSON.stringify(PRODUCTS_DATA));
            } catch (e) { }
            hasChanges = true;
          }
        }
      }
    } catch (e) { }
  }

  // Fallback to local storage if server fetch was skipped or offline
  if (!hasChanges) {
    try {
      const rawCats = JSON.parse(localStorage.getItem('verdanta_categories'));
      if (Array.isArray(rawCats) && rawCats.length > 0) {
        const catStr = JSON.stringify(rawCats);
        if (catStr !== lastSyncedCategoriesJson) {
          lastSyncedCategoriesJson = catStr;
          PRODUCT_CATEGORIES = rawCats.filter(c => c.id !== 'esg-corporate-solution');
          hasChanges = true;
        }
      }
    } catch (e) { }

    try {
      const rawProds = JSON.parse(localStorage.getItem('verdanta_products'));
      if (Array.isArray(rawProds) && rawProds.length > 0) {
        const cleanedProds = rawProds.filter(p => !LEGACY_REMOVED_IDS.has(p.id)).map(normalizeProduct);
        const prodStr = JSON.stringify(cleanedProds);
        if (prodStr !== lastSyncedProductsJson) {
          lastSyncedProductsJson = prodStr;
          PRODUCTS_DATA = cleanedProds;
          try {
            localStorage.setItem('verdanta_products', JSON.stringify(PRODUCTS_DATA));
          } catch (e) { }
          hasChanges = true;
        }
      }
    } catch (e) { }
  }

  if (hasChanges) {
    renderNavbarShopDropdown();
    renderNavbarWholesaleDropdown();
    renderNavbarExportDropdown();
    renderCategoryTabs();
    renderCategoryCardsGrid();
    renderProductCatalog();
    renderCorporateProducts();
    if (typeof populateSearchCategoryDropdown === 'function') populateSearchCategoryDropdown();
  }
}

function reloadStorefrontProducts() {
  syncStorefrontWithServer();
}

// Initial trigger to begin background fetching as early as possible
syncStorefrontWithServer();

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  loadCategories();
  renderNavbarShopDropdown();
  renderNavbarWholesaleDropdown();
  renderNavbarExportDropdown();
  renderCategoryTabs();
  renderCategoryCardsGrid();
  renderProductCatalog();
  renderCorporateProducts();
  fetchCorporateCards();
  renderHeroSection();
  fetchHeroData();
  if (typeof populateSearchCategoryDropdown === 'function') populateSearchCategoryDropdown();
  updateCartUI();
  updateWishlistBadge();
  setupEventListeners();
  setupHeaderScrollEffect();

  // Immediate sync from server
  syncStorefrontWithServer();

  // Cross-tab real-time sync via BroadcastChannel
  if (storeBroadcastChannel) {
    storeBroadcastChannel.onmessage = (e) => {
      syncStorefrontWithServer();
      loadCategories();
      fetchCorporateCards();
      fetchHeroData();
    };
  }

  // Listen for admin changes across tabs or local storage dispatch
  window.addEventListener('storage', (e) => {
    if (!e.key || e.key === 'verdanta_categories' || e.key === 'verdanta_cat_sync_trigger') {
      loadCategories();
      syncStorefrontWithServer();
    }
    if (!e.key || e.key === 'verdanta_products' || e.key === 'verdanta_sync_trigger') {
      syncStorefrontWithServer();
    }
    if (!e.key || e.key === 'verdanta_corporate_cards' || e.key === 'verdanta_corp_trigger') {
      fetchCorporateCards();
    }
    if (!e.key || e.key === 'verdanta_hero_data' || e.key === 'verdanta_hero_trigger') {
      fetchHeroData();
    }
  });

  window.addEventListener('verdanta-products-updated', (e) => {
    if (e.detail && Array.isArray(e.detail)) {
      PRODUCTS_DATA = e.detail.map(normalizeProduct);
      renderCategoryTabs();
      renderCategoryCardsGrid();
      renderProductCatalog();
      renderCorporateProducts();
    }
  });

  // Re-sync instantly whenever user switches back to storefront tab
  window.addEventListener('focus', () => {
    syncStorefrontWithServer();
    fetchHeroData();
  });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      syncStorefrontWithServer();
      fetchHeroData();
    }
  });

  // Fast heartbeat sync (checks every 2.5 seconds so admin changes appear live without refresh)
  setInterval(() => {
    syncStorefrontWithServer();
  }, 2500);
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
      const catSelect = document.getElementById('searchCategorySelect');
      const catVal = catSelect ? catSelect.value : 'all';
      performSearch(e.target.value, catVal);
    });
  }

  // Dropdown link listeners for Wholesale and Export
  document.querySelectorAll('.wholesale-menu-dropdown a[data-category], .export-menu-dropdown a[data-category]').forEach(link => {
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
  const sellingPrice = (product.price !== undefined && product.price !== null) ? Number(product.price) : 0;
  let mrp = (product.mrp && Number(product.mrp) > sellingPrice) ? Number(product.mrp) : 0;
  if (!mrp && sellingPrice > 0) {
    mrp = Math.round((sellingPrice * 1.35) / 50) * 50;
    if (mrp <= sellingPrice) mrp = sellingPrice + 500;
  }
  const discountPct = (mrp > sellingPrice && mrp > 0) ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;
  const isCorporate = (product.categoryId === 'corporate-gifting' || (product.category && product.category.toLowerCase().includes('corporate')));

  return `
    <article class="product-card ${product.outOfStock ? 'is-out-of-stock' : ''}" id="card-${product.id}">
      <div class="product-img-box">
        <img src="${product.image}" alt="${escapeHtml(product.title || product.name)}" class="product-img" loading="lazy" onerror="this.src='images/wooden-gallery.jpg'">
        <span class="product-badge">${escapeHtml(product.badge || 'Artisan Creation')}</span>
        ${product.outOfStock ? '<span class="product-badge product-out-of-stock-badge" style="background:#dc3545; color:#fff; font-weight:700;"><i class="fa-solid fa-ban"></i> OUT OF STOCK</span>' : ''}
        ${discountPct > 0 ? `<span class="product-discount-ribbon"><i class="fa-solid fa-arrow-down"></i>${discountPct}% OFF</span>` : ''}
        <div class="product-quick-actions">
          <button class="quick-action-btn" onclick="openQuickView('${product.id}')">
            <i class="fa-regular fa-eye"></i> QUICK VIEW
          </button>
          ${isCorporate ? `
            <button class="quick-action-btn" onclick="openProposalModalForProduct('${product.id}')">
              <i class="fa-solid fa-file-signature"></i> ENQUIRE
            </button>
          ` : (product.outOfStock ? `
            <button class="quick-action-btn btn-action-disabled" disabled style="opacity: 0.6; cursor: not-allowed;">
              <i class="fa-solid fa-ban"></i> OUT OF STOCK
            </button>
          ` : `
            <button class="quick-action-btn" onclick="addToCart('${product.id}')">
              <i class="fa-solid fa-plus"></i> ADD TO BAG
            </button>
          `)}
        </div>
      </div>
      <div class="product-info">
        <span class="product-category-meta">${escapeHtml(product.category)}</span>
        <h4 class="product-title">${escapeHtml(product.title || product.name)}</h4>
        <div class="product-price-row">
          <div class="card-deal-pricing">
            <div class="card-deal-row">
              <span class="card-discount-pct"><i class="fa-solid fa-arrow-down"></i>${discountPct}%</span>
              <span class="card-mrp-price">₹${mrp.toLocaleString('en-IN')}</span>
              <span class="card-selling-price">₹${sellingPrice.toLocaleString('en-IN')}</span>
            </div>
          </div>
          ${isCorporate ? `
            <button class="btn-corporate-mini-enquire" onclick="openProposalModalForProduct('${product.id}')" title="Request Corporate Proposal">
              <i class="fa-solid fa-paper-plane"></i> Enquire
            </button>
          ` : (product.outOfStock ? `
            <button class="add-cart-mini-btn btn-stock-disabled" disabled title="Out of stock" style="opacity: 0.5; cursor: not-allowed; background: #e2e8f0; color: #a0aec0;">
              <i class="fa-solid fa-ban"></i>
            </button>
          ` : `
            <button class="add-cart-mini-btn" onclick="addToCart('${product.id}')" title="Add to bag">
              <i class="fa-solid fa-bag-shopping"></i>
            </button>
          `)}
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

  // If there are no groups found, render flat grid
  if (groups.length === 0) {
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
  const banner = document.getElementById('catalogActiveFilterBanner');
  if (!container) return;

  // 1. ACTIVE SEARCH QUERY FILTER
  if (currentSearchQuery && currentSearchQuery.trim() !== '') {
    const q = currentSearchQuery.toLowerCase().trim();
    let filtered = PRODUCTS_DATA.filter(p => {
      // If a specific category is also chosen
      if (currentCategoryFilter !== 'all') {
        const pCatId = p.categoryId || normalizeCategoryId(p.category);
        if (pCatId !== currentCategoryFilter) return false;
      }
      return (
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.subItem && p.subItem.toLowerCase().includes(q)) ||
        (p.subCategory && p.subCategory.toLowerCase().includes(q)) ||
        (p.material && p.material.toLowerCase().includes(q)) ||
        (p.craftOrigin && p.craftOrigin.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    });

    if (banner) {
      banner.style.display = 'flex';
      banner.innerHTML = `
        <div class="catalog-active-filter-banner">
          <div class="filter-info">
            <i class="fa-solid fa-magnifying-glass" style="color:var(--color-gold);"></i>
            Search Results for <span class="filter-crumb">"${escapeHtml(currentSearchQuery)}"</span> &bull; <strong>${filtered.length}</strong> artisan creation${filtered.length === 1 ? '' : 's'} found
          </div>
          <button type="button" class="filter-clear-btn" onclick="clearSearchFilter()">
            <i class="fa-solid fa-xmark"></i> Clear Search
          </button>
        </div>
      `;
    }

    if (countLabel) {
      countLabel.textContent = `Showing ${filtered.length} search result${filtered.length === 1 ? '' : 's'} for "${currentSearchQuery}"`;
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="padding: 50px 20px; text-align: center; color: var(--color-text-muted); background: #faf9f6; border-radius: 8px; border: 1px dashed var(--color-border); width: 100%;">
          <i class="fa-solid fa-magnifying-glass" style="font-size: 2.2rem; color: var(--color-gold); margin-bottom: 14px; display: block;"></i>
          <h4 style="font-family: var(--font-serif); font-size: 1.4rem; color: var(--color-primary); margin: 0 0 8px;">No creations found for "${escapeHtml(currentSearchQuery)}"</h4>
          <p style="margin: 0 0 20px; font-size: 0.92rem;">Try searching for lamp, terracotta, wooden clock, brass urli, or switch collection.</p>
          <button type="button" class="btn btn-primary btn-sm" onclick="clearSearchFilter()">View Complete Artisan Collection</button>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div class="product-cards-grid" style="width: 100%;">
          ${filtered.map(renderProductCardHtml).join('')}
        </div>
      `;
    }
    return;
  }

  // 2. ACTIVE SUBCATEGORY FILTER
  if (currentSubCategoryFilter && currentCategoryFilter !== 'all') {
    const targetCat = getCategoryById(currentCategoryFilter);
    const subQ = currentSubCategoryFilter.toLowerCase().trim();

    const filtered = PRODUCTS_DATA.filter(p => {
      const pCatId = p.categoryId || normalizeCategoryId(p.category);
      const catMatch = (pCatId === targetCat.id || (p.category && p.category.toLowerCase() === targetCat.name.toLowerCase()));
      if (!catMatch) return false;

      const pSub = (p.subCategory || p.subItem || '').toLowerCase();
      const pTitle = (p.title || '').toLowerCase();
      return pSub.includes(subQ) || subQ.includes(pSub) || pTitle.includes(subQ);
    });

    if (banner) {
      banner.style.display = 'flex';
      banner.innerHTML = `
        <div class="catalog-active-filter-banner">
          <div class="filter-info">
            <i class="fa-solid fa-layer-group" style="color:var(--color-gold);"></i>
            Collection: <span class="filter-crumb">${escapeHtml(targetCat.name)} &rsaquo; ${escapeHtml(currentSubCategoryFilter)}</span> &bull; <strong>${filtered.length}</strong> creation${filtered.length === 1 ? '' : 's'}
          </div>
          <button type="button" class="filter-clear-btn" onclick="filterAndScroll('${escapeHtml(targetCat.name)}')">
            <i class="fa-solid fa-xmark"></i> Show All in ${escapeHtml(targetCat.name)}
          </button>
        </div>
      `;
    }

    if (countLabel) {
      countLabel.textContent = `Showing ${filtered.length} artisan creation${filtered.length === 1 ? '' : 's'} in ${targetCat.name} › ${currentSubCategoryFilter}`;
    }

    container.innerHTML = `
      <div class="public-category-block" id="pub-cat-${targetCat.id}" style="width: 100%;">
        <div class="public-cat-header">
          <div class="public-cat-title-wrap">
            <span class="public-cat-eyebrow">${escapeHtml(targetCat.badge || 'Collection')}</span>
            <h3 class="public-cat-title">${escapeHtml(targetCat.name.toUpperCase())} &mdash; ${escapeHtml(currentSubCategoryFilter.toUpperCase())}</h3>
          </div>
          <span class="public-cat-count">${filtered.length} Artisan Creation${filtered.length === 1 ? '' : 's'}</span>
        </div>
        ${filtered.length === 0 ? `
          <div style="padding: 40px; text-align: center; color: var(--color-text-muted); background: #faf9f6; border-radius: 8px; border: 1px dashed var(--color-border);">
            <p style="margin: 0 0 16px; font-size: 1rem;"><i class="fa-solid fa-sparkles" style="color:var(--color-gold); margin-right: 6px;"></i>No items specifically listed under "${escapeHtml(currentSubCategoryFilter)}" right now.</p>
            <button type="button" class="btn btn-outline btn-sm" onclick="filterAndScroll('${escapeHtml(targetCat.name)}')">View All ${escapeHtml(targetCat.name)}</button>
          </div>
        ` : `
          <div class="product-cards-grid">
            ${filtered.map(renderProductCardHtml).join('')}
          </div>
        `}
      </div>
    `;
    return;
  }

  // 3. CHANNEL LEVEL FILTER (Wholesale or Export)
  if (currentCategoryFilter && String(currentCategoryFilter).startsWith('channel:')) {
    const ch = currentCategoryFilter.split(':')[1].toLowerCase();
    const isWholesale = ch === 'wholesale';
    const isExport = ch === 'export';
    const channelTitle = isWholesale ? 'Wholesale B2B Catalog' : (isExport ? 'Export & Global Consignments' : `${ch.toUpperCase()} Collections`);
    const channelBadge = isWholesale ? 'Wholesale B2B' : (isExport ? 'Export Global' : 'Department');

    const channelCats = PRODUCT_CATEGORIES.filter(c => (c.channel || '').toLowerCase() === ch);
    const channelCatIds = new Set(channelCats.map(c => c.id));

    const filtered = PRODUCTS_DATA.filter(p => {
      const pCatId = p.categoryId || normalizeCategoryId(p.category);
      return channelCatIds.has(pCatId) || (p.category && p.category.toLowerCase().includes(ch));
    });

    if (banner) {
      banner.style.display = 'flex';
      banner.innerHTML = `
        <div class="catalog-active-filter-banner">
          <div class="filter-info">
            <i class="fa-solid ${isWholesale ? 'fa-boxes-stacked' : (isExport ? 'fa-earth-americas' : 'fa-layer-group')}" style="color:var(--color-gold);"></i>
            Department: <span class="filter-crumb">${escapeHtml(channelTitle)}</span> &bull; <strong>${filtered.length}</strong> artisan creation${filtered.length === 1 ? '' : 's'}
          </div>
          <button type="button" class="filter-clear-btn" onclick="filterAndScroll('all')">
            <i class="fa-solid fa-xmark"></i> View All Collections
          </button>
        </div>
      `;
    }

    if (countLabel) {
      countLabel.textContent = `Showing ${filtered.length} artisan creation${filtered.length === 1 ? '' : 's'} in ${channelTitle}`;
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="padding: 50px 20px; text-align: center; color: var(--color-text-muted); background: #faf9f6; border-radius: 8px; border: 1px dashed var(--color-border); width: 100%;">
          <i class="fa-solid ${isWholesale ? 'fa-boxes-stacked' : 'fa-earth-americas'}" style="font-size: 2.2rem; color: var(--color-gold); margin-bottom: 14px; display: block;"></i>
          <h4 style="font-family: var(--font-serif); font-size: 1.4rem; color: var(--color-primary); margin: 0 0 8px;">No creations found in ${escapeHtml(channelTitle)}</h4>
          <p style="margin: 0 0 20px; font-size: 0.92rem;">Explore our other collections or submit a bespoke enquiry.</p>
          <button type="button" class="btn btn-primary btn-sm" onclick="filterAndScroll('all')">View All Collections</button>
        </div>
      `;
    } else {
      container.innerHTML = channelCats.map(cat => {
        const catProds = filtered.filter(p => {
          const pCatId = p.categoryId || normalizeCategoryId(p.category);
          return pCatId === cat.id || (p.category && p.category.toLowerCase() === cat.name.toLowerCase());
        });
        if (catProds.length === 0) return '';
        return `
          <div class="public-category-block" id="pub-cat-${cat.id}">
            <div class="public-cat-header">
              <div class="public-cat-title-wrap">
                <span class="public-cat-eyebrow">${escapeHtml(cat.badge || channelBadge)}</span>
                <h3 class="public-cat-title">${escapeHtml(cat.name.toUpperCase())}</h3>
              </div>
              <span class="public-cat-count">${catProds.length} Artisan Creation${catProds.length === 1 ? '' : 's'}</span>
            </div>
            ${renderCategorySubBlocksHtml(cat, catProds)}
          </div>
        `;
      }).join('');
    }
    return;
  }

  // 4. STANDARD CATEGORY / ALL VIEW
  if (banner) {
    banner.style.display = 'none';
    banner.innerHTML = '';
  }

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

    if (banner) {
      banner.style.display = 'flex';
      banner.innerHTML = `
        <div class="catalog-active-filter-banner">
          <div class="filter-info">
            <i class="fa-solid fa-layer-group" style="color:var(--color-gold);"></i>
            Collection: <span class="filter-crumb">${escapeHtml(targetCat.name)}</span> &bull; <strong>${filtered.length}</strong> artisan creation${filtered.length === 1 ? '' : 's'}
          </div>
          <button type="button" class="filter-clear-btn" onclick="filterAndScroll('all')">
            <i class="fa-solid fa-xmark"></i> View All Collections
          </button>
        </div>
      `;
    }

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
            <button type="button" class="btn btn-outline btn-sm" onclick="filterAndScroll('all')">View All Collections</button>
          </div>
        ` : renderCategorySubBlocksHtml(targetCat, filtered)}
      </div>
    `;
  }
}

// Filter and scroll smoothly to catalog
window.filterAndScroll = function (categoryName, subCategory) {
  currentSearchQuery = '';
  const searchInput = document.getElementById('catalogSearchInput');
  if (searchInput) searchInput.value = '';

  if (categoryName && String(categoryName).startsWith('channel:')) {
    filterByChannel(categoryName.replace('channel:', ''));
    return;
  }

  if (categoryName === 'all') {
    currentCategoryFilter = 'all';
    currentSubCategoryFilter = null;
  } else {
    const normId = normalizeCategoryId(categoryName);
    currentCategoryFilter = normId;
    currentSubCategoryFilter = subCategory && typeof subCategory === 'string' && subCategory.trim() ? subCategory.trim() : null;
  }

  const targetCat = getCategoryById(currentCategoryFilter);

  const tabBtns = document.querySelectorAll('.category-tabs .tab-btn');
  tabBtns.forEach(btn => {
    const btnFilter = btn.getAttribute('data-filter');
    if (currentCategoryFilter === 'all' && btnFilter === 'all' && !currentSubCategoryFilter) {
      btn.classList.add('active');
    } else if (!currentSubCategoryFilter && (btnFilter === categoryName || btnFilter === targetCat.name || (btnFilter !== 'all' && normalizeCategoryId(btnFilter) === currentCategoryFilter))) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  renderProductCatalog();

  const catalogElem = document.getElementById('categories');
  if (catalogElem) {
    catalogElem.scrollIntoView({ behavior: 'smooth' });
  }
};

// Filter by department/channel (wholesale, export, or shop)
window.filterByChannel = function (channelName) {
  currentSearchQuery = '';
  const searchInput = document.getElementById('catalogSearchInput');
  if (searchInput) searchInput.value = '';

  const ch = String(channelName || '').toLowerCase().trim();
  if (ch === 'shop' || ch === 'all') {
    filterAndScroll('all');
    return;
  }

  currentCategoryFilter = 'channel:' + ch;
  currentSubCategoryFilter = null;

  renderProductCatalog();

  const catalogElem = document.getElementById('categories');
  if (catalogElem) {
    catalogElem.scrollIntoView({ behavior: 'smooth' });
  }
};

window.executeCatalogSearch = function () {
  const input = document.getElementById('catalogSearchInput');
  if (!input) return;
  const q = input.value.trim();
  if (!q) {
    clearSearchFilter();
    return;
  }
  currentSearchQuery = q;
  currentSubCategoryFilter = null;
  renderProductCatalog();
  const catalogElem = document.getElementById('categories');
  if (catalogElem) {
    catalogElem.scrollIntoView({ behavior: 'smooth' });
  }
};

window.clearSearchFilter = function () {
  currentSearchQuery = '';
  const input = document.getElementById('catalogSearchInput');
  if (input) input.value = '';
  const banner = document.getElementById('catalogActiveFilterBanner');
  if (banner) {
    banner.style.display = 'none';
    banner.innerHTML = '';
  }
  renderProductCatalog();
};

window.toggleAllProducts = function () {
  filterAndScroll('all');
};

// =============================================================================
// 4. SHOPPING CART SYSTEM
// =============================================================================

window.addToCart = function (productId, quantity = 1) {
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

window.removeFromCart = function (productId) {
  cartState = cartState.filter(item => item.id !== productId);
  saveCart();
  updateCartUI();
};

window.updateItemQuantity = function (productId, delta) {
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

window.openCart = function () {
  document.getElementById('cartDrawer').classList.add('active');
  document.getElementById('cartOverlay').classList.add('active');
};

window.closeCart = function () {
  document.getElementById('cartDrawer').classList.remove('active');
  document.getElementById('cartOverlay').classList.remove('active');
};

window.simulateCheckout = function () {
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

window.openQuickView = function (productId) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  const sellingPrice = (product.price !== undefined && product.price !== null) ? Number(product.price) : 0;
  let mrp = (product.mrp && Number(product.mrp) > sellingPrice) ? Number(product.mrp) : 0;
  if (!mrp && sellingPrice > 0) {
    mrp = Math.round((sellingPrice * 1.35) / 50) * 50;
    if (mrp <= sellingPrice) mrp = sellingPrice + 500;
  }
  const discountPct = (mrp > sellingPrice && mrp > 0) ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;
  const savingsAmount = (mrp > sellingPrice) ? (mrp - sellingPrice) : 0;

  const content = document.getElementById('quickViewContent');
  content.innerHTML = `
    <div>
      <img src="${product.image}" alt="${product.title}" class="quick-view-img">
    </div>
    <div class="quick-view-details">
      <span class="modal-eyebrow">${product.category} • ${product.subItem}</span>
      <h2>${product.title}</h2>
      
      <!-- Reference Pricing Banner: ↓Discount% StrikethroughMRP SellingPrice -->
      <div class="deal-pricing-container">
        <div class="deal-pricing-row">
          <span class="deal-discount-pct"><i class="fa-solid fa-arrow-down"></i>${discountPct}%</span>
          <span class="deal-mrp-price">₹${mrp.toLocaleString('en-IN')}</span>
          <span class="deal-selling-price">₹${sellingPrice.toLocaleString('en-IN')}</span>
        </div>
        ${savingsAmount > 0 ? `
          <div class="deal-savings-banner">
            <i class="fa-solid fa-tag"></i> Special Artisan Offer • You Save ₹${savingsAmount.toLocaleString('en-IN')}
          </div>
        ` : ''}
      </div>

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

window.closeQuickView = function () {
  document.getElementById('quickViewModal').classList.remove('active');
};

// =============================================================================
// 6. PROPOSAL & B2B MODAL
// =============================================================================

window.openProposalModal = function (inquiryTitle = 'General Inquiry') {
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

window.closeProposalModal = function () {
  document.getElementById('proposalModal').classList.remove('active');
};

// Open Proposal Modal Pre-filled for a specific product
window.openProposalModalForProduct = function (productId) {
  const prod = PRODUCTS_DATA.find(p => p.id === productId);
  if (!prod) {
    openProposalModal('Corporate Gifting');
    return;
  }

  const modal = document.getElementById('proposalModal');
  const typeSelect = document.getElementById('partnershipType');
  const modalTitle = document.getElementById('proposalModalTitle');
  const notesField = document.getElementById('projectNotes');

  if (modalTitle) {
    modalTitle.innerHTML = `<i class="fa-solid fa-gift" style="color:var(--color-gold); margin-right:8px;"></i> Request Proposal — ${escapeHtml(prod.title || prod.name)}`;
  }

  if (typeSelect) {
    const sub = (prod.subItem || '').toLowerCase();
    if (sub.includes('welcome') || sub.includes('onboard')) {
      typeSelect.value = 'Employee Appreciation Gift Kit';
    } else if (sub.includes('recogni') || sub.includes('milestone')) {
      typeSelect.value = 'Employee Appreciation Gift Kit';
    } else if (sub.includes('festive') || sub.includes('celebration')) {
      typeSelect.value = 'Festive Gifting';
    } else if (sub.includes('client') || sub.includes('executive')) {
      typeSelect.value = 'Executive Gifting';
    } else if (sub.includes('esg') || sub.includes('sustain')) {
      typeSelect.value = 'ESG & Impact Gifting';
    } else if (sub.includes('custom') || sub.includes('set')) {
      typeSelect.value = 'Custom Gift Kits';
    } else {
      typeSelect.value = 'Employee Appreciation Gift Kit';
    }
  }

  if (notesField) {
    const mrpStr = prod.mrp ? `MRP: ₹${Number(prod.mrp).toLocaleString('en-IN')}` : '';
    const priceStr = prod.price ? `Offer Price: ₹${Number(prod.price).toLocaleString('en-IN')}` : '';
    const stockNote = prod.outOfStock ? ' [Note: Currently marked Out of Stock - requesting next production batch quote]' : '';
    notesField.value = `Product Inquiry: ${prod.title || prod.name} (${prod.subItem || 'Corporate Gifting'})\n${priceStr} ${mrpStr}${stockNote}\nPlease share minimum order quantities, customization timeline, and enterprise bulk pricing.`;
  }

  if (modal) modal.classList.add('active');
};

// =============================================================================
// HERO SECTION (Dynamic Background, Eyebrow, Headings, Subtitle & Buttons)
// =============================================================================

const DEFAULT_HERO_DATA = {
  eyebrow: "ARTISANAL EXCELLENCE • DIRECT FROM INDIA",
  title: "CRAFTED BY ARTISANS.\nINSPIRED BY INDIA.\nMADE MEANINGFUL.",
  description: "Discover thoughtfully crafted home décor and meaningful gifts that celebrate Indian craftsmanship, empower artisans and inspire more sustainable living.",
  image: "images/hero.jpg",
  defaultImage: "images/hero.jpg",
  primaryBtnText: "SHOP COLLECTIONS",
  primaryBtnLink: "#categories",
  secondaryBtnText: "REQUEST A PROPOSAL",
  secondaryBtnLink: "modal:proposal"
};

let HERO_DATA = (function () {
  try {
    const cached = localStorage.getItem('verdanta_hero_data');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && typeof parsed === 'object') return { ...DEFAULT_HERO_DATA, ...parsed };
    }
  } catch (e) {}
  return { ...DEFAULT_HERO_DATA };
})();

window.renderHeroSection = function (customData) {
  const hero = customData || HERO_DATA || DEFAULT_HERO_DATA;

  const backdrop = document.getElementById('heroBackdrop');
  if (backdrop) {
    const bgUrl = hero.image || hero.defaultImage || 'images/hero.jpg';
    backdrop.style.backgroundImage = `url("${escapeAttr(bgUrl)}")`;
  }

  const eyebrow = document.getElementById('heroEyebrow');
  if (eyebrow) {
    eyebrow.textContent = hero.eyebrow || DEFAULT_HERO_DATA.eyebrow;
  }

  const title = document.getElementById('heroTitle');
  if (title) {
    const rawTitle = hero.title || DEFAULT_HERO_DATA.title;
    title.innerHTML = escapeHtml(rawTitle).replace(/\n/g, '<br>');
  }

  const subtitle = document.getElementById('heroSubtitle');
  if (subtitle) {
    subtitle.textContent = hero.description || DEFAULT_HERO_DATA.description;
  }

  const primaryBtn = document.getElementById('heroShopBtn');
  if (primaryBtn) {
    const pText = hero.primaryBtnText !== undefined ? hero.primaryBtnText : DEFAULT_HERO_DATA.primaryBtnText;
    const pLink = hero.primaryBtnLink !== undefined ? hero.primaryBtnLink : DEFAULT_HERO_DATA.primaryBtnLink;
    if (pText && pText.trim()) {
      primaryBtn.textContent = pText;
      primaryBtn.href = pLink || '#categories';
      primaryBtn.style.display = 'inline-flex';
    } else {
      primaryBtn.style.display = 'none';
    }
  }

  const secondaryBtn = document.getElementById('heroProposalBtn');
  if (secondaryBtn) {
    const sText = hero.secondaryBtnText !== undefined ? hero.secondaryBtnText : DEFAULT_HERO_DATA.secondaryBtnText;
    if (sText && sText.trim()) {
      secondaryBtn.textContent = sText;
      secondaryBtn.style.display = 'inline-flex';
    } else {
      secondaryBtn.style.display = 'none';
    }
  }
};

window.handleHeroSecondaryClick = function (e) {
  if (e && e.preventDefault) e.preventDefault();
  const hero = HERO_DATA || DEFAULT_HERO_DATA;
  const link = (hero.secondaryBtnLink || 'modal:proposal').trim();

  if (link.startsWith('modal:') || link === 'proposal') {
    if (typeof openProposalModal === 'function') {
      openProposalModal('General Inquiry');
    }
  } else if (link.startsWith('#')) {
    const target = document.querySelector(link);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  } else if (link) {
    window.location.href = link;
  }
};

window.fetchHeroData = async function () {
  try {
    const res = await fetch(getApiUrl('/api/hero'));
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data === 'object') {
        HERO_DATA = { ...DEFAULT_HERO_DATA, ...data };
        try {
          localStorage.setItem('verdanta_hero_data', JSON.stringify(HERO_DATA));
        } catch (e) {}
        renderHeroSection(HERO_DATA);
      }
    }
  } catch (err) {
    console.warn('Could not fetch hero data from server, using local/defaults:', err);
  }
};

// Immediate render on script load
try {
  renderHeroSection(HERO_DATA);
  fetchHeroData();
} catch (e) {}

// =============================================================================
// CORPORATE GIFTING (Exact 6 Category Cards Matching Reference Image)
// =============================================================================

const DEFAULT_CORPORATE_CARDS = [
  {
    id: "corp-welcome",
    order: 1,
    title: "EMPLOYEE WELCOME & ONBOARDING",
    description: "Thoughtful gift sets to make new team members feel valued and connected.",
    icon: "fa-solid fa-leaf",
    image: "images/corporate/corp-welcome.jpg",
    defaultImage: "images/corporate/corp-welcome.jpg",
    categoryKey: "Employee Welcome & Onboarding"
  },
  {
    id: "corp-recognition",
    order: 2,
    title: "EMPLOYEE RECOGNITION & MILESTONES",
    description: "Celebrate achievements with premium gifts that inspire and motivate.",
    icon: "fa-solid fa-user",
    image: "images/corporate/corp-recognition.jpg",
    defaultImage: "images/corporate/corp-recognition.jpg",
    categoryKey: "Employee Recognition & Milestones"
  },
  {
    id: "corp-festive",
    order: 3,
    title: "FESTIVE & CELEBRATION GIFTING",
    description: "Spread joy with curated gifts for festivals, celebrations and special occasions.",
    icon: "fa-solid fa-gift",
    image: "images/corporate/corp-festive.jpg",
    defaultImage: "images/corporate/corp-festive.jpg",
    categoryKey: "Festive & Celebration Gifting"
  },
  {
    id: "corp-client",
    order: 4,
    title: "CLIENT, PARTNER & EXECUTIVE GIFTING",
    description: "Build lasting relationships with premium, customized and eco-friendly gift options.",
    icon: "fa-solid fa-leaf",
    image: "images/corporate/corp-client.jpg",
    defaultImage: "images/corporate/corp-client.jpg",
    categoryKey: "Client, Partner & Executive Gifting"
  },
  {
    id: "corp-esg",
    order: 5,
    title: "SUSTAINABLE & ESG GIFTING",
    description: "Eco-conscious gifts for a greener planet and a better tomorrow.",
    icon: "fa-solid fa-leaf",
    image: "images/corporate/corp-esg.jpg",
    defaultImage: "images/corporate/corp-esg.jpg",
    categoryKey: "Sustainable & ESG Gifting"
  },
  {
    id: "corp-curated",
    order: 6,
    title: "CURATED & CUSTOM CORPORATE GIFT SETS",
    description: "Tailored gift sets to reflect your brand and unique message.",
    icon: "fa-regular fa-star",
    image: "images/corporate/corp-curated.jpg",
    defaultImage: "images/corporate/corp-curated.jpg",
    categoryKey: "Curated & Custom Corporate Gift Sets"
  }
];

let CORPORATE_CARDS = (function () {
  try {
    const cached = localStorage.getItem('verdanta_corporate_cards');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return [...DEFAULT_CORPORATE_CARDS];
})();
let lastSyncedCorpCardsJson = '';

window.fetchCorporateCards = async function () {
  try {
    const res = await fetch(getApiUrl('/api/corporate-cards'));
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        CORPORATE_CARDS = data;
        lastSyncedCorpCardsJson = JSON.stringify(data);
        try {
          localStorage.setItem('verdanta_corporate_cards', lastSyncedCorpCardsJson);
        } catch (e) {}
      }
    }
  } catch (err) {
    console.warn('Could not fetch corporate cards from server:', err);
    try {
      const cached = localStorage.getItem('verdanta_corporate_cards');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          CORPORATE_CARDS = parsed;
        }
      }
    } catch (e) {}
  }
  renderCorporateCards();
};

window.renderCorporateCards = function () {
  const container = document.getElementById('corporateCardsGrid') || document.getElementById('corporateProductsGrid');
  if (!container) return;

  container.className = 'corporate-reference-grid';
  container.innerHTML = CORPORATE_CARDS.map(card => {
    const imgSrc = card.image || card.defaultImage || 'images/corporate-lifestyle.jpg';
    return `
      <div class="corp-card-ref" id="card-${escapeAttr(card.id)}">
        <div class="corp-card-img-wrap">
          <img src="${escapeAttr(imgSrc)}" alt="${escapeAttr(card.title)}" loading="lazy" onerror="this.onerror=null; this.src='${escapeAttr(card.defaultImage || 'images/corporate-lifestyle.jpg')}';">
        </div>
        <div class="corp-card-body-ref">
          <div class="corp-card-head-row">
            <div class="corp-card-icon-pill">
              <i class="${escapeAttr(card.icon || 'fa-solid fa-leaf')}"></i>
            </div>
            <h3 class="corp-card-title-ref">${escapeHtml(card.title)}</h3>
          </div>
          <p class="corp-card-desc-ref">${escapeHtml(card.description)}</p>
          <button type="button" class="corp-card-btn-ref" onclick="openCorporateCardEnquiry(event, '${escapeAttr(card.id)}')">
            <i class="fa-solid fa-paper-plane"></i> Enquire Now
          </button>
        </div>
      </div>
    `;
  }).join('');
};

// Aliases for compatibility
window.renderCorporateProducts = function () {
  renderCorporateCards();
};

// Run immediate render & background fetch
try {
  renderCorporateCards();
  fetchCorporateCards();
} catch (e) {}

window.filterCorporateSubCategory = function (subCategoryName = 'all') {
  openCorporateGifting(null, subCategoryName);
};

window.openCorporateGifting = function (event, targetSubCategory = 'all') {
  if (event && event.preventDefault) event.preventDefault();

  const section = document.getElementById('corporate');
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  if (targetSubCategory && targetSubCategory !== 'all') {
    const targetLower = targetSubCategory.toLowerCase().trim();
    const card = CORPORATE_CARDS.find(c => 
      c.id === targetSubCategory || 
      (c.categoryKey && c.categoryKey.toLowerCase() === targetLower) ||
      (c.title && c.title.toLowerCase() === targetLower)
    );
    if (card) {
      setTimeout(() => {
        const el = document.getElementById('card-' + card.id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('highlight-active');
          setTimeout(() => el.classList.remove('highlight-active'), 2000);
        }
      }, 350);
    }
  }
};

window.openCorporateCardEnquiry = function (event, cardId) {
  if (event && event.preventDefault) event.preventDefault();
  const card = CORPORATE_CARDS.find(c => c.id === cardId) || {
    id: cardId,
    title: 'Corporate Gifting',
    categoryKey: 'Corporate Gifting'
  };

  const modal = document.getElementById('proposalModal');
  const typeSelect = document.getElementById('partnershipType');
  const modalTitle = document.getElementById('proposalModalTitle');
  const notesField = document.getElementById('projectNotes');

  if (modalTitle) {
    modalTitle.innerHTML = `<i class="fa-solid fa-gift" style="color:var(--color-gold); margin-right:8px;"></i> Request Proposal — ${escapeHtml(card.title)}`;
  }

  if (typeSelect) {
    const targetVal = card.categoryKey || card.title;
    let found = false;
    for (let opt of typeSelect.options) {
      if (opt.value.toLowerCase() === targetVal.toLowerCase() || opt.text.toLowerCase().includes(targetVal.toLowerCase())) {
        typeSelect.value = opt.value;
        found = true;
        break;
      }
    }
    if (!found) {
      const opt = document.createElement('option');
      opt.value = targetVal;
      opt.textContent = `Corporate Gifting - ${targetVal}`;
      opt.selected = true;
      typeSelect.prepend(opt);
    }
  }

  if (notesField) {
    notesField.value = `Inquiry for ${card.title}. Please provide product options, logo branding customization, volume pricing tiers, and delivery timelines.`;
  }

  if (modal) modal.classList.add('active');
  const nameInput = document.getElementById('contactName');
  if (nameInput) setTimeout(() => nameInput.focus(), 150);
};

window.handleProposalSubmit = async function (event) {
  event.preventDefault();
  const name = (document.getElementById('contactName').value || '').trim() || 'Valued Client';
  const company = (document.getElementById('companyName').value || '').trim() || 'Direct Inquiry';
  const email = (document.getElementById('workEmail').value || '').trim() || 'Not specified';
  const phone = (document.getElementById('phoneNumber').value || '').trim() || 'Not specified';
  const type = (document.getElementById('partnershipType') && document.getElementById('partnershipType').value) || 'Corporate Gifting';
  const units = (document.getElementById('estimatedUnits').value || '').trim() || 'Not specified';
  const notes = (document.getElementById('projectNotes').value || '').trim() || 'No additional notes';

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

  // 1. Immediate local storage persistence fallback
  try {
    const proposals = JSON.parse(localStorage.getItem('verdanta_proposals')) || [];
    proposals.unshift(newProposal);
    localStorage.setItem('verdanta_proposals', JSON.stringify(proposals));
    localStorage.setItem('verdanta_sync_trigger', String(Date.now()));
  } catch (e) {
    console.warn('LocalStorage error:', e);
  }

  // 2. Persistent Database Storage via Backend API (/api/proposals)
  try {
    fetch(getApiUrl('/api/proposals'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProposal)
    }).then(res => res.json())
      .then(data => {
        console.log('[Database] Customer enquiry saved successfully:', data);
        if (storeBroadcastChannel) {
          storeBroadcastChannel.postMessage({ type: 'NEW_PROPOSAL', proposal: newProposal, timestamp: Date.now() });
        }
      })
      .catch(err => {
        console.warn('Server database proposal save warning:', err);
      });
  } catch (err) {
    console.warn('Network error saving proposal:', err);
  }

  // 3. Format WhatsApp Notification Message & Send to Configured WhatsApp Number
  const waTarget = VERDANTA_WHATSAPP_NUMBER || '918867688699';
  const waLines = [
    '🌿 *NEW CUSTOMER ENQUIRY — VERDANTA WORLD* 🌿',
    '━━━━━━━━━━━━━━━━━━━━━━━━━',
    `📋 *Inquiry ID:* ${newProposal.id}`,
    `👤 *Client Name:* ${name}`,
    `🏢 *Organization:* ${company}`,
    `📞 *Phone:* ${phone}`,
    `✉️ *Email:* ${email}`,
    `🏷️ *Inquiry Type:* ${type}`,
    `📦 *Volume / Budget:* ${units}`,
    `📝 *Customization Details:*\n${notes}`,
    `📅 *Submitted:* ${new Date().toLocaleString('en-IN')}`,
    '━━━━━━━━━━━━━━━━━━━━━━━━━',
    '_Sent via Verdanta World Online Portal_'
  ];
  const waMessage = waLines.join('\n');
  const waUrl = `https://wa.me/${waTarget}?text=${encodeURIComponent(waMessage)}`;

  // Automatically launch WhatsApp with the formatted inquiry message
  try {
    window.open(waUrl, '_blank');
  } catch (e) {
    window.location.href = waUrl;
  }

  // 4. Confirmation Feedback
  alert(`Thank you, ${name}!\n\nYour proposal enquiry for "${company}" (${type}) has been logged in our database (ID: ${newProposal.id}).\n\nYour enquiry has also been forwarded to our WhatsApp (${waTarget}) for immediate priority review.`);

  const form = document.getElementById('proposalForm');
  if (form) form.reset();
  closeProposalModal();
};

window.handleVisitSubmit = async function (event) {
  event.preventDefault();
  const name = (document.getElementById('visitName').value || '').trim() || 'Guest';
  const phone = (document.getElementById('visitPhone').value || '').trim() || 'Not specified';
  const location = (document.getElementById('visitLocation') && document.getElementById('visitLocation').value) || 'Jaipur Atelier & Craft Studio';
  const date = (document.getElementById('visitDate') && document.getElementById('visitDate').value) || 'Flexible';

  const newVisitEnquiry = {
    id: 'PRP-VST-' + Date.now().toString().slice(-5),
    name: name,
    company: `Private Showroom Visit (${location})`,
    email: 'In-Person Appointment',
    phone: phone,
    type: 'Showroom Studio Visit',
    units: `Date: ${date} at ${location}`,
    notes: `Private atelier appointment requested for ${date} at ${location}. Client contact: ${phone}.`,
    status: 'New',
    createdAt: new Date().toISOString()
  };

  // 1. Local persistence
  try {
    const proposals = JSON.parse(localStorage.getItem('verdanta_proposals')) || [];
    proposals.unshift(newVisitEnquiry);
    localStorage.setItem('verdanta_proposals', JSON.stringify(proposals));
    localStorage.setItem('verdanta_sync_trigger', String(Date.now()));
  } catch (e) { }

  // 2. Database persistence via Backend API (/api/proposals)
  try {
    fetch(getApiUrl('/api/proposals'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newVisitEnquiry)
    }).then(res => res.json())
      .then(data => {
        console.log('[Database] Showroom visit enquiry saved:', data);
        if (storeBroadcastChannel) {
          storeBroadcastChannel.postMessage({ type: 'NEW_PROPOSAL', proposal: newVisitEnquiry, timestamp: Date.now() });
        }
      })
      .catch(err => console.warn('Server visit enquiry sync warning:', err));
  } catch (err) { }

  // 3. Format WhatsApp Notification
  const waTarget = VERDANTA_WHATSAPP_NUMBER || '918867688699';
  const waLines = [
    '🏛️ *SHOWROOM VISIT APPOINTMENT — VERDANTA WORLD* 🏛️',
    '━━━━━━━━━━━━━━━━━━━━━━━━━',
    `📋 *Booking ID:* ${newVisitEnquiry.id}`,
    `👤 *Client Name:* ${name}`,
    `📞 *Phone:* ${phone}`,
    `📍 *Location:* ${location}`,
    `📅 *Preferred Date:* ${date}`,
    '━━━━━━━━━━━━━━━━━━━━━━━━━',
    '_Sent via Verdanta World Online Portal_'
  ];
  const waUrl = `https://wa.me/${waTarget}?text=${encodeURIComponent(waLines.join('\n'))}`;

  try {
    window.open(waUrl, '_blank');
  } catch (e) {
    window.location.href = waUrl;
  }

  alert(`Thank you, ${name}!\n\nYour studio visit appointment request for ${date} has been scheduled and recorded in our database (ID: ${newVisitEnquiry.id}).\n\nDetails have been forwarded to our WhatsApp concierge.`);

  const form = document.getElementById('visitForm');
  if (form) form.reset();
  closeVisitModal();
};

// =============================================================================
// 7. CATALOGUE & SHOWROOM VISIT MODALS
// =============================================================================

window.openCatalogueModal = function () {
  document.getElementById('catalogueModal').classList.add('active');
};

window.closeCatalogueModal = function () {
  document.getElementById('catalogueModal').classList.remove('active');
};

window.simulateDownload = function (filename) {
  showToast(`Preparing download for: ${filename}`);
  setTimeout(() => {
    alert(`Downloading "${filename}"\n\nThank you for exploring Verdanta World export collections!`);
    closeCatalogueModal();
  }, 600);
};

window.openVisitModal = function () {
  document.getElementById('visitModal').classList.add('active');
};

window.closeVisitModal = function () {
  document.getElementById('visitModal').classList.remove('active');
};

// =============================================================================
// 8. LIVE SEARCH SYSTEM (NAME & CATEGORY WITH DEDICATED SEARCH ACTION)
// =============================================================================

window.populateSearchCategoryDropdown = function () {
  const select = document.getElementById('searchCategorySelect');
  if (!select) return;
  const currentVal = select.value || 'all';
  select.innerHTML = `
    <option value="all" ${currentVal === 'all' ? 'selected' : ''}>All Collections</option>
    ${PRODUCT_CATEGORIES.map(c => `
      <option value="${escapeHtml(c.id)}" ${currentVal === c.id ? 'selected' : ''}>${escapeHtml(c.name)}</option>
    `).join('')}
  `;
};

window.openSearch = function () {
  if (typeof populateSearchCategoryDropdown === 'function') {
    populateSearchCategoryDropdown();
  }
  const overlay = document.getElementById('searchOverlay');
  if (overlay) overlay.classList.add('active');
  const input = document.getElementById('searchInput');
  if (input) {
    input.value = currentSearchQuery || '';
    input.focus();
  }
  performSearch(input ? input.value : '', 'all');
};

window.closeSearch = function () {
  const overlay = document.getElementById('searchOverlay');
  if (overlay) overlay.classList.remove('active');
};

window.executeSearchFromOverlay = function () {
  const input = document.getElementById('searchInput');
  const catSelect = document.getElementById('searchCategorySelect');
  const q = input ? input.value.trim() : '';
  const cat = catSelect ? catSelect.value : 'all';
  performSearch(q, cat);
};

window.viewSearchResultsInCatalog = function (query, categoryId) {
  closeSearch();
  currentSearchQuery = query || '';
  if (categoryId && categoryId !== 'all') {
    currentCategoryFilter = normalizeCategoryId(categoryId);
  } else {
    currentCategoryFilter = 'all';
  }
  currentSubCategoryFilter = null;
  const catInput = document.getElementById('catalogSearchInput');
  if (catInput) catInput.value = query;
  renderProductCatalog();
  const catalogElem = document.getElementById('categories');
  if (catalogElem) {
    catalogElem.scrollIntoView({ behavior: 'smooth' });
  }
};

window.performSearch = function (query, categoryFilter = 'all') {
  const grid = document.getElementById('searchResultsGrid');
  const input = document.getElementById('searchInput');
  const catSelect = document.getElementById('searchCategorySelect');
  if (!grid) return;

  if (input && query !== input.value) {
    input.value = query;
  }
  if (catSelect && categoryFilter && categoryFilter !== catSelect.value) {
    catSelect.value = categoryFilter;
  }

  const q = (query || '').toLowerCase().trim();
  const selectedCat = categoryFilter || (catSelect ? catSelect.value : 'all');

  const results = PRODUCTS_DATA.filter(p => {
    // 1. Filter by Category if specified
    if (selectedCat && selectedCat !== 'all') {
      const pCatId = p.categoryId || normalizeCategoryId(p.category);
      if (pCatId !== selectedCat) return false;
    }
    // 2. Filter by Search Query
    if (q === '') return true;
    return (
      (p.title && p.title.toLowerCase().includes(q)) ||
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q)) ||
      (p.subItem && p.subItem.toLowerCase().includes(q)) ||
      (p.subCategory && p.subCategory.toLowerCase().includes(q)) ||
      (p.material && p.material.toLowerCase().includes(q)) ||
      (p.craftOrigin && p.craftOrigin.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q))
    );
  });

  if (results.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; color: rgba(255,255,255,0.7); padding: 40px 0;">
        <i class="fa-solid fa-magnifying-glass" style="font-size: 2rem; color: var(--color-gold); margin-bottom: 12px; display: block;"></i>
        <p style="font-size: 1.15rem; margin: 0 0 6px;">No creations found matching "${escapeHtml(query)}"</p>
        <span style="font-size: 0.85rem; color: rgba(255,255,255,0.5);">Try selecting "All Collections" or searching for lamp, clock, terracotta, tea light, or brass</span>
      </div>
    `;
    return;
  }

  grid.innerHTML = `
    <div style="grid-column: 1/-1; display: flex; justify-content: space-between; align-items: center; padding-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.12); margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
      <span style="color: rgba(255,255,255,0.85); font-size: 0.88rem;">
        Found <strong>${results.length}</strong> matching creation${results.length === 1 ? '' : 's'}
        ${selectedCat !== 'all' ? ` in <em>${escapeHtml(getCategoryById(selectedCat).name)}</em>` : ''}
      </span>
      <button type="button" class="btn btn-sm btn-outline" style="border-color: var(--color-gold); color: var(--color-gold); font-size: 0.8rem; padding: 5px 12px;" onclick="viewSearchResultsInCatalog('${escapeHtml(query)}', '${escapeHtml(selectedCat)}')">
        <i class="fa-solid fa-arrow-down"></i> View All in Storefront Grid
      </button>
    </div>
    ${results.slice(0, 16).map(p => `
      <div style="background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.16); border-radius: 8px; overflow: hidden; padding: 10px; display: flex; gap: 12px; align-items: center; cursor: pointer; transition: transform 0.2s, background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.14)'" onmouseout="this.style.background='rgba(255,255,255,0.07)'" onclick="closeSearch(); openQuickView('${p.id}')">
        <img src="${p.image}" alt="${escapeHtml(p.title)}" style="width: 58px; height: 58px; object-fit: cover; border-radius: 5px; flex-shrink: 0;" onerror="this.src='images/wooden-gallery.jpg'">
        <div style="flex: 1; min-width: 0;">
          <h5 style="color: #ffffff; font-size: 0.92rem; font-family: var(--font-serif); margin: 0 0 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(p.title)}</h5>
          <span style="color: var(--color-gold); font-size: 0.74rem; font-weight: 600; display: block;">${escapeHtml(p.subItem || p.category)} &bull; ${escapeHtml(p.priceFormatted || '₹' + p.price)}</span>
        </div>
        <button type="button" class="btn btn-sm btn-primary" style="padding: 6px 10px; font-size: 0.72rem; border-radius: 4px; flex-shrink: 0;" onclick="event.stopPropagation(); closeSearch(); addToCart('${p.id}')" title="Add to Bag">
          <i class="fa-solid fa-bag-shopping"></i>
        </button>
      </div>
    `).join('')}
  `;
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

