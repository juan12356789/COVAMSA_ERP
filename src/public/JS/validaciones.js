const socket = io();

$("#spinner").hide();
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
    $("#inputCliente").show();
    document.getElementById('inputCliente').innerHTML = mandar;

};
//Trae los tipos de pago 

$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "/ventas/pedidos",
        success: function(response) {
            socket.emit('data:pedidos', response);
        }
    });
});

$(function(){
    $("#imgct").on("submit", function(e){
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
            success: function (response) {
                if(response) {
                    $("#spinner").hide();
                    $('#imgct').trigger("reset");
                    remuveClass(); 
                    classText();
                    alert('su pedido ha sido subido con exito')
                }
                else alert('El pedido no ha sigo  guardado favor de revisar los campos '); 
            },
            cache: false,
            contentType: false,
     processData: false
        })
            .done(function(res){
                
            });
    }); 
});


