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
$id  =  $_GET['id'];
$idinfo = $mysqli->query("SELECT * from compras INNER JOIN proveedores USING (idProveedor) INNER JOIN empleados USING (idEmpleado) WHERE idcompra = $id");
$res = $idinfo->fetch_assoc();
$productos = $mysqli->query("SELECT  idProducto,nombreProducto,precioVenta FROM  productos");
$servicios = $mysqli->query("SELECT idServicio, nombreServicio, precioServicio FROM servicios");
$productosServicios = '';

while ($r = $servicios->fetch_assoc()) {
    $productosServicios .=  "<option data-precio='" . $r['precioServicio'] . "'  value='" . $r['nombreServicio'] . "'>";
}
while ($r = $productos->fetch_assoc()) {
    $productosServicios .=  "<option  data-precio='" . $r['precioVenta'] . "'   value='" . $r['nombreProducto'] . "'>";
}
?>

<body>
    <div class="row col-12">
        <?php require "menu.php" ?>

        <div class="col-sm-11">

            <h1 class="text-center">Perfil de Pedido</h1>
            <hr>
            <input type="hidden" name="id" id="id" value="<?php echo $id  ?>" readonly>
            <div class="row mx-5">
                <div class="col-12 mx-auto">
                    <div class="card">
                        <div class="card-header">
                            <h5>Informacion</h5>
                        </div>
                        <div class="card-body row">
                            <div class="col-sm-6">
                                <p><b>Proveedor:</b> <a href="#"><?php echo $res['nombreProveedor'] ?></a></p>
                                <p><b>Código:</b> <?php echo $res['codigo'] ?></p>
                                <p><b>Fecha de Pedido: </b><?php echo $res['fechaCreacion'] ?></p>
                                <p><b>Fecha de Entrega Estimada: </b> <?php echo $res['fechaEntrega'] ?></p>
                            </div>
                            <div class="col-sm-6">
                                <p><b>Condiciones de Pago: </b> <?php echo $res['condicionesPago'] ?></p>
                                <p><b>Tipo de Pago:</b> <?php echo $res['tipoPago'] ?></p>
                                <p><b>Status:</b>
                                    <?php if ($res['status'] == 2) echo '<span class="badge badge-success text-center">Recibido</span>';
                                    else echo '<span class="badge badge-danger text-center">Pendiente</span>'; ?></p>
                                <p class="row"><b class="col-2">Notas:</b> <textarea class="form-control col-8" placeholder="Texto" rows="2" disabled><?php echo $res['nota'] ?></textarea></p>

                            </div>
                            <a href="/compras/add.php/?id=<?php echo $id ?>" class="btn btn-secondary btn-sm ml-auto">Editar</a>
                        </div>
                    </div>
                </div>
            </div>
            <br>
            <div class="row mx-5">
                <div class="col-sm-12 mx-auto">
                    <div class="card">
                        <div class="card-header">
                            <h5>Listado Articulos</h5>
                        </div>
                        <div class="card-body">
                            <table class="table table-bordered table-hover table-sm dataTable">
                                <thead class="table-primary">
                                    <th style="width: 40%">Poducto / Servicio</th>
                                    <th style="width: 10%">Precio Unitario</th>
                                    <th style="width: 10%">Cantidad</th>
                                    <th style="width: 10%">Descuento</th>
                                    <th style="width: 5%">IVA</th>
                                    <th>Total</th>
                                    <th>Función</th>
                                </thead>
                                <tbody id="new">
                                    <?php
                                    if ($resultado = $mysqli->query("SELECT *,
                                        if( iva=1, (preciocompra*cantidad-descuento)*1.16, (preciocompra*cantidad-descuento) ) totalprod, 
                                        if ( iva=1, (preciocompra*cantidad-descuento)*1.16, (precioservicio*cantidad-descuento) ) totalserv 
                                        FROM compras INNER JOIN comprasproductos USING (idcompra) LEFT JOIN productos USING(idproducto) LEFT JOIN servicios USING (idservicio) WHERE idCompra = $id")) {

                                        while ($r = $resultado->fetch_assoc()) {
                                            echo '<tr>
                                                <td>' . $r['nombreProducto'] . $r['nombreServicio'] . '</td>
                                                <td>' . $r['precioCompra'] . $r['precioServicio'] . '</td>
                                                <td>' . $r['cantidad'] . '</td>
                                                <td>' . $r['descuento'] . '</td>
                                                <td>' . $r['iva'] . '</td>
                                                <td>' . $r['totalprod'] . $r['totalserv'] . '</td>
                                                <td class="text-center"><button type="button" id="editar" onclick="opeaciones(2)"  class="btn btn-secondary btn-sm">Editar</button>';
                                            if (isset($r['idProducto'])) echo '<button type="button" id="eliminar" onclick="opeaciones(3,' . $r['idProducto'] . ',null)" class="btn btn-danger btn-sm">Eliminar</button></td></tr>';
                                            else echo '<button type="button" id="eliminar" onclick="opeaciones(3,null,' . $r['idServicio'] . ')" class="btn btn-danger btn-sm">Eliminar</button></td></tr>';
                                        }
                                    }
                                    ?>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td><input type="text" name="idproducto" id="idproducto" class="form-control" list="productos" placeholder="Buscar..." required>
                                            <datalist id="productos">
                                                <?php echo $productosServicios;  ?>
                                            </datalist></td>
                                        <td><input name="precio" type="number" id="precio" class="form-control" required></td>
                                        <td><input name="cantidad" type="number" class="form-control" required></td>
                                        <td><input name="descuento" type="number" class="form-control" required></td>
                                        <td class="text-center pl-4"><input class="form-check-input" type="checkbox" id="iva" name="iva" value="1" required></td>
                                        <td class="text-center" colspan="2">
                                            <button type="submit" onclick="opeaciones(1, null,null)" class="btn btn-primary btn-sm">Agregar</button>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script src="/compras/js/addProfile.js"></script>
</body>
<?php
require "./libraries/dataTable/tables.php"; ?>

</html>