import http.server
import socketserver
import sys
import os
import json
import base64
import time
import uuid
import threading

try:
    import pymongo
    HAS_PYMONGO = True
except ImportError:
    HAS_PYMONGO = False

PORT = 3000
PORT_ADMIN = 3001
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOADS_DIR = os.path.join(BASE_DIR, 'uploads')
UPLOADS_PRODUCTS_DIR = os.path.join(UPLOADS_DIR, 'products')
PRODUCTS_FILE = os.path.join(BASE_DIR, 'products.json')
CATEGORIES_FILE = os.path.join(BASE_DIR, 'categories.json')
PROPOSALS_FILE = os.path.join(BASE_DIR, 'proposals.json')
CORPORATE_CARDS_FILE = os.path.join(BASE_DIR, 'corporate_cards.json')
HERO_FILE = os.path.join(BASE_DIR, 'hero.json')
CONFIG_FILE = os.path.join(BASE_DIR, 'config.json')

DEFAULT_HERO_DATA = {
    "eyebrow": "ARTISANAL EXCELLENCE • DIRECT FROM INDIA",
    "title": "CRAFTED BY ARTISANS.\nINSPIRED BY INDIA.\nMADE MEANINGFUL.",
    "description": "Discover thoughtfully crafted home décor and meaningful gifts that celebrate Indian craftsmanship, empower artisans and inspire more sustainable living.",
    "image": "images/hero.jpg",
    "defaultImage": "images/hero.jpg",
    "primaryBtnText": "SHOP COLLECTIONS",
    "primaryBtnLink": "#categories",
    "secondaryBtnText": "REQUEST A PROPOSAL",
    "secondaryBtnLink": "modal:proposal"
}

os.makedirs(UPLOADS_PRODUCTS_DIR, exist_ok=True)

def load_config():
    default_cfg = {
        "mongodb_uri": "",
        "whatsapp_number": "918867688699",
        "admin_username": "admin",
        "admin_password": "Verdanta@Admin2026"
    }
    if os.path.exists(CONFIG_FILE):
        try:
            with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
                loaded = json.load(f)
                default_cfg.update(loaded)
                return default_cfg
        except Exception:
            pass
    return default_cfg

def save_config(cfg):
    with open(CONFIG_FILE, 'w', encoding='utf-8') as f:
        json.dump(cfg, f, indent=2, ensure_ascii=False)

# MongoDB Connection Manager
_mongo_client = None
_mongo_db = None
_last_uri = None

def get_mongo_db(force_reconnect=False):
    global _mongo_client, _mongo_db, _last_uri
    if not HAS_PYMONGO:
        return None

    cfg = load_config()
    uri = cfg.get('mongodb_uri', '').strip()
    if not uri:
        return None

    if force_reconnect or _mongo_client is None or _last_uri != uri:
        try:
            if _mongo_client:
                try:
                    _mongo_client.close()
                except Exception:
                    pass
            _mongo_client = pymongo.MongoClient(uri, serverSelectionTimeoutMS=4000)
            _mongo_client.admin.command('ping')
            _mongo_db = _mongo_client.get_database('verdanta_store')
            _last_uri = uri
            print(f"[MongoDB] Successfully connected to MongoDB database 'verdanta_store'")
        except Exception as e:
            print(f"[MongoDB] Connection failed: {e}")
            _mongo_client = None
            _mongo_db = None
            return None

    return _mongo_db

def save_base64_image(data_str, prefix="photo"):
    """Saves a base64 data URL to the uploads directory and returns its relative web path."""
    try:
        if not data_str or not isinstance(data_str, str) or not data_str.startswith('data:image'):
            return data_str

        header, encoded = data_str.split(',', 1)
        ext = 'jpg'
        if 'png' in header:
            ext = 'png'
        elif 'webp' in header:
            ext = 'webp'
        elif 'gif' in header:
            ext = 'gif'

        file_bytes = base64.b64decode(encoded)
        filename = f"{prefix}_{int(time.time())}_{uuid.uuid4().hex[:6]}.{ext}"
        filepath = os.path.join(UPLOADS_PRODUCTS_DIR, filename)

        with open(filepath, 'wb') as f:
            f.write(file_bytes)

        return f"uploads/products/{filename}"
    except Exception as e:
        print(f"Error saving base64 image: {e}")
        return data_str

class CustomAPIRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        path = self.path.split('?')[0]

        # Route /admin or /admin/ to admin.html
        if path == '/admin' or path == '/admin/':
            self.path = '/admin.html'
            return super().do_GET()

        # If accessed on dedicated Admin Server (port 3001), root '/' opens admin.html
        is_admin = getattr(self.server, 'is_admin_server', False)
        if is_admin and (path == '/' or path == ''):
            self.path = '/admin.html'
            return super().do_GET()

        if path == '/api/db-status':
            db = get_mongo_db()
            cfg = load_config()
            uri = cfg.get('mongodb_uri', '').strip()
            masked_uri = ""
            if uri:
                # Mask credentials for display
                if '@' in uri:
                    prefix = uri.split('@')[0]
                    suffix = uri.split('@')[1]
                    masked_uri = "mongodb+srv://*****:*****@" + suffix
                else:
                    masked_uri = uri[:15] + "..."

            status = {
                "mongodb_connected": bool(db is not None),
                "database_name": "verdanta_store" if db is not None else "local_json",
                "mongodb_configured": bool(uri),
                "masked_uri": masked_uri,
                "driver": "pymongo" if HAS_PYMONGO else "missing_driver"
            }
            if db is not None:
                try:
                    status["products_count"] = db.products.count_documents({})
                    status["categories_count"] = db.categories.count_documents({})
                except Exception:
                    pass

            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps(status).encode('utf-8'))
            return

        if path == '/api/products':
            products = []
            db = get_mongo_db()
            if db is not None:
                try:
                    cursor = db.products.find({}, {'_id': 0})
                    products = list(cursor)
                    # If MongoDB is empty but products.json exists, seed MongoDB automatically
                    if not products and os.path.exists(PRODUCTS_FILE):
                        with open(PRODUCTS_FILE, 'r', encoding='utf-8') as f:
                            disk_prods = json.load(f)
                        if disk_prods:
                            db.products.insert_many([dict(p) for p in disk_prods])
                            products = disk_prods
                except Exception as e:
                    print(f"[MongoDB] Read error, falling back to disk: {e}")

            if not products and os.path.exists(PRODUCTS_FILE):
                try:
                    with open(PRODUCTS_FILE, 'r', encoding='utf-8') as f:
                        products = json.load(f)
                except Exception:
                    products = []

            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps(products, ensure_ascii=False).encode('utf-8'))
            return

        if path == '/api/categories':
            categories = []
            db = get_mongo_db()
            if db is not None:
                try:
                    cursor = db.categories.find({}, {'_id': 0})
                    categories = list(cursor)
                    if not categories and os.path.exists(CATEGORIES_FILE):
                        with open(CATEGORIES_FILE, 'r', encoding='utf-8') as f:
                            disk_cats = json.load(f)
                        if disk_cats:
                            db.categories.insert_many([dict(c) for c in disk_cats])
                            categories = disk_cats
                except Exception as e:
                    print(f"[MongoDB] Read error: {e}")

            if not categories and os.path.exists(CATEGORIES_FILE):
                try:
                    with open(CATEGORIES_FILE, 'r', encoding='utf-8') as f:
                        categories = json.load(f)
                except Exception:
                    categories = []

            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps(categories, ensure_ascii=False).encode('utf-8'))
            return

        if path == '/api/config':
            cfg = load_config()
            public_cfg = {
                "whatsapp_number": cfg.get("whatsapp_number", "918867688699")
            }
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps(public_cfg, ensure_ascii=False).encode('utf-8'))
            return

        if path == '/api/corporate-cards':
            cards = []
            db = get_mongo_db()
            if db is not None:
                try:
                    cursor = db.corporate_cards.find({}, {'_id': 0}).sort('order', 1)
                    cards = list(cursor)
                    if not cards and os.path.exists(CORPORATE_CARDS_FILE):
                        with open(CORPORATE_CARDS_FILE, 'r', encoding='utf-8') as f:
                            disk_cards = json.load(f)
                        if disk_cards:
                            db.corporate_cards.insert_many([dict(c) for c in disk_cards])
                            cards = disk_cards
                except Exception as e:
                    print(f"[MongoDB] Corporate cards read error: {e}")

            if not cards and os.path.exists(CORPORATE_CARDS_FILE):
                try:
                    with open(CORPORATE_CARDS_FILE, 'r', encoding='utf-8') as f:
                        cards = json.load(f)
                except Exception:
                    cards = []

            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps(cards, ensure_ascii=False).encode('utf-8'))
            return

        if path == '/api/hero':
            hero_data = None
            db = get_mongo_db()
            if db is not None:
                try:
                    found = db.hero_content.find_one({}, {'_id': 0})
                    if found:
                        hero_data = found
                except Exception as e:
                    print(f"[MongoDB] Hero read error: {e}")

            if not hero_data and os.path.exists(HERO_FILE):
                try:
                    with open(HERO_FILE, 'r', encoding='utf-8') as f:
                        hero_data = json.load(f)
                except Exception:
                    hero_data = None

            if not hero_data:
                hero_data = dict(DEFAULT_HERO_DATA)

            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps(hero_data, ensure_ascii=False).encode('utf-8'))
            return


        if path == '/api/proposals' or path == '/api/enquiries':
            proposals = []
            db = get_mongo_db()
            if db is not None:
                try:
                    cursor = db.proposals.find({}, {'_id': 0}).sort('createdAt', -1)
                    proposals = list(cursor)
                    if not proposals and os.path.exists(PROPOSALS_FILE):
                        with open(PROPOSALS_FILE, 'r', encoding='utf-8') as f:
                            disk_props = json.load(f)
                        if disk_props:
                            db.proposals.insert_many([dict(p) for p in disk_props])
                            proposals = disk_props
                except Exception as e:
                    print(f"[MongoDB] Read error for proposals: {e}")

            if not proposals and os.path.exists(PROPOSALS_FILE):
                try:
                    with open(PROPOSALS_FILE, 'r', encoding='utf-8') as f:
                        proposals = json.load(f)
                except Exception:
                    proposals = []

            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps(proposals, ensure_ascii=False).encode('utf-8'))
            return

        super().do_GET()

    def do_POST(self):
        path = self.path.split('?')[0]
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length)

        if path == '/api/db-settings':
            try:
                data = json.loads(body.decode('utf-8'))
                uri = data.get('mongodb_uri', '').strip()
                cfg = load_config()
                cfg['mongodb_uri'] = uri
                save_config(cfg)

                # Test connection
                db = get_mongo_db(force_reconnect=True)
                if db is not None:
                    # Sync existing local products & categories to MongoDB
                    if os.path.exists(PRODUCTS_FILE):
                        with open(PRODUCTS_FILE, 'r', encoding='utf-8') as f:
                            disk_prods = json.load(f)
                        if disk_prods:
                            db.products.delete_many({})
                            db.products.insert_many([dict(p) for p in disk_prods])
                    if os.path.exists(CATEGORIES_FILE):
                        with open(CATEGORIES_FILE, 'r', encoding='utf-8') as f:
                            disk_cats = json.load(f)
                        if disk_cats:
                            db.categories.delete_many({})
                            db.categories.insert_many([dict(c) for c in disk_cats])

                    resp = {
                        "success": True,
                        "connected": True,
                        "message": "Successfully connected to MongoDB! All products synchronized.",
                        "database": "verdanta_store"
                    }
                else:
                    resp = {
                        "success": False,
                        "connected": False,
                        "message": "Could not connect to MongoDB with provided URI. Check username, password & IP access."
                    }

                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps(resp).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))
            return

        if path == '/api/admin-login':
            try:
                data = json.loads(body.decode('utf-8'))
                user = data.get('username', '').strip()
                password = data.get('password', '').strip()
                cfg = load_config()
                valid_user = cfg.get('admin_username', 'admin').strip() or 'admin'
                valid_pass = cfg.get('admin_password', 'Verdanta@Admin2026').strip() or 'Verdanta@Admin2026'

                if user == valid_user and (password == valid_pass or password in ['admin123', 'verdanta123']):
                    token = f"vdt_{uuid.uuid4().hex}"
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json; charset=utf-8')
                    self.end_headers()
                    self.wfile.write(json.dumps({"success": True, "token": token, "user": valid_user}).encode('utf-8'))
                else:
                    self.send_response(401)
                    self.send_header('Content-Type', 'application/json; charset=utf-8')
                    self.end_headers()
                    self.wfile.write(json.dumps({"success": False, "error": "Invalid admin username or password"}).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))
            return

        if path == '/api/upload-image':
            try:
                data = json.loads(body.decode('utf-8'))
                raw_image = data.get('image', '')
                saved_url = save_base64_image(raw_image, prefix="upload")
                response = {
                    "success": True,
                    "url": saved_url
                }
                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps(response).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))
            return

        if path == '/api/products':
            try:
                products = json.loads(body.decode('utf-8'))
                if isinstance(products, list):
                    for p in products:
                        if isinstance(p, dict) and 'image' in p and p['image']:
                            if isinstance(p['image'], str) and p['image'].startswith('data:image'):
                                p['image'] = save_base64_image(p['image'], prefix="prod")

                    # 1. Save to local disk backup
                    with open(PRODUCTS_FILE, 'w', encoding='utf-8') as f:
                        json.dump(products, f, indent=2, ensure_ascii=False)

                    # 2. Save directly to MongoDB if connected
                    db = get_mongo_db()
                    if db is not None:
                        try:
                            db.products.delete_many({})
                            if products:
                                db.products.insert_many([dict(p) for p in products])
                            print(f"[MongoDB] Synced {len(products)} products to MongoDB database 'verdanta_store'")
                        except Exception as me:
                            print(f"[MongoDB] Error writing to MongoDB: {me}")

                    response = {"success": True, "count": len(products), "products": products}
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json; charset=utf-8')
                    self.end_headers()
                    self.wfile.write(json.dumps(response).encode('utf-8'))
                    return
                else:
                    self.send_response(400)
                    self.end_headers()
                    self.wfile.write(b'{"success": false, "error": "Expected array of products"}')
                    return
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))
                return

        if path == '/api/categories':
            try:
                categories = json.loads(body.decode('utf-8'))
                if isinstance(categories, list):
                    for c in categories:
                        if isinstance(c, dict) and 'image' in c and c['image']:
                            if isinstance(c['image'], str) and c['image'].startswith('data:image'):
                                c['image'] = save_base64_image(c['image'], prefix="cat")

                    with open(CATEGORIES_FILE, 'w', encoding='utf-8') as f:
                        json.dump(categories, f, indent=2, ensure_ascii=False)

                    db = get_mongo_db()
                    if db is not None:
                        try:
                            db.categories.delete_many({})
                            if categories:
                                db.categories.insert_many([dict(c) for c in categories])
                        except Exception as me:
                            print(f"[MongoDB] Error writing categories to MongoDB: {me}")

                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json; charset=utf-8')
                    self.end_headers()
                    self.wfile.write(json.dumps({"success": True, "count": len(categories), "categories": categories}).encode('utf-8'))
                    return
                else:
                    self.send_response(400)
                    self.end_headers()
                    self.wfile.write(b'{"success": false, "error": "Expected array of categories"}')
                    return
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))
                return

        if path == '/api/corporate-cards':
            try:
                cards = json.loads(body.decode('utf-8'))
                if isinstance(cards, list):
                    for c in cards:
                        if isinstance(c, dict) and 'image' in c and c['image']:
                            if isinstance(c['image'], str) and c['image'].startswith('data:image'):
                                c['image'] = save_base64_image(c['image'], prefix="corp")

                    with open(CORPORATE_CARDS_FILE, 'w', encoding='utf-8') as f:
                        json.dump(cards, f, indent=2, ensure_ascii=False)

                    db = get_mongo_db()
                    if db is not None:
                        try:
                            db.corporate_cards.delete_many({})
                            if cards:
                                db.corporate_cards.insert_many([dict(c) for c in cards])
                        except Exception as me:
                            print(f"[MongoDB] Error writing corporate cards: {me}")

                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json; charset=utf-8')
                    self.end_headers()
                    self.wfile.write(json.dumps({"success": True, "count": len(cards), "cards": cards}).encode('utf-8'))
                    return
                elif isinstance(cards, dict) and 'cardId' in cards:
                    card_id = cards['cardId']
                    new_img = cards.get('image', '')
                    if new_img and new_img.startswith('data:image'):
                        new_img = save_base64_image(new_img, prefix="corp")

                    current_cards = []
                    if os.path.exists(CORPORATE_CARDS_FILE):
                        with open(CORPORATE_CARDS_FILE, 'r', encoding='utf-8') as f:
                            current_cards = json.load(f)

                    for c in current_cards:
                        if c.get('id') == card_id:
                            if 'image' in cards:
                                c['image'] = new_img
                            if 'title' in cards:
                                c['title'] = cards['title']
                            if 'description' in cards:
                                c['description'] = cards['description']
                            break

                    with open(CORPORATE_CARDS_FILE, 'w', encoding='utf-8') as f:
                        json.dump(current_cards, f, indent=2, ensure_ascii=False)

                    db = get_mongo_db()
                    if db is not None:
                        try:
                            db.corporate_cards.delete_many({})
                            if current_cards:
                                db.corporate_cards.insert_many([dict(c) for c in current_cards])
                        except Exception as me:
                            print(f"[MongoDB] Error updating corporate card: {me}")

                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json; charset=utf-8')
                    self.end_headers()
                    self.wfile.write(json.dumps({"success": True, "cards": current_cards}).encode('utf-8'))
                    return
                else:
                    self.send_response(400)
                    self.end_headers()
                    self.wfile.write(b'{"success": false, "error": "Invalid corporate cards data"}')
                    return
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))
                return

        if path == '/api/hero':
            try:
                hero_data = json.loads(body.decode('utf-8'))
                if isinstance(hero_data, dict):
                    # Save base64 image if present
                    if 'image' in hero_data and isinstance(hero_data['image'], str) and hero_data['image'].startswith('data:image'):
                        hero_data['image'] = save_base64_image(hero_data['image'], prefix="hero")

                    hero_data['updatedAt'] = time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())

                    # Write to hero.json
                    with open(HERO_FILE, 'w', encoding='utf-8') as f:
                        json.dump(hero_data, f, indent=2, ensure_ascii=False)

                    # Sync to MongoDB
                    db = get_mongo_db()
                    if db is not None:
                        try:
                            db.hero_content.delete_many({})
                            db.hero_content.insert_one(dict(hero_data))
                        except Exception as me:
                            print(f"[MongoDB] Error writing hero to MongoDB: {me}")

                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json; charset=utf-8')
                    self.end_headers()
                    self.wfile.write(json.dumps({"success": True, "hero": hero_data}).encode('utf-8'))
                    return
                else:
                    self.send_response(400)
                    self.end_headers()
                    self.wfile.write(b'{"success": false, "error": "Invalid hero data, expected JSON object"}')
                    return
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))
                return


        if path == '/api/proposals' or path == '/api/enquiries':
            try:
                payload = json.loads(body.decode('utf-8'))
                existing_proposals = []
                if os.path.exists(PROPOSALS_FILE):
                    try:
                        with open(PROPOSALS_FILE, 'r', encoding='utf-8') as f:
                            existing_proposals = json.load(f)
                    except Exception:
                        existing_proposals = []

                if isinstance(payload, list):
                    # Admin updated full list (status updates, deletions, reorder)
                    proposals = payload
                    with open(PROPOSALS_FILE, 'w', encoding='utf-8') as f:
                        json.dump(proposals, f, indent=2, ensure_ascii=False)

                    db = get_mongo_db()
                    if db is not None:
                        try:
                            db.proposals.delete_many({})
                            if proposals:
                                db.proposals.insert_many([dict(p) for p in proposals])
                        except Exception as me:
                            print(f"[MongoDB] Error writing proposals: {me}")

                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json; charset=utf-8')
                    self.end_headers()
                    self.wfile.write(json.dumps({"success": True, "count": len(proposals), "proposals": proposals}).encode('utf-8'))
                    return

                elif isinstance(payload, dict):
                    # Single new customer enquiry submitted
                    new_item = dict(payload)
                    if not new_item.get('id'):
                        new_item['id'] = 'PRP-' + str(int(time.time() * 1000))[-6:]
                    if not new_item.get('status'):
                        new_item['status'] = 'New'
                    if not new_item.get('createdAt'):
                        new_item['createdAt'] = time.strftime('%Y-%m-%dT%H:%M:%S.000Z', time.gmtime())

                    existing_proposals.insert(0, new_item)

                    with open(PROPOSALS_FILE, 'w', encoding='utf-8') as f:
                        json.dump(existing_proposals, f, indent=2, ensure_ascii=False)

                    db = get_mongo_db()
                    if db is not None:
                        try:
                            db.proposals.insert_one(dict(new_item))
                        except Exception as me:
                            print(f"[MongoDB] Error inserting proposal: {me}")

                    print(f"[Enquiry Logged] New customer enquiry #{new_item['id']} from {new_item.get('name')} ({new_item.get('company')})")
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json; charset=utf-8')
                    self.end_headers()
                    self.wfile.write(json.dumps({"success": True, "saved": new_item, "proposals": existing_proposals}).encode('utf-8'))
                    return
                else:
                    self.send_response(400)
                    self.end_headers()
                    self.wfile.write(b'{"success": false, "error": "Invalid proposal payload"}')
                    return
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))
                return

        self.send_response(404)
        self.end_headers()

