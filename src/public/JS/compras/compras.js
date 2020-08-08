
const partidas = () =>{
    
    $.ajax({type: "POST",url: "/compras/partidas",data: "data",success: function (response) {
   
        let table = '';
        ruta = ["Norte", "Sur"];
        let estatus = ['Nuevo', 'Surtiendo', 'Facturable', 'Requerir y facturar ', 'Requerir', 'Cancelado', 'Detenido','Facturando','Facturado','Ruta','Entregado','Suspendida'];
        prioridad_info = ["Normal", "Normal", "Urgente"];
        colores = ["#C6AED8", "#A1DEDB ", "#DECAA1 ", "#C1DEA1 ", "#DBE09A", "#E0A09A", "#817E7E","#B4EFED","#98F290","#F2FE9C","#D4FEA8","#F1C078"];
        let numeracion_pedidos = 1 , numero_de_pedidos_urgentes = 0;
        response.forEach(data => {
            if (data.prioridad == 2) numero_de_pedidos_urgentes++;
            table += `<tr>
                      <th scope="row">${numeracion_pedidos++}</th>
                      <td><a  href="/almacen/pdf/${data.ruta_pdf_pedido}">${data.num_subpedido == null? data.num_pedido:data.num_subpedido}</a></td>
                      <td><a  href="/almacen/pdf/${data.ruta_pdf_orden_compra}">${data.orden_de_compra}</a></td>
                      <td><a  href="/almacen/pdf/${data.ruta_pdf_comprobante_pago}">${data.comprobante_pago}</a></td>
                      <td> ${data.numero_factura == null?'': data.numero_factura} </td>
                      <td  style="background-color:${data.ruta ==  1 ? "#DFBC92" : "#92C1DF"} " >${ruta[data.ruta - 1]}</td>
                      <td id="userinput" >${data.importe}</td> 
                      <td style="background-color:${colores[data.estatus - 1]}" >${estatus[data.estatus - 1]}</td>
                      <td >${prioridad_info[data.prioridad]}</td>
                      <td >  <p class="line-clamp" >  ${data.observacion} </p> </td>
                      <td>${data.fecha_inicial}</td>
                      <td><i class="fas fa-tools" onclick="cambios_status_pedidos('${estatus[data.estatus - 1]}','${data.id_pedido}')"></i></td>
                   
                    </tr>`;
        });
        document.getElementById('pedidos').innerHTML = table;
            
        }
    });

};






partidas(); 