<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'phpmailer/src/Exception.php';
require 'phpmailer/src/PHPMailer.php';

$mail = new PHPMailer(true);
$mail->CharSet = 'UTF-8';
$mail->setLanguage('ru', 'phpmailer/language/');
$mail->IsHTML(true);

// от кого письмо
$mail->setFrom('info@fls.duru', 'Заявка с моего сайта');
// кому отправить
$mail->addAddress('stas89tihanov@gmail.com');
// тема письма
$mail->Subject = 'Новая заявка на верстку сайта';

// тело письма
$body = '<h1>Заявка сайта</h1>';

if (trim(!empty($_POST['name']))) {
    $body .= '<p><strong>Имя:</strong> ' . $_POST['name'] . '</p>';
}
if (trim(!empty($_POST['email']))) {
    $body .= '<p><strong>Email:</strong> ' . $_POST['email'] . '</p>';
}
if (trim(!empty($_POST['number']))) {
    $body .= '<p><strong>Телефон:</strong> ' . $_POST['number'] . '</p>';
}
if (trim(!empty($_POST['deadlines']))) {
    $body .= '<p><strong>Сроки:</strong> ' . $_POST['deadlines'] . '</p>';
}
if (trim(!empty($_POST['message']))) {
    $body .= '<p><strong>Ссылка на макет:</strong> ' . $_POST['message'] . '</p>';
}

// Прикрепить файл
if (!empty($_FILES['image']['tmp_name'])) {
    // путь загрузки 
    $filePath = __DIR__ . "/files/" . $_FILES['image']['name'];
    // загрузим файл
    if (copy($_FILES['image']['tmp_name'], $filePath)) {
        $fileAttach = $filePath;
        $body .= '<p><strong>Фото макета:</strong> Во вложении</p>';
        $mail->addAttachment($fileAttach);
    }
}

$mail->Body = $body;

// отправляем 
if (!$mail->send()) {
    $message = 'Ошибка';
} else {
    $message = 'Данные отправлены!';
}
$response = ['message' => $message];
header('Content-type: application/json');
echo json_encode($response);
?>
