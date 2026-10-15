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

// Multi-origin API resolver (works on http://localhost:3000, 127.0.0.1, or file://)
function getApiUrl(path) {
  if (window.location.protocol === 'file:') {
    return 'http://localhost:3000' + path;
  }
  return path;
}

const storeBroadcastChannel = (typeof BroadcastChannel !== 'undefined') ? new BroadcastChannel('verdanta_store_channel') : null;

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
          console.log('[Cloudinary] Uploaded successfully:', cData.secure_url);
          return cData.secure_url;
        }
      }
    } catch (cErr) {
      console.warn('Cloudinary upload failed, falling back to Hostinger server storage:', cErr);
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
        parsed = parsed.filter(c => c.id !== 'esg-corporate-solution' && !c.name.toLowerCase().includes('esg corporate'));
        PRODUCT_CATEGORIES = parsed;
        if (typeof renderCategoryProductSections === 'function') renderCategoryProductSections();
        if (typeof renderCategoryJumpPills === 'function') renderCategoryJumpPills();
        if (typeof renderCategoryManagementList === 'function') renderCategoryManagementList();
        if (typeof updateSidebarCounts === 'function') updateSidebarCounts();
      } else {
        PRODUCT_CATEGORIES = [...DEFAULT_CATEGORIES];
      }
    } catch (e) {
      PRODUCT_CATEGORIES = [...DEFAULT_CATEGORIES];
    }
  } else {
    PRODUCT_CATEGORIES = [...DEFAULT_CATEGORIES];
  }

  // Also fetch categories from server if available
  fetch(getApiUrl('/api/categories'))
    .then(res => res.json())
    .then(serverCats => {
      if (Array.isArray(serverCats) && serverCats.length > 0) {
        PRODUCT_CATEGORIES = serverCats.filter(c => c.id !== 'esg-corporate-solution');
        try {
          localStorage.setItem('verdanta_categories', JSON.stringify(PRODUCT_CATEGORIES));
        } catch (e) { }
        if (typeof renderCategoryProductSections === 'function') renderCategoryProductSections();
        if (typeof renderCategoryJumpPills === 'function') renderCategoryJumpPills();
        if (typeof renderCategoryManagementList === 'function') renderCategoryManagementList();
        if (typeof updateSidebarCounts === 'function') updateSidebarCounts();
      }
    })
    .catch(() => { });
}

function saveCategories() {
  try {
    localStorage.setItem('verdanta_categories', JSON.stringify(PRODUCT_CATEGORIES));
  } catch (e) { }
  fetch(getApiUrl('/api/categories'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(PRODUCT_CATEGORIES)
  }).then(res => res.json())
    .then(data => {
      if (data && data.categories && Array.isArray(data.categories)) {
        PRODUCT_CATEGORIES = data.categories;
        try {
          localStorage.setItem('verdanta_categories', JSON.stringify(PRODUCT_CATEGORIES));
        } catch (e) { }
        renderCategoryProductSections();
        renderCategoryJumpPills();
        if (typeof renderCategoryManagementList === 'function') renderCategoryManagementList();
        if (typeof updateSidebarCounts === 'function') updateSidebarCounts();
      }
    })
    .catch(() => { });

  try {
    localStorage.setItem('verdanta_cat_sync_trigger', String(Date.now()));
    window.dispatchEvent(new Event('storage'));
    if (storeBroadcastChannel) {
      storeBroadcastChannel.postMessage({ type: 'CATEGORIES_UPDATED', timestamp: Date.now() });
    }
  } catch (e) { }
}


// Helper to normalize subcategory names to canonical taxonomy
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


// List of legacy mock IDs that should never be shown or re-injected
const LEGACY_REMOVED_IDS = new Set([
  'art-01', 'art-02', 'art-03',
  'wood-01', 'wood-02', 'wood-03', 'wood-04', 'wood-05',
  'decor-01', 'decor-02', 'decor-03',
  'corp-01', 'corp-02', 'corp-03', 'corp-04', 'esg-01', 'esg-02', 'pers-01', 'wh-metal-01', 'wh-metal-02'
]);

// Default Seed Products with reliable categoryId and name references
const SEED_PRODUCTS = [
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
      { title: 'Leather Lighting Lamp', quantity: 1, price: 4899 },
      { title: 'Hammered Brass Tabletop Floating Urli Bowl', quantity: 1, price: 3800 }
    ]
  }
];

// App State
let adminProducts = [];
let adminProposals = [];
let adminOrders = [];
let currentProposalFilter = 'all';

if (storeBroadcastChannel) {
  storeBroadcastChannel.onmessage = (event) => {
    if (event.data && (event.data.type === 'NEW_PROPOSAL' || event.data.type === 'PROPOSALS_UPDATED')) {
      fetch(getApiUrl('/api/proposals'))
        .then(res => res.json())
        .then(serverProps => {
          if (Array.isArray(serverProps) && serverProps.length > 0) {
            adminProposals = serverProps;
            renderProposalsTable();
            renderDashboard();
            updateSidebarCounts();
            if (event.data.proposal) {
              showToast(`🔔 New enquiry received: ${event.data.proposal.name} (${event.data.proposal.type})`);
            }
          }
        })
        .catch(() => { });
    }
  };
}

