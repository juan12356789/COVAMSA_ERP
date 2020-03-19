const socket = io();

let pedidos = (data) => {
    if (data == undefined) {
        $.ajax({
            type: "GET",
            url: "/almacen/pedidos",
            success: function(response) {
                sendData(response);
                if (response == []) console.log('No hay pedidos por el momento');
            }
        });
    } else {
        sendData(data)
    }
};
pedidos();
socket.on('data:pedidos', function(data) {
    pedidos(data);
});

let sendData = (data) => {
    console.log(data);
    let table = '',
        ruta = ["NORTE", "SUR"],
        estatus = ['CAPTURADO'];
    data.forEach(data => {
        table += `<tr>
                    <td>${data.orden_de_compra}</td>
                    <td>${data.num_pedido}</td>
                    <td>${data.comprobante_pago}</td>
                    <td>${ruta[data.ruta - 1]}</td>
                    <td>${data.importe}</td> 
                    <td>${estatus[data.estatus - 1]}</td> 
                    <td>${data.observacion}</td>
                    <td>${data.fecha_inicial}</td>
                    <td> <a href="/almacen/pdf/${data.ruta_pdf_orden_compra}"><img src="https://t2.uc.ltmcdn.com/images/4/1/4/img_como_escribir_en_un_pdf_19414_600.jpg" width="40" ></a></td>
                    <td> <a href="/almacen/pdf/${data.ruta_pdf_pedido}"><img src="https://t2.uc.ltmcdn.com/images/4/1/4/img_como_escribir_en_un_pdf_19414_600.jpg" width="40" ></a></td>
                    <td> <a href="/almacen/pdf/${data.ruta_pdf_comprobante_pago}"><img src="https://t2.uc.ltmcdn.com/images/4/1/4/img_como_escribir_en_un_pdf_19414_600.jpg" width="40" ></a></td>
                </tr>`;
    });
    document.getElementById('pedidos').innerHTML = table;
}