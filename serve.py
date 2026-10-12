import http.server
import socketserver
import sys
import os
import json
import base64
import time
import uuid

try:
    import pymongo
    HAS_PYMONGO = True
except ImportError:
    HAS_PYMONGO = False

PORT = 3000
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOADS_DIR = os.path.join(BASE_DIR, 'uploads')
UPLOADS_PRODUCTS_DIR = os.path.join(UPLOADS_DIR, 'products')
PRODUCTS_FILE = os.path.join(BASE_DIR, 'products.json')
CATEGORIES_FILE = os.path.join(BASE_DIR, 'categories.json')
CONFIG_FILE = os.path.join(BASE_DIR, 'config.json')

os.makedirs(UPLOADS_PRODUCTS_DIR, exist_ok=True)

def load_config():
    if os.path.exists(CONFIG_FILE):
        try:
            with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            pass
    return {"mongodb_uri": ""}

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
                self.wfile.write(json.dumps({"success": True}).encode('utf-8'))
                return
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))
                return

        self.send_response(404)
        self.end_headers()

if __name__ == '__main__':
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), CustomAPIRequestHandler) as httpd:
        print(f"VERDANTA Storefront Server running at http://localhost:{PORT}")
        print(f"Serving files from {BASE_DIR}")
        print("API endpoints: /api/products, /api/categories, /api/upload-image, /api/db-status, /api/db-settings")
        sys.stdout.flush()
        httpd.serve_forever()
