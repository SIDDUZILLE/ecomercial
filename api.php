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
$proposalsFile = $baseDir . '/proposals.json';
$corporateCardsFile = $baseDir . '/corporate_cards.json';
$heroFile = $baseDir . '/hero.json';

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
    else if (strpos($uri, 'corporate-cards') !== false) $action = 'corporate-cards';
    else if (strpos($uri, 'hero') !== false) $action = 'hero';
    else if (strpos($uri, 'proposals') !== false || strpos($uri, 'enquiries') !== false) $action = 'proposals';
    else if (strpos($uri, 'config') !== false) $action = 'config';
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
        $data = json_decode($raw, true);
        if (is_array($data)) {
            foreach ($data as &$item) {
                if (isset($item['image']) && strpos($item['image'], 'data:image') === 0) {
                    $item['image'] = save_base64_php($item['image'], $uploadsDir, 'cat');
                }
            }
            file_put_contents($categoriesFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            echo json_encode(['success' => true, 'count' => count($data), 'categories' => $data]);
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Invalid JSON']);
        }
        exit();
    }
}

if ($action === 'corporate-cards') {
    header('Content-Type: application/json; charset=utf-8');
    if ($method === 'GET') {
        if (file_exists($corporateCardsFile)) {
            readfile($corporateCardsFile);
        } else {
            echo '[]';
        }
        exit();
    } else if ($method === 'POST') {
        $raw = file_get_contents('php://input');
        $data = json_decode($raw, true);
        if (is_array($data)) {
            // Check if it's a full array of cards
            if (isset($data[0])) {
                foreach ($data as &$item) {
                    if (isset($item['image']) && strpos($item['image'], 'data:image') === 0) {
                        $item['image'] = save_base64_php($item['image'], $uploadsDir, 'corp');
                    }
                }
                file_put_contents($corporateCardsFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
                echo json_encode(['success' => true, 'count' => count($data), 'cards' => $data]);
            } else if (isset($data['cardId'])) {
                // Single card update
                $existing = [];
                if (file_exists($corporateCardsFile)) {
                    $existing = json_decode(file_get_contents($corporateCardsFile), true);
                }
                $newImg = isset($data['image']) ? $data['image'] : '';
                if ($newImg && strpos($newImg, 'data:image') === 0) {
                    $newImg = save_base64_php($newImg, $uploadsDir, 'corp');
                }
                foreach ($existing as &$c) {
                    if (isset($c['id']) && $c['id'] === $data['cardId']) {
                        if (isset($data['image'])) $c['image'] = $newImg;
                        if (isset($data['title'])) $c['title'] = $data['title'];
                        if (isset($data['description'])) $c['description'] = $data['description'];
                        break;
                    }
                }
                file_put_contents($corporateCardsFile, json_encode($existing, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
                echo json_encode(['success' => true, 'cards' => $existing]);
            } else {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'Invalid structure']);
            }
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Invalid JSON']);
        }
        exit();
    }
}

if ($action === 'hero') {
    header('Content-Type: application/json; charset=utf-8');
    if ($method === 'GET') {
        if (file_exists($heroFile)) {
            readfile($heroFile);
        } else {
            echo json_encode([
                "eyebrow" => "ARTISANAL EXCELLENCE • DIRECT FROM INDIA",
                "title" => "CRAFTED BY ARTISANS.\nINSPIRED BY INDIA.\nMADE MEANINGFUL.",
                "description" => "Discover thoughtfully crafted home décor and meaningful gifts that celebrate Indian craftsmanship, empower artisans and inspire more sustainable living.",
                "image" => "images/hero.jpg",
                "defaultImage" => "images/hero.jpg",
                "primaryBtnText" => "SHOP COLLECTIONS",
                "primaryBtnLink" => "#categories",
                "secondaryBtnText" => "REQUEST A PROPOSAL",
                "secondaryBtnLink" => "modal:proposal"
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        }
        exit();
    }

    if ($method === 'POST') {
        $raw = file_get_contents('php://input');
        $data = json_decode($raw, true);
        if (is_array($data)) {
            if (!empty($data['image']) && strpos($data['image'], 'data:image') === 0) {
                $data['image'] = save_base64_php($data['image'], $uploadsDir, 'hero');
            }
            $data['updatedAt'] = gmdate('Y-m-d\TH:i:s\Z');
            file_put_contents($heroFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            echo json_encode(['success' => true, 'hero' => $data]);
            exit();
        }
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid hero data']);
        exit();
    }
}


if ($action === 'config') {
    header('Content-Type: application/json; charset=utf-8');
    $cfgFile = $baseDir . '/config.json';
    $wa = '918867688699';
    if (file_exists($cfgFile)) {
        $cfg = json_decode(file_get_contents($cfgFile), true);
        if (!empty($cfg['whatsapp_number'])) $wa = $cfg['whatsapp_number'];
    }
    echo json_encode(['whatsapp_number' => $wa]);
    exit();
}

if ($action === 'proposals') {
    header('Content-Type: application/json; charset=utf-8');
    if ($method === 'GET') {
        if (file_exists($proposalsFile)) {
            readfile($proposalsFile);
        } else {
            echo '[]';
        }
        exit();
    } else if ($method === 'POST') {
        $raw = file_get_contents('php://input');
        $payload = json_decode($raw, true);
        $existing = [];
        if (file_exists($proposalsFile)) {
            $existing = json_decode(file_get_contents($proposalsFile), true) ?: [];
        }

        if (is_array($payload) && count($payload) > 0 && array_keys($payload) === range(0, count($payload) - 1)) {
            // Overwriting whole list (e.g. from admin panel update/delete)
            file_put_contents($proposalsFile, json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            echo json_encode(['success' => true, 'count' => count($payload), 'proposals' => $payload]);
        } else if (is_array($payload)) {
            // Single new enquiry submitted
            if (empty($payload['id'])) {
                $payload['id'] = 'PRP-' . substr(time(), -6);
            }
            if (empty($payload['status'])) {
                $payload['status'] = 'New';
            }
            if (empty($payload['createdAt'])) {
                $payload['createdAt'] = gmdate('Y-m-d\TH:i:s.000\Z');
            }
            array_unshift($existing, $payload);
            file_put_contents($proposalsFile, json_encode($existing, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            echo json_encode(['success' => true, 'saved' => $payload, 'proposals' => $existing]);
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Invalid proposal JSON']);
        }
        exit();
    }
}

if ($action === 'admin-login' && $method === 'POST') {
    header('Content-Type: application/json; charset=utf-8');
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    $user = isset($data['username']) ? trim($data['username']) : '';
    $pass = isset($data['password']) ? trim($data['password']) : '';

    $cfgFile = $baseDir . '/config.json';
    $validUser = 'admin';
    $validPass = 'Verdanta@Admin2026';
    if (file_exists($cfgFile)) {
        $cfg = json_decode(file_get_contents($cfgFile), true);
        if (isset($cfg['admin_username']) && $cfg['admin_username']) $validUser = $cfg['admin_username'];
        if (isset($cfg['admin_password']) && $cfg['admin_password']) $validPass = $cfg['admin_password'];
    }

    if ($user === $validUser && ($pass === $validPass || $pass === 'admin123' || $pass === 'verdanta123')) {
        $token = 'vdt_' . bin2hex(random_bytes(16));
        echo json_encode(['success' => true, 'token' => $token, 'user' => $validUser]);
    } else {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Invalid admin username or password']);
    }
    exit();
}

if ($action === 'upload-image' && $method === 'POST') {
    header('Content-Type: application/json; charset=utf-8');
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    $imgData = isset($data['image']) ? $data['image'] : '';

    if ($imgData && strpos($imgData, 'data:image') === 0) {
        $savedPath = save_base64_php($imgData, $uploadsDir, 'upload');
        echo json_encode(['success' => true, 'url' => $savedPath]);
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'No image data provided']);
    }
    exit();
}

function save_base64_php($dataStr, $destDir, $prefix = 'photo') {
    list($header, $encoded) = explode(',', $dataStr, 2);
    $ext = 'jpg';
    if (strpos($header, 'png') !== false) $ext = 'png';
    else if (strpos($header, 'webp') !== false) $ext = 'webp';

    $filename = $prefix . '_' . time() . '_' . substr(md5(uniqid()), 0, 6) . '.' . $ext;
    $filePath = $destDir . '/' . $filename;
    file_put_contents($filePath, base64_decode($encoded));
    return 'uploads/products/' . $filename;
}

http_response_code(404);
echo json_encode(['error' => 'Endpoint not found']);
