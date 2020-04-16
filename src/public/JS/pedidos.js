
const socket = io();

let pedidos = (data) => {

    if (data == undefined  || typeof(data) == "string") {

        $.ajax({
            type: "GET",
            url: "/almacen/pedidos",
            success: function(response) {

                 if( typeof(data)  ==  "string" && data.length < 20 ) alert(`El pedido con el código ${data} ha sido cancelado`);

                 sendData( response );
                 
                 if (response.length == 0) console.log('No hay pedidos por el momento');

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



let sendData = (data) => {
    let table = '';
    ruta = ["NORTE", "SUR"];
    estatus = ['NUEVO','PROCESO','PARCIAL','COMPLETO','RUTA','CANCELADO'];
    data.forEach(data => {
        table += `<tr>
                 
                  <td> <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSNGhpmNOG1joyk_s0v1KH229zGd6CpZ0axtXRT6c6pqW4FlB2b&usqp=CAU" height="15">
                  <a  href="/almacen/pdf/${data.ruta_pdf_orden_compra}">${data.orden_de_compra}</a></td>

                  <td> <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSNGhpmNOG1joyk_s0v1KH229zGd6CpZ0axtXRT6c6pqW4FlB2b&usqp=CAU" height="15">
                  <a  href="/almacen/pdf/${data.ruta_pdf_pedido}">${data.num_pedido}</a></td>

                  <td> <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSNGhpmNOG1joyk_s0v1KH229zGd6CpZ0axtXRT6c6pqW4FlB2b&usqp=CAU" height="15">
                  <a  href="/almacen/pdf/${data.ruta_pdf_comprobante_pago}">${data.comprobante_pago}</a></td>

                  <td>${ruta[data.ruta - 1]}</td>
                  <td>${data.importe}</td> 
                  <td style="background-color:#DF3A01">${estatus[data.estatus - 1]}</td>
                  <td>${data.observacion}</td>
                  <td>${data.fecha_inicial}</td>
               
                </tr>`;
    });
    document.getElementById('pedidos').innerHTML = table;
}