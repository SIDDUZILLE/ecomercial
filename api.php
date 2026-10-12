<?php
/**
 * VERDANTA WORLD - HOSTINGER PHP API BACKEND
 * Handles persistent storage for products.json, categories.json, and uploads/products/
 */

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Cache-Control: no-cache, no-store, must-revalidate");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$baseDir = __DIR__;
$uploadsDir = $baseDir . '/uploads/products';
$productsFile = $baseDir . '/products.json';
$categoriesFile = $baseDir . '/categories.json';

if (!file_exists($uploadsDir)) {
    mkdir($uploadsDir, 0755, true);
}

// Route extraction: from query param ?action=... or REQUEST_URI
$action = isset($_GET['action']) ? $_GET['action'] : '';
if (!$action) {
    $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    if (strpos($uri, 'upload-image') !== false) $action = 'upload-image';
    else if (strpos($uri, 'products') !== false) $action = 'products';
    else if (strpos($uri, 'categories') !== false) $action = 'categories';
    else if (strpos($uri, 'status') !== false) $action = 'status';
}

$method = $_SERVER['REQUEST_METHOD'];

if ($action === 'status') {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'status' => 'online',
        'backend' => 'Hostinger PHP',
        'storage' => 'uploads/products/'
    ]);
    exit();
}

if ($action === 'products') {
    header('Content-Type: application/json; charset=utf-8');
    if ($method === 'GET') {
        if (file_exists($productsFile)) {
            readfile($productsFile);
        } else {
            echo '[]';
        }
        exit();
    } else if ($method === 'POST') {
        $raw = file_get_contents('php://input');
        $data = json_decode($raw, true);
        if (is_array($data)) {
            // Check for any inline base64 images and save to disk
            foreach ($data as &$item) {
                if (isset($item['image']) && strpos($item['image'], 'data:image') === 0) {
                    $item['image'] = save_base64_php($item['image'], $uploadsDir);
                }
            }
            file_put_contents($productsFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            echo json_encode(['success' => true, 'count' => count($data), 'products' => $data]);
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Invalid JSON']);
        }
        exit();
    }
}

if ($action === 'categories') {
    header('Content-Type: application/json; charset=utf-8');
    if ($method === 'GET') {
        if (file_exists($categoriesFile)) {
            readfile($categoriesFile);
        } else {
            echo '[]';
        }
        exit();
    } else if ($method === 'POST') {
        $raw = file_get_contents('php://input');
        file_put_contents($categoriesFile, $raw);
        echo json_encode(['success' => true]);
        exit();
    }
}

if ($action === 'upload-image' && $method === 'POST') {
    header('Content-Type: application/json; charset=utf-8');
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    $imgData = isset($data['image']) ? $data['image'] : '';

    if ($imgData && strpos($imgData, 'data:image') === 0) {
        $savedPath = save_base64_php($imgData, $uploadsDir);
        echo json_encode(['success' => true, 'url' => $savedPath]);
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'No image data provided']);
    }
    exit();
}

function save_base64_php($dataStr, $destDir) {
    list($header, $encoded) = explode(',', $dataStr, 2);
    $ext = 'jpg';
    if (strpos($header, 'png') !== false) $ext = 'png';
    else if (strpos($header, 'webp') !== false) $ext = 'webp';

    $filename = 'photo_' . time() . '_' . substr(md5(uniqid()), 0, 6) . '.' . $ext;
    $filePath = $destDir . '/' . $filename;
    file_put_contents($filePath, base64_decode($encoded));
    return 'uploads/products/' . $filename;
}

http_response_code(404);
echo json_encode(['error' => 'Endpoint not found']);
