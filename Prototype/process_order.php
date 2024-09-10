<?php
include 'db_connect.php';

// ตรวจสอบการเชื่อมต่อ
if ($conn->connect_error) {
    die("การเชื่อมต่อล้มเหลว: " . $conn->connect_error);
}

// รับข้อมูลจากฟอร์ม
$name = $_POST['name'];
$phone_number = $_POST['phone-number'];
$province = $_POST['province'];
$district = $_POST['district'];
$zip_code = $_POST['zip-code'];
$further_description = $_POST['further-description'];
$payment_channel = $_POST['payment-channel'];

// เตรียมและผูกข้อมูล
$stmt = $conn->prepare("INSERT INTO orders (name, phone_number, province, district, zip_code, further_description, payment_channel) VALUES (?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sssssss", $name, $phone_number, $province, $district, $zip_code, $further_description, $payment_channel);

// ดำเนินการตามคำสั่ง
if ($stmt->execute()) {
    echo "สั่งซื้อสำเร็จ!";
} else {
    echo "ข้อผิดพลาด: " . $stmt->error;
}

// ปิดการเชื่อมต่อฐานข้อมูล
$stmt->close();
$conn->close();
?>