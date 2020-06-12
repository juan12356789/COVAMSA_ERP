const uploadExcel = () => {

    var csvFile = $('#excel')[0].files[0];
    if (csvFile.name.substring(csvFile.name.lastIndexOf(".")) != ".xlsx") return notifications(`Sólo se admiten archivos .xlsx`, 'warning');
    if (csvFile == undefined) return notifications(`Seleccione algún archivo `, 'warning');

    var data = new FormData();
    data.append('excel', csvFile);

    var request = $.ajax({
        url: '/excel',
        method: 'POST',
        contentType: false,
        processData: false,
        data: data,
        dataType: "html"
    });

    request.done(function(msg) {

        if (msg == "null") return notifications(`No se en cuentra ese cliente en la base de datos`, 'warning');
        let info = JSON.parse(msg);
        notifications("Ha sido importado de manera correcta", 'success');
        $("#imgct").show();
        $("#infoPedido").val(info.cotizacion);
        $("#fecha_pedido").val(info.fecha.split('/').reverse().join('-'));
        $("#importe").val(info.total.replace(',', ''));
        $("#numero_partidas").val(info.numero_partidas);

        cliente(info.cliente);
    });

    request.fail(function(jqXHR, textStatus) {
        alert("Hubo un error: " + textStatus);
    });

};