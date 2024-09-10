<?php
header('Content-Type: application/json');

include 'db_connect.php';

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT * FROM product";
$result = $conn->query($sql);

$products = array(); // แก้เป็น $products

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $products[] = $row;
    }
}

echo json_encode($products); // ส่งข้อมูลสินค้าเป็น JSON

$conn->close();
?>
