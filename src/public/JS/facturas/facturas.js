const socket = io();

socket.on('data:facturas', function(data) {

    console.log(data);
    facturas(); 
    

});

const facturas  = () =>{
    
    $.ajax({type: "POST",url: "/facturas",data: "data",success: function (response) {
        let table = '';
        ruta = ["Norte", "Sur"];
        let estatus = ['Nuevo', 'Surtiendo', 'Facturable', 'Facturable ', 'Requerir', 'Cancelado', 'Detenido','Facturando'];
        prioridad_info = ["Normal", "Normal", "Urgente"];
        colores = ["#C6AED8", "#A1DEDB ", "#C1DEA1", "#C1DEA1", "#DBE09A", "#E0A09A", "#817E7E","#B4EFED"];
        let numeracion_pedidos = 1 , numero_de_pedidos_urgentes = 0;
        response.forEach(data => {
            if (data.prioridad == 2) numero_de_pedidos_urgentes++;
            table += `<tr>
    
                      <th scope="row">${numeracion_pedidos++}</th>
                      <td> ${estatus[data.estatus - 1] != "Facturando"?`<button  type="button"  class="btn btn-secondary"  onclick="procesando('${data.num_pedido}')"   > Procesar </button>`:`<button  type="button"  class="btn btn-success"  onclick="procesando('${data.num_pedido}')"   > Completo</button>`} </td>
                      <td><button   class="btn btn-primary" onclick="partidas('${data.num_pedido}')" > Partidas </button></td>
                      <td><a  href="/almacen/pdf/${data.ruta_pdf_orden_compra}">${data.orden_de_compra}</a></td>
                      <td><a  href="/almacen/pdf/${data.ruta_pdf_pedido}">${data.num_pedido}</a></td>
                      <td><a  href="/almacen/pdf/${data.ruta_pdf_comprobante_pago}">${data.comprobante_pago}</a></td>
                      <td  style="background-color:${data.ruta ==  1 ? "#DFBC92" : "#92C1DF"} " >${ruta[data.ruta - 1]}</td>
                      <td id="userinput" >${data.importe}</td> 
                      <td style="background-color:${colores[data.estatus - 1]}" >${estatus[data.estatus - 1]}</td>
                      <td >${prioridad_info[data.prioridad]}</td>
                      <td>${data.prioridadE == 0?"Parcial":"Completa"} </td>
                      <td >  <p class="line-clamp" >${data.observacion}</p></td>
                      <td>${data.fecha_inicial}</td>
                   
                    </tr>`;
        });
        
        
        document.getElementById('numero_pedidos').innerHTML = `Total De Pedidos: <input type="text"  value="${numeracion_pedidos - 1}" disabled>`;
    
        document.getElementById('pedidos').innerHTML = table;
        }
    });

}; 

facturas();

const partidas = id =>{
    $.ajax({type: "POST",url: "/facturas/partidas",data:{id:id},success: function (response) {
        let tabla = ``;
            response.forEach(element => {
                tabla +=`
                    <tr>
                        <td>${element.clave}</td>
                        <td>${element.nombre}</td>
                        <td>${element.cantidad}</td>
                    </tr>
                `;
            });

            let table =`
              <div class="modal fade" id="modalPartidas" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Productos  a facturar</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                    <div id="container" >
                            <table class="table">
                                <thead class="thead-dark">
                                    <tr>
                                        <th>Clave</th>
                                        <th>Nombre</th>
                                        <th>Cantidad</th>
                                    </tr>
                                <tbody>
                                ${tabla}
                                </tbody>
                            </thead>
                            </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
    `;
    document.getElementById('partidas').innerHTML = table;
    $("#modalPartidas").modal('show');
            
        }
    });
}
const change_status =  id  =>{
    $.ajax({type: "POST",url: "/facturas/status",data: {id:id},success: function (response) {

            $("#modalProcess").modal('hide');
            notifications(`Se ha cambiado el satatus de la orden ${id}`,"success"); 
            facturas();
            
        }
    });
    
}
const procesando = id  =>{
    
    let table =`
              <div class="modal fade" id="modalProcess" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                    <div id="container" >
                        <div class="row" >
                            <div class="col-12" >
                                <center><h3>¿Está listo para generar la factura de este pedido?</h3></center>
                            </div>
                        </div>
                        <div class="row" >
                            <div class="col">
                              <center><button  class="btn btn-success" onclick="change_status('${id}')" >Sí</button></center>
                            </div>
                            <div class="col">
                            <center><button data-dismiss="modal" class="btn btn-danger">No</button></center>
                            </div>
                        <div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
    `;
    document.getElementById('modal_procesar').innerHTML = table;
    $("#modalProcess").modal('show');

}; 