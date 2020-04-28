<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
</head>
<?php
$conexion =  include('./back/conexion.php');
?>

<body>
    <div class="row col-12">
        <?php
        require "menu.php"; ?>
        <div class="col-sm-11">
            <h1 class="text-center">Listado de Pedidos</h1>
            <hr>
            <table class="table table-bordered table-hover table-sm dataTable">
                <thead>
                    <tr class="table-primary">
                        <th>Código</th>
                        <th>Proveedor</th>
                        <th>Condiciones de Pago</th>
                        <th>Tipo de Pago</th>
                        <th>Fecha de creación</th>
                        <th>Fecha de Entrega</th>
                        <th>Total</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                        <?php
                        if ($resultado = $mysqli->query("SELECT *, IF(total<=0, '...', total) total FROM compras INNER JOIN proveedores USING (idproveedor)")) {

                            while ($r = $resultado->fetch_assoc()) {
                                echo '<tr>
                        <td><a href="profile.php/?id='.$r['idCompra'].'">'. $r['codigo'] . '</a></td>
                        <td><a href="">' . $r['nombreProveedor'] . '</a></td>
                        <td>' . $r['condicionesPago'] . '</td>
                        <td>' . $r['tipoPago'] . '</td>
                        <td>' . $r['fechaCreacion'] . '</td>
                        <td>' . $r['fechaEntrega'] . '</td>
                        <td>$' . $r['total'] . '</td>';
                        if($r['status']==2) echo '<td><span class="badge badge-success text-center">Recibido</span></td></tr>';
                        else echo '<td><span class="badge badge-danger text-center">Pendiente</span></td></tr>';
                            }
                        }
                        ?>
                </tbody>
            </table>
        </div>
    </div>
</body>
<?php
require "./libraries/dataTable/tables.php"; ?>

</html>