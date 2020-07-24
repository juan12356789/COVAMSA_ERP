const socket = io();

let tablaRepartidor = () =>{

    $.ajax({type: "POST",url: "/entregas/informacion_envios",success: function (response) {

             sendData(response); 
            

        }
    });

}; 

const pedidos = (data) => socket.emit('data:pedidos', data);

socket.on('data:pedidos', function(data) {

    tablaRepartidor();

});

tablaRepartidor(); 

let sendData = (data) => {
    console.log(data);
    
    let table = '';
    ruta = ["Norte", "Sur"];
    let estatus = ['Nuevo', 'Surtiendo', 'Facturable', 'Requerir y facturar ', 'Requerir', 'Cancelado', 'Detenido','Facturando','Facturado','Ruta','Entregado','Suspendida'];
    prioridad_info = ["Normal", "Normal", "Urgente"];
    colores = ["#C6AED8", "#A1DEDB ", "#DECAA1 ", "#C1DEA1 ", "#DBE09A", "#E0A09A", "#817E7E","#B4EFED","#98F290","#F2FE9C","#D4FEA8","#F1C078"];
    let numeracion_pedidos = 1 , numero_de_pedidos_urgentes = 0;
    data.forEach(data => {
        if (data.prioridad == 2) numero_de_pedidos_urgentes++;
        table += `<tr>

                  <th scope="row">${numeracion_pedidos++}</th>
                  <td> <button  class="btn btn-primary" onclick="cambioStatus('${data.id_pedido}')" >Entregado</button> </td>
                  <td><a  href="/almacen/pdf/${data.ruta_pdf_pedido}">${data.num_pedido}</a></td>
                  <td>${data.numero_factura} </td>
                  <td  style="background-color:${data.ruta ==  1 ? "#DFBC92" : "#92C1DF"} " >${ruta[data.ruta - 1]}</td>
                  <td id="userinput" >${data.importe}</td> 
                  <td style="background-color:${colores[data.estatus - 1]}" >${estatus[data.estatus - 1]}</td>
                  <td >${prioridad_info[data.prioridad]}</td>
                  <td>${data.fecha_facturas}</td>
                  <td> <center><i class="fas fa-tools" onclick="orderDatailMisPedidos('${data.id_pedido}')"  ></i></center> </td>
                  <td> ${estatus[data.estatus - 1] == "Ruta"?`<input type="checkbox" id="${data.id_pedido}" onclick="suspenderEntregas('${data.id_pedido}')" name="" id="suspenderPedido">`:'' }</td>

                </tr>`;
    })

    document.getElementById('pedidos').innerHTML = table; 

    document.getElementById('numero_pedidos').innerHTML = `
    <div class="row">
        <div class="col" >
        Total De Pedidos: <input type="text"  value="${numeracion_pedidos - 1}" disabled> 
        </div>
        <div class="col" >
        Pedidos Urgentes: <input type="text"  value="${numero_de_pedidos_urgentes}" disabled>
        </diV>
        <div class="col" >
          <button  id="suspenderPedido" class="btn btn-secondary" onclick="modalSuspender()" disabled > Suspender pedidos </button>
        </div>
    </div>`;

};


// Se cambia el status y se sube  una foto del comprobante 
const cambioStatus  = id  =>{
    $.ajax({type: "POST",url: "/entregas/archivo",data: {id:id}, success: function (response) {
        
        let tabla_entregas = `
        <div class="modal fade" id="entregasPedidos" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Pedido entregado</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
    
            <form>
                <div class="form-group">
                    <label for="exampleFormControlFile1">Ingrese su comprobante</label>
                    ${response == false ? `<input type="file" class="form-control-file"   id="comprobante">`:
                    `<div class="alert alert-success" role="alert">
                            archivo subido!
                    </div>`}
                 </div>
                 
                <div class="form-group">
                    <label for="exampleFormControlTextarea1">Comentarios</label>
                    <textarea class="form-control" maxlength="99" id="comentarios" rows="3"></textarea>
                </div>
             </form>
    
            </div>
            <div class="modal-footer">
                <div class="row" >
                    <div class="col" >
                        <button type="button" class="btn btn-primary" ${response == true? 'disabled':''}  onclick="uploadExcel('${id}')">Guardar</button>
                    </div>
                    <div class="col" >
                        <button  class="btn btn-danger" ${response == false ? 'disabled':''}    onclick="deleteFile('${id}')" >Borrar</button>
                    </div>
                    <div class="col" >
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
        `; 
    
        document.getElementById('entregas').innerHTML = tabla_entregas;
        $("#entregasPedidos").modal('show');
        }
    });

}; 

