const socket = io();
const dot_obervaciones = document.querySelector("#observaciones");

$("#spinner").hide();


let clickClientes  = ()=>{
    $('.col-sm-8').val("");
    clientes();
};

$("#inputBusqueda").click(function(e) {
    e.preventDefault();
    $("#inputBusqueda").on('keydown', function() {

        clientes($("#inputBusqueda").val())
    });
});

let clientes = (words = '') => {
    let validacio = 1;
    if (words.length == 0 || words.length == 1) validacio = 2;
    $.post("/ventas", { words: words, validaciones: validacio }, function(data) {
        console.log(data);
        if (data.length == 0) return document.getElementById("clientes").innerHTML = "<br><p>No se encuentra en la base de dato...<p>";
        let table = '';
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
    
       <div class="col-sm-14">
         <input type="text"  class="form-control valid border border-secondary" value="${nombre}" name="nombre" require readonly >
       </div>
       
    `;
    $("#inputCliente").show();
    document.getElementById('inputCliente').innerHTML = mandar;

};

// pagos ..
$("#comprobante").hide();
$("#input").hide();
let tipo_pago  = document.getElementById('pagos_transferencia');
$("#pagos_transferencia").click(function (e) { 
    if (tipo_pago.value == 1) {
        $("#comprobante").show();
        $("#input").show();
    }else{
        $("#comprobante").hide();
        $("#input").hide();
    }
}); 

$(document).ready(function() {
  
   
    document.getElementById('button_send').innerHTML = `<button  type="submit"  class="btn btn-success btn-lg btn-block"   >Enviar</button>`; 
   
    dataTable =  $("#orders").DataTable({
        "order": [[ 9, "desc" ]], 
        "fnRowCallback": function(nRow, aData, iDisplayIndex, iDisplayIndexFull) { 
             if(aData.estatus == 6)    $('td', nRow).css('color', 'red');  
            } ,
        columns: [
            {
                sortable: false,
                "render": function(data, type, full, meta) {
                    return `<a href="/almacen/pdf/${full.ruta_pdf_orden_compra}"  style="a {color:#130705;} " >${full.orden_de_compra}</a>`;
                }
            }, {
                sortable: false,
                "render": function(data, type, full, meta) {
                    return `<a href="/almacen/pdf/${full.ruta_pdf_pedido}" >${full.num_pedido}</a>`;
                }
            }, {
                sortable: false,
                "render": function ( data, type, full, meta ) {
                    return `<a href="/almacen/pdf/${full.ruta_pdf_comprobante_pago}" >${full.comprobante_pago ==''?'<a href="#"> COMPROBANTE</a>':full.comprobante_pago }</a>`;
                }
            },{
                sortable:false,
                "render": function(data, type, full ,meta){
                 let pagos  = ['TRANSFERENCIA','ANTICIPADO','CONTRA ENTREGA','CREDITO'];  
                 return `${pagos[ full.tipo_de_pago - 1 ]}`;
            
                }  
              },
                 { data: 'ruta'},
                 { data: 'importe'},
                //  { data: 'nombre_estatus' },
                {
                    sortable:false,
                    "render": function (data, type, full ,meta) {
                        return `${full.nombre_estatus == "DETENIDO"?`<a  onclick="uploadFileTransferencia('${full.num_pedido}')">${full.nombre_estatus}</a>`:full.nombre_estatus}`;
                      }
                },
                 { data: 'prioridad' },
                 {
                    sortable:false,
                    "render": function(data, type, full ,meta){
                        
                     return `  <p class="line-clamp" >${full.observacion}</p>`;
                    }  
                  },
                 { data: 'fecha_inicial'},{
                   sortable:false,
                   "render": function(data, type, full ,meta){
                    if(full.estatus <= 3 || full.estatus == 7  )return `<button type="button" class="btn btn-danger" onclick="cancelOrder('${full.num_pedido}')" class="close"    ><img src="https://image.flaticon.com/icons/svg/1936/1936477.svg" height="30" alt=""></button><br>`;
                    return ' '; 
                   }  
                 }

                ]

            }); 
            pedidos_vendedores(); 
});


let pedidos_vendedores = () => {
    $.ajax({
        type: "POST",
        url: "/ventas/pedidos_vendedor",
        success: function(response) {
            
            let ruta = ['NORTE', 'SUR'];
            let estatus = ['NUEVO','EN PROCESO','PARCIAL','COMPLETO','RUTA','CANCELADO','DETENIDO'];
            let prioridad_info  = ["NORMAL","NOMRAL","URGENTE"];
            response.filter(n => n.ruta = ruta[n.ruta - 1]);
            response.filter(n => n.nombre_estatus = estatus[n.estatus - 1]);
            response.filter(n => n.prioridad = prioridad_info[n.prioridad]);
            dataTable.rows().remove();
            dataTable.rows.add(response).draw();
            
        }
    });

};
let cancelOrder = ( order ) =>{
    
    reson_to_cancel( order ); 
    let inputReason = document.getElementById('motivo_cancelacion'); 
    $("#aceptar").click(function (e) {
        if( inputReason.value == ''  || inputReason.value.length < 30 )  return  alert('Ingrese la razón de cancelación  con un mínimo de 30 caracteres')  ; 
           $.post("/ventas/cancel", {data : order ,  reason : inputReason.value }, function (data) {
        
                   pedidos_vendedores(); 
                   pedidos(order);   
                   $('#Ventana_Modal_order').modal('hide'); 
                   
               }
           );        
    });  
    
}; 


// socket -----------
const pedidos = (data) => {

    socket.emit('data:pedidos', data);

};

socket.on('data:pedidos', function(data) {
    pedidos_vendedores();

});

//---------------------------------------

// componente guardar  
var correoPrioridad = document.getElementById('prioridad');
$("#prioridad").click(function(e) {

    if (correoPrioridad.value == 0) {
        document.getElementById('button_send').innerHTML = `<button  type="submit"  class="btn btn-success btn-lg btn-block"   >Enviar</button>`;
    } else {
        document.getElementById('button_send').innerHTML = `<button   type="button"  class="btn btn-success btn-lg btn-block"  onclick="order_priority()" >Enviar</button>`;
    }

});

// Se manda el file de transferencia 


 $(function () {  
    $("#imgct").submit(function (e) { 
        $('#Ventana_Modal').modal('hide'); 
        e.preventDefault();
        var formData = new FormData(document.getElementById("imgct"));

        formData.append("dato", "valor");

        $.ajax({
            url: "/ventas/add",
            type: "POST",
            dataType: "html",
            data: formData,
            beforeSend: function() {
                $('input[type="text"]').attr('disabled', 'disabled');
                $('input[type="file"]').attr('disabled', 'disabled');
                $('button[type="submit"]').attr('disabled', 'disabled');
                $('button[type="button"]').attr('disabled', 'disabled');
                $('select').attr('disabled', 'disabled');
                $("#spinner").show(); // Le quito la clase que oculta mi animación 

            },
            success: function(response) {

                if (response == 'false') {
                    alert('El pedido no ha sigo  guardado favor de revisar los campos ');
                    $('input[type="text"]').removeAttr('disabled');
                    $('input[type="file"]').removeAttr('disabled');
                    $('button[type="submit"]').removeAttr('disabled');
                    $('button[type="button"]').removeAttr('disabled');
                    $('select').removeAttr('disabled');
                    $("#comprobante").hide();
                    $("#input").hide();
                    $("#spinner").hide();
                } else {
                    pedidos(response);
                    pedidos_vendedores();
                    // alert('El pedido ha sigo guardado con éxito '); 
                    $("#spinner").hide();
                    $('input[type="text"]').removeAttr('disabled');
                    $('input[type="file"]').removeAttr('disabled');
                    $('button[type="submit"]').removeAttr('disabled');
                    $('button[type="button"]').removeAttr('disabled');
                    $('select').removeAttr('disabled');
                    $('#imgct').trigger("reset");
                    $("#comprobante").hide();
                    $("#input").hide();
                    cliente(' ');
                    $("#inputCliente").hide();
                }
            },
            cache: false,
            contentType: false,
            processData: false
        })
    });
});