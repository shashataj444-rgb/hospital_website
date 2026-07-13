<?php
// Sunrise Multispecialty Hospital — appointment form handler.
// This is a functional STARTER for a PHP+MySQL backend. Before going live:
//   1. Add CSRF protection and rate limiting.
//   2. Send a confirmation SMS/email (e.g. via an SMS gateway or PHPMailer).
//   3. Validate department/doctor IDs against the departments/doctors tables.
//   4. Serve this over HTTPS only.

require_once __DIR__ . '/config.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$name    = trim($_POST['patient_name'] ?? '');
$mobile  = trim($_POST['mobile'] ?? '');
$email   = trim($_POST['email'] ?? '');
$dept    = trim($_POST['department'] ?? '');
$doctor  = trim($_POST['doctor'] ?? '');
$date    = trim($_POST['date'] ?? '');
$time    = trim($_POST['time'] ?? '');

if (!$name || !preg_match('/^[0-9]{10}$/', $mobile) || !$dept || !$date || !$time) {
    http_response_code(422);
    echo json_encode(['error' => 'Please fill all required fields correctly.']);
    exit;
}

$stmt = $pdo->prepare("SELECT id FROM departments WHERE slug = ?");
$stmt->execute([$dept]);
$deptRow = $stmt->fetch();
$deptId = $deptRow['id'] ?? null;

$insert = $pdo->prepare(
    "INSERT INTO appointments (patient_name, mobile, email, department_id, appointment_date, appointment_time)
     VALUES (?, ?, ?, ?, ?, ?)"
);
$insert->execute([$name, $mobile, $email, $deptId, $date, $time]);

echo json_encode([
    'success' => true,
    'message' => 'Appointment request received. Our team will confirm shortly by SMS/email.',
    'id' => $pdo->lastInsertId(),
]);
