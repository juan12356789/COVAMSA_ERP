const socket = io();

let orderTable = () => {

        dataTable = $("#orders").DataTable({
                    "order": [
                        [9, "desc"]
                    ],
                    "fnRowCallback": function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        if (aData.estatus == 6) $('td', nRow).css('color', '#CE2B2B');
                    },
                    columns: [{
                                sortable: false,
                                "render": function(data, type, full, meta) {
                                    return `<a href="/almacen/pdf/${full.ruta_pdf_orden_compra}" >${full.orden_de_compra}</a>`;
                                }
                            }, {
                                sortable: false,
                                "render": function(data, type, full, meta) {
                                    return `<a href="/almacen/pdf/${full.ruta_pdf_pedido}" >${full.num_pedido}</a>`;
                                }
                            }, {
                                sortable: false,
                                "render": function(data, type, full, meta) {

                                    return `<a href="/almacen/pdf/${full.ruta_pdf_comprobante_pago}" >${full.comprobante_pago ==''?'<a href="#"> COMPROBANTE</a>':full.comprobante_pago }</a>`;
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
        } , 
        },
            { data: 'fecha_inicial' }, {
                sortable: false,
                "render": function(data, type, full, meta) {
                    if(full.estatus <= 3 || full.estatus == 7  )return `<button type="button" class="btn btn-danger" onclick="cancelOrder('${full.num_pedido}')" class="close"    ><img src="https://image.flaticon.com/icons/svg/1936/1936477.svg" height="30" alt=""></button><br>`;
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
        columns: [{
                sortable: false,
                "render": function(data, type, full, meta) {
                    return `<a href="/almacen/pdf/${full.ruta_pdf_orden_compra}" >${full.orden_de_compra}</a>`;
                }
            }, {
                sortable: false,
                "render": function(data, type, full, meta) {
                    return `<a href="/almacen/pdf/${full.ruta_pdf_pedido}" >${full.num_pedido}</a>`;
                }
            }, {
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
            },
            { data: 'fecha_inicial' }, {
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
            let estatus = ['Nuevo', 'En Proceso', 'Parcial', 'Completo', 'Ruta', 'Cancelado', 'Detenido'];
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