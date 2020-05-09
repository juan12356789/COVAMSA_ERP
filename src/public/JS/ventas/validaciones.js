const socket = io();
const dot_obervaciones = document.querySelector("#observaciones");

$("#spinner").hide();


// $("#tusClientes").click(function(e) {
let clickClientes = () => {

    $('.col-sm-8').val("");
    let words = '';
    clientes();

};

<<
<<
<< < HEAD
$(#inputBusqueda ").click(function(e) {
        e.preventDefault(); $("#inputBusqueda").on('keydown', function() {

                clientes($("#inputBusqueda").val()) ===
                    ===
                    =
                    $("#inputBusqueda").click(funct i on(e) {
                        e.preventDefault();
                        $("#inputBusqueda").on('keydown', function() {

                            clientes($("#inputBusqueda").val()) >>>
                                >>>
                                > est
                        });

                    });

                let clientes = (words = '') => { <<
                        <<
                        << < HEAD
                        let validacio = 1;

                        if (words.length == 0 || words.length == 1) validacio = 2;
                        $.post("/ventas", { words: words, validaciones: validacio }, function(data) {
                                console.log(data);
                                if (data.length == 0) return document.getElementById("clientes").innerHTML = "<br><p>No se encuentra en la base de dato...<p>"; ===
                                ===
                                =
                                let validacio = 1;

                                if (words.length == 0 || words.length == 1) validacio = 2;
                                $.post("/ventas", { words: words, validaciones: validacio }, function(data) {
                                    console.log(data);
                                    if (data.length == 0) return document.getElementById("clientes").innerHTML = "<br><p>No se encuentra en la base de dato...<p>"; >>>
                                    >>>
                                    > est
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
       <div class=" row  ">
      
       <div class="col-sm-12">
         <input type="text"  class="form-control valid border border-secondary" value="${nombre}" name="nombre" require readonly >
       </div>
       </div>
       
    `;
                                $("#inputCliente").show();
                                document.getElementById('inputCliente').innerHTML = mandar;

                            };

                            $(document).ready(function() {


                                document.getElementById('button_send').innerHTML = `<button  type="submit"  class="btn btn-success btn-lg btn-block"   >Enviar</button>`;

                                dataTable = $("#orders").DataTable({
                                    "order": [
                                        [8, "desc"]
                                    ],

                                    "fnRowCallback": function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                                        if (aData.estatus == 6) $('td', nRow).css('color', 'red');
                                    },
                                    columns: [{
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
                                        //  { data: 'observacion' },
                                        { data: 'fecha_inicial' }, {
                                            sortable: false,
                                            "render": function(data, type, full, meta) {
                                                if (full.estatus <= 3) return `<button type="button" class="btn btn-danger" onclick="cancelOrder('${full.num_pedido}')" class="close"    ><img src="https://image.flaticon.com/icons/svg/1936/1936477.svg" height="30" alt=""></button><br>`;
                                                return ' ';
                                            }
                                        }

                                    ]

                                });
                                const para = document.querySelector('p');
                                shave(para, 1);
                                pedidos_vendedores();
                            });

                        };

                        <<
                        <<
                        << < HEAD
                        let cancelOrder = (order) => {

                                reson_to_cancel(order);
                                let inputReason = document.getElementBy
                                I d('motivo_cancelacion');
                                $("#aceptar").click(function(e) {
                                        if (inputReason.value == '' || inputReason.value.length < 30) return alert('Ingrese la razón de cancelación  con un mínimo de 30 caracteres');
                                        $.post("/ventas/cancel", { data: order, reason: inputReason.value }, function(data) {

                                                pedidos_vendedores();

                                                pedidos(order);
                                                $('#Ventana_Modal_order').modal('hide'); ===
                                                ===
                                                =
                                                let pedidos_vendedores = () => {
                                                    $.ajax({
                                                        type: "POST",
                                                        url: "/ventas/pedidos_vendedor",
                                                        success: function(response) {
                                                            let ruta = ['NORTE', 'SUR'];
                                                            let estatus = ['NUEVO', 'EN PROCESO', 'PARCIAL', 'COMPLETO', 'RUTA', 'CANCELADO', 'URGENTE'];
                                                            let prioridad_info = ["NORMAL", "NOMRAL", "URGENTE"];
                                                            response.filter(n => n.ruta = ruta[n.ruta - 1]);

                                                            response.filter(n => n.nombre_estatus = estatus[n.estatus - 1]);
                                                            response.filter(n => n.prioridad = prioridad_info[n.prioridad]);
                                                            dataTable.rows().remove();
                                                            dataTable.rows.add(response).draw();
                                                        }
                                                    });

                                                };

                                                let cancelOrder = (order) => {

                                                    reson_to_cancel(order);
                                                    let inputReason = document.getElementById('motivo_cancelacion');
                                                    $("#aceptar").click(function(e) {
                                                        if (inputReason.value == '' || inputReason.value.length < 30) return alert('Ingrese la razón de cancelación  con un mínimo de 30 caracteres');
                                                        $.post("/ventas/cancel", { data: order, reason: inputReason.value }, function(data) {

                                                            pedidos_vendedores();
                                                            pedidos(order);
                                                            $('#Ventana_Modal_order').modal('hide');

                                                        });
                                                    });

                                                };

                                                // socket -----------
                                                const pedidos = (data) => {

                                                    socket.emit('data:pedidos', data); >>>
                                                    >>>
                                                    > est

                                                });
                                        });

                                };

                                // socket -----------
                                <<

                                <<
                                <<
                                <
                                HEAD
                                const pedidos = (data) => {
                                        console.log(data);

                                        socket.emit('data:pedidos', data); ===
                                        ===
                                        =
                                        const pedidos = (data) => {

                                            socket.emit('data:pedidos', data); >>>
                                            >>>
                                            >
                                            est

                                        };

                                        <<
                                        <<
                                        << < HEAD
                                        socket.on('data:pedidos', function(data) {
                                            pedidos_vendedores();

                                        });

                                        // componente guardar  
                                        var correoPrioridad = document.getElementById('prioridad');
                                        $("#prioridad").click(function(e) {

                                            if (correoPrioridad.value == 0) {
                                                document.getElementById('button_send')
                                                    .innerHTML = `<button  type="submit"  class="btn btn-success btn-lg btn-block"   >Enviar</button>`;
                                            } else {
                                                document.getElementById('button_send').innerHTML = `<button   type="button"  class="btn btn-success btn-lg btn-block"  onclick="order_priority()" >Enviar</button>`;
                                            }

                                        });

                                        $(function() {
                                                    $("#imgct").submit(function(e) {
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
                                                                            $("#spinner").hide();
                                                                        } else {
                                                                            pedidos(response);
                                                                            pedidos_vendedores(); <<
                                                                            <<
                                                                            <<
                                                                            <
                                                                            HEAD
                                                                            alert('El pedido ha sigo guardado con éxito '); ===
                                                                            ===
                                                                            =
                                                                            // alert('El pedido ha sigo guardado con éxito '); 
                                                                            >>>
                                                                            >>>
                                                                            >
                                                                            est
                                                                            $("#spinner").hide();
                                                                            $('input[type="text"]').removeAttr('disabled');
                                                                            $('input[type="file"]').removeAttr('disabled');
                                                                            $('button[type="submit"]').removeAttr('disabled');
                                                                            $('button[type="button"]').removeAttr('disabl
                                                                                e d ');
                                                                                $('select').removeAttr('disabled'); $('#imgct').trigger("reset"); cliente(' '); $("#inputCliente").hide();
                                                                            }
                                                                        },
                                                                        cache: false,
                                                                            contentType: false,
                                                                            processData: false
                                                                    })
                                                            });
                                                    }); ===
                                                ===
                                                =
                                                $(function() {
                                                        $("#imgct").submit(function(e) {
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
                                                                            $('button[type="submit"]').attr('disabled', 'dis
                                                                                    a bled ');
                                                                                    $('button[type="button"]').attr('disabled', 'disabled'); $('select').attr('disabled', 'disabled'); $("#spinner").show(); // Le quito la clase que oculta mi animación 

                                                                                },
                                                                                success: function(response) {

                                                                                    if (response == 'false') {
                                                                                        alert('El pedido no ha sigo  guardado favor de revisar los campos ');
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
                                                                                        cliente(' ');
                                                                                        $("#inputCliente").hide();
                                                                                    }
                                                                                },
                                                                                cache: false,
                                                                                contentType: false,
                                                                                processData: false
                                                                        })
                                                                });
                                                        }); >>>
                                                    >>>
                                                    > est