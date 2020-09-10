const socket = io();

let orderTable = () => {

        dataTable = $("#orders").DataTable({
                    "order": [
                        [9, "desc"]
                    ],
                    "fnRowCallback": function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        if (aData.estatus == 6) $('td', nRow).css('color', 'red');
                    },
                    columns: [
                     
                        {
                            sortable: false,
                            "render": function(data, type, full, meta) {
                                return `<a href="/almacen/pdf/${full.ruta_pdf_pedido}" >${full.num_subpedido == null ? full.num_pedido : full.num_subpedido}</a>`;
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
                            },{
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
                                        return `${full.nombre_estatus == "Detenido"?`<a href="#"  onclick="uploadFileTransferencia('${full.num_pedido}')">${full.nombre_estatus}</a>`:full.nombre_estatus}`;
                  }
            },
             { data: 'prioridad' },
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
                    
                 return `  <i class="fas fa-list-ul"  onclick="logPartidas('${full.id_pedido}')" ></i>`;
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
                if(full.estatus != 6 )return `<center><i class="fas fa-trash-alt" onclick="cancelOrder('${full.id_pedido}')" ></i></center>`;
                return ' '; 
               }  
             }

            ]

    });


};

let piorityTable = () => {

    tablePriority = $("#orders_priority").DataTable({
        "order": [
            [9, "desc"]
        ],
        columns: [
            {
                sortable: false,
                "render": function(data, type, full, meta) {
                    return `<a href="/almacen/pdf/${full.ruta_pdf_pedido}" >${full.num_subpedido == null ? full.num_pedido : full.num_subpedido}</a>`;
                }
            },{
                sortable: false,
                "render": function(data, type, full, meta) {
                    return `<a href="/almacen/pdf/${full.ruta_pdf_orden_compra}" >${full.orden_de_compra}</a>`;
                }
            },  {
                sortable: false,
                "render": function(data, type, full, meta) {
                    return `<a href="/almacen/pdf/${full.ruta_pdf_comprobante_pago}" >${full.comprobante_pago}</a>`;
                }
            },{
                sortable:false,
                "render": function(data, type, full ,meta){
                 let pagos  = ['Transferencia','Anticipado','Contra Entrega','Crédito'];  
                 return `${pagos[ full.tipo_de_pago - 1 ]}`;
            
                }  
              },
            { data: 'ruta' },
            { data: 'importe' },
            {
                sortable:false,
                "render": function (data, type, full ,meta) {
                    return `${full.nombre_estatus == "Detenido"?`${full.nombre_estatus}`:full.nombre_estatus}`;
                  }
            },
            { data: 'prioridad' },
            {
                sortable: false,
                "render": function(data, type, full, meta) {

                    return `  <p class="line-clamp" >${full.observacion}</p>`;
                }
            },{ data: 'fecha_inicial' },{
                sortable: false,
                "render": function(data, type, full, meta) {
                   return `<i class="fas fa-tools" onclick="orderDatailMisPedidosUrgentes('${full.id_pedido}',1)"  ></i>`;
               }
           },
             {
                sortable: false,
                "render": function(data, type, full, meta) {
                    let disabled = ''
                    if (full.estatus == "CANCELADO") disabled = 'disabled';
                    return `<button type="button" class="btn btn-success  btn-sm" style="width: 100%;" onclick="pedidos_urgentes_normales(${3},'${full.num_pedido}',${2})"    >Aceptar</button>
                            <button type="button" class="btn btn-danger btn-sm" style="width: 100%;" onclick="pedidos_urgentes_normales(${3},'${full.num_pedido}',${0})"    >Rechazar</button>`;
                }
            }

        ]

    });


};


let pedidos_urgentes_normales = (tipo_de_pedido, numero_pedido, tipo_prioridad) => {
   
    $.ajax({
        type: "POST",
        url: "/admin/urgentes",
        data: { tipo_de_pedido, numero_pedido, tipo_prioridad },
        success: function(response) {
            
            if(response === '2' )notifications(`El pedido ha sido aceptado como  Urgente `,'success');
            if(response === '0' )notifications(`El pedido se ha aceptado como Normal  `,'success');
            
            if (tipo_de_pedido == 3) {
                pedidos_urgentes_normales(1, null, null);
                pedidos_urgentes_normales(2, null, null);
                pedidos();
                return;
            }

            let ruta = ['Norte', 'Sur'];
            
            let estatus = ['Nuevo', 'Surtiendo', 'Facturable', 'Requerir y facturar ', 'Requerir', 'Cancelado', 'Detenido','Facturando','Facturado','Ruta','Entregado','Suspendida','Comprado'];
            let prioridad_info = ["Normal", "Normal", "Urgente"];

            response.filter(n => n.ruta = ruta[n.ruta - 1]);
            response.filter(n => n.nombre_estatus = estatus[n.estatus - 1]);
            response.filter(n => n.prioridad = prioridad_info[n.prioridad]);

            if (tipo_de_pedido == 1) {

                dataTable.rows().remove();
                dataTable.rows.add(response).draw();
                
            } else {
                tablePriority.rows().remove();
                tablePriority.rows.add(response).draw();

            }
        }
    });

};

