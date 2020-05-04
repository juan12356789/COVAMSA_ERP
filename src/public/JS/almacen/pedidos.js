const socket = io();

let pedidos = (data) => {

    if (data == undefined || typeof(data) == "string") {

        $.ajax({
            type: "GET",
            url: "/almacen/pedidos",
            success: function(response) {

                if (typeof(data) == "string" && data.length < 20) alert(`EL PEDIDO CON EL CÓDIGO ${data} HA SIDO CANCELADO`);

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
    console.log(data);

    pedidos(data);

});


let sendData = (data) => {
    let table = '';
    ruta = ["NORTE", "SUR"];
    estatus = ['NUEVO', 'EN PROCESO', 'PARCIAL', 'COMPLETO', 'RUTA', 'CANCELADO', 'URGENTE'];
    prioridad_info = ["NORMAL", "NORMAL", "URGENTE"];
    colores = ["#C6AED8", "#A1DEDB ", "#DECAA1 ", "#C1DEA1 ", "#DBE09A", "#E0A09A", "#817E7E"];
    data.forEach(data => {
        table += `<tr>
                 
                  <td><a  href="/almacen/pdf/${data.ruta_pdf_orden_compra}">${data.orden_de_compra}</a></td>

                  <td><a  href="/almacen/pdf/${data.ruta_pdf_pedido}">${data.num_pedido}</a></td>

                  <td><a  href="/almacen/pdf/${data.ruta_pdf_comprobante_pago}">${data.comprobante_pago}</a></td>
                
                  <td  style="background-color:${data.ruta ==  1 ? "#DFBC92" : "#92C1DF"} " >${ruta[data.ruta - 1]}</td>
                  <td id="userinput" >${data.importe}</td> 
                  <td style="background-color:${colores[data.estatus - 1]}">${estatus[data.estatus - 1]}</td>
                  <td >${prioridad_info[data.prioridad]}</td>
                  <td>${data.observacion}</td>
                  <td>${data.fecha_inicial}</td>
               
                </tr>`;
    });
    document.getElementById('pedidos').innerHTML = table;
}

document.getElementById("userinput").onblur = function() {

    //number-format the user input
    this.value = parseFloat(this.value.replace(/,/g, ""))
        .toFixed(2)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    //set the numeric value to a number input
    document.getElementById("number").value = this.value.replace(/,/g, "")

}