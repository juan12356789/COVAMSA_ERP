const excelInfo = [];

const uploadExcel = () => {

    var csvFile = $('#excel')[0].files[0];
    if (csvFile == undefined) return notifications(`Seleccione algún archivo `, 'warning');
    if (csvFile.name.substring(csvFile.name.lastIndexOf(".")) != ".xlsx") return notifications(`Sólo se adminten archivos .xlsx`, 'warning');
    $("#ocultar_excel").hide();

    var data = new FormData();
    data.append('excel', csvFile);

    var request = $.ajax({
        url: '/excel',
        method: 'POST',
        contentType: false,
        processData: false,
        data: data,
        dataType: "html"
    });

    request.done(function(msg) {

        if (msg == "null") return notifications(`No se en cuentra ese cliente en la base de datos`, 'warning');
        let info = JSON.parse(msg);
        excelInfo.push(msg);
        notifications("Ha sido importado de manera correcta", 'success');
        $("#imgct").show();
        $("#infoPedido").val(info.Sheet1[info.Sheet1.length - 1].cotizacion);
        $("#fecha_pedido").val(info.Sheet1[info.Sheet1.length - 1].fecha.split('/').reverse().join('-'));
        $("#importe").val(info.Sheet1[info.Sheet1.length - 1].total.replace(',', ''));
        $("#numero_partidas").val(info.Sheet1[info.Sheet1.length - 1].numero_partidas);
        $("#nombre_cliente").val(info.Sheet1[info.Sheet1.length - 1].cliente);
        $("#tipo_entrega").val(info.Sheet1[info.Sheet1.length - 1].prioridadE == 0 ? "Entrega parcial" : "Entrega  completo");
        cliente(info.cliente);

    });

    request.fail(function(jqXHR, textStatus) {
        alert("Hubo un error: " + textStatus);
    });

};

const orderDetail = () => {

    let info = JSON.parse(excelInfo),
        n = false,
        pedido = ``;
    console.log(info);

    info.Sheet1.forEach(element => {
        if (element.K == "Subtotal") n = false;
        if (n) {
            pedido += `
              <tr>
               <td>${element.C}</td>
               <td>${element.F}</td>
               <td>${element.O}</td>
              </tr>
            `;
        }
        if (element.C == "Clave") n = true;

    });
    let ventana = `
         <div class="modal fade" id="orden" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-labelledby="staticBackdropLabel" aria-hidden="true">
         <div class="modal-dialog  modal-dialog-scrollable modal-lg"  >
           <div class="modal-content">
             <div class="modal-header">
               <h5 class="modal-title" id="staticBackdropLabel">Modal title</h5>
               <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                 <span aria-hidden="true">&times;</span>
               </button>
             </div>
             <div class="modal-body">
                  <table  class="table" >
                  <thead  class="thead-dark" >
                      <th>Clave</th>
                      <th>Nombre</th>
                      <th>Cantidad</th>
                  </thead>
                  <tbody id="cuerpo" >
                   ${pedido}
                  </tbody>
                </table>
             </div>
             <div class="modal-footer">
               <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
               <button type="button" class="btn btn-primary">Understood</button>
             </div>
           </div>
         </div>
       </div>
      `;
    document.getElementById('detallesPedido').innerHTML = ventana;
    $('#orden').modal('show');

};

const orderDatailMisPedidos = id => {

    $.ajax({
        type: "POST",
        url: "/excel/excelDetail",
        data: { pedido: id },
        success: function(response) {
            let pedido = ``;
            response.forEach(element => {

                pedido += `
              <tr>
               <td>${element.clave}</td>
               <td>${element.cantidad}</td>
               <td>${element.nombre}</td>
              </tr>
            `;


            });
            let ventana = `
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

}