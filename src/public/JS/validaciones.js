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

         dataTable =  $("#orders").DataTable({
                "order": [[ 7, "desc" ]],
                columns: [
                    {
                        sortable: false,
                        "render": function ( data, type, full, meta ) {
                            return `<a href="/almacen/pdf/${full.ruta_pdf_orden_compra}" >${full.orden_de_compra}</a>`;
                        }
                    }, {
                        sortable: false,
                        "render": function ( data, type, full, meta ) {
                            return `<a href="/almacen/pdf/${full.ruta_pdf_pedido}" >${full.num_pedido}</a>`;
                        }
                    },{
                        sortable: false,
                        "render": function ( data, type, full, meta ) {
                            return `<a href="/almacen/pdf/${full.ruta_pdf_comprobante_pago}" >${full.comprobante_pago}</a>`;
                        }
                    },
                         { data: 'ruta'},
                         { data: 'importe'},
                         { data: 'estatus' },
                         { data: 'observacion' },
                         { data: 'fecha_inicial'},{
                           sortable:false,
                           "render": function(data, type, full ,meta){
                               let  disabled = ''
                               if(full.estatus == "CANCELADO")  disabled = 'disabled';
                               return `<button type="button" class="btn btn-danger" onclick="cancelOrder('${full.num_pedido}')" class="close" ${disabled}   ><img src="https://image.flaticon.com/icons/svg/1936/1936477.svg" height="30" alt=""></button><br>`;
                           }  
                         }
        
                        ]
        
                    }); 
});



let pedidos_vendedores = () => {
    $.ajax({
        type: "POST",
        url: "/ventas/pedidos_vendedor",
        success: function(response) {
            let ruta = ['NORTE', 'SUR'];
            let estatus = ['NUEVO','PROCESO','PARCIAL','COMPLETO','RUTA','CANCELADO'];
            response.filter(n => n.ruta = ruta[n.ruta - 1]);
            response.filter(n => n.estatus = estatus[n.estatus - 1]);
            dataTable.rows().remove();  
            dataTable.rows.add(response).draw();
        }
    });
    
};

let cancelOrder = ( order ) =>{
    
   let confirmCancel  =  prompt(`Alerta. Esta apunto de cancelar el pedido con el numero ${order}, Si desea proceder, introdusca in 'motivo para la cancelacion'`);
   if(confirmCancel == '' ||  confirmCancel == null )  return; 
   $.post("/ventas/cancel", {data : order ,  reason : confirmCancel }, function (data) {

           pedidos_vendedores(); 
           pedidos(order); 
           alert('Cancelado');
       }
   );
    
}; 


let pedidos = ( data ) => {
  
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