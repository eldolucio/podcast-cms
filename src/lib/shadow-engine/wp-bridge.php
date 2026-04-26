<?php
/**
 * Shadow Engine Bridge
 * Recebe comandos JSON do Next.js e renderiza o conteúdo do WordPress (shortcodes, hooks)
 * capturando os assets injetados pelos plugins.
 */

// Permite requisições do Next.js local
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Inicializa o ambiente WordPress silenciosamente
define('WP_USE_THEMES', false);
require_once __DIR__ . '/wp-load.php';

// Handle GET requests for Auto-Login and IFrame Rendering
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['action']) && $_GET['action'] === 'login_and_redirect') {
        $redirect_to = $_GET['redirect_to'] ?? '/wp-admin/';
        // Auto-login ID 1 (Admin)
        wp_set_current_user(1);
        wp_set_auth_cookie(1);
        wp_redirect($redirect_to);
        exit;
    }
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['action'])) {
    echo json_encode(['error' => 'Invalid payload. "action" is required.']);
    exit;
}

$action = $input['action'];
$response = [
    'html' => '',
    'css' => [],
    'js' => []
];

// Captura de Output e Assets
ob_start();

// Dispara wp_head para plugins que enfileiram coisas antes do conteúdo
wp_head();
$head_content = ob_get_clean();

ob_start();

if ($action === 'render_shortcode') {
    $shortcode = $input['shortcode'] ?? '';
    echo do_shortcode($shortcode);
} elseif ($action === 'do_action') {
    $hook = $input['hook'] ?? '';
    $args = $input['args'] ?? [];
    do_action_ref_array($hook, $args);
} elseif ($action === 'activate_plugin') {
    require_once ABSPATH . 'wp-admin/includes/plugin.php';
    $plugin = $input['plugin'] ?? '';
    if ($plugin) {
        $result = activate_plugin($plugin);
        if (is_wp_error($result)) {
            echo json_encode(['error' => $result->get_error_message()]);
        } else {
            echo json_encode(['success' => true, 'message' => "Plugin $plugin activated."]);
        }
    }
    exit;
} elseif ($action === 'deactivate_plugin') {
    require_once ABSPATH . 'wp-admin/includes/plugin.php';
    $plugin = $input['plugin'] ?? '';
    if ($plugin) {
        deactivate_plugins($plugin);
        echo json_encode(['success' => true, 'message' => "Plugin $plugin deactivated."]);
    }
    exit;
} elseif ($action === 'uninstall_plugin') {
    require_once ABSPATH . 'wp-admin/includes/plugin.php';
    $plugin = $input['plugin'] ?? '';
    if ($plugin) {
        uninstall_plugin($plugin);
        echo json_encode(['success' => true, 'message' => "Plugin $plugin uninstalled from DB."]);
    }
    exit;
} elseif ($action === 'activate_theme') {
    require_once ABSPATH . 'wp-admin/includes/theme.php';
    $theme = $input['theme'] ?? '';
    if ($theme) {
        switch_theme($theme);
        echo json_encode(['success' => true, 'message' => "Theme $theme activated."]);
    }
    exit;
} elseif ($action === 'list_extensions') {
    require_once ABSPATH . 'wp-admin/includes/plugin.php';
    $plugins = get_plugins();
    $active_plugins = get_option('active_plugins', []);
    
    $themes = wp_get_themes();
    $active_theme = wp_get_theme();
    
    $ext_plugins = [];
    foreach ($plugins as $path => $data) {
        $ext_plugins[] = [
            'name' => $data['Name'],
            'version' => $data['Version'],
            'path' => $path,
            'active' => in_array($path, $active_plugins)
        ];
    }
    
    $ext_themes = [];
    foreach ($themes as $slug => $theme_obj) {
        $ext_themes[] = [
            'name' => $theme_obj->get('Name'),
            'version' => $theme_obj->get('Version'),
            'slug' => $slug,
            'active' => ($slug === $active_theme->get_stylesheet() || $slug === $active_theme->get_template())
        ];
    }
    
    echo json_encode([
        'plugins' => $ext_plugins,
        'themes' => $ext_themes
    ]);
    exit;
} elseif ($action === 'verify_login') {
    $username = $input['username'] ?? '';
    $password = $input['password'] ?? '';
    
    $user = wp_authenticate($username, $password);
    if (is_wp_error($user)) {
        echo json_encode(['success' => false, 'error' => 'Credenciais inválidas.']);
    } else {
        echo json_encode(['success' => true, 'user_id' => $user->ID]);
    }
    exit;
} else {
    echo json_encode(['error' => "Unknown action: " . esc_html($action)]);
    exit;
}

$body_content = ob_get_clean();

ob_start();
// Dispara wp_footer para capturar scripts de rodapé
wp_footer();
$footer_content = ob_get_clean();

// Função para extrair tags <link> e <style>
function extract_css($html) {
    $css = [];
    preg_match_all('/<link[^>]+rel=[\'"]stylesheet[\'"][^>]*>/i', $html, $matches);
    if (!empty($matches[0])) {
        $css = array_merge($css, $matches[0]);
    }
    preg_match_all('/<style[^>]*>.*?<\/style>/is', $html, $matches);
    if (!empty($matches[0])) {
        $css = array_merge($css, $matches[0]);
    }
    return $css;
}

// Função para extrair tags <script>
function extract_js($html) {
    $js = [];
    preg_match_all('/<script[^>]*>.*?<\/script>/is', $html, $matches);
    if (!empty($matches[0])) {
        $js = array_merge($js, $matches[0]);
    }
    return $js;
}

// Junta tudo
$full_assets = $head_content . "\n" . $footer_content;

$response['html'] = $body_content;
$response['css'] = extract_css($full_assets);
$response['js'] = extract_js($full_assets);

echo json_encode($response);
