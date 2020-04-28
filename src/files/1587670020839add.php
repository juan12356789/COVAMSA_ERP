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
if (isset($_GET['id'])) {
    $id = $_GET['id'];
    $idinfo = $mysqli->query("SELECT * from compras WHERE idcompra = $id");
    $res = $idinfo->fetch_row();
}

?>

<body>

    <div class="row col-12">
        <?php require "menu.php"; ?>
        <div class="col-sm-11">
            <h1 class="text-center"><?php if (isset($id)) echo "Editar";
                                    else echo "Nuevo" ?> Pedido</h1>
            <hr>
            <form class="mt-4" id="addform" method="POST">
                <?php if (isset($id)) echo '<input type="hidden" name="id" id="id" value="' . $res[0] . '">' ?>
                <div class="col-sm-6 mx-auto">
                    <div class="row">
                        <div class="col-sm-6">
                            <label for="empleados">Empleado</label>
                            <select name="empleado" class="form-control" required>
                                <option value="" <?php if (!isset($id)) echo 'selected' ?> disabled>Seleccione...</option>
                                <?php
                                if ($resultado_e = $mysqli->query("SELECT nombre,idEmpleado  FROM empleados")) {
                                    while ($r = $resultado_e->fetch_assoc()) {
                                        if (isset($id)) {
                                            if ($res[1] == $r['idEmpleado']) {
                                                echo "<option  value='" . $r['idEmpleado'] . "' selected>" . $r['nombre'] . "</option>";
                                            } else {
                                                echo "<option  value='" . $r['idEmpleado'] . "'>" . $r['nombre'] . "</option>";
                                            }
                                        } else {
                                            echo "<option  value='" . $r['idEmpleado'] . "'>" . $r['nombre'] . "</option>";
                                        }
                                    }
                                } ?>
                            </select>
                        </div>
                        <div class="col-sm-6">
                            Status
                            <br>
                            <div class="pt-2">
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="status" id="status1" value="1" <?php if (isset($id)) if($res[10] ==1) echo "checked" ?> required >
                                    <label class="form-check-label" for="status1">Pendiente</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="status" id="status2" value="2" <?php if (isset($id)) if($res[10] ==2) echo "checked" ?>>
                                    <label class="form-check-label" for="status2">Recibido</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row pt-2">
                        <div class="col-sm-6">
                            <label for="idprovedor">Proveedor</label>
                            <select name="idproveedor" id="idproveedor" class="form-control" required>
                                <option value="" <?php if (!isset($id)) echo 'selected' ?> disabled>Seleccione...</option>
                                <?php
                                if ($resultado = $mysqli->query("SELECT idProveedor, nombreProveedor  FROM proveedores")) {
                                    while ($fila = $resultado->fetch_assoc()) {
                                        if (isset($id)) {
                                            if ($res[2] == $fila['idProveedor']) {
                                                echo  "<option  value='" . $fila['idProveedor'] . "' selected>" . $fila['nombreProveedor'] . "</option>";
                                            } else {
                                                echo  "<option  value='" . $fila['idProveedor'] . "'>" . $fila['nombreProveedor'] . "</option>";
                                            }
                                        } else {
                                            echo  "<option  value='" . $fila['idProveedor'] . "'>" . $fila['nombreProveedor'] . "</option>";
                                        }
                                    }
                                } ?>
                            </select>
                        </div>
                        <div class="col-sm-6">
                            <label for="codigo">Código</label>
                            <input type="text" id='codigo' name="codigo" class="form-control" placeholder="###" value="<?php if (isset($id)) echo $res[3] ?>" required>
                        </div>
                    </div>
                    <div class="row pt-2">
                        <div class="col-sm-6">
                            <label for="fecha_pedido">Fecha de Pedido</label>
                            <input type="date" name="fecha_pedidio" id="fecha_pedidio" class="form-control" value="<?php if (isset($id)) echo $res[6] ?>" required>
                        </div>
                        <div class="col-sm-6">
                            <label for="fecha_entrega">Fecha de Entrega Estimada</label>
                            <input type="date" id="fecha_entrega" name="fecha_entrega" class="form-control" value="<?php if (isset($id)) echo $res[7] ?>" required>
                        </div>
                    </div>

                    <div class="row pt-2">
                        <div class="col-sm-6">
                            <label for="condiciones_pago">Condiciones de Pago</label>
                            <select name="condiciones_pago" id="condiciones_pago" class="form-control" required>
                                <option value="" <?php if (!isset($id)) echo 'selected' ?> disabled>Seleccione...</option>
                                <option value="Acuse de Recibo" <?php if (isset($id)) if ($res[4] == "Acuse de Recibo") echo "selected" ?>>Acuse de Recibo</option>
                                <option value="Orden" <?php if (isset($id)) if ($res[4] == "Orden") echo "selected" ?>>Orden</option>
                                <option value="A la entrega" <?php if (isset($id)) if ($res[4] == "A la entrega") echo "selected" ?>>A la entrega</option>
                                <option value="10 dias" <?php if (isset($id)) if ($res[4] == "10 dias") echo "selected" ?>>10 dias</option>
                                <option value="14 dias" <?php if (isset($id)) if ($res[4] == "14 dias") echo "selected" ?>>14 dias</option>
                                <option value="30 dias" <?php if (isset($id)) if ($res[4] == "30 dias") echo "selected" ?>>30 dias</option>
                                <option value="60 dias" <?php if (isset($id)) if ($res[4] == "60 dias") echo "selected" ?>>60 dias</option>
                            </select>
                        </div>
                        <div class="col-sm-6">
                            <label for="tipo_pago">Tipo de Pago</label>
                            <select name="tipo_pago" id="tipo_pago" class="form-control" required>
                                <option value="" <?php if (!isset($id)) echo 'selected' ?> disabled>Seleccione...</option>
                                <option value="Cheque" <?php if (isset($id)) if ($res[5] == "Cheque") echo "selected" ?>>Cheque</option>
                                <option value="Domicialiación" <?php if (isset($id)) if ($res[5] == "Domicialiación") echo "selected" ?>>Domicialiación</option>
                                <option value="Efectivo" <?php if (isset($id)) if ($res[5] == "Efectivo") echo "selected" ?>>Efectivo</option>
                                <option value="Tarjeta" <?php if (isset($id)) if ($res[5] == "Tarjeta") echo "selected" ?>>Tarjeta</option>
                                <option value="Transferencia Bancaria" <?php if (isset($id)) if ($res[5] == "Transferencia Bancaria") echo "selected" ?>>Transferencia Bancaria</option>
                            </select>
                        </div>
                    </div>
                    <div class="row pt-2">
                        <div class="col-sm-12">
                            <label for="nota">Notas</label>
                            <textarea name="nota" id="nota" rows="4" class="form-control" placeholder="..." value=""><?php if (isset($id)) echo $res[8] ?></textarea>
                        </div>
                    </div>
                    <div class="ml-auto pt-3" style="float: right">
                        <button type="submit" class="btn btn-primary">Guardar</button>
                        <input type="reset" class="btn btn-secondary" value="Limpiar">
                    </div>
                </div>
            </form>

        </div>
    </div>
</body>
<script src="/compras/js/addOrder.js"></script>

</html>