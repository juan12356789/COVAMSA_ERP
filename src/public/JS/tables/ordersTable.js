const socket = io();
let orderTable = () => {

    dataTable = $("#orders").DataTable({
        "order": [
            [7, "desc"]
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
            { data: 'estatus' },
            { data: 'observacion' },
            { data: 'fecha_inicial' }, {
                sortable: false,
                "render": function(data, type, full, meta) {
                    let disabled = ''
                    if (full.estatus == "CANCELADO") disabled = 'disabled';
                    return `<button type="button" class="btn btn-danger" onclick="cancelOrder('${full.num_pedido}')" class="close" ${disabled}   ><img src="https://image.flaticon.com/icons/svg/1936/1936477.svg" height="30" alt=""></button><br>`;
                }
            }

        ]

    });


};

let piorityTable = () => {

    tablePriority = $("#orders_priority").DataTable({
        "order": [
            [7, "desc"]
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
            { data: 'estatus' },
            { data: 'observacion' },
            { data: 'fecha_inicial' }, {
                sortable: false,
                "render": function(data, type, full, meta) {
                    let disabled = ''
                    if (full.estatus == "CANCELADO") disabled = 'disabled';
                    return `<button type="button" class="btn btn-primary" onclick="cancelOrder('${full.num_pedido}')" class="close"  ${disabled}   >Normal</button>
                            <button type="button" class="btn btn-secondary" onclick="cancelOrder('${full.num_pedido}')" class="close" ${disabled}   >urgente</button><br>`;
                }
            }

        ]

    });


};


let pedidos_urgentes_normales = (tipo_de_pedido) => {

    $.ajax({
        type: "POST",
        url: "/admin/urgentes",
        data: { tipo_de_pedido },
        success: function(response) {
            let ruta = ['NORTE', 'SUR'];
            let estatus = ['NUEVO', 'EN PROCESO', 'PARCIAL', 'COMPLETO', 'RUTA', 'CANCELADO', 'URGENTE'];

            response.filter(n => n.ruta = ruta[n.ruta - 1]);
            response.filter(n => n.estatus = estatus[n.estatus - 1]);

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

let pedidos = (data) => {

    socket.emit('data:pedidos', data);

};