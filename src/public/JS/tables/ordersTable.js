const socket = io();

let orderTable = () => {

    dataTable = $("#orders").DataTable({
        "order": [
            [9, "desc"]
        ], 
        "fnRowCallback": function(nRow, aData, iDisplayIndex, iDisplayIndexFull) { 
             if(aData.estatus == 6)    $('td', nRow).css('color', 'red');  
            } ,
        columns: [{
            sortable: false,
            "render": function (data, type, full, meta) {
                return `<a href="/almacen/pdf/${full.ruta_pdf_orden_compra}" >${full.orden_de_compra}</a>`;
            }
        }, {
            sortable: false,
            "render": function (data, type, full, meta) {
                return `<a href="/almacen/pdf/${full.ruta_pdf_pedido}" >${full.num_pedido}</a>`;
            }
        },{
            sortable:false,
            "render": function(data, type, full ,meta){
             let pagos  = ['TRANSFERENCIA','ANTICIPADO','CONTRA ENTREGA','CREDITO'];  
             return `${pagos[ full.tipo_de_pago - 1 ]}`;
        
            }  
          },
        { data: 'ruta' },
        { data: 'importe' },
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
            },
            { data: 'ruta' },
            { data: 'importe' },
            { data: 'nombre_estatus' },
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
                    if (full.estatus <= 3) return `<button type="button" class="btn btn-danger" onclick="cancelOrder('${full.num_pedido}')" class="close"    ><img src="https://image.flaticon.com/icons/svg/1936/1936477.svg" height="30" alt=""></button><br>`;
                    return ' ';
                }
            }

        ]

    });


};

let piorityTable = () => {

    tablePriority = $("#orders_priority").DataTable({
        "order": [
            [8, "desc"]
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
            },
            { data: 'ruta' },
            { data: 'importe' },
            { data: 'nombre_estatus' },
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
                    return `<button type="button" class="btn btn-success  btn-sm" style="width: 100%; onclick="pedidos_urgentes_normales(${3},'${full.num_pedido}',${2})"    >Aceptar</button>
                            <button type="button" class="btn btn-danger btn-sm" style="width: 100%; onclick="pedidos_urgentes_normales(${3},'${full.num_pedido}',${0})"    >Rechazar</button>`;
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
            if (tipo_de_pedido == 3) {
                pedidos_urgentes_normales(1, null, null);
                pedidos_urgentes_normales(2, null, null);
                pedidos();
                return;
            }

            let ruta = ['NORTE', 'SUR'];
            let estatus = ['NUEVO', 'EN PROCESO', 'PARCIAL', 'COMPLETO', 'RUTA', 'CANCELADO', 'DETENIDO'];
            let prioridad_info = ["NORMAL", "NORMAL", "URGENTE"];

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

let cancelOrder = (order) => {

    reson_to_cancel(order);
    let inputReason = document.getElementById('motivo_cancelacion');
    $("#aceptar").click(function(e) {
        if (inputReason.value == '') return alert('Ingrese la razón de cancelación ');
        $.post("/ventas/cancel", { data: order, reason: inputReason.value }, function(data) {

            pedidos_urgentes_normales(1);
            pedidos(order);
            $('#Ventana_Modal_order').modal('hide');

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