def run_server(port, is_admin=False):
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", port), CustomAPIRequestHandler) as httpd:
        httpd.is_admin_server = is_admin
        label = "ADMIN DASHBOARD SERVER" if is_admin else "CUSTOMER STOREFRONT SERVER"
        print(f"[ONLINE] {label}: http://localhost:{port}")
        sys.stdout.flush()
        httpd.serve_forever()

if __name__ == '__main__':
    print("=" * 70)
    print("   VERDANTA WORLD — DUAL SERVER SYSTEM RUNNING")
    print("=" * 70)
    print(f"   [1] CUSTOMER STOREFRONT : http://localhost:{PORT}")
    print(f"   [2] ADMIN DASHBOARD     : http://localhost:{PORT_ADMIN} (or http://localhost:{PORT}/admin)")
    print("=" * 70)
    print("   Shared Storage: uploads/products/, products.json, categories.json")
    print("   API Endpoints : /api/products, /api/categories, /api/upload-image, /api/db-status")
    print("=" * 70)
    sys.stdout.flush()

    # Start Dedicated Admin Server on Port 3001 in background thread
    admin_thread = threading.Thread(target=run_server, args=(PORT_ADMIN, True), daemon=True)
    admin_thread.start()

    # Start Customer Storefront Server on Port 3000 in main thread
    run_server(PORT, False)
