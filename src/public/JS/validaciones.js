const socket = io();

$("#spinner").hide();
$("#tusClientes").click(function(e) {
    $('.col-sm-8').val('');
    $("#inputBusqueda").keydown(function(e) {
        clientes($("#inputBusqueda").val());
    });
    clientes();
});


let clientes = (data) => {
    $.post("/ventas", { words: data }, function(data) {
        let table = '';
        if (data.length == 0) clientes();
        data.forEach(data => {
            table += `
            <tr>
                <td>${data.nombre}</td>
                <td>${data.numero_interno}</td>
                <td><button type="button" onclick="cliente('${data.nombre}')" class="btn btn-success" data-dismiss="modal">Seleccionar</button></td>
            </tr>
            `;
        });
        document.getElementById("clientes").innerHTML = table;
    });
};



let cliente = (nombre) => {
    let mandar = `
       <div class="form-group row justify-content-center ">
       <label for="" class="col-sm-2 col-form-label"></label>
       <div class="col-sm-5">
         <input type="text"  class="form-control valid border border-secondary" value="${nombre}" name="nombre" require readonly >
       </div>
       </div>
       </div>
    `;
    $("#inputCliente").show();
    document.getElementById('inputCliente').innerHTML = mandar;

};



$(document).ready(function() {

    pedidos_vendedores();
});


let pedidos_vendedores = () => {

    $.ajax({
        type: "POST",
        url: "/ventas/pedidos_vendedor",
        success: function(response) {
            let ruta = ['NORTE', 'SUR'];
            let estatus = ['NUEVO'];
            response.filter(n => n.ruta = ruta[n.ruta - 1]);
            response.filter(n => n.estatus = estatus[n.estatus - 1]);


            $("#orders").DataTable({
                "order": [
                    [7, "desc"]
                ],
                data: response,
                columns: [
                    { data: 'orden_de_compra' },
                    { data: 'num_pedido' },
                    { data: 'comprobante_pago' },
                    { data: 'ruta' },
                    { data: 'importe' },
                    { data: 'estatus' },
                    { data: 'observacion' },
                    { data: 'fecha_inicial' }

                ]

            });

        }
    });


};



let pedidos = (data) => {
    socket.emit('data:pedidos', data);
};

$(function() {
    $("#imgct").on("submit", function(e) {
        e.preventDefault();
        var f = $(this);
        var formData = new FormData(document.getElementById("imgct"));
        formData.append("dato", "valor");
        $.ajax({
            url: "/ventas/add",
            type: "POST",
            dataType: "html",
            data: formData,
            beforeSend: function() {
                $("#spinner").show(); // Le quito la clase que oculta mi animación 
            },
            success: function(response) {
                console.log(response);

                if (response == 'false') {
                    $("#spinner").hide();
                    $("#inputCliente").hide();
                    alert('El pedido no ha sigo  guardado favor de revisar los campos ');
                } else {
                    $("#spinner").hide();
                    $('#imgct').trigger("reset");
                    cliente(' ');
                    $("#inputCliente").hide();
                    pedidos(response);
                    pedidos_vendedores();

                }
            },
            cache: false,
            contentType: false,
            processData: false
        })

    });
});