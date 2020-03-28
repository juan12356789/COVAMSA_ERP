const socket = io();

let pedidos = (data) => {
    if (data == undefined) {
        $.ajax({
            type: "GET",
            url: "/almacen/pedidos",
            success: function(response) {
                sendData(response);
                if (response.length == 0) console.log('No hay pedidos por el momento');
            }
        });
    } else {
       sendData(data);
    }
};
pedidos();
socket.on('data:pedidos', function(data) {

    pedidos(JSON.parse(data));
});

let sendData = (data) => {
    
    let table = '';
        ruta = ["NORTE", "SUR"];
<<<<<<< HEAD
        estatus = ['NUEVO'];
=======
        estatus = ['CAPTURADO'];
        console.log(data);
        
>>>>>>> e1a29f5084fd438115f622d8b17999011c482dc6
    data.forEach(data => {
        table+= `<tr>
                  <td> <a  href="/almacen/pdf/${data.ruta_pdf_orden_compra}">${data.orden_de_compra}</a></td>
                  <td> <a  href="/almacen/pdf/${data.ruta_pdf_pedido}">${data.num_pedido}</a></td>
                  <td> <a  href="/almacen/pdf/${data.ruta_pdf_comprobante_pago}">${data.comprobante_pago}</a></td>
                  <td>${ruta[data.ruta - 1]}</td>
                  <td>${data.importe}</td> 
                  <td>${estatus[data.estatus - 1]}</td> 
                  <td>${data.observacion}</td>
                  <td>${data.fecha_inicial}</td>
                </tr>`; 
        
    
    });
    document.getElementById('pedidos').innerHTML = table;
}