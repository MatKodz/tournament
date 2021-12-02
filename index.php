<?php

if(isset($_POST['creer'])) {
    $pattern = '/^[a-zA-Z0-9]{3,}$/';
    if ( preg_match($pattern,$_POST['joueur']) ) {
        require_once "connect.php";
        echo "Le joueur <b>" . $_POST['joueur'] . "</b> a bien été ajouté ";
        $req = "INSERT INTO players VALUES (NULL, ? , NOW() )";
        $sth = $dbh->prepare($req);
        $player_name = trim($_POST['joueur']);
        if ( $sth->execute( [ucfirst($player_name)] ) )
        $msg_s =  "Le joueur <b>" . $_POST['joueur'] . "</b> a bien été ajouté ";
    }
    else $msg_f = "Format incorrect";
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Players</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
    <style>
        .list-players div.player, .head-list-players {
            display: flex;
            justify-content: space-between;
            padding: 5px;
        }

        div.player {
          border-bottom: 1px dotted #ccc;
          padding: 7px 0;
          margin: 7px 0;
        }

        .list-players div.player div, .head-list-players div {
          flex: 1 1;
        }

        .list-players div.player div:last-of-type, .head-list-players div:last-of-type {
          flex: 0 0 100px;
        }

        .head-list-players {
            background: #555;
            color: white;
            font-size: 120%;
        }

        .btn.btn-danger {
          min-width: 180px;
        }

        .list-players div.player:last-child input[type="submit"] {
          visibility: hidden;
        }

    </style>
</head>
<body>
    <div class="container">
            <div class="jumbotron bg-light p-5 my-3">
                <h1>Créer un joueur</h1>
                <form action="" method="post">
                <input type="text" name="joueur" class="w-50 p-2" placeholder="Entrer le nom du joueur">
                <input type="submit" name="creer" value="Créer le joueur" class="mx-2 btn btn-success btn-lg">
                </form>
                <?= (isset($msg_s)) ? '<p class="alert alert-success my-3">' . $msg_s .  '</p>' : "" ?>
                <?= (isset($msg_f)) ? '<p class="alert alert-warning my-3">' . $msg_f .  '</p>' : "" ?>

            </div>
        <hr>
        <div class="row">
        <h2>Afficher tous les joueurs</h2>
        <div class="list-players">
        <div class="head-list-players"><div>Joueur</div><div>Date </div><div>Id</div><div>Actions</div></div>
        <?php
        $reqall = "SELECT * FROM players ORDER BY player_register DESC";
        require_once "connect.php";
        foreach($dbh->query($reqall) as $player) {
            echo "<div class=\"player\">
            <div>{$player['player_name']}</div>
            <div>{$player['player_register']}</div>
            <div>{$player['player_id']}</div>";
            echo '<div><form method="post" action="./remove_user/"><input name="iduser" type="hidden" value="'.$player['player_id'].'"><input type="submit" class="btn btn-danger" value="Supprimer"></form></div>';
            echo "</div>";
        }
        $dbh = null;
        ?>
        </div>
        </div>
        <hr>
        <div class="row">
            <div class="col">
            <a href="./bracket/" class="btn btn-primary">Voir le bracket</a>
            </div>
        </div>
</div>
</body>
</html>
