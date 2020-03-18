const  socket = io ();  


socket.on('data:pedidos',function(data){
    let table = '';
    data.forEach(data => {
        table+= `<tr>
                    <td>${data.orden_de_compra}</td>
                    <td>${data.ruta}</td>
                    <td>${data.num_pedido}</td>
                    <td>${data.importe}</td> 
                    <td>${data.estatus}</td> 
                    <td>${data.observacion}</td>
                    <td>${data.fecha_inicial}</td>
                    <td> <a  class="btn btn-primary"  href="/almacen/pdf/${data.ruta_pdf_orden_compra}">PDF</a></td>
                </tr>`;    
    });
    document.getElementById('pedidos').innerHTML = table; 
});
