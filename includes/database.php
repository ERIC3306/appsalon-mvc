<?php

//$db = mysqli_connect('localhost', 'root', 'Eric3306+', 'appsalon_mvc');
//Base de datos oculta
$db = mysqli_connect(
    $_ENV['DB_HOST'],
    $_ENV['DB_USER'], 
    $_ENV['DB_PASS'], 
    $_ENV['DB_NAME'],
);
$db->set_charset('utf8');

if (!$db) {
    echo "Error: No se pudo conectar a MySQL.";
    echo "errno de depuración: " . mysqli_connect_errno();
    echo "error de depuración: " . mysqli_connect_error();
    exit;
}
