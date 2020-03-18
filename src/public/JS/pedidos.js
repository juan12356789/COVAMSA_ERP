const  socket = io ();  

let pedidos = (data)=>{
    if (data == undefined ) {
        $.ajax({type: "GET",url: "/almacen/pedidos",success: function (response) {
                 sendData(response); 
                 if(response == []) console.log('No hay pedidos por el momento');
            }
        });
    }else{
        sendData(data)
    }
};
pedidos(); 
socket.on('data:pedidos',function(data){
    pedidos(data); 
});

let sendData =(data )=>{
    console.log(data);
    let table = '',ruta = ["NORTE","SUR"],estatus  = ['CAPTURADO'];
    data.forEach(data => {
        table+= `<tr>
                    <td>${data.orden_de_compra}</td>
                    <td>${data.num_pedido}</td>
                    <td>${data.comprobante_pago}</td>
                    <td>${ruta[data.ruta - 1]}</td>
                    <td>${data.importe}</td> 
                    <td>${estatus[data.estatus - 1]}</td> 
                    <td>${data.observacion}</td>
                    <td>${data.fecha_inicial}</td>
                    <td> <a  class="btn btn-primary"  href="/almacen/pdf/${data.ruta_pdf_orden_compra}">PDF</a></td>
                    <td> <a  class="btn btn-primary"  href="/almacen/pdf/${data.ruta_pdf_pedido}">PDF</a></td>
                    <td> <a  class="btn btn-primary"  href="/almacen/pdf/${data.ruta_pdf_comprobante_pago}">PDF</a></td>
                </tr>`;    
    });
    document.getElementById('pedidos').innerHTML = table; 
}


