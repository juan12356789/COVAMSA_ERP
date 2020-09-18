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
                            
                            let colores = ["#C6AED8", "#A1DEDB ", "#DECAA1 ", "#C1DEA1 ", "#DBE09A", "#E0A09A", "#817E7E","#B4EFED","#98F290","#F2FE9C","#D4FEA8","#F1C078","#E1FCE3"];
                            if (aData.estatus == 6) $('td', nRow).css('color', 'red');
                            else $(nRow).find('td:eq(7)').css('background-color', colores[aData.estatus - 1]);
                            $(nRow).find('td:eq(8)').css('background-color', aData.prioridad == "Normal"?'#ECF575':'#F5AD75');

                        },
                        columns: [
                         
                            {
                                sortable: false,
                                "render": function(data, type, full, meta) {
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
                                        let pagos = ['Transferencia', 'Anticipado', 'Contra Entrega', 'Crédito'];
                                        return `${pagos[ full.tipo_de_pago - 1 ]}`;

                                    }
                                },
                                { data: 'ruta' },
                                { data: 'importe' },
                                //  { data: 'nombre_estatus' },
                                {
                                    sortable: false,
                                    "render": function(data, type, full, meta) {
                                        let estatus = ['Nuevo', 'Surtiendo', 'Facturable', 'Requerir y facturar ', 'Requerir', 'Cancelado', 'Detenido','Facturando','Facturado','Ruta','Entregado','Suspendida','Comprado'];
                                        return `${estatus[full.estatus - 1]  == "Detenido"
                                                ?`<a href="#"  onclick="uploadFileTransferencia('${full.num_pedido}')">${estatus[full.estatus - 1]}</a>`
                                                :` ${estatus[full.estatus - 1]}`}`;
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
                    sortable:false,
                    "render": function(data, type, full ,meta){
                     return `<i class="fas fa-list-ul" onclick="logPartidas('${full.id_pedido}','${full.orden_de_compra}','${full.num_pedido}','${full.ruta}','${full.fecha_inicial}')" ></i>`;
                    }  
                  },
                    {
                    sortable: false,
                    "render": function(data, type, full, meta) {
                        return `<i class="fas fa-tools" onclick="orderDatailMisPedidos('${full.id_pedido}')"  ></i>`;
                    }
                },{
                   sortable:false,
                   "render": function(data, type, full ,meta){
                    if(full.estatus != 6 && full.estatus != 11)return `<center><i  class="fas fa-trash-alt" onclick="cancelOrder('${full.id_pedido}')" ></i></center>`;
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
            let ruta = ['Norte', 'Sur'];  
            let estatus = ['Nuevo', 'Surtiendo', 'Facturable', 'Requerir y facturar ', 'Requerir', 'Cancelado', 'Detenido','Facturando','Facturado','Ruta','Entregado','Suspendida','Comprado'];
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

const logPartidas  = ( id , ordenCompra ,num_pedido, ruta , fecha_pedido )  =>{
    console.log( ordenCompra );
    $.ajax({type: "POST",url: "/ventas/log",data: {id : id},success: function (response) {
            let table = ``,cont = 1; 
            let estatus = ['Nuevo', 'Surtiendo', 'Facturable', 'Requerir y facturar ', 'Requerir', 'Cancelado', 'Detenido','Facturando','Facturado','Ruta','Entregado','Suspendida','Comprado'];
            let colores = ["#C6AED8", "#A1DEDB ", "#DECAA1 ", "#C1DEA1 ", "#DBE09A", "#E0A09A", "#817E7E","#B4EFED","#98F290","#F2FE9C","#D4FEA8","#F1C078"];
            let descripcion = ['Se ha creado la orden en el sistema',
                                'La order esta siendo surtida ',
                                'La orden está lista para ser facturada',
                                'La orden ha sido requerida al modulo de compras ',
                                'La orden ha sido requerida al modulo de compras',
                                'La orden ha sido cancelada',
                                'La orden ha sido detenida',
                                'La orden esta en proceso de factura',
                                'La orden ha sido facturada',
                                'La orden está en ruta',
                                'La orden ha sido entregada',
                                'La orden ha sido suspendida',
                                'Se han comprado los faltantes de la orden'];
            response.forEach(element => {
                table += `
                    <tr>
                        <td>${cont++}</th>
                        <td>${element.nombre}</td>
                        <td style="background-color: ${colores[element.estado - 1]}" >${estatus[element.estado - 1]}</td>
                        <td>${element.fecha}</td>
                        <td><p>${descripcion[element.estado - 1]}</p></td>
                    </tr>
                `;
            });
            let modalLog = `
              <div class="modal fade" id="logModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div class="modal-dialog modal-lg">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Bitacora de Requerimiento  #${num_pedido} </h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                    <div class="row" >
                        <div class="col-3" >Orden de compra: ${ordenCompra} </div>
                        <div class="col-3">No.pedido: ${num_pedido} </div>
                        <div class="col-3">Ruta: ${ruta}</div>
                        <div class="col-3">Fecha de pedido: ${fecha_pedido} </div>
                    </div>
                    <br>
                    <table class="table table-striped table-bordered " >
                        <thead class="thead-dark" >
                           <tr> 
                              <th>#</th>
                              <th>Usuario</th>
                              <th>Estado </th>
                              <th>Fecha y hora </th>
                              <th>Notas</td>
                            </tr>
                        </thead>
                        <tbody>
                            ${table}
                        </tbody>
                    </table>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-primary" data-dismiss="modal">Aceptar</button>
                  </div>
                </div>
              </div>
            </div>`;
            document.getElementById('log').innerHTML = modalLog ;
            $("#logModal").modal('show');
            
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
                    
      
            notifications(` El pedido ${response} ha sido entregado `,'success'); 
            

        }
    });

}; 

const tipoEntrega  = () =>{
    let  tipoEntrega =  document.getElementById("entrega").value;
    $("#parcial").val( tipoEntrega == 0 ? "Entrega parcial" : "Entrega completa" );
    $(selector).val();
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
cargar_pedido(false);
 $(function () {  
    $("#imgct").submit(function (e) { 
        $('#Ventana_Modal').modal('hide'); 
        e.preventDefault();
        var formData = new FormData(document.getElementById("imgct"));
        formData.append("productosArray", excelInfo);
        if((pdf_orden.value  !=  "" && orden_compra.value == "") || (pdf_orden.value  ==  "" && orden_compra.value != "")  ){
           
             return notifications("Ingrese el número de orden de compra y seleccione el archivo",'warning');
             
        } else{ 
            cargar_pedido(true);  
        $.ajax({
            url: "/ventas/add",
            type: "POST",
            dataType: "html",
            data: formData,
            success: function(response) {
                if ($('.modal-backdrop').is(':visible')) {
                    $('body').removeClass('modal-open'); 
                    $('.modal-backdrop').remove(); 
                  };
                    let num_pedido = JSON.parse(response);
                    pedidos(response);
                    pedidos_vendedores();
                    document.getElementById('button_send').innerHTML = `<button  type="submit"  class="btn btn-success btn-lg btn-block"   >Enviar</button>`;
                    $('#imgct').trigger("reset");
                    $("#comprobante").hide();
                    $("#input").hide();
                    cliente(' ');
                    $("#inputCliente").hide();
                    $("#imgct").hide();
                    $("#ocultar_excel").show();
                    $("#excel").val('');
                    notificar(); 
                    $("#excel").val('');
            },
            cache: false,
            contentType: false,
            processData: false
        });
    }
    });
});

let notificar = ()=>{
    swal({
        title: "El pedido ha sido guardado de manera exitosa",
        type: "success",
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Aceptar",
      }).then(result => {
        // swal("Deleted!", "Your file has been deleted.", "success");
        if (result.value) {
            // swall.closeModal();
            location.reload();
          
        } 
      });
};