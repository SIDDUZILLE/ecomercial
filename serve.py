import http.server
import socketserver
import sys
import os
import json
import base64
import time
import uuid

PORT = 3000
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOADS_DIR = os.path.join(BASE_DIR, 'uploads')
PRODUCTS_FILE = os.path.join(BASE_DIR, 'products.json')
CATEGORIES_FILE = os.path.join(BASE_DIR, 'categories.json')

if not os.path.exists(UPLOADS_DIR):
    os.makedirs(UPLOADS_DIR, exist_ok=True)

def save_base64_image(data_str, prefix="photo"):
    """Saves a base64 data URL to the uploads directory and returns its relative web path."""
    try:
        if not data_str or not isinstance(data_str, str) or not data_str.startswith('data:image'):
            return data_str

        # Format: data:image/png;base64,...
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
        filepath = os.path.join(UPLOADS_DIR, filename)

        with open(filepath, 'wb') as f:
            f.write(file_bytes)

        return f"uploads/{filename}"
    except Exception as e:
        print(f"Error saving base64 image: {e}")
        return data_str

class CustomAPIRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def end_headers(self):
        # Universal CORS headers so client works from localhost or file://
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
        # Prevent aggressive browser caching during live development
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        path = self.path.split('?')[0]

        if path == '/api/products':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            if os.path.exists(PRODUCTS_FILE):
                with open(PRODUCTS_FILE, 'r', encoding='utf-8') as f:
                    self.wfile.write(f.read().encode('utf-8'))
            else:
                self.wfile.write(b'[]')
            return

        if path == '/api/categories':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            if os.path.exists(CATEGORIES_FILE):
                with open(CATEGORIES_FILE, 'r', encoding='utf-8') as f:
                    self.wfile.write(f.read().encode('utf-8'))
            else:
                self.wfile.write(b'[]')
            return

        # Fallback to standard static file server
        super().do_GET()

    def do_POST(self):
        path = self.path.split('?')[0]
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length)

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
                    # Automatically extract and save any embedded base64 images as disk files
                    for p in products:
                        if isinstance(p, dict) and 'image' in p and p['image']:
                            if isinstance(p['image'], str) and p['image'].startswith('data:image'):
                                p['image'] = save_base64_image(p['image'], prefix="prod")

                    with open(PRODUCTS_FILE, 'w', encoding='utf-8') as f:
                        json.dump(products, f, indent=2, ensure_ascii=False)

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
        print("API endpoints: /api/products, /api/categories, /api/upload-image")
        sys.stdout.flush()
        httpd.serve_forever()
