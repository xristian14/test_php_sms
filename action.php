<?php
$message = $_POST['message'];
$countSms = $_POST['countSms'];
$errors = [];

if ( $message == '' ) {
	array_push( $errors, 'сообщение не может быть пустым' );
}
if ( is_numeric($countSms) ) {
	if ( strpos($countSms, '.') ) {
		array_push( $errors, 'количество sms должно быть целым числом' );
	} else {
		if ( (int)$countSms < 1 ) {
			array_push( $errors, 'количество sms должно больше 0' );
		}
	}
} else {
	array_push( $errors, 'количество sms должно быть числом' );
}

if ( empty($errors) ) {
	$mysqli = new mysqli('localhost', 'root', '', 'php_sms_test_task');
	$stmt = $mysqli->prepare("INSERT INTO `sms` (`id`, `text`, `countSms`) VALUES (NULL, ?, ?)");
	$stmt->bind_param('si', $message, $countSms);
	$stmt->execute();
	
	$stmt->close();
	$mysqli->close();	
}

$result = array(
	'message'  => $message,
	'countSms' => $countSms,
	'errors'   => $errors
);

echo json_encode($result);