<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'phpmailer/src/Exception.php';
require 'phpmailer/src/PHPMailer.php';

// Настройки Telegram
$botToken = "ТОКЕН";
$chatId = "CHAT_ID";

// Настройки PHPMailer
$mail = new PHPMailer(true);
$mail->CharSet = 'UTF-8';
$mail->setLanguage('ru', 'phpmailer/language/');
$mail->IsHTML(true);

// От кого письмо
$mail->setFrom('info@fls.duru', 'Заявка с моего сайта');
// Кому отправить
$mail->addAddress('stas89tihanov@gmail.com');
// Тема письма
$mail->Subject = 'Новая заявка на верстку сайта';

// Формируем текст для письма и Telegram
$body = '<h1>Заявка сайта</h1>';
$message = "<b>Новая заявка на верстку сайта</b>\n";

if (!empty($_POST['name'])) {
    $body .= '<p><strong>Имя:</strong> ' . htmlspecialchars($_POST['name']) . '</p>';
    $message .= "<b>Имя:</b> " . htmlspecialchars($_POST['name']) . "\n";
}
if (!empty($_POST['email'])) {
    $body .= '<p><strong>Email:</strong> ' . htmlspecialchars($_POST['email']) . '</p>';
    $message .= "<b>Email:</b> " . htmlspecialchars($_POST['email']) . "\n";
}
if (!empty($_POST['number'])) {
    $body .= '<p><strong>Телефон:</strong> ' . htmlspecialchars($_POST['number']) . '</p>';
    $message .= "<b>Телефон:</b> " . htmlspecialchars($_POST['number']) . "\n";
}
if (!empty($_POST['deadlines'])) {
    $body .= '<p><strong>Сроки:</strong> ' . htmlspecialchars($_POST['deadlines']) . '</p>';
    $message .= "<b>Сроки:</b> " . htmlspecialchars($_POST['deadlines']) . "\n";
}
if (!empty($_POST['message'])) {
    $body .= '<p><strong>Ссылка на макет:</strong> ' . htmlspecialchars($_POST['message']) . '</p>';
    $message .= "<b>Ссылка на макет:</b> " . htmlspecialchars($_POST['message']) . "\n";
}

// Работа с файлом (если прикреплен)
if (!empty($_FILES['image']['tmp_name'])) {
    // Загрузка файла
    $filePath = __DIR__ . "/files/" . $_FILES['image']['name'];
    if (move_uploaded_file($_FILES['image']['tmp_name'], $filePath)) {
        // Для почты
        $body .= '<p><strong>Фото макета:</strong> Во вложении</p>';
        $mail->addAttachment($filePath);

        // Для Telegram
        $url = "https://api.telegram.org/bot{$botToken}/sendDocument";
        $postData = [
            'chat_id' => $chatId,
            'caption' => $message,
            'document' => new CURLFile($filePath)
        ];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
        curl_exec($ch);
        curl_close($ch);
    } else {
        $body .= '<p><strong>Фото макета:</strong> Ошибка загрузки файла</p>';
        $message .= "<b>Фото макета:</b> Ошибка загрузки файла\n";
    }
}

// Отправка письма через PHPMailer
$mail->Body = $body;
try {
    $mail->send();
    $emailStatus = "Данные отправлены на почту!";
} catch (Exception $e) {
    $emailStatus = "Ошибка отправки письма: {$mail->ErrorInfo}";
}

// Отправка текста в Telegram (если файл не отправлялся как документ)
if (empty($_FILES['image']['tmp_name'])) {
    $url = "https://api.telegram.org/bot{$botToken}/sendMessage";
    $postData = [
        'chat_id' => $chatId,
        'text' => $message,
        'parse_mode' => 'HTML'
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
    curl_exec($ch);
    curl_close($ch);
}

// Ответ для клиента
$response = ['email_status' => $emailStatus, 'telegram_status' => 'Данные отправлены в Telegram!'];
header('Content-Type: application/json');
echo json_encode($response);
?>
