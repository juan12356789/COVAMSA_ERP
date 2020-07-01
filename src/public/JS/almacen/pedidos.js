const socket = io();

let pedidos = (data) => {

    if (data == undefined || typeof(data) == "string") {

        $.ajax({
            type: "GET",
            url: "/almacen/pedidos",
            success: function(response) {
                // if (typeof(data) == "string" && data.length < 20) notifications(`El pedido ${data}, ha sido cancelado. Si el surtido de la 
                // orden esta en progreso, retorne los productos y cambie el estado a enterado. Si no, de click de enterado.`, 'warning');

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

// soket para mandar facturas 
const actualizarFacturas = data => socket.emit('data:facturas', data);
socket.on('data:facturas', function(data) {

    pedidos(data);

});

let sendData = (data) => {
        let table = '';
        ruta = ["Norte", "Sur"];
        let estatus = ['Nuevo', 'Surtiendo', 'Facturable', 'Requerir y facturar ', 'Requerir', 'Cancelado', 'Detenido', 'Facturando', 'Facturado', 'Ruta', 'Entregado', 'Suspendida'];
        prioridad_info = ["Normal", "Normal", "Urgente"];
        colores = ["#C6AED8", "#A1DEDB ", "#DECAA1 ", "#C1DEA1 ", "#DBE09A", "#E0A09A", "#817E7E", "#B4EFED", "#98F290", "#F2FE9C", "#D4FEA8", "#F1C078"];
        let numeracion_pedidos = 1,
            numero_de_pedidos_urgentes = 0;
        data.forEach(data => {
                    if (data.prioridad == 2) numero_de_pedidos_urgentes++;
                    table += `<tr>

                  <th scope="row">${numeracion_pedidos++}</th>
                  <td> ${estatus[data.estatus - 1] == "Facturado"?`<input type="checkbox" id="${data.num_pedido}"  onclick="enviarPedidos('${data.num_pedido}','${ruta[data.ruta - 1]}','${prioridad_info[data.prioridad]}')" ></input>`:''} </td>
                  <td> <i class="fas fa-file-invoice" onclick="cambios_status_pedidos('${estatus[data.estatus - 1]}','${data.num_pedido}')"></i> </td>
                  <td><a  href="/almacen/pdf/${data.ruta_pdf_orden_compra}">${data.orden_de_compra}</a></td>
                  <td><a  href="/almacen/pdf/${data.ruta_pdf_pedido}">${data.num_pedido}</a></td>
                  <td><a  href="/almacen/pdf/${data.ruta_pdf_comprobante_pago}">${data.comprobante_pago}</a></td>
                  <td  style="background-color:${data.ruta ==  1 ? "#DFBC92" : "#92C1DF"} " >${ruta[data.ruta - 1]}</td>
                  <td id="userinput" >${data.importe}</td> 
                  <td style="background-color:${colores[data.estatus - 1]}" >${estatus[data.estatus - 1]}</td>
                  <td >${prioridad_info[data.prioridad]}</td>
                  <td >  <p class="line-clamp" >  ${data.observacion} </p> </td>
                  <td>${data.fecha_inicial}</td>
               
                </tr>`;
    });
    
    document.getElementById('numero_pedidos').innerHTML = `
    <div class="row">
        <div class="col" >
        Total De Pedidos: <input type="text"  value="${numeracion_pedidos - 1}" disabled> 
        </div>
        <div class="col" >
        Pedidos Urgentes: <input type="text"  value="${numero_de_pedidos_urgentes}" disabled>
        </diV>
        <div class="col" >
        <button  class="btn btn-secondary"  onclick="enviar()" disabled id="enviar"> Preparar envio </button>
        </diV>
    </div>`;

    document.getElementById('pedidos').innerHTML = table;
}

// Esta funcion se utiliza para mandar los pedidos al modulo de entregas 
let  idPedidosAEntregar   = [] , rutaPedidos  = [] , prioridadPedidos = []; 
const enviarPedidos  = (id ,ruta, prioridad) =>{
    
    $('#enviar').prop('disabled', false);
    if(document.getElementById(`${id}`).checked == false){
        idPedidosAEntregar.splice(idPedidosAEntregar.indexOf(id) , 1 );
        rutaPedidos.splice(rutaPedidos.indexOf(ruta) , 1 );
        prioridadPedidos.splice(prioridadPedidos.indexOf(prioridad) , 1 );
        return idPedidosAEntregar.length == 0 ?  $('#enviar').prop('disabled', true):$('#enviar').prop('disabled', false);
    }  
    prioridadPedidos.push(prioridad); 
    rutaPedidos.push(ruta); 
    idPedidosAEntregar.push(id); 
    
   
}; 

// Se muestran los  pedidos  que van a estar listos para enviar 
const enviar = () =>{

    $.ajax({type: "POST",url: "/almacen/repartidores",success: function (response) {
            let empleados = ``, partidas = ``;
            response.forEach(element => empleados+= `<option value="${element.id_empleados}">${element.nombre} ${element.apellido_paterno} ${element.apellido_materno} </option>`  );    
            for (let i = 0; i < idPedidosAEntregar.length; i++) {
                partidas +=  `
                <tr>
                    <td>${idPedidosAEntregar[i]}</td>
                    <td>${rutaPedidos[i]}</td>
                    <td>${prioridadPedidos[i]}</td>
                </tr>`
            }
             let ventanaEntregas  =`
             <div class="modal fade" id="entregasModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
               <div class="modal-dialog   modal-dialog-scrollable">
                 <div class="modal-content">
                   <div class="modal-header">
                     <h5 class="modal-title" id="exampleModalLabel">Entregas</h5>
                     <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                       <span aria-hidden="true">&times;</span>
                     </button>
                   </div>
                   <div class="modal-body">
                   <div class="container" >
                        <div class="row" >
                            <div class="col-xs-2">
                                <label> Repartidor: </label>
                                <select class="form-control" id="repartidor" >
                                    ${empleados}
                                </select>
                            </div>
                            <div class="col" >
                                <label>Intrucciones especiales</label>
                                <textarea class="form-control"  id="texto" ></textarea>  
                            </div>
                        </div>
                            <br>
                        <div class="row" >
                                <table class="table  table-striped" >
                                    <thead class="thead-dark" >
                                        <tr>
                                            <th>Numero de  pedido</th>
                                            <th>Ruta</th>
                                            <th>Prioridad</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${partidas}
                                    </tbody>
                                </table>
                        </div>
                           
                        </div>
                   </div>
                   <div class="modal-footer">
                     <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                     <button type="button" class="btn btn-primary"  onclick="sendRuta()" >Comenzar ruta</button>
                   </div>
                 </div>
               </div>
             </div>
        `;
        document.getElementById('entregas').innerHTML =  ventanaEntregas;  
        $("#entregasModal").modal("show"); 
        

        }
    });
    

};  

// Manda  las partidad a  entregas para de esa manera procesarlas y  ponerlas enn ruta 
const sendRuta  = id =>{
    $.ajax({type: "POST",
            url: "/almacen/envioEntregas",
            data: {
                partidas : JSON.stringify(idPedidosAEntregar),
                empleado: document.getElementById('repartidor').value,
                descripcion: document.getElementById('texto').value
                },
            success: function (response) {
                     notifications(`El envio ha sido guardado con éxito`, 'success');
                     pedidos(); 
                     $("#entregasModal").modal("hide"); 
        }
    });
}; 

const chanche_estatus_almacen = (order) => {
    $('#change_status').modal('hide');

    let estado_nuevo = document.getElementById('estado_nuevo').value;
    
    $.ajax({type: "POST",url: "/almacen/cambio_estado",data: { estado_nuevo, order }, success: function(response) {
            if(response == false )  return notifications(`No se puede cambiar el status a facturación ya que hay partidas incompletas`, 'warning');
            if(estado_nuevo != "Nuevo" && estado_nuevo != "Surtiendo" )    actualizarFacturas(`${order}`);
            let estatus = ['Nuevo', 'Surtiendo', 'Facturable', 'Requerir y facturar ', 'Requerir', 'Cancelado', 'Detenido'];
            cambios_status_pedidos(  estatus[estado_nuevo - 1] , order);
            notifications(`El estado del pedido ${order} ha sido cambiado `, 'success');
            pedidos();
            actualizar();
        }
    });

};