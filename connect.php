<?php
// connexion bdd
$servername = "localhost";
$username = "root";
$password = "root";
$mydb = "exercice";
try {
    $dbh = new PDO("mysql:host=$servername;dbname=$mydb", $username, $password);
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    print '<p class="alert alert-warning">Erreur connexion!: ' . $e->getMessage() . '</p>';
    exit('<p class="alert alert-danger">Connexion impossible</p>');
      }
?>