const logPartidas  = id  =>{
    
    $.ajax({type: "POST",url: "/ventas/log",data: {id : id},success: function (response) {
            let table = ``,cont = 1; 
            let estatus = ['Nuevo', 'Surtiendo', 'Facturable', 'Requerir y facturar ', 'Requerir', 'Cancelado', 'Detenido','Facturando','Facturado','Ruta','Entregado','Suspendida','Comprado'];
            let colores = ["#C6AED8", "#A1DEDB ", "#DECAA1 ", "#C1DEA1 ", "#DBE09A", "#E0A09A", "#817E7E","#B4EFED","#98F290","#F2FE9C","#D4FEA8","#F1C078","#E1FCE3"];
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
                    <h5 class="modal-title" id="exampleModalLabel">Bitacora de Requerimiento</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
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
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-primary">Aceptar</button>
                  </div>
                </div>
              </div>
            </div>`;
            document.getElementById('log').innerHTML = modalLog ;
            $("#logModal").modal('show');
            
        }
    });

}; 

let info_tables = () =>{
    info_table  = $("#data").DataTable({
        columns: [
            { data: 'clave' },
            {data:'nombre'}

        ]

    });
}; 

let clientes = () =>{
    info_clientes  = $("#clientes").DataTable({
        columns: [
            { data: 'nombre' },
            {data:'numero_interno'}

        ]

    });
}; 

const info_admin = (  ) => {

    $.ajax({type: "POST",url: "/admin/data",success: function (response) {
    ;
        
    
            info_table.rows().remove();
            info_table.rows.add(response).draw();
    
            
        }
    });

}; 
const info_cliente = (  ) => {

    $.ajax({type: "POST",url: "/admin/cliente",success: function (response) {
        
        
        
            info_clientes.rows().remove();
            info_clientes.rows.add(response).draw();
        
            
        }
    });

}; 

let cancelOrder = (order) => {

    reson_to_cancel(order);
    let inputReason = document.getElementById('motivo_cancelacion');
    $("#aceptar").click(function(e) {
        if (inputReason.value == '') return  notifications(" Ingrese la razón de cancelación  con un mínimo de 30 caracteres",'warning');
        $.post("/ventas/cancel", { data: order, reason: inputReason.value }, function(data) {
            pedidos_urgentes_normales(1);
            pedidos(order);
            $('#Ventana_Modal_order').modal('hide');
            notifications(`El pedido con el numero "${order}" ha sido cancelado`,'success');

        });
    });

};

socket.on('data:pedidos', function(data) {

    pedidos_urgentes_normales(1);
    pedidos_urgentes_normales(2);

});

let pedidos = (data) => {

    socket.emit('data:pedidos', data);

};

// se ven los detalles de la orden 
const  orderDatailMisPedidos =  (id , opcion = 0)  =>{

    $.ajax({ type: "POST",url: "/excel/excelDetail",data: {pedido: id},   success: function (response) {
        let pedido  = `` , cont  = 1 ; 
        response.forEach(element => {

          pedido  +=  `
            <tr>
             <td>${cont++}</td>  
             <td>${element.clave}</td>
             <td>${element.cantidad}</td>
             <td>${element.nombre}</td>
            </tr>
          `; 
 
       
    });
       let ventana  = `
       <div class="modal fade" id="detalleMisPpedidos" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-labelledby="staticBackdropLabel" aria-hidden="true">
       <div class="modal-dialog  modal-dialog-scrollable modal-lg"  >
         <div class="modal-content">
           <div class="modal-header">
             <h5 class="modal-title" id="staticBackdropLabel">Información pedidos</h5>
             <button type="button" class="close" data-dismiss="modal" aria-label="Close">
               <span aria-hidden="true">&times;</span>
             </button>
           </div>
           <div class="modal-body">
            <div class="container" >
                <table  class="table" >
                <thead  class="thead-dark" >
                    <th>#</th>
                    <th>Clave</th>
                    <th>Nombre</th>
                    <th>Cantidad</th>
                </thead>
                <tbody id="cuerpo" >
                 ${pedido}
                </tbody>
              </table>
            </div>
           </div>
           <div class="modal-footer">
             <button type="button" class="btn btn-success" data-dismiss="modal">Aceptar</button>
           </div>
         </div>
       </div>
     </div>
    `;
        document.getElementById('detalle_mis_pedidos').innerHTML = ventana;
        $('#detalleMisPpedidos').modal('show');
   
      }
    });
    
 };

 const  orderDatailMisPedidosUrgentes =  id   =>{

    $.ajax({ type: "POST",url: "/excel/excelDetail",data: {pedido: id},   success: function (response) {
        let pedido  = `` , cont  = 1 ; 
        response.forEach(element => {

          pedido  +=  `
            <tr>
             <td>${cont++}</td>  
             <td>${element.clave}</td>
             <td>${element.cantidad}</td>
             <td>${element.nombre}</td>
            </tr>
          `; 
 
       
    });
       let ventana  = `
       <div class="modal fade" id="detalleMisPpedidosUrgentes" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-labelledby="staticBackdropLabel" aria-hidden="true">
       <div class="modal-dialog  modal-dialog-scrollable modal-lg"  >
         <div class="modal-content">
           <div class="modal-header">
             <h5 class="modal-title" id="staticBackdropLabel">Información pedidos</h5>
             <button type="button" class="close" data-dismiss="modal" aria-label="Close">
               <span aria-hidden="true">&times;</span>
             </button>
           </div>
           <div class="modal-body">
            <div class="container" >
                <table  class="table" >
                <thead  class="thead-dark" >
                    <th>#</th>
                    <th>Clave</th>
                    <th>Nombre</th>
                    <th>Cantidad</th>
                </thead>
                <tbody id="cuerpo" >
                 ${pedido}
                </tbody>
              </table>
            </div>
           </div>
           <div class="modal-footer">
             <button type="button" class="btn btn-success" data-dismiss="modal">Aceptar</button>
           </div>
         </div>
       </div>
     </div>
    `;
        document.getElementById('detalle_mis_pedidos_urgentes').innerHTML = ventana;
        $('#detalleMisPpedidosUrgentes').modal('show');
        
   
      }
    });
    
 };
 