const  uploadExcel  = id =>{

    let csvFile = $('#comprobante')[0].files[0];
    let observaciones = $("#comentarios").val();
    var data = new FormData(); 
    data.append('comprobante', csvFile);
    data.append('observaciones',observaciones); 
    data.append('num_pedido',id); 
    if(csvFile == undefined) return notifications("Favor de cargar algun archivo",'warning'); 
    var request = $.ajax
        ({
            url: '/entregas',
            method: 'POST',
            contentType: false,
            processData: false,
            data: data,
            dataType: "html"
        });

        request.done(function( msg )
        {
        socket.emit('data:alertEntregado', id);
        if(msg) notifications("El  comprobante  ha sido guardado",'success'); 
        tablaRepartidor(); 
        pedidos(); 
        $("#entregasPedidos").modal('hide');

        });

        request.fail(function( jqXHR, textStatus )
        {
            alert( "Hubo un error: " + textStatus );
        });

      }; 

// se elimina el archivo    
const deleteFile = id =>{

    $.ajax({type: "POST",url: "/entregas/eliminarArchivo",data:{id:id},success: function (response) {

        if(response == true ) notifications("El  comprobante ha sido eliminado",'success'); 
        tablaRepartidor(); 
        pedidos(); 
        $("#entregasPedidos").modal('hide');

        }
    });
   
}; 

//  se va seleccionando el  pedido que se va a cancelar 
let  idPedidosAEntregar   = [] ; 
const suspenderEntregas   = id =>{

    $('#suspenderPedido').prop('disabled', false);
    if(document.getElementById(`${id}`).checked == false){
        idPedidosAEntregar.splice(idPedidosAEntregar.indexOf(id) , 1 );
        return idPedidosAEntregar.length == 0 ?  $('#suspenderPedido').prop('disabled', true):$('#suspenderPedido').prop('disabled', false);
    }  
    idPedidosAEntregar.push(id); 
    
};

// se manda el id en el cual se  suspenderá la entrega 
const modalSuspender  = () =>{

    let td = `
        <div class="modal fade" id="cancelar_entrega" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Motivo de suspencion</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
                 <div class="form-group">
                    <label for="exampleFormControlTextarea1">Example textarea</label>
                     <textarea class="form-control" id="motivoCancelacion" rows="3"></textarea>
                 </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-primary" onclick="idSuspender()" >Aceptar</button>
            </div>
          </div>
        </div>
     </div>
    `;
    document.getElementById('cancelar').innerHTML = td; 
    $("#cancelar_entrega").modal('show');

};

const idSuspender  = () =>{

    $.ajax({ type: "POST",url: "/entregas/cancelar_entrega",data: {id : JSON.stringify(idPedidosAEntregar),observacion:$("#motivoCancelacion").val()} ,success: function (response) {
        tablaRepartidor(); 
        pedidos(); 
        notifications("El  estado ha sido cambiado a detenido ",'success'); 
        $("#cancelar_entrega").modal('hide');
            
        }
    });
    
}; 

const  orderDatailMisPedidos =  (id , opcion = 0)  =>{
    console.log('hola');
    $.ajax({ type: "POST",url: "/entregas/detalles",data: {pedido: id},   success: function (response) {
        let pedido  = `` , cont  = 1 ; 
        response.forEach(element => {

          pedido  +=  `
            <tr>
             <td>${cont++}</td>  
             <td>${element.clave}</td>
             <td>${element.nombre}</td>
             <td>${element.cantidad_surtida}</td>
            </tr>
          `; 
 
       
    });
       let ventana  = `
       <div class="modal fade" id="detalleMisPpedidos" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-labelledby="staticBackdropLabel" aria-hidden="true">
       <div class="modal-dialog  modal-dialog-scrollable modal-lg"  >
         <div class="modal-content">
           <div class="modal-header">
             <h5 class="modal-title" id="staticBackdropLabel">Información pedidos</h5>
             <button type="button" class="close" data-dismiss="modal" aria-label="Close">
               <span aria-hidden="true">&times;</span>
             </button>
           </div>
           <div class="modal-body">
            <div class="container" >
                <table  class="table" >
                <thead  class="thead-dark" >
                    <th>#</th>
                    <th>Clave</th>
                    <th>Nombre</th>
                    <th>Cantidad</th>
                </thead>
                <tbody id="cuerpo" >
                 ${pedido}
                </tbody>
              </table>
            </div>
           </div>
           <div class="modal-footer">
             <button type="button" class="btn btn-success" data-dismiss="modal">Aceptar</button>
           </div>
         </div>
       </div>
     </div>
    `;
        document.getElementById('detalle_mis_pedidos').innerHTML = ventana;
        $('#detalleMisPpedidos').modal('show');
   
      }
    });
    
 };