// Periodic background sync for new customer enquiries (every 10s)
setInterval(() => {
  fetch(getApiUrl('/api/proposals'))
    .then(res => res.json())
    .then(serverProps => {
      if (Array.isArray(serverProps) && serverProps.length !== adminProposals.length) {
        adminProposals = serverProps;
        renderProposalsTable();
        renderDashboard();
        updateSidebarCounts();
      }
    })
    .catch(() => { });
}, 10000);

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

  // Ensure every product has both MRP and Discount Price
  if (p.mrp !== undefined && p.mrp !== null && p.mrp !== '' && Number(p.mrp) > p.price) {
    p.mrp = Number(p.mrp);
  } else if (p.price > 0) {
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


// =============================================================================
// ADMIN AUTHENTICATION GATE & SESSION GUARDS
// =============================================================================

function checkAdminAuth() {
  const isAuth = sessionStorage.getItem('verdanta_admin_auth') === 'authenticated';
  const overlay = document.getElementById('adminAuthOverlay');
  const app = document.getElementById('adminApp');

  if (isAuth) {
    document.documentElement.classList.add('admin-logged-in');
    if (overlay) overlay.style.display = 'none';
    if (app) app.style.display = 'flex';
  } else {
    document.documentElement.classList.remove('admin-logged-in');
    if (overlay) overlay.style.display = 'flex';
    if (app) app.style.display = 'none';
    const userInp = document.getElementById('adminAuthUser');
    if (userInp) userInp.focus();
  }
  return isAuth;
}

window.handleAdminLogin = async function (e) {
  if (e && e.preventDefault) e.preventDefault();
  const userInp = document.getElementById('adminAuthUser');
  const passInp = document.getElementById('adminAuthPass');
  const errBanner = document.getElementById('adminAuthError');
  const btn = document.getElementById('adminLoginBtn');

  const username = userInp ? userInp.value.trim() : '';
  const password = passInp ? passInp.value : '';

  if (!username || !password) {
    if (errBanner) {
      errBanner.style.display = 'flex';
      errBanner.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Please enter both username and password.';
    }
    return;
  }

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Authenticating...';
  }
  if (errBanner) errBanner.style.display = 'none';

  try {
    let authenticated = false;

    // Try backend API endpoint /api/admin-login
    try {
      const res = await fetch(getApiUrl('/api/admin-login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.success) {
          authenticated = true;
        }
      }
    } catch (netErr) {
      console.log('Network auth check skipped, trying credential match:', netErr);
    }

    // Fallback credential verification if server unreachable or offline dev
    if (!authenticated) {
      if ((username === 'admin' && (password === 'Verdanta@Admin2026' || password === 'admin123' || password === 'admin')) ||
          (username === 'verdanta' && password === 'Verdanta@Admin2026')) {
        authenticated = true;
      }
    }

    if (authenticated) {
      sessionStorage.setItem('verdanta_admin_auth', 'authenticated');
      sessionStorage.setItem('verdanta_admin_user', username);
      document.documentElement.classList.add('admin-logged-in');
      const overlay = document.getElementById('adminAuthOverlay');
      const app = document.getElementById('adminApp');
      if (overlay) overlay.style.display = 'none';
      if (app) app.style.display = 'flex';
      showAdminToast('Welcome, Administrator! Secure session established.');
      loadData();
      renderDashboard();
    } else {
      if (errBanner) {
        errBanner.style.display = 'flex';
        errBanner.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Invalid admin username or password. Please try again.';
      }
      if (passInp) {
        passInp.value = '';
        passInp.focus();
      }
    }
  } catch (err) {
    if (errBanner) {
      errBanner.style.display = 'flex';
      errBanner.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Authentication error: ${err.message}`;
    }
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-lock"></i> Authorize &amp; Sign In';
    }
  }
};

window.logoutAdmin = function () {
  sessionStorage.removeItem('verdanta_admin_auth');
  sessionStorage.removeItem('verdanta_admin_user');
  document.documentElement.classList.remove('admin-logged-in');
  const overlay = document.getElementById('adminAuthOverlay');
  const app = document.getElementById('adminApp');
  if (overlay) overlay.style.display = 'flex';
  if (app) app.style.display = 'none';
  const passInp = document.getElementById('adminAuthPass');
  if (passInp) passInp.value = '';
  const errBanner = document.getElementById('adminAuthError');
  if (errBanner) errBanner.style.display = 'none';
  showAdminToast('You have been signed out of Admin Console.');
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  checkAdminAuth();
  loadData();
  fetchCorporateCardsAdmin();
  fetchHeroDataAdmin();
  renderDashboard();
  renderCategoryJumpPills();
  renderCategoryProductSections();
  renderCategoryManagementList();
  renderCorporateCardsAdmin();
  renderHeroAdmin();
  renderProposalsTable();
  renderOrdersTable();
  updateSidebarCounts();
  updateStorageStatusUI();
});

// Load Data from LocalStorage
// Load Data with local cache and immediate server sync
function loadData() {
  loadCategories();
  const storedProd = localStorage.getItem('verdanta_products');
  if (storedProd) {
    try {
      const parsed = JSON.parse(storedProd);
      if (Array.isArray(parsed) && parsed.length > 0) {
        adminProducts = parsed.filter(p => !LEGACY_REMOVED_IDS.has(p.id)).map(normalizeProduct);
      } else {
        adminProducts = SEED_PRODUCTS.filter(p => !LEGACY_REMOVED_IDS.has(p.id)).map(normalizeProduct);
      }
    } catch (e) {
      adminProducts = SEED_PRODUCTS.filter(p => !LEGACY_REMOVED_IDS.has(p.id)).map(normalizeProduct);
    }
  } else {
    adminProducts = SEED_PRODUCTS.filter(p => !LEGACY_REMOVED_IDS.has(p.id)).map(normalizeProduct);
  }

  // Fetch definitive products list from backend server
  fetch(getApiUrl('/api/products'))
    .then(res => res.ok ? res.json() : fetch('products.json').then(r => r.json()))
    .then(serverProducts => {
      if (Array.isArray(serverProducts) && serverProducts.length > 0) {
        adminProducts = serverProducts.filter(p => !LEGACY_REMOVED_IDS.has(p.id)).map(normalizeProduct);
        try {
          localStorage.setItem('verdanta_products', JSON.stringify(adminProducts));
        } catch (e) { }
        renderCategoryProductSections();
        renderDashboard();
        updateSidebarCounts();
      }
    })
    .catch(err => console.log('Local data active; server sync pending:', err));

  const storedProp = localStorage.getItem('verdanta_proposals');
  if (storedProp) {
    try {
      adminProposals = JSON.parse(storedProp);
    } catch (e) {
      adminProposals = [...SAMPLE_PROPOSALS];
    }
  } else {
    adminProposals = [...SAMPLE_PROPOSALS];
  }

  // Fetch definitive proposals database from backend server
  fetch(getApiUrl('/api/proposals'))
    .then(res => res.json())
    .then(serverProps => {
      if (Array.isArray(serverProps) && serverProps.length > 0) {
        adminProposals = serverProps;
        try {
          localStorage.setItem('verdanta_proposals', JSON.stringify(adminProposals));
        } catch (e) { }
        renderProposalsTable();
        renderDashboard();
        updateSidebarCounts();
      } else if (adminProposals.length > 0) {
        // Sync sample proposals to server if server is empty
        saveProposals();
      }
    })
    .catch(err => console.log('Proposals server sync pending:', err));

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
  // 1. Immediate local storage save
  try {
    localStorage.setItem('verdanta_products', JSON.stringify(adminProducts));
  } catch (err) {
    console.warn('LocalStorage quota limit reached, server file sync handles persistence.', err);
  }
  updateSidebarCounts();

  // 2. Direct server persistence: writes directly to products.json and uploads folder
  fetch(getApiUrl('/api/products'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(adminProducts)
  }).then(res => res.json())
    .then(data => {
      if (data && data.products) {
        // Update adminProducts with server-saved disk paths if any base64 was converted
        adminProducts = data.products.map(normalizeProduct);
        try {
          localStorage.setItem('verdanta_products', JSON.stringify(adminProducts));
        } catch (e) { }
      }
    })
    .catch(err => console.warn('Server sync error:', err));

  // 3. Notify other tabs, windows, and storefront listeners
  try {
    localStorage.setItem('verdanta_sync_trigger', String(Date.now()));
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('verdanta-products-updated', { detail: adminProducts }));
    if (storeBroadcastChannel) {
      storeBroadcastChannel.postMessage({ type: 'PRODUCTS_UPDATED', timestamp: Date.now() });
    }
  } catch (e) { }
}

function saveProposals() {
  try {
    localStorage.setItem('verdanta_proposals', JSON.stringify(adminProposals));
  } catch (e) { }
  updateSidebarCounts();

  // Direct server database persistence: writes to proposals.json and MongoDB
  fetch(getApiUrl('/api/proposals'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(adminProposals)
  }).then(res => res.json())
    .then(data => {
      console.log('[Admin] Proposals database synchronized:', data);
    })
    .catch(err => console.warn('Proposals server sync error:', err));

  try {
    localStorage.setItem('verdanta_sync_trigger', String(Date.now()));
    if (storeBroadcastChannel) {
      storeBroadcastChannel.postMessage({ type: 'PROPOSALS_UPDATED', timestamp: Date.now() });
    }
  } catch (e) { }
}

function saveOrders() {
  localStorage.setItem('verdanta_orders', JSON.stringify(adminOrders));
  updateSidebarCounts();
}

// =============================================================================
// TAB NAVIGATION
// =============================================================================

window.switchTab = function (tabName) {
  document.querySelectorAll('.nav-tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));

  const tabIndex = {
    dashboard: 0,
    products: 1,
    categories: 2,
    'corporate-cards': 3,
    hero: 4,
    proposals: 5,
    orders: 6
  }[tabName] || 0;

  const btn = document.querySelectorAll('.nav-tab-btn')[tabIndex];
  if (btn) btn.classList.add('active');

  const pane = document.getElementById('tab-' + tabName);
  if (pane) pane.classList.add('active');

  const titleMap = {
    dashboard: 'Dashboard Overview',
    products: 'Products & Collections Inventory',
    categories: 'Categories & Subcategories Management',
    'corporate-cards': 'Corporate Gifting Category Cards (3×2 Grid)',
    hero: 'Homepage Hero Banner & Content',
    proposals: 'Customer B2B Proposals & Requests',
    orders: 'Customer Orders & Checkouts'
  };
  const titleEl = document.getElementById('currentPageTitle');
  if (titleEl) titleEl.textContent = titleMap[tabName] || 'Dashboard';

  // Close mobile sidebar if open
  document.getElementById('adminSidebar').classList.remove('open');

  if (tabName === 'dashboard') renderDashboard();
  if (tabName === 'products') renderCategoryProductSections();
  if (tabName === 'categories') renderCategoryManagementList();
  if (tabName === 'corporate-cards') renderCorporateCardsAdmin();
  if (tabName === 'hero') renderHeroAdmin();
  if (tabName === 'proposals') renderProposalsTable();
  if (tabName === 'orders') renderOrdersTable();
};

window.toggleSidebar = function () {
  document.getElementById('adminSidebar').classList.toggle('open');
};

function updateSidebarCounts() {
  const prodBadge = document.getElementById('sidebarProductCount');
  const catBadge = document.getElementById('sidebarCategoryCount');
  const corpBadge = document.getElementById('sidebarCorpCardsCount');
  const propBadge = document.getElementById('sidebarProposalCount');
  const ordBadge = document.getElementById('sidebarOrderCount');

  if (prodBadge) prodBadge.textContent = adminProducts.length;
  if (catBadge) catBadge.textContent = PRODUCT_CATEGORIES.length;
  if (corpBadge) corpBadge.textContent = (adminCorporateCards && adminCorporateCards.length) ? adminCorporateCards.length + ' Cards' : '6 Cards';
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
window.handleDropFile = function (event) {
  event.preventDefault();
  const dropzone = document.getElementById('photoDropzone');
  if (dropzone) dropzone.style.borderColor = '';
  if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length > 0) {
    const fakeEvent = { target: { files: event.dataTransfer.files } };
    window.handleImageFileUpload(fakeEvent);
  }
};

// Handle local device photo file upload (JPG, PNG, WEBP)
window.handleImageFileUpload = function (event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  if (file.size > 20 * 1024 * 1024) {
    alert('Please choose a photo under 20MB.');
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const img = new Image();
    img.onload = async function () {
      // Scale for web viewing and sharp display
      const maxDim = 900;
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
      const dataUrl = canvas.toDataURL('image/jpeg', 0.82);

      uploadedPhotoDataUrl = dataUrl;
      showPhotoPreview(dataUrl, 'Saving Photo to Disk...');

      // Save directly to server disk as an actual image file
      const savedDiskUrl = await uploadImageToServer(dataUrl);
      if (savedDiskUrl) {
        uploadedPhotoDataUrl = savedDiskUrl;
        showPhotoPreview(savedDiskUrl, 'Saved to Server Disk');
      } else {
        showPhotoPreview(dataUrl, 'Photo Ready');
      }

      // Clear custom URL and preset radio selection
      const customInput = document.getElementById('prodCustomImage');
      if (customInput) customInput.value = '';
      document.querySelectorAll('input[name="prodImgPreset"]').forEach(r => r.checked = false);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
};

window.handleCustomImageUrlInput = function (val) {
  const url = (val || '').trim();
  if (url) {
    uploadedPhotoDataUrl = '';
    const fileInput = document.getElementById('prodFileInput');
    if (fileInput) fileInput.value = '';
    document.querySelectorAll('input[name="prodImgPreset"]').forEach(r => r.checked = false);
    showPhotoPreview(url, 'Custom Photo URL');
  }
};

window.handlePresetSelect = function (val) {
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

window.removeUploadedImage = function (e) {
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
// CATEGORY MANAGEMENT CONSOLE (CRUD & SUB-CATEGORIES)
// =============================================================================

// Helper to escape attribute string safely
function escapeAttr(str) {
  if (!str) return '';
  return String(str)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '&quot;');
}

let currentCategoryChannelFilter = 'all';

window.filterCategoriesByChannel = function (channel) {
  currentCategoryChannelFilter = channel;
  document.querySelectorAll('[data-cat-channel]').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-cat-channel') === channel);
  });
  renderCategoryManagementList();
};

function getCategoryCoverImage(cat) {
  if (cat && cat.image && typeof cat.image === 'string' && cat.image.trim()) {
    return cat.image.trim();
  }
  if (Array.isArray(adminProducts)) {
    const catProd = adminProducts.find(p => {
      const pCatId = p.categoryId || normalizeCategoryId(p.category);
      return pCatId === cat.id && p.image && typeof p.image === 'string' && p.image.trim();
    });
    if (catProd && catProd.image) {
      return catProd.image.trim();
    }
  }
  return 'images/wooden-gallery.jpg';
}

window.renderCategoryManagementList = function () {
  const container = document.getElementById('categoriesManagementContainer');
  if (!container) return;

  const searchInput = document.getElementById('categorySearchInput');
  const query = (searchInput ? searchInput.value : '').toLowerCase().trim();

  let categories = [...PRODUCT_CATEGORIES];

  // Channel filter
  if (currentCategoryChannelFilter !== 'all') {
    categories = categories.filter(c => (c.channel || 'shop') === currentCategoryChannelFilter);
  }

  // Search filter
  if (query) {
    categories = categories.filter(c => {
      const nameMatch = (c.name || '').toLowerCase().includes(query);
      const descMatch = (c.description || '').toLowerCase().includes(query);
      const badgeMatch = (c.badge || '').toLowerCase().includes(query);
      const subMatch = Array.isArray(c.subCategories) && c.subCategories.some(s => s.toLowerCase().includes(query));
      return nameMatch || descMatch || badgeMatch || subMatch;
    });
  }

  if (categories.length === 0) {
    container.innerHTML = `
      <div style="padding: 60px 20px; text-align: center; color: var(--color-text-muted); background: #ffffff; border-radius: 8px; border: 1px dashed var(--color-border); margin-top: 10px;">
        <i class="fa-solid fa-folder-open" style="font-size: 2.2rem; color: var(--color-gold); margin-bottom: 12px; display: inline-block;"></i>
        <h4 style="color: var(--color-primary); font-size: 1.15rem; margin-bottom: 6px;">No categories found matching criteria</h4>
        <p style="font-size: 0.88rem; margin-bottom: 18px;">Try clearing your search query or click below to create a new category.</p>
        <button type="button" class="btn btn-primary" onclick="openAddCategoryModal()">
          <i class="fa-solid fa-folder-plus"></i> + Create New Category
        </button>
      </div>
    `;
    return;
  }

  const channelLabels = {
    shop: 'Shop Collections',
    corporate: 'Corporate Gifting',
    wholesale: 'Wholesale B2B',
    export: 'Export & Global'
  };

  container.innerHTML = categories.map((cat, idx) => {
    const catProds = adminProducts.filter(p => (p.categoryId || normalizeCategoryId(p.category)) === cat.id);
    const coverImg = getCategoryCoverImage(cat);
    const channelName = channelLabels[cat.channel || 'shop'] || 'Shop Collections';
    const subs = Array.isArray(cat.subCategories) ? cat.subCategories : [];

    const subPillsHtml = subs.map(sub => {
      const subCount = catProds.filter(p => normalizeSubCategory(cat.id, p.subItem || p.subCategory) === sub).length;
      return `
        <span class="manage-subcat-pill">
          <span>${escapeHtml(sub)}</span>
          <span class="manage-subcat-count" title="${subCount} products assigned">${subCount}</span>
          <button type="button" class="manage-subcat-delete-btn" title="Remove subcategory '${escapeHtml(sub)}'" onclick="removeSubCategoryFromCat('${cat.id}', '${escapeAttr(sub)}')">&times;</button>
        </span>
      `;
    }).join('');

    return `
      <div class="cat-manage-card" id="cat_card_${cat.id}">
        <div class="cat-manage-card-header">
          <div class="cat-manage-left">
            <div class="cat-manage-thumb-box" onclick="openEditCategoryModal('${cat.id}')" title="Click to edit category cover photo">
              <img src="${coverImg}" alt="${escapeHtml(cat.name)}" onerror="this.src='images/wooden-gallery.jpg'">
            </div>
            <div class="cat-manage-info">
              <div class="cat-manage-meta-row">
                <span class="sidebar-badge" style="background: #eef4f0; color: var(--color-primary); font-size: 0.75rem; padding: 3px 8px; border-radius: 4px; font-weight: 700;">
                  ${escapeHtml(channelName)}
                </span>
                <span class="sidebar-badge badge-gold" style="font-size: 0.75rem; padding: 3px 8px; border-radius: 4px; font-weight: 700;">
                  ${escapeHtml(cat.badge || `Collection 0${idx + 1}`)}
                </span>
                <span style="font-size: 0.75rem; color: #888; font-weight: 600;">
                  <i class="fa-solid fa-boxes-stacked"></i> ${catProds.length} ${catProds.length === 1 ? 'Product' : 'Products'} Live
                </span>
              </div>
              <h3 class="cat-manage-name">${escapeHtml(cat.name)}</h3>
              <p class="cat-manage-desc">${escapeHtml(cat.description || `Artisanal handcrafted ${cat.name} creations.`)}</p>
            </div>
          </div>

          <div class="cat-manage-actions">
            <button type="button" class="btn-edit-cat" onclick="openEditCategoryModal('${cat.id}')">
              <i class="fa-solid fa-pen-to-square"></i> Edit Category
            </button>
            <button type="button" class="btn-delete-cat" onclick="deleteCategory('${cat.id}')">
              <i class="fa-solid fa-trash-can"></i> Delete
            </button>
          </div>
        </div>

        <div class="cat-manage-body">
          <div class="cat-subcat-box">
            <div class="cat-subcat-box-title-row">
              <div class="cat-subcat-box-title">
                <i class="fa-solid fa-tags" style="color: var(--color-gold);"></i>
                <span>Subcategories (${subs.length})</span>
              </div>
              <span style="font-size: 0.74rem; color: #888;">
                Click &times; to remove or type below to add. Automatically updates live customer website.
              </span>
            </div>

            <div class="cat-subcat-pills-wrap">
              ${subPillsHtml || '<span style="font-size: 0.8rem; color: #888; font-style: italic;">No subcategories yet. Add one below:</span>'}
              <form class="inline-subcat-form" onsubmit="addSubCategoryFromInput(event, '${cat.id}')">
                <input type="text" class="inline-subcat-input" id="subInput_${cat.id}" placeholder="+ Add new subcategory..." autocomplete="off">
                <button type="submit" class="btn-inline-add-subcat">
                  <i class="fa-solid fa-plus"></i> Add
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
};

window.addSubCategoryFromInput = function (event, catId) {
  if (event) event.preventDefault();
  const input = document.getElementById(`subInput_${catId}`);
  if (!input) return;
  const subName = input.value.trim();
  if (!subName) return;

  const cat = PRODUCT_CATEGORIES.find(c => c.id === catId);
  if (!cat) return;

  if (!Array.isArray(cat.subCategories)) {
    cat.subCategories = [];
  }

  const exists = cat.subCategories.some(s => s.toLowerCase() === subName.toLowerCase());
  if (exists) {
    showToast(`Subcategory "${subName}" already exists in ${cat.name}.`, 'warning');
    return;
  }

  cat.subCategories.push(subName);
  input.value = '';

  saveCategories();
  renderCategoryManagementList();
  renderCategoryProductSections();
  showToast(`Subcategory "${subName}" added to "${cat.name}"!`);
};

window.removeSubCategoryFromCat = function (catId, subName) {
  const cat = PRODUCT_CATEGORIES.find(c => c.id === catId);
  if (!cat || !Array.isArray(cat.subCategories)) return;

  if (!confirm(`Are you sure you want to remove subcategory "${subName}" from "${cat.name}"?`)) {
    return;
  }

  cat.subCategories = cat.subCategories.filter(s => s !== subName);
  saveCategories();
  renderCategoryManagementList();
  renderCategoryProductSections();
  showToast(`Subcategory "${subName}" removed from "${cat.name}".`);
};

window.deleteCategory = function (catId) {
  const cat = PRODUCT_CATEGORIES.find(c => c.id === catId);
  if (!cat) return;

  const catProds = adminProducts.filter(p => (p.categoryId || normalizeCategoryId(p.category)) === catId);
  let confirmMsg = `Are you sure you want to permanently delete category "${cat.name}"?`;
  if (catProds.length > 0) {
    confirmMsg += `\n\nThere are ${catProds.length} products currently in this category. They will remain in inventory with unassigned category.`;
  }

  if (!confirm(confirmMsg)) return;

  // Unassign products if any
  if (catProds.length > 0) {
    adminProducts.forEach(p => {
      if ((p.categoryId || normalizeCategoryId(p.category)) === catId) {
        p.categoryId = '';
      }
    });
    saveProducts();
  }

  // Remove from PRODUCT_CATEGORIES
  PRODUCT_CATEGORIES = PRODUCT_CATEGORIES.filter(c => c.id !== catId);

  saveCategories();
  updateSidebarCounts();
  renderCategoryManagementList();
  renderCategoryProductSections();
  renderCategoryJumpPills();
  renderDashboard();
  showToast(`Category "${cat.name}" deleted successfully.`);
};

// =============================================================================
// CATEGORY & SUBTITLE CATEGORY PRODUCT MANAGEMENT
// =============================================================================

// Prompt admin to add a new subtitle category on the fly
window.quickAddSubCategoryPrompt = function (categoryId) {
  const cat = getCategoryById(categoryId);
  const newSub = prompt(`Enter new Subtitle Category name for "${cat.name}":`);
  if (!newSub || !newSub.trim()) return;

  const cleanSub = newSub.trim();
  if (!cat.subCategories) cat.subCategories = [];
  if (!cat.subCategories.includes(cleanSub)) {
    cat.subCategories.push(cleanSub);
  }

  saveCategories();
  showToast(`Subtitle category "${cleanSub}" added to ${cat.name}!`);
  renderCategoryManagementList();
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

  // Only categories currently defined in PRODUCT_CATEGORIES
  let categoriesList = [...PRODUCT_CATEGORIES];

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
          <div style="display: flex; gap: 16px; align-items: center; flex: 1; min-width: 0;">
            <div class="admin-cat-cover-thumb-wrap" onclick="openEditCategoryModal('${cat.id}')" title="Click to change category cover photo" style="position: relative; width: 84px; height: 84px; border-radius: 8px; overflow: hidden; border: 2px solid #ecd8b4; flex-shrink: 0; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.08); background: #fdfbf7;">
              <img src="${cat.image || 'images/wooden-gallery.jpg'}" alt="${escapeHtml(cat.name)}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='images/wooden-gallery.jpg'">
              <span style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(26,20,16,0.78); color: #fff; font-size: 0.65rem; font-weight: 700; text-align: center; padding: 2px 0; letter-spacing: 0.5px;">COVER</span>
            </div>
            <div class="admin-cat-title-block" style="flex: 1; min-width: 0;">
              <div class="admin-cat-pill-row">
                <span class="cat-channel-tag tag-${channel}"><i class="fa-solid fa-tag"></i> ${escapeHtml(channelLabel)}</span>
                <span class="admin-cat-badge">${escapeHtml(cat.badge || 'Collection')}</span>
                <span class="admin-cat-count-pill">${allCatProducts.length} Total Photos</span>
                <span class="admin-cat-sub-count-pill" style="background:#f4efe6; color:var(--color-primary); font-size:0.74rem; font-weight:700; padding:3px 10px; border-radius:12px;">${subCategories.length} Subtitle Categories</span>
              </div>
              <h3 class="admin-cat-title">${escapeHtml(cat.displayName || cat.name)}</h3>
              <p class="admin-cat-description">${escapeHtml(cat.description || 'Artisan handcrafted creations.')}</p>
            </div>
          </div>
          
          <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
            <!-- Button to Change Category Cover Photo & Info -->
            <button class="btn btn-sm btn-outline-cat" onclick="openEditCategoryModal('${cat.id}')" style="background:#ffffff; border:1px solid var(--color-gold); color:var(--color-primary); padding:8px 14px; font-weight:700; font-size:0.8rem; border-radius:4px; display:inline-flex; align-items:center; gap:6px;">
              <i class="fa-solid fa-camera"></i> Change Cover / Edit
            </button>
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
                        <div class="admin-product-card ${prod.outOfStock ? 'is-out-of-stock' : ''}" id="admin-prod-${prod.id}">
                          <div class="admin-prod-thumb-wrap">
                            <img src="${prod.image || 'images/wooden-gallery.jpg'}" alt="${escapeHtml(prod.title || prod.name)}" class="admin-prod-thumb" onerror="this.src='images/wooden-gallery.jpg'">
                            <span class="admin-prod-badge">${escapeHtml(prod.badge || 'Artisan Signature')}</span>
                            ${prod.outOfStock ? '<span class="admin-stock-tag is-out"><i class="fa-solid fa-ban"></i> OUT OF STOCK</span>' : '<span class="admin-stock-tag is-in"><i class="fa-solid fa-circle-check"></i> IN STOCK</span>'}
                          </div>
                          <div class="admin-prod-details">
                            <span class="admin-prod-sub-tag"><i class="fa-solid fa-tag"></i> ${escapeHtml(subName)}</span>
                            <h4 class="admin-prod-title">${escapeHtml(prod.title || prod.name)}</h4>
                            <div class="admin-prod-price-row">
                              ${(prod.mrp && prod.mrp > (prod.price || 0)) ? `
                                <span class="card-discount-pct"><i class="fa-solid fa-arrow-down"></i>${Math.round(((prod.mrp - (prod.price || 0)) / prod.mrp) * 100)}%</span>
                                <span class="card-mrp-price">₹${Number(prod.mrp).toLocaleString('en-IN')}</span>
                              ` : ''}
                              <span class="admin-prod-price">${prod.priceFormatted || (prod.price > 0 ? '₹' + Number(prod.price).toLocaleString('en-IN') : '₹0')}</span>
                              ${prod.origin ? `<span class="admin-prod-origin"><i class="fa-solid fa-location-dot"></i> ${escapeHtml(prod.origin)}</span>` : ''}
                            </div>
                            ${prod.description ? `<p class="admin-prod-desc-snippet">${escapeHtml(prod.description)}</p>` : ''}
                          </div>
                          <div class="admin-prod-actions">
                            <button class="btn-card-action btn-card-stock ${prod.outOfStock ? 'is-out' : 'is-in'}" onclick="toggleProductStock('${prod.id}')" title="Click to toggle stock availability">
                              <i class="fa-solid ${prod.outOfStock ? 'fa-ban' : 'fa-circle-check'}"></i> ${prod.outOfStock ? 'Out of Stock' : 'In Stock'}
                            </button>
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

window.handleModalCategorySelect = function (catId, targetSubName = '') {
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

window.handleModalSubCategorySelect = function (val) {
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
window.openAddProductModalForCategory = function (categoryId, subCategoryName = '') {
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

  // Reset pricing and discount calculation
  if (document.getElementById('prodMrp')) document.getElementById('prodMrp').value = '';
  if (document.getElementById('prodPrice')) document.getElementById('prodPrice').value = '';
  calculateDiscountPreview('admin');

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
window.openAddProductModal = function () {
  let targetCatId = 'artisan-gallery';
  if (currentAdminChannel !== 'all') {
    const channelCat = PRODUCT_CATEGORIES.find(c => (c.channel || 'shop') === currentAdminChannel);
    if (channelCat) targetCatId = channelCat.id;
  }
  openAddProductModalForCategory(targetCatId);
};

// Edit Product (Preserves existing category & subtitle category, updates in place)
window.editProduct = function (productId) {
  const prod = adminProducts.find(p => p.id === productId);
  if (!prod) return;

  const cat = getCategoryById(prod.categoryId || prod.category);
  const currentSub = prod.subItem || (cat && cat.subCategories && cat.subCategories[0]) || 'Featured Creations';

  document.getElementById('editProductId').value = prod.id;
  document.getElementById('prodCategoryId').value = cat ? cat.id : (prod.categoryId || 'artisan-gallery');
  document.getElementById('prodCategory').value = cat ? cat.name : (prod.category || 'Artisan Gallery');

  document.getElementById('prodTitle').value = prod.title || prod.name || '';
  document.getElementById('prodPrice').value = (prod.price !== undefined && prod.price !== null && prod.price > 0) ? prod.price : '';
  if (document.getElementById('prodMrp')) {
    document.getElementById('prodMrp').value = (prod.mrp !== undefined && prod.mrp !== null && prod.mrp > 0) ? prod.mrp : '';
  }
  calculateDiscountPreview('admin');

  document.getElementById('prodSubItem').value = currentSub;
  const hiddenSub = document.getElementById('prodSubItemHidden');
  if (hiddenSub) hiddenSub.value = currentSub;

  populateModalCategoryDropdown(cat ? cat.id : 'artisan-gallery', currentSub);

  document.getElementById('prodBadge').value = prod.badge || 'Artisan Signature';
  const stockSelect = document.getElementById('prodStockStatus');
  if (stockSelect) {
    stockSelect.value = prod.outOfStock ? 'out' : 'in';
  }
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

window.closeProductModal = function () {
  document.getElementById('productModal').classList.remove('active');
};

// Real-time calculation of discount percentage and rupee savings
window.calculateDiscountPreview = function (context = 'admin') {
  const mrpInput = document.getElementById(context === 'admin' ? 'prodMrp' : 'custProdMrp');
  const priceInput = document.getElementById(context === 'admin' ? 'prodPrice' : 'custProdPrice');
  const badgeEl = document.getElementById(context === 'admin' ? 'adminDiscountSavings' : 'custDiscountSavings');
  if (!mrpInput || !priceInput || !badgeEl) return;

  const mrp = parseFloat(mrpInput.value) || 0;
  const price = parseFloat(priceInput.value) || 0;

  if (mrp > 0 && price > 0) {
    if (price < mrp) {
      const savings = mrp - price;
      const pct = Math.round((savings / mrp) * 100);
      badgeEl.className = 'discount-savings-calc pricing-preview-success';
      badgeEl.style.display = 'flex';
      badgeEl.innerHTML = `<i class="fa-solid fa-tags"></i> <span><strong>${pct}% OFF</strong> — Customer saves ₹${savings.toLocaleString('en-IN')}</span>`;
    } else if (price > mrp) {
      badgeEl.className = 'discount-savings-calc pricing-preview-warning';
      badgeEl.style.display = 'flex';
      badgeEl.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> <span>Note: Discount Price (₹${price.toLocaleString('en-IN')}) is higher than MRP (₹${mrp.toLocaleString('en-IN')}).</span>`;
    } else {
      badgeEl.style.display = 'none';
    }
  } else {
    badgeEl.style.display = 'none';
  }
};

// Handle Add / Edit Submission
window.handleProductSubmit = async function (event) {
  event.preventDefault();
  const saveBtn = document.getElementById('saveProductBtn');
  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Publishing to Live Store...';
  }

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

  const mrpVal = document.getElementById('prodMrp') ? document.getElementById('prodMrp').value : '';
  let mrp = mrpVal !== '' ? parseInt(mrpVal, 10) : null;

  const priceVal = document.getElementById('prodPrice').value;
  const price = priceVal !== '' ? parseInt(priceVal, 10) : (mrp !== null ? mrp : 0);
  if ((!mrp || mrp <= price) && price > 0) {
    mrp = Math.round((price * 1.35) / 50) * 50;
    if (mrp <= price) mrp = price + 500;
  }
  const discountPercent = (mrp && mrp > price && price > 0) ? Math.round(((mrp - price) / mrp) * 100) : 0;

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
  const stockSelect = document.getElementById('prodStockStatus');
  const outOfStock = stockSelect ? (stockSelect.value === 'out') : false;
  const origin = document.getElementById('prodOrigin').value.trim();
  const material = document.getElementById('prodMaterial').value.trim();
  const description = document.getElementById('prodDescription').value.trim();

  // Determine final image source:
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

  // If image is still a base64 string, upload and persist it to disk now
  if (image && image.startsWith('data:image')) {
    const diskPath = await uploadImageToServer(image);
    if (diskPath) image = diskPath;
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
        mrp: mrp,
        mrpFormatted: mrp > 0 ? '₹' + mrp.toLocaleString('en-IN') : null,
        price: price,
        discountPercent: discountPercent,
        priceFormatted: price > 0 ? '₹' + price.toLocaleString('en-IN') : '₹0',
        badge: badge,
        outOfStock: outOfStock,
        image: image,
        origin: origin,
        material: material,
        description: description,
        updatedAt: new Date().toISOString()
      };
      showToast(`Product "${title}" updated! Stock: ${outOfStock ? '🔴 Out of Stock' : '🟢 In Stock'}.`);
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
      mrp: mrp,
      mrpFormatted: mrp > 0 ? '₹' + mrp.toLocaleString('en-IN') : null,
      price: price,
      discountPercent: discountPercent,
      priceFormatted: price > 0 ? '₹' + price.toLocaleString('en-IN') : '₹0',
      badge: badge,
      outOfStock: outOfStock,
      image: image,
      origin: origin || 'Handcrafted in India',
      material: material || 'Natural Materials',
      description: description || '',
      createdAt: new Date().toISOString()
    };
    adminProducts.unshift(newProduct);
    showToast(`New product "${title}" added to live customer store!`);
  }

  saveProducts();
  renderCategoryProductSections();
  renderDashboard();
  closeProductModal();

  if (saveBtn) {
    saveBtn.disabled = false;
    saveBtn.textContent = 'Save Product to Live Store';
  }
};

// Quick Stock Toggle handler for Admin
window.toggleProductStock = function (productId) {
  const prod = adminProducts.find(p => p.id === productId);
  if (!prod) return;
  prod.outOfStock = !prod.outOfStock;
  saveProducts();
  renderCategoryProductSections();
  renderDashboard();
  showToast(`"${prod.title || prod.name}" is now marked ${prod.outOfStock ? '🔴 OUT OF STOCK' : '🟢 IN STOCK'}.`);
};

// Delete Product Confirmation
window.confirmDeleteProduct = function (productId) {
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

window.closeDeleteConfirmModal = function () {
  pendingDeleteProductId = null;
  document.getElementById('deleteConfirmModal').classList.remove('active');
};

window.executeDeleteProduct = function () {
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
window.deleteProduct = function (productId) {
  confirmDeleteProduct(productId);
};

// Reset to Default Products
window.confirmResetCatalog = function () {
  if (confirm('This will restore the original 14 curated artisan products from the notebook. Are you sure?')) {
    adminProducts = SEED_PRODUCTS.filter(p => !LEGACY_REMOVED_IDS.has(p.id)).map(normalizeProduct);
    saveProducts();
    renderCategoryProductSections();
    renderDashboard();
    showToast('Product catalog reset to default seed data.');
  }
};

// Jump / Filter Category Sections
window.jumpToCategory = function (catId) {
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

let uploadedCatPhotoDataUrl = '';

// Handle drag & drop category photo onto dropzone
window.handleCatDropFile = function (event) {
  event.preventDefault();
  const dropzone = document.getElementById('catPhotoDropzone');
  if (dropzone) dropzone.style.borderColor = '';
  if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length > 0) {
    const fakeEvent = { target: { files: event.dataTransfer.files } };
    window.handleCategoryImageUpload(fakeEvent);
  }
};

// Handle category cover photo file upload from device
window.handleCategoryImageUpload = function (event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  if (file.size > 20 * 1024 * 1024) {
    alert('Please choose a photo under 20MB.');
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const img = new Image();
    img.onload = async function () {
      const maxDim = 1200;
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

      const compressed = canvas.toDataURL('image/jpeg', 0.90);
      uploadedCatPhotoDataUrl = compressed;

      const previewImg = document.getElementById('catPhotoPreviewImg');
      const previewWrap = document.getElementById('catPhotoPreviewWrap');
      const dropPrompt = document.getElementById('catDropzonePrompt');
      const customImgInput = document.getElementById('catCustomImage');
      const catImageInput = document.getElementById('newCatImage');

      if (previewImg) previewImg.src = compressed;
      if (previewWrap) previewWrap.style.display = 'block';
      if (dropPrompt) dropPrompt.style.display = 'none';
      if (customImgInput) customImgInput.value = compressed;
      if (catImageInput) catImageInput.value = '';

      showToast('Cover photo chosen! Click "Save" to apply across Customer Storefront.');
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
};

window.removeUploadedCatImage = function (event) {
  if (event) event.stopPropagation();
  uploadedCatPhotoDataUrl = '';
  const previewImg = document.getElementById('catPhotoPreviewImg');
  const previewWrap = document.getElementById('catPhotoPreviewWrap');
  const dropPrompt = document.getElementById('catDropzonePrompt');
  const customImgInput = document.getElementById('catCustomImage');
  const catFileInput = document.getElementById('catFileInput');
  const catImageInput = document.getElementById('newCatImage');

  if (previewImg) previewImg.src = '';
  if (previewWrap) previewWrap.style.display = 'none';
  if (dropPrompt) dropPrompt.style.display = 'block';
  if (customImgInput) customImgInput.value = '';
  if (catFileInput) catFileInput.value = '';
  if (catImageInput) catImageInput.value = '';
};

window.handleCatUrlInput = function (val) {
  val = (val || '').trim();
  const previewImg = document.getElementById('catPhotoPreviewImg');
  const previewWrap = document.getElementById('catPhotoPreviewWrap');
  const dropPrompt = document.getElementById('catDropzonePrompt');
  const customImgInput = document.getElementById('catCustomImage');

  if (val) {
    uploadedCatPhotoDataUrl = val;
    if (previewImg) previewImg.src = val;
    if (previewWrap) previewWrap.style.display = 'block';
    if (dropPrompt) dropPrompt.style.display = 'none';
    if (customImgInput) customImgInput.value = val;
  }
};

// Open Add Category Modal
window.openAddCategoryModal = function () {
  const form = document.getElementById('categoryForm');
  if (form) form.reset();
  document.getElementById('editCategoryId').value = '';
  document.getElementById('categoryModalTitle').textContent = 'Add New Product Category';
  document.getElementById('saveCategoryBtn').textContent = 'Create Category';

  uploadedCatPhotoDataUrl = '';
  const previewWrap = document.getElementById('catPhotoPreviewWrap');
  const dropPrompt = document.getElementById('catDropzonePrompt');
  const customImgInput = document.getElementById('catCustomImage');
  const catFileInput = document.getElementById('catFileInput');
  if (previewWrap) previewWrap.style.display = 'none';
  if (dropPrompt) dropPrompt.style.display = 'block';
  if (customImgInput) customImgInput.value = '';
  if (catFileInput) catFileInput.value = '';

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

// Open Edit Category & Cover Photo Modal
window.openEditCategoryModal = function (catId) {
  const cat = getCategoryById(catId);
  if (!cat) return;

  const form = document.getElementById('categoryForm');
  if (form) form.reset();

  document.getElementById('editCategoryId').value = cat.id;
  document.getElementById('categoryModalTitle').textContent = `Edit Category & Cover: ${cat.name}`;
  document.getElementById('saveCategoryBtn').textContent = 'Save Category & Cover';

  document.getElementById('newCatName').value = cat.name || '';
  const channelSelect = document.getElementById('newCatChannel');
  if (channelSelect) channelSelect.value = cat.channel || 'shop';
  document.getElementById('newCatBadge').value = cat.badge || '';
  document.getElementById('newCatDescription').value = cat.description || '';
  document.getElementById('newCatSubCategories').value = (cat.subCategories || []).join(', ');
  document.getElementById('newCatImage').value = cat.image || '';

  // Set up cover photo preview
  uploadedCatPhotoDataUrl = cat.image || '';
  const previewImg = document.getElementById('catPhotoPreviewImg');
  const previewWrap = document.getElementById('catPhotoPreviewWrap');
  const dropPrompt = document.getElementById('catDropzonePrompt');
  const customImgInput = document.getElementById('catCustomImage');

  if (cat.image) {
    if (previewImg) previewImg.src = cat.image;
    if (previewWrap) previewWrap.style.display = 'block';
    if (dropPrompt) dropPrompt.style.display = 'none';
    if (customImgInput) customImgInput.value = cat.image;
  } else {
    if (previewWrap) previewWrap.style.display = 'none';
    if (dropPrompt) dropPrompt.style.display = 'block';
    if (customImgInput) customImgInput.value = '';
  }

  document.getElementById('categoryModal').classList.add('active');
};

window.closeCategoryModal = function () {
  const modal = document.getElementById('categoryModal');
  if (modal) modal.classList.remove('active');
};

window.handleCategorySubmit = async function (event) {
  event.preventDefault();
  const saveBtn = document.getElementById('saveCategoryBtn');
  const editId = document.getElementById('editCategoryId').value;

  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving & Syncing...';
  }

  const name = document.getElementById('newCatName').value.trim();
  const channel = document.getElementById('newCatChannel')?.value || 'shop';
  const badge = document.getElementById('newCatBadge').value.trim();
  const description = document.getElementById('newCatDescription').value.trim();
  const subCatsRaw = document.getElementById('newCatSubCategories').value.trim();

  let image = uploadedCatPhotoDataUrl || '';
  if (!image) {
    image = document.getElementById('catCustomImage')?.value.trim() || '';
  }
  if (!image) {
    image = document.getElementById('newCatImage')?.value.trim() || 'images/wooden-gallery.jpg';
  }

  // If image is a base64 string, persist to server disk immediately
  if (image && image.startsWith('data:image')) {
    const diskPath = await uploadImageToServer(image);
    if (diskPath) image = diskPath;
  }

  if (!name) {
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.textContent = editId ? 'Save Category & Cover' : 'Create Category';
    }
    return;
  }

  const id = editId || (name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || ('cat-' + Date.now()));

  let subCategories = [];
  if (subCatsRaw) {
    subCategories = subCatsRaw.split(',').map(s => s.trim()).filter(Boolean);
  }
  if (subCategories.length === 0) {
    const existing = PRODUCT_CATEGORIES.find(c => c.id === id);
    subCategories = (existing && existing.subCategories) ? existing.subCategories : ['General Collection', 'Artisan Creations'];
  }

  const channelLabels = {
    shop: 'Shop Collections',
    corporate: 'Corporate Gifting',
    wholesale: 'Wholesale B2B',
    export: 'Export & Global'
  };
  const channelName = channelLabels[channel] || 'Shop Collections';

  const existingIdx = PRODUCT_CATEGORIES.findIndex(c => c.id === id || (!editId && c.name.toLowerCase() === name.toLowerCase()));
  const newCatObj = {
    id: id,
    name: name,
    displayName: name,
    channel: channel,
    channelName: channelName,
    badge: badge || `${channelName}`,
    description: description || `Artisanal handcrafted ${name} creations.`,
    icon: (existingIdx !== -1 && PRODUCT_CATEGORIES[existingIdx].icon) ? PRODUCT_CATEGORIES[existingIdx].icon : 'fa-boxes-stacked',
    image: image,
    subCategories: subCategories
  };

  if (existingIdx !== -1) {
    const oldCat = PRODUCT_CATEGORIES[existingIdx];
    const oldName = oldCat ? oldCat.name : '';
    PRODUCT_CATEGORIES[existingIdx] = {
      ...PRODUCT_CATEGORIES[existingIdx],
      ...newCatObj
    };
    if (oldName && oldName !== name) {
      let updatedProd = false;
      adminProducts.forEach(p => {
        if (p.category === oldName || (p.categoryId && p.categoryId === id)) {
          p.category = name;
          updatedProd = true;
        }
      });
      if (updatedProd) saveProducts();
    }
    showToast(`Category "${name}" updated! Changes synchronized with customer website.`);
  } else {
    PRODUCT_CATEGORIES.push(newCatObj);
    showToast(`New category "${name}" created and synced with Customer Storefront!`);
  }

  saveCategories();

  // If newly created category is in a different channel than current filter, switch filter
  if (currentAdminChannel !== 'all' && currentAdminChannel !== channel) {
    currentAdminChannel = channel;
    document.querySelectorAll('.channel-pill-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-channel') === channel);
    });
  }

  updateSidebarCounts();
  renderCategoryManagementList();
  renderCategoryProductSections();
  renderCategoryJumpPills();
  renderDashboard();
  closeCategoryModal();

  if (saveBtn) {
    saveBtn.disabled = false;
    saveBtn.textContent = editId ? 'Save Category & Cover' : 'Create Category';
  }

  // Scroll to the modified category section if on products tab
  const prodPane = document.getElementById('tab-products');
  if (prodPane && prodPane.classList.contains('active')) {
    setTimeout(() => {
      jumpToCategory(id);
    }, 200);
  }
};

window.filterCategorySections = function () {
  const query = (document.getElementById('productSearchInput').value || '').toLowerCase().trim();
  renderCategoryProductSections(query);
};

// Compatibility aliases
window.renderProductsTable = function () {
  renderCategoryProductSections();
};

window.filterProductsTable = function () {
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

  tbody.innerHTML = list.map(prop => {
    const rawPhone = (prop.phone || '').replace(/\D/g, '');
    const clientPhone = rawPhone.length === 10 ? ('91' + rawPhone) : rawPhone;
    const waReplyMsg = `Hello ${prop.name}, thank you for your enquiry regarding "${prop.type}" (Ref #${prop.id}) with Verdanta World. Our partnership team is reviewing your requirements.`;
    const waUrl = clientPhone ? `https://wa.me/${clientPhone}?text=${encodeURIComponent(waReplyMsg)}` : `https://wa.me/918867688699`;

    return `
    <tr>
      <td><strong style="color: var(--color-primary);">${prop.id}</strong></td>
      <td>
        <span style="font-weight: 600; color: var(--color-primary); display: block;">${escapeHtml(prop.name)}</span>
        <span style="font-size: 0.78rem; color: #888;">${escapeHtml(prop.company)}</span>
      </td>
      <td style="font-size: 0.8rem;">
        <div><i class="fa-solid fa-envelope" style="color: var(--color-gold);"></i> ${escapeHtml(prop.email)}</div>
        <div><i class="fa-solid fa-phone" style="color: var(--color-gold);"></i> ${escapeHtml(prop.phone)}</div>
      </td>
      <td>
        <span class="badge-tag">${escapeHtml(prop.type)}</span>
      </td>
      <td style="font-size: 0.84rem; font-weight: 600; color: var(--color-primary);">
        ${escapeHtml(prop.units || 'N/A')}
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
        <div class="action-btns" style="display: flex; gap: 6px; align-items: center;">
          <a href="${waUrl}" target="_blank" class="btn-icon" title="Chat with Client on WhatsApp" style="color: #25D366; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; font-size: 1.1rem; width: 32px; height: 32px; border-radius: 4px; background: rgba(37, 211, 102, 0.1);">
            <i class="fa-brands fa-whatsapp"></i>
          </a>
          <button class="btn-icon" onclick="viewProposalDetail('${prop.id}')" title="View Full Details">
            <i class="fa-solid fa-eye"></i>
          </button>
          <button class="btn-icon btn-icon-delete" onclick="deleteProposal('${prop.id}')" title="Delete Inquiry">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </td>
    </tr>
    `;
  }).join('');
}

window.filterProposalsByStatus = function (status) {
  currentProposalFilter = status;
  document.querySelectorAll('.filter-tabs-pills .pill-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.textContent.trim().toLowerCase() === status.toLowerCase() || (status === 'all' && btn.textContent.includes('All'))) {
      btn.classList.add('active');
    }
  });
  renderProposalsTable();
};

window.updateProposalStatus = function (propId, newStatus) {
  const prop = adminProposals.find(p => p.id === propId);
  if (!prop) return;

  prop.status = newStatus;
  saveProposals();
  renderProposalsTable();
  renderDashboard();
  showToast(`Inquiry #${propId} status marked as "${newStatus}"`);
};

window.deleteProposal = function (propId) {
  if (confirm(`Delete inquiry request #${propId}?`)) {
    adminProposals = adminProposals.filter(p => p.id !== propId);
    saveProposals();
    renderProposalsTable();
    renderDashboard();
    showToast('Inquiry removed.');
  }
};

window.viewProposalDetail = function (propId) {
  const prop = adminProposals.find(p => p.id === propId);
  if (!prop) return;

  const rawPhone = (prop.phone || '').replace(/\D/g, '');
  const clientPhone = rawPhone.length === 10 ? ('91' + rawPhone) : rawPhone;
  const waReplyMsg = `Hello ${prop.name}, regarding your Verdanta World proposal request #${prop.id} (${prop.type}):\n\n`;
  const waUrl = clientPhone ? `https://wa.me/${clientPhone}?text=${encodeURIComponent(waReplyMsg)}` : `https://wa.me/918867688699`;

  document.getElementById('propDetailTitle').textContent = `Inquiry #${prop.id} — ${prop.name}`;
  document.getElementById('propDetailStatus').textContent = prop.status;

  document.getElementById('proposalDetailBody').innerHTML = `
    <div style="background: #faf8f5; padding: 18px; border-radius: 8px; margin-bottom: 20px; font-size: 0.9rem; line-height: 1.8;">
      <div><strong>Company / Entity:</strong> ${escapeHtml(prop.company)}</div>
      <div><strong>Contact Person:</strong> ${escapeHtml(prop.name)}</div>
      <div><strong>Email:</strong> ${escapeHtml(prop.email)}</div>
      <div><strong>Phone:</strong> ${escapeHtml(prop.phone)}</div>
      <div><strong>Inquiry Discipline:</strong> ${escapeHtml(prop.type)}</div>
      <div><strong>Volume / Budget:</strong> ${escapeHtml(prop.units)}</div>
      <div><strong>Submitted On:</strong> ${new Date(prop.createdAt).toLocaleString()}</div>
    </div>
    <div>
      <h4 style="font-family: var(--font-serif); font-size: 1.15rem; color: var(--color-primary); margin-bottom: 8px;">Client Customization Notes:</h4>
      <p style="background: #fff; border: 1px solid #e0dbd0; padding: 14px; border-radius: 6px; font-size: 0.88rem; color: #444; line-height: 1.6; white-space: pre-wrap;">
        ${escapeHtml(prop.notes || 'No specific notes provided.')}
      </p>
    </div>
    <div style="margin-top: 24px; display: flex; gap: 12px; flex-wrap: wrap;">
      <a href="${waUrl}" target="_blank" class="btn btn-primary" style="background: #25D366; border-color: #25D366; color: #fff; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; font-weight: 600; padding: 10px 18px; border-radius: 6px;">
        <i class="fa-brands fa-whatsapp" style="font-size: 1.2rem;"></i> Chat with ${escapeHtml(prop.name)} on WhatsApp
      </a>
      ${prop.email && !prop.email.includes('Appointment') ? `
      <a href="mailto:${escapeHtml(prop.email)}?subject=Verdanta%20World%20Proposal%20${encodeURIComponent(prop.id)}" class="btn btn-secondary" style="display: inline-flex; align-items: center; gap: 8px; font-weight: 600; padding: 10px 18px; border-radius: 6px; text-decoration: none;">
        <i class="fa-solid fa-envelope"></i> Send Email
      </a>` : ''}
    </div>
  `;

  document.getElementById('proposalDetailModal').classList.add('active');
};

window.closeProposalDetailModal = function () {
  document.getElementById('proposalDetailModal').classList.remove('active');
};

// Export Proposals as CSV
window.exportProposalsToCSV = function () {
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

window.deleteOrder = function (orderId) {
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

// =============================================================================
// PERMANENT STORAGE HANDLERS (HOSTINGER SERVER & CLOUDINARY)
// =============================================================================

window.openStorageModal = function () {
  const modal = document.getElementById('storageSettingsModal');
  const cloudInput = document.getElementById('cloudinaryCloudName');
  const presetInput = document.getElementById('cloudinaryUploadPreset');

  if (cloudInput) {
    cloudInput.value = localStorage.getItem('verdanta_cloudinary_cloud_name') || '';
  }
  if (presetInput) {
    presetInput.value = localStorage.getItem('verdanta_cloudinary_upload_preset') || '';
  }

  updateStorageStatusUI();
  if (modal) modal.classList.add('active');
};

window.closeStorageModal = function () {
  const modal = document.getElementById('storageSettingsModal');
  if (modal) modal.classList.remove('active');
};

window.saveStorageSettings = function () {
  const cloudInput = document.getElementById('cloudinaryCloudName');
  const presetInput = document.getElementById('cloudinaryUploadPreset');

  const cloudName = cloudInput ? cloudInput.value.trim() : '';
  const uploadPreset = presetInput ? presetInput.value.trim() : '';

  if (cloudName && uploadPreset) {
    localStorage.setItem('verdanta_cloudinary_cloud_name', cloudName);
    localStorage.setItem('verdanta_cloudinary_upload_preset', uploadPreset);
    showToast('Cloudinary CDN storage activated! Photos will upload to Cloudinary.');
  } else {
    localStorage.removeItem('verdanta_cloudinary_cloud_name');
    localStorage.removeItem('verdanta_cloudinary_upload_preset');
    showToast('Hostinger Server Storage active! Photos saved to uploads/products/.');
  }

  updateStorageStatusUI();
  closeStorageModal();
};

window.updateStorageStatusUI = function () {
  const cloudName = (localStorage.getItem('verdanta_cloudinary_cloud_name') || '').trim();
  const uploadPreset = (localStorage.getItem('verdanta_cloudinary_upload_preset') || '').trim();

  const statusText = document.getElementById('storageStatusText');
  const activeBadge = document.getElementById('storageActiveBadge');
  const cBadge = document.getElementById('cloudinaryActiveBadge');

  if (cloudName && uploadPreset) {
    if (statusText) statusText.textContent = 'Storage: Cloudinary CDN';
    if (activeBadge) {
      activeBadge.textContent = 'Cloudinary Active';
      activeBadge.style.background = '#e0f2fe';
      activeBadge.style.color = '#0369a1';
    }
    if (cBadge) {
      cBadge.textContent = 'ACTIVE';
      cBadge.style.background = '#0284c7';
      cBadge.style.color = '#fff';
    }
  } else {
    if (statusText) statusText.textContent = 'Storage: Hostinger Server';
    if (activeBadge) {
      activeBadge.textContent = 'Hostinger Disk Active';
      activeBadge.style.background = '#d1fae5';
      activeBadge.style.color = '#065f46';
    }
    if (cBadge) {
      cBadge.textContent = 'OPTIONAL';
      cBadge.style.background = '#f1f5f9';
      cBadge.style.color = '#64748b';
    }
  }
};

// =============================================================================
// CORPORATE GIFTING CATEGORY CARDS (3x2 Grid Photo & Content Management)
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

let adminCorporateCards = [...DEFAULT_CORPORATE_CARDS];

window.fetchCorporateCardsAdmin = async function () {
  try {
    const res = await fetch(getApiUrl('/api/corporate-cards'));
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        adminCorporateCards = data;
        try {
          localStorage.setItem('verdanta_corporate_cards', JSON.stringify(data));
        } catch (e) {}
      }
    }
  } catch (err) {
    console.warn('Could not fetch corporate cards for admin:', err);
    try {
      const stored = localStorage.getItem('verdanta_corporate_cards');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          adminCorporateCards = parsed;
        }
      }
    } catch (e) {}
  }
  renderCorporateCardsAdmin();
  updateSidebarCounts();
};

window.renderCorporateCardsAdmin = function () {
  const container = document.getElementById('corporateCardsAdminGrid');
  if (!container) return;

  if (!adminCorporateCards || adminCorporateCards.length === 0) {
    adminCorporateCards = [...DEFAULT_CORPORATE_CARDS];
  }

  container.innerHTML = adminCorporateCards.map((card, idx) => {
    const isCustom = Boolean(card.image && card.image !== card.defaultImage && !card.image.includes('corporate/corp-'));
    const displayImg = card.image || card.defaultImage || 'images/corporate-lifestyle.jpg';

    return `
      <div class="admin-corp-card-box" id="admin-card-${escapeAttr(card.id)}" style="background:#ffffff; border-radius:12px; border:1px solid #e2dbcf; overflow:hidden; box-shadow:0 3px 12px rgba(23,59,44,0.06); display:flex; flex-direction:column; transition:transform 0.2s, box-shadow 0.2s;">
        <!-- Card Top Bar -->
        <div style="padding:14px 18px; background:#faf7f0; border-bottom:1px solid #ebe4d8; display:flex; justify-content:space-between; align-items:center;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:0.8rem; font-weight:800; color:#c59d5f; text-transform:uppercase; letter-spacing:0.8px;">CARD #${idx + 1}</span>
            <span style="font-size:0.75rem; padding:2px 8px; border-radius:10px; font-weight:600; background:${isCustom ? '#dcfce7; color:#15803d;' : '#fef3c7; color:#b45309;'}">
              ${isCustom ? '<i class="fa-solid fa-check"></i> Custom Photo' : '<i class="fa-solid fa-image"></i> Reference Photo'}
            </span>
          </div>
          <button type="button" class="btn btn-sm btn-outline" onclick="resetAdminCardPhoto('${escapeAttr(card.id)}')" title="Reset to original reference photo" style="padding:4px 8px; font-size:0.75rem; background:#fff;">
            <i class="fa-solid fa-rotate-left"></i> Reset
          </button>
        </div>

        <!-- Photo Box with Instant Upload Overlay -->
        <div style="position:relative; height:200px; background:#f0ece3; overflow:hidden;">
          <img id="admin-corp-img-${escapeAttr(card.id)}" src="${escapeAttr(displayImg)}" alt="${escapeAttr(card.title)}" style="width:100%; height:100%; object-fit:cover; display:block;" onerror="this.onerror=null; this.src='${escapeAttr(card.defaultImage || 'images/corporate-lifestyle.jpg')}';">
          
          <div style="position:absolute; bottom:12px; right:12px; display:flex; gap:8px; z-index:2;">
            <label class="btn btn-sm btn-primary" style="cursor:pointer; margin:0; padding:7px 14px; font-size:0.8rem; border-radius:6px; box-shadow:0 3px 10px rgba(0,0,0,0.3); display:inline-flex; align-items:center; gap:6px;">
              <i class="fa-solid fa-camera"></i> Replace Photo
              <input type="file" accept="image/*" style="display:none;" onchange="handleAdminCardPhotoUpload('${escapeAttr(card.id)}', this)">
            </label>
            <button type="button" class="btn btn-sm btn-outline" onclick="handleAdminCardPhotoDelete('${escapeAttr(card.id)}')" title="Delete custom photo" style="background:#fff; color:#b91c1c; border-color:#f87171; padding:7px 11px; font-size:0.8rem; border-radius:6px; box-shadow:0 3px 10px rgba(0,0,0,0.2);">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>

        <!-- Card Editable Details Form -->
        <div style="padding:18px 20px 22px; flex:1; display:flex; flex-direction:column; gap:14px;">
          <div>
            <label style="display:block; font-size:0.78rem; font-weight:700; color:#555; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:5px;">Category Title</label>
            <input type="text" id="admin-corp-title-${escapeAttr(card.id)}" value="${escapeAttr(card.title)}" class="form-control" style="font-weight:700; color:#173b2c; font-family:var(--font-serif);" onchange="updateCorporateCardField('${escapeAttr(card.id)}', 'title', this.value)">
          </div>

          <div>
            <label style="display:block; font-size:0.78rem; font-weight:700; color:#555; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:5px;">Card Description</label>
            <textarea id="admin-corp-desc-${escapeAttr(card.id)}" rows="2" class="form-control" style="font-size:0.88rem; line-height:1.45;" onchange="updateCorporateCardField('${escapeAttr(card.id)}', 'description', this.value)">${escapeHtml(card.description)}</textarea>
          </div>

          <div>
            <label style="display:block; font-size:0.75rem; color:#777; margin-bottom:4px;">Photo File / URL</label>
            <div style="display:flex; gap:6px;">
              <input type="text" id="admin-corp-url-${escapeAttr(card.id)}" value="${escapeAttr(card.image || '')}" class="form-control" style="font-size:0.8rem;" placeholder="Image URL or upload a file above" onchange="updateCorporateCardPhotoUrl('${escapeAttr(card.id)}', this.value)">
              <button type="button" class="btn btn-sm btn-outline" onclick="saveSingleCorporateCard('${escapeAttr(card.id)}')" title="Save Card" style="padding:6px 12px; font-weight:600;">
                <i class="fa-solid fa-check"></i> Save
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
};

window.handleAdminCardPhotoUpload = function (cardId, inputEl) {
  if (!inputEl.files || !inputEl.files[0]) return;
  const file = inputEl.files[0];

  if (!file.type.startsWith('image/')) {
    alert('Please select a valid image file (JPG, PNG, WebP).');
    return;
  }

  const reader = new FileReader();
  reader.onload = async function (e) {
    const dataUrl = e.target.result;
    const card = adminCorporateCards.find(c => c.id === cardId);
    if (!card) return;

    card.image = dataUrl;

    // Immediately update UI preview
    const imgEl = document.getElementById('admin-corp-img-' + cardId);
    if (imgEl) imgEl.src = dataUrl;

    showAdminToast(`Uploading photo for "${card.title}"...`);

    // Save to server
    try {
      const res = await fetch(getApiUrl('/api/corporate-cards'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardId: card.id,
          image: dataUrl,
          title: card.title,
          description: card.description
        })
      });

      if (res.ok) {
        const result = await res.json();
        if (result.cards && Array.isArray(result.cards)) {
          adminCorporateCards = result.cards;
        }
        localStorage.setItem('verdanta_corporate_cards', JSON.stringify(adminCorporateCards));
        localStorage.setItem('verdanta_corp_trigger', String(Date.now()));
        localStorage.setItem('verdanta_sync_trigger', String(Date.now()));
        renderCorporateCardsAdmin();
        showAdminToast(`Photo successfully updated for "${card.title}"! Live storefront updated.`);
      } else {
        throw new Error('Server returned ' + res.status);
      }
    } catch (err) {
      console.warn('Error saving photo to server:', err);
      // Fallback local save
      localStorage.setItem('verdanta_corporate_cards', JSON.stringify(adminCorporateCards));
      localStorage.setItem('verdanta_corp_trigger', String(Date.now()));
      renderCorporateCardsAdmin();
      showAdminToast(`Photo saved locally for "${card.title}".`);
    }
  };
  reader.readAsDataURL(file);
};

window.handleAdminCardPhotoDelete = async function (cardId) {
  const card = adminCorporateCards.find(c => c.id === cardId);
  if (!card) return;

  if (!confirm(`Are you sure you want to delete/revert the photo for "${card.title}"?\n\nIt will revert to the default reference photo.`)) {
    return;
  }

  card.image = card.defaultImage || 'images/corporate-lifestyle.jpg';

  try {
    const res = await fetch(getApiUrl('/api/corporate-cards'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cardId: card.id,
        image: card.image,
        title: card.title,
        description: card.description
      })
    });
    if (res.ok) {
      const result = await res.json();
      if (result.cards && Array.isArray(result.cards)) {
        adminCorporateCards = result.cards;
      }
    }
  } catch (e) {
    console.warn('API error deleting photo:', e);
  }

  localStorage.setItem('verdanta_corporate_cards', JSON.stringify(adminCorporateCards));
  localStorage.setItem('verdanta_corp_trigger', String(Date.now()));
  localStorage.setItem('verdanta_sync_trigger', String(Date.now()));
  renderCorporateCardsAdmin();
  showAdminToast(`Photo deleted for "${card.title}". Reverted to reference photo.`);
};

window.resetAdminCardPhoto = async function (cardId) {
  const card = adminCorporateCards.find(c => c.id === cardId);
  if (!card) return;

  card.image = card.defaultImage || 'images/corporate-lifestyle.jpg';
  await saveSingleCorporateCard(cardId);
  showAdminToast(`Card #${card.order} reset to original reference photo.`);
};

window.updateCorporateCardField = function (cardId, field, value) {
  const card = adminCorporateCards.find(c => c.id === cardId);
  if (!card) return;
  card[field] = value.trim();
};

window.updateCorporateCardPhotoUrl = function (cardId, url) {
  const card = adminCorporateCards.find(c => c.id === cardId);
  if (!card) return;
  card.image = url.trim();
  const imgEl = document.getElementById('admin-corp-img-' + cardId);
  if (imgEl && card.image) imgEl.src = card.image;
};

window.saveSingleCorporateCard = async function (cardId) {
  const card = adminCorporateCards.find(c => c.id === cardId);
  if (!card) return;

  try {
    const res = await fetch(getApiUrl('/api/corporate-cards'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cardId: card.id,
        image: card.image,
        title: card.title,
        description: card.description
      })
    });
    if (res.ok) {
      const result = await res.json();
      if (result.cards) adminCorporateCards = result.cards;
    }
  } catch (err) {
    console.warn('Save error:', err);
  }

  localStorage.setItem('verdanta_corporate_cards', JSON.stringify(adminCorporateCards));
  localStorage.setItem('verdanta_corp_trigger', String(Date.now()));
  localStorage.setItem('verdanta_sync_trigger', String(Date.now()));
  renderCorporateCardsAdmin();
  showAdminToast(`Card "${card.title}" saved successfully!`);
};

window.saveAllCorporateCardsFromAdmin = async function () {
  try {
    const res = await fetch(getApiUrl('/api/corporate-cards'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(adminCorporateCards)
    });
    if (res.ok) {
      const result = await res.json();
      if (result.cards) adminCorporateCards = result.cards;
    }
  } catch (err) {
    console.warn('Error saving all corporate cards:', err);
  }

  localStorage.setItem('verdanta_corporate_cards', JSON.stringify(adminCorporateCards));
  localStorage.setItem('verdanta_corp_trigger', String(Date.now()));
  localStorage.setItem('verdanta_sync_trigger', String(Date.now()));
  renderCorporateCardsAdmin();
  showAdminToast('All 6 Corporate Gifting cards saved & synchronized with live store!');
};

// =============================================================================
// HERO BANNER MANAGEMENT (Dynamic Background, Eyebrow, Headings, Subtitle & Buttons)
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

let adminHeroData = (function () {
  try {
    const cached = localStorage.getItem('verdanta_hero_data');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && typeof parsed === 'object') return { ...DEFAULT_HERO_DATA, ...parsed };
    }
  } catch (e) {}
  return { ...DEFAULT_HERO_DATA };
})();

window.fetchHeroDataAdmin = async function () {
  try {
    const res = await fetch(getApiUrl('/api/hero'));
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data === 'object') {
        adminHeroData = { ...DEFAULT_HERO_DATA, ...data };
        try {
          localStorage.setItem('verdanta_hero_data', JSON.stringify(adminHeroData));
        } catch (e) {}
        renderHeroAdmin();
      }
    }
  } catch (err) {
    console.warn('Could not fetch hero data from server, using local/defaults:', err);
  }
};

window.renderHeroAdmin = function () {
  const hero = adminHeroData || DEFAULT_HERO_DATA;

  // 1. Populate Form Inputs
  const imgUrlInput = document.getElementById('adminHeroImageUrl');
  if (imgUrlInput && document.activeElement !== imgUrlInput) {
    imgUrlInput.value = hero.image || '';
  }

  const eyebrowInput = document.getElementById('adminHeroEyebrow');
  if (eyebrowInput && document.activeElement !== eyebrowInput) {
    eyebrowInput.value = hero.eyebrow || '';
  }

  const titleInput = document.getElementById('adminHeroTitle');
  if (titleInput && document.activeElement !== titleInput) {
    titleInput.value = hero.title || '';
  }

  const descInput = document.getElementById('adminHeroDesc');
  if (descInput && document.activeElement !== descInput) {
    descInput.value = hero.description || '';
  }

  const btn1TextInput = document.getElementById('adminHeroBtn1Text');
  if (btn1TextInput && document.activeElement !== btn1TextInput) {
    btn1TextInput.value = hero.primaryBtnText || '';
  }

  const btn1LinkInput = document.getElementById('adminHeroBtn1Link');
  if (btn1LinkInput && document.activeElement !== btn1LinkInput) {
    btn1LinkInput.value = hero.primaryBtnLink || '';
  }

  const btn2TextInput = document.getElementById('adminHeroBtn2Text');
  if (btn2TextInput && document.activeElement !== btn2TextInput) {
    btn2TextInput.value = hero.secondaryBtnText || '';
  }

  const btn2LinkInput = document.getElementById('adminHeroBtn2Link');
  if (btn2LinkInput && document.activeElement !== btn2LinkInput) {
    btn2LinkInput.value = hero.secondaryBtnLink || '';
  }

  // Update Photo Status Badge
  const badge = document.getElementById('adminHeroPhotoBadge');
  if (badge) {
    const isCustom = Boolean(hero.image && hero.image !== hero.defaultImage);
    badge.style.background = isCustom ? '#dcfce7' : '#fef3c7';
    badge.style.color = isCustom ? '#15803d' : '#b45309';
    badge.innerHTML = isCustom ? '<i class="fa-solid fa-check"></i> Custom Uploaded Photo' : '<i class="fa-solid fa-image"></i> Default Reference Photo';
  }

  // 2. Update Interactive Live Preview
  const previewBackdrop = document.getElementById('adminHeroPreviewBackdrop');
  if (previewBackdrop) {
    const bgUrl = hero.image || hero.defaultImage || 'images/hero.jpg';
    previewBackdrop.style.backgroundImage = `url("${escapeAttr(bgUrl)}")`;
  }

  const previewEyebrow = document.getElementById('adminHeroPreviewEyebrow');
  if (previewEyebrow) {
    previewEyebrow.textContent = hero.eyebrow || DEFAULT_HERO_DATA.eyebrow;
  }

  const previewTitle = document.getElementById('adminHeroPreviewTitle');
  if (previewTitle) {
    const rawTitle = hero.title || DEFAULT_HERO_DATA.title;
    previewTitle.innerHTML = escapeHtml(rawTitle).replace(/\n/g, '<br>');
  }

  const previewDesc = document.getElementById('adminHeroPreviewDesc');
  if (previewDesc) {
    previewDesc.textContent = hero.description || DEFAULT_HERO_DATA.description;
  }

  const previewBtn1 = document.getElementById('adminHeroPreviewBtn1');
  if (previewBtn1) {
    previewBtn1.textContent = hero.primaryBtnText || 'SHOP COLLECTIONS';
    previewBtn1.style.display = hero.primaryBtnText ? 'inline-flex' : 'none';
  }

  const previewBtn2 = document.getElementById('adminHeroPreviewBtn2');
  if (previewBtn2) {
    previewBtn2.textContent = hero.secondaryBtnText || 'REQUEST A PROPOSAL';
    previewBtn2.style.display = hero.secondaryBtnText ? 'inline-flex' : 'none';
  }
};

window.updateAdminHeroField = function (field, value) {
  if (!adminHeroData) adminHeroData = { ...DEFAULT_HERO_DATA };
  adminHeroData[field] = value;
  renderHeroAdmin();
};

window.handleAdminHeroPhotoUpload = function (fileInput) {
  if (!fileInput.files || !fileInput.files[0]) return;
  const file = fileInput.files[0];

  if (!file.type.startsWith('image/')) {
    alert('Please select a valid image file (JPG, PNG, WebP).');
    return;
  }

  if (file.size > 15 * 1024 * 1024) {
    alert('Image file is too large (max 15MB).');
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const base64Data = e.target.result;
    adminHeroData.image = base64Data;
    renderHeroAdmin();
    showAdminToast('New background photo loaded in preview. Click "Save Hero Changes" to publish live.');
  };
  reader.readAsDataURL(file);
};

window.resetAdminHeroPhoto = function () {
  if (!adminHeroData) adminHeroData = { ...DEFAULT_HERO_DATA };
  adminHeroData.image = adminHeroData.defaultImage || 'images/hero.jpg';
  const fileInput = document.getElementById('adminHeroFileInput');
  if (fileInput) fileInput.value = '';
  renderHeroAdmin();
  showAdminToast('Hero background reset to default reference photo.');
};

window.saveHeroFromAdmin = async function () {
  // Read current input values directly to guarantee capturing all latest changes
  const eyebrowEl = document.getElementById('adminHeroEyebrow');
  const titleEl = document.getElementById('adminHeroTitle');
  const descEl = document.getElementById('adminHeroDesc');
  const imgUrlEl = document.getElementById('adminHeroImageUrl');
  const btn1TextEl = document.getElementById('adminHeroBtn1Text');
  const btn1LinkEl = document.getElementById('adminHeroBtn1Link');
  const btn2TextEl = document.getElementById('adminHeroBtn2Text');
  const btn2LinkEl = document.getElementById('adminHeroBtn2Link');

  if (!adminHeroData) adminHeroData = { ...DEFAULT_HERO_DATA };

  if (eyebrowEl) adminHeroData.eyebrow = eyebrowEl.value.trim();
  if (titleEl) adminHeroData.title = titleEl.value;
  if (descEl) adminHeroData.description = descEl.value.trim();
  if (imgUrlEl && imgUrlEl.value.trim()) adminHeroData.image = imgUrlEl.value.trim();
  if (btn1TextEl) adminHeroData.primaryBtnText = btn1TextEl.value.trim();
  if (btn1LinkEl) adminHeroData.primaryBtnLink = btn1LinkEl.value.trim();
  if (btn2TextEl) adminHeroData.secondaryBtnText = btn2TextEl.value.trim();
  if (btn2LinkEl) adminHeroData.secondaryBtnLink = btn2LinkEl.value.trim();

  try {
    const res = await fetch(getApiUrl('/api/hero'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(adminHeroData)
    });
    if (res.ok) {
      const result = await res.json();
      if (result.hero) adminHeroData = result.hero;
    }
  } catch (err) {
    console.warn('Error saving hero to backend server:', err);
  }

  // Save to localStorage & notify other tabs
  localStorage.setItem('verdanta_hero_data', JSON.stringify(adminHeroData));
  localStorage.setItem('verdanta_hero_trigger', String(Date.now()));
  localStorage.setItem('verdanta_sync_trigger', String(Date.now()));

  // Broadcast to other open customer tabs
  try {
    const bc = new BroadcastChannel('verdanta_store_channel');
    bc.postMessage({ type: 'hero_updated', hero: adminHeroData, time: Date.now() });
    setTimeout(() => bc.close(), 100);
  } catch (e) {}

  renderHeroAdmin();
  showAdminToast('Homepage Hero Banner saved and published live to customer store!');
};

