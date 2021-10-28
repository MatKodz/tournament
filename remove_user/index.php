<?php
if(isset($_POST['iduser'])) {
  if(is_numeric($_POST['iduser'])) {
    require("../connect.php");
    $req = "DELETE FROM players WHERE player_id = ?";
    $sth = $dbh->prepare($req);
    $sth->execute( [ $_POST['iduser'] ]);
    $count = $sth->rowCount();
      if($count) {
        echo "<h2>Le compte {$_POST['iduser']} a bien été supprimé</h2>";
      }
      else echo "Aucun compte à supprimer";
  }
}

?>
