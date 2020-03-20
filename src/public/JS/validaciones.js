const socket = io();

$("#tusClientes").click(function (e) { 
    $('.col-sm-8').val('');
    $("#inputBusqueda").keydown(function (e) {  
        clientes( $("#inputBusqueda").val() ); 
    });    
    clientes();
});

let clientes = (data)=>{
    $.post("/ventas", { words:data},function (data) {
        let table = '';
        if(data.length == 0) clientes(); 
        data.forEach(data => {
            table+=`
            <tr>
                <td>${data.nombre}</td>
                <td>${data.numero_interno}</td>
                <td><button type="button" onclick="cliente('${data.nombre}')" class="btn btn-success" data-dismiss="modal">Seleccionar</button></td>
            </tr>
            `;
        });
        document.getElementById("clientes").innerHTML = table;
    }
    );
};

let classText = () => {
    $(".orden_compra").addClass("col-sm-2 col-form-label");
    $(".numero_pedido").addClass("col-sm-2 col-form-label");
    $(".comprobante_pago").addClass("col-sm-2 col-form-label");
    $(".observaciones").addClass("col-sm-2 col-form-label");


};
classText();

let cliente = (nombre) => {
    let mandar = `
       <div class="form-group row justify-content-center ">
       <label for="" class="col-sm-2 col-form-label"></label>
       <div class="col-sm-5">
         <input type="text"  class="form-control valid border border-secondary" value="${nombre}" name="nombre" readonly >
       </div>
       </div>
       </div>
    `;
    pagos(nombre);
    $("#inputCliente").show();
    document.getElementById('inputCliente').innerHTML = mandar;

};
//Trae los tipos de pago 
let pagos = (cliente) => {

    $.post("/ventas/pagos", { cliente: cliente }, function(data, campos) {
        data[data.length - 1].forEach(data => {
            $("." + data.tipo_pago).removeClass("col-sm-2 col-form-label text-danger");
        });
        classText();
        data.forEach(data => {
            $("." + data.tipo_pago).addClass("col-sm-2 col-form-label text-danger");

        });
    });
};
$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "/ventas/pedidos",
        success: function(response) {
            socket.emit('data:pedidos', response);
        }
    });
});