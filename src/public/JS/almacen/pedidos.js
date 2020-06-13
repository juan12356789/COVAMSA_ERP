const socket = io();

let pedidos = (data) => {

    if (data == undefined || typeof(data) == "string") {

        $.ajax({
            type: "GET",
            url: "/almacen/pedidos",
            success: function(response) {

                if (typeof(data) == "string" && data.length < 20) notifications(`El pedido ${data}, ha sido cancelado. Si el surtido de la 
                orden esta en progreso, retorne los productos y cambie el estado a enterado. Si no, de click de enterado.`, 'warning');

                sendData(response);

                if (response.length == 0) console.log('NO HAY PEDIDOS POR EL MOMENTO');

            }
        });

    } else {

        sendData(JSON.parse(data));

    }

};


pedidos();

socket.on('data:pedidos', function(data) {

    pedidos(data);

});
const actualizar = (data) => {

    socket.emit('data:pedidos', data);

};


let sendData = (data) => {
    let table = '';
    ruta = ["Norte", "Sur"];
    let estatus = ['Nuevo', 'En Proceso', 'Parcial', 'Completo', 'Ruta', 'Cancelado', 'Detenido'];
    prioridad_info = ["Normal", "Normal", "Urgente"];
    colores = ["#C6AED8", "#A1DEDB ", "#DECAA1 ", "#C1DEA1 ", "#DBE09A", "#E0A09A", "#817E7E"];
    let numeracion_pedidos = 0,
        numero_de_pedidos_urgentes = 0;
    console.log(data.length);
    data.forEach(data => {
        if (data.prioridad == 2) numero_de_pedidos_urgentes++;
        table += `<tr>

                  <th scope="row">${numeracion_pedidos++}</th>
                  <td> <i class="fas fa-file-invoice" onclick="cambios_status_pedidos('${estatus[data.estatus - 1]}','${data.num_pedido}')"></i> </td>
                  <td><a  href="/almacen/pdf/${data.ruta_pdf_orden_compra}">${data.orden_de_compra}</a></td>
                  <td><a  href="/almacen/pdf/${data.ruta_pdf_pedido}">${data.num_pedido}</a></td>
                  <td><a  href="/almacen/pdf/${data.ruta_pdf_comprobante_pago}">${data.comprobante_pago}</a></td>
                  <td  style="background-color:${data.ruta ==  1 ? "#DFBC92" : "#92C1DF"} " >${ruta[data.ruta - 1]}</td>
                  <td id="userinput" >${data.importe}</td> 
                  <td style="background-color:${colores[data.estatus - 1]}" >${estatus[data.estatus - 1]}</td>
                  <td >${prioridad_info[data.prioridad]}</td>
                  <td >  <p class="line-clamp" >${data.observacion}</p></td>
                  <td>${data.fecha_inicial}</td>
               
                </tr>`;
    });
    document.getElementById('numero_pedidos').innerHTML = `Total De Pedidos: <input type="text"  value="${numeracion_pedidos}" disabled>  Pedidos Urgentes: <input type="text"  value="${numero_de_pedidos_urgentes}" disabled>`;

    document.getElementById('pedidos').innerHTML = table;
}


const chanche_estatus_almacen = (order) => {
    $('#change_status').modal('hide');
    let estado_nuevo = document.getElementById('estado_nuevo').value;
    $.ajax({
        type: "POST",
        url: "/almacen/cambio_estado",
        data: { estado_nuevo, order },
        success: function(response) {
            notifications(`El estado del pedido ${order} ha sido cambiado `, 'success');
            pedidos();
            actualizar();
        }
    });

};

/*  preguntarle a rosa para que es esto 
document.getElementById("userinput").onblur = function() {

    //number-format the user input
    this.value = parseFloat(this.value.replace(/,/g, ""))
        .toFixed(2)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    //set the numeric value to a number input
    document.getElementById("number").value = this.value.replace(/,/g, "")

}*/