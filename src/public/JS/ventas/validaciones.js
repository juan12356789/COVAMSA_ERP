const socket = io();
const dot_obervaciones = document.querySelector("#observaciones");

$("#spinner").hide();
$("#imgct").hide();

let clickClientes = () => {
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
    $.post("/ventas", { words: words, validaciones: validacio }, function(data) {1
        console.log(data);
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
    // let mandar = `
    
    //    <div class="col-sm-14">
    //      <input type="text"  class="form-control valid border border-secondary" value="${nombre}" id="nombre"  name="nombre" require readonly >
    //    </div>
       
    // `;
    // $("#inputCliente").show();
    // document.getElementById('inputCliente').innerHTML = mandar;
    $("#nombre").val(nombre);

};

// pagos ..
$("#comprobante").hide();
$("#input").hide();
let tipo_pago = document.getElementById('pagos_transferencia');
$("#pagos_transferencia").click(function(e) {
    if (tipo_pago.value == 1) {
        $("#comprobante").show();
        $("#input").show();
    } else {
        $("#comprobante").hide();
        $("#input").hide();
    }
});

$(document).ready(function() {


            document.getElementById('button_send').innerHTML = `<button  type="submit"  class="btn btn-success btn-lg btn-block"   >Enviar</button>`;

            dataTable = $("#orders").DataTable({
                        "order": [
                            [10, "desc"]
                        ],
                        fixedHeader: true,
                        "fnRowCallback": function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                            if (aData.estatus == 6) $('td', nRow).css('color', 'red');
                        },
                        columns: [
                         
                            {
                                sortable: false,
                                "render": function(data, type, full, meta) {
                                    console.log(full.num_pedido);
                                    return `<a href="/almacen/pdf/${full.ruta_pdf_pedido}" >${full.num_subpedido == null ? full.num_pedido : full.num_subpedido  }</a>`;
                                }
                            },{
                                    sortable: false,
                                    "render": function(data, type, full, meta) {
                                        return `<a href="/almacen/pdf/${full.ruta_pdf_orden_compra}"  style="a {color:#130705;} " >${full.orden_de_compra}</a>`;
                                    }
                                },  {
                                    sortable: false,
                                    "render": function(data, type, full, meta) {
                                        return `<a href="/almacen/pdf/${full.ruta_pdf_comprobante_pago}" >${full.comprobante_pago ==''?'':full.comprobante_pago }</a>`;
                                    }
                                },{
                                    sortable: false,
                                    "render": function(data, type, full, meta) {
                                        return `${full.numero_factura == null?'':full.numero_factura}`;
                                    }
                                }, {
                                    sortable: false,
                                    "render": function(data, type, full, meta) {
                                        let pagos = ['Transferencia', 'Anticipado', 'Cntra Entrega', 'Crédito'];
                                        return `${pagos[ full.tipo_de_pago - 1 ]}`;

                                    }
                                },
                                { data: 'ruta' },
                                { data: 'importe' },
                                //  { data: 'nombre_estatus' },
                                {
                                    sortable: false,
                                    "render": function(data, type, full, meta) {
                                        let estatus = ['Nuevo', 'Surtiendo', 'Facturable', 'Requerir y facturar ', 'Requerir', 'Cancelado', 'Detenido','Facturando','Facturado','Ruta','Entregado','Suspendida'];
                                        let colores = ["#C6AED8", "#A1DEDB ", "#DECAA1 ", "#C1DEA1 ", "#DBE09A", "#E0A09A", "#817E7E","#B4EFED","#98F290","#F2FE9C","#D4FEA8","#F1C078"];

                                            return `${estatus[full.estatus - 1]  == "Detenido"?`<a href="#"  onclick="uploadFileTransferencia('${full.num_pedido}')">${full.estatus}</a>`:estatus[full.estatus - 1]}`;
                      }
                },
                 { data: 'prioridad' },
                 {data:'prioridadE'},
                 {
                    sortable:false,
                    "render": function(data, type, full ,meta){
                        
                     return `  <p class="line-clamp" >${full.observacion}</p>`;
                    }  
                  }, 
                  { data: 'fecha_inicial'},
                    {
                    sortable: false,
                    "render": function(data, type, full, meta) {
                        return `<i class="fas fa-tools" onclick="orderDatailMisPedidos('${full.num_pedido}')"  ></i>`;
                    }
                },{
                   sortable:false,
                   "render": function(data, type, full ,meta){
                    if(full.estatus != 6 )return `<center><i class="fas fa-trash-alt" onclick="cancelOrder('${full.id_pedido}')" ></i></center>`;
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
            console.log(response);
            let ruta = ['Norte', 'Sur'];  
            let estatus = ['Nuevo', 'Surtiendo', 'Facturable', 'Requerir y facturar ', 'Requerir', 'Cancelado', 'Detenido','Facturando','Facturado','Ruta','Entregado','Suspendida'];
            let colores = ["#C6AED8", "#A1DEDB ", "#DECAA1 ", "#C1DEA1 ", "#DBE09A", "#E0A09A", "#817E7E","#B4EFED","#98F290","#F2FE9C","#D4FEA8","#F1C078"];

            let prioridad_info = ["Normal", "Normal", "Urgente"];
            response.filter(n => n.ruta = ruta[n.ruta - 1]);
            // response.filter(n => n.nombre_estatus = `<div style="background-color:${colores[n.estatus - 1]}; >`+estatus[n.estatus - 1] + '</div>');
            response.filter(n => n.prioridad = prioridad_info[n.prioridad]);
            response.filter(n => n.prioridadE == 0 ? n.prioridadE = 'Sí' : n.prioridadE = 'No');
            dataTable.rows().remove();
            dataTable.rows.add(response).draw();
            
        }
    });

};

let cancelOrder = ( order ) =>{
    
    reson_to_cancel( order ); 
    let inputReason = document.getElementById('motivo_cancelacion'); 
    $("#aceptar").click(function (e) {
        if( inputReason.value == ''  || inputReason.value.length < 30 )  return  notifications(" Ingrese la razón de cancelación  con un mínimo de 30 caracteres",'warning');  
           $.post("/ventas/cancel", {data : order ,  reason : inputReason.value }, function (data) {
                   notifications(`El pedido con el número "${order}" ha sido cancelado`,'success');
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

// da la notificacion  cuando el pedido cambia al status a entregado 
socket.on('data:alertEntregado',  data => notificacionEntregado(data)); 

socket.on('data:pedidos', function(data) {
    pedidos_vendedores();

});

//---------------------------------------

const notificacionEntregado = id =>{
        
    $.ajax({type: "POST", url: "/ventas/notificacionEntregado", data: {id:id}, success: function (response) {
                    
            console.log(response);
            notifications(` El pedido ${response} ha sido entregado `,'success'); 
            

        }
    });

}; 

const tipoEntrega  = () =>{
    let  tipoEntrega =  document.getElementById("entrega").value;
    $("#tipo_entrega").val( tipoEntrega == 0 ? "Entrega parcial" : "Entrega completa" );
};

// componente guardar  
var correoPrioridad = document.getElementById('prioridad');
$("#prioridad").click(function(e) {

    if (correoPrioridad.value == 0) {
        document.getElementById('button_send').innerHTML = `<button  type="submit"  class="btn btn-success btn-lg btn-block"   >Enviar</button>`;
    } else {
        document.getElementById('button_send').innerHTML = `<button   type="button"  class="btn btn-success btn-lg btn-block"  onclick="order_priority()" >Enviar</button>`;
    }
    
});

let pdf_orden  =  document.getElementById('orden_pdf');
let orden_compra =  document.getElementById('orden') ;
let cancelarOrden =() =>{
 
    
    location.reload(true);
};
 $(function () {  
    $("#imgct").submit(function (e) { 
        $('#Ventana_Modal').modal('hide'); 
        e.preventDefault();
        var formData = new FormData(document.getElementById("imgct"));
        formData.append("productosArray", excelInfo);
        if((pdf_orden.value  !=  "" && orden_compra.value == "") || (pdf_orden.value  ==  "" && orden_compra.value != "")  ) return notifications("Ingrese el número de orden de compra y seleccione el archivo",'warning');
        $.ajax({
            url: "/ventas/add",
            type: "POST",
            dataType: "html",
            data: formData,
            beforeSend: function() {
                
                cargar_pedido();
                $('#spinnerUpload').modal('show');

            },
            success: function(response) {
                  $('#spinnerUpload').modal('hide');
                if(response == "null"){
                    
                    $('#spinnerUpload').modal('hide');
                    notifications("Esta orden ya esta en proceso ",'warning'); 
                    $("#input").hide();
                    $("#imgct").hide();
                    $("#ocultar_excel").show();
                    $("#comprobante").hide();
                    $("#cargarOrden").hide();
                    $('body').removeClass('modal-open');
                    $('.modal-backdrop fade show').remove();


                } 
                if (response == 'false' || response == 'null') {
                    $('#spinnerUpload').modal('hide');
                    notifications("No se pudo guardar su pedido favor de checar sus campos",'warning'); 
                    $('#imgct').trigger("reset");
                    $("#comprobante").hide();
                    $("#input").hide();
                    $("#imgct").hide();
                    $("#ocultar_excel").show();

                }

                if(response  != 'false' && response != "null"){
                    let num_pedido = JSON.parse(response);
                    $('#spinnerUpload').modal('hide');
                    pedidos(response);
                    pedidos_vendedores();
                    notifications("Su pedido se ha guardado con éxito",'success'); 
                    document.getElementById('button_send').innerHTML = `<button  type="submit"  class="btn btn-success btn-lg btn-block"   >Enviar</button>`;
                    $('#imgct').trigger("reset");
                    $("#comprobante").hide();
                    $("#input").hide();
                    cliente(' ');
                    $("#inputCliente").hide();
                    $("#imgct").hide();
                    $("#ocultar_excel").show();
                    $("#excel").val('');
                    swal({
                        title: `El  pedido ha sido guardado con éxito con el número ${num_pedido[0].num_pedido}`,
                        type: `success`,
                        showConfirmButton: true
                    });

                }
               
                $("#excel").val('');
            },
            cache: false,
            contentType: false,
            processData: false
        })
    });
});