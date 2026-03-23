<?php
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate');

$env = [];
$envFile = __DIR__ . '/.env';
if (file_exists($envFile)) {
    foreach (file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        $line = trim($line);
        if ($line === '' || $line[0] === '#') continue;
        $pos = strpos($line, '=');
        if ($pos === false) continue;
        $env[trim(substr($line, 0, $pos))] = trim(substr($line, $pos + 1));
    }
}

$tg_bot_token = $env['TG_MEDIA_BOT_TOKEN'] ?? '';
$chat_id      = $env['TG_MEDIA_CHAT_ID'] ?? '';

if ($tg_bot_token === '' || $chat_id === '') {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'config']);
    exit;
}

if (empty($_POST['human'])) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'captcha']);
    exit;
}

$s = fn(string $k): string => htmlspecialchars(trim($_POST[$k] ?? ''), ENT_XML1 | ENT_QUOTES, 'UTF-8');

$text  = "📰 <b>Аккредитация СМИ — КБК'26</b>\n\n";
$text .= "<b>Название СМИ:</b> {$s('media-name')}\n";
$text .= "<b>Тип СМИ:</b> {$s('media-type')}\n";
$text .= "<b>Страна / регион:</b> {$s('media-region')}\n";
$text .= "<b>Сайт / соцсети:</b> {$s('media-url')}\n";
$text .= "<b>ФИО и должность:</b> {$s('journalist-name')}\n";
$text .= "<b>Телефон:</b> {$s('journalist-phone')}\n";
$text .= "<b>Email:</b> {$s('journalist-email')}\n";
$text .= "<b>Нужна помощь со съёмками:</b> {$s('need-help')}\n";

$helpDetails = $s('help-details');
if ($helpDetails !== '') {
    $text .= "<b>Необходимая помощь:</b> {$helpDetails}\n";
}

$wishes = $s('special-wishes');
if ($wishes !== '') {
    $text .= "<b>Особые пожелания:</b> {$wishes}\n";
}

$text .= "\n🕐 " . date('d.m.Y H:i:s');
$text .= "\n🌐 " . htmlspecialchars($_SERVER['REMOTE_ADDR'] ?? '', ENT_XML1);

$ch = curl_init('https://api.telegram.org/bot' . $tg_bot_token . '/sendMessage');
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => [
        'chat_id'    => $chat_id,
        'text'       => $text,
        'parse_mode' => 'HTML',
    ],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_SSL_VERIFYPEER => false,
    CURLOPT_TIMEOUT        => 10,
]);

$result   = curl_exec($ch);
curl_close($ch);
$response = json_decode($result, true);

if (!empty($response['ok'])) {
    echo json_encode(['ok' => true]);
} else {
    http_response_code(500);
    echo json_encode(['ok' => false]);
}
