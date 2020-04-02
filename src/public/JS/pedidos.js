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
<<<<<<< HEAD
        sendData(response);
=======
        sendData(data);
>>>>>>> adb1326d29f0c5df3f6ce814e69289bf6662b1a3
    }
};

pedidos();
socket.on('data:pedidos', function(data) {

    pedidos(JSON.parse(data));
});



let sendData = (data) => {
<<<<<<< HEAD
    let table = '';
        ruta = ["NORTE", "SUR"];
        estatus = ['NUEVO'];
=======

    let table = '';
    ruta = ["NORTE", "SUR"];

    // <<<<<<< HEAD
    estatus = ['NUEVO'];
    // =======
    estatus = ['CAPTURADO'];
    console.log(data);

    // >>>>>>> e1a29f5084fd438115f622d8b17999011c482dc6
>>>>>>> adb1326d29f0c5df3f6ce814e69289bf6662b1a3
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
<<<<<<< HEAD
                </tr>`; 
    });
    document.getElementById('pedidos').innerHTML = table; 
}
=======
                </tr>`;
    });
    document.getElementById('pedidos').innerHTML = table;
}

function cambiar_color_over(celda) {
    celda.style.backgroundColor = "#66ff33"
}

$(function() {
    $('#table td:last-child:contains(1)').closest('td').css('background-color', 'red');
    $('#table td:last-child:contains(2)').closest('td').css('background-color', 'blue');

    // Así sucesivamente hasta llegar al 10
});
>>>>>>> adb1326d29f0c5df3f6ce814e69289bf6662b1a3
