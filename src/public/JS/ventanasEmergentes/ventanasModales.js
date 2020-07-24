let order_priority = () => {

    $('#Ventana_Modal').modal('show');

    let elementsHTML = `

        <div class="modal-header">
            <h5 class="modal-title">Pedidos Urgentes</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <p>
                Se ha seleccionado el  pedido como urgente, el administrador debe aprobar la solicitud para que el cambio en el estado tenga efecto en el reporte de almacén,  
                informe a su Administrador para que apruebe el cambio de prioridad. 
            </p>
            <label>  Desea notificar la urgencia por e-mail  </label>
            <input type="checkbox"  name="enviar_correo"  id="enviar_correo">  
        </div>
        <div class="modal-footer">
          <button  type="submit"  class="btn btn-primary"  onclick="enviarCorreo('Pedido Urgente')"   >Aceptar</button>
          <button type="button" class="btn btn-secondary"  data-dismiss="modal">Cancelar</button>

        </div>
    `;

    document.getElementById('elements_of_modal').innerHTML = elementsHTML;

};

let reson_to_cancel = (order) => {

    $('#Ventana_Modal_order').modal('show');
    let elementsHTML = `
        <div class="modal-header">
            <h5 class="modal-title">Cancelación del Pedido</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <p>
              Alerta.Está a punto de cancelar el pedido con el número ${order}, Si desea proceder, introduzca un 'Motivo para la Cancelación'
            </p>
            <label>Motivo de cancelación: </label>
            <input type="text"  class="form-control"  name="motivo_cancelacion"    maxlength="85" id="motivo_cancelacion">
        </div>
        <div class="modal-footer">
          <button value="0"  class="btn btn-primary"  id="aceptar"  >Aceptar</button>
          <button value="1" type="button" class="btn btn-danger"  id=""cancelar"  data-dismiss="modal">Cancelar</button>
        </div>
        
    `;

    document.getElementById('cancel_order').innerHTML = elementsHTML;

};

let cambios_status_pedidos = (current_status, order) => {
        console.log(order);
    if (current_status == "Cancelado") return notifications("Este pedido ha sido cancelado no es posible cambiar  el status", 'warning');
    $('#change_status').modal('show');
    let nuevo_estatus = document.getElementById('estado_nuevo');
    
    let elementsHTML = `
    <style>
   
    </style>
        <div class="modal-body">
        <div class="row" >
            <div  class="col">

                <label>Estado actual: </label>
                <input type="text" name="" id=""  class="form-control"  value="${current_status}" disabled >

            </div>
            <div class="col-xs-2">
                <br><br>
                <i class="fas fa-arrow-right"></i>
            </div>
            <div class="col"  >

            <label>Nuevo Estado:</label>
            <select  id="estado_nuevo"   class="form-control"></select>
            </div>       

        </div>
        <div class="row">
            <div class="col">
                <button value="0"  class="btn btn-primary"  onclick="chanche_estatus_almacen('${order}' )" >Aceptar</button>
                <button value="1" type="button" class="btn btn-secondary"  id="cancelar"  data-dismiss="modal">Cancelar</button>
            </div>
        </div>
        <br><br>
        <div class="row" >
            <div class="col" >
            <div id="numero_partidas" ></div>
            <div class=" table-responsive ">
            <table class="thead-dark" id="job-table" >
                  <thead>
                      <tr class="text-center" > 
                          <th class="col" >#</th>
                          <th class="col" >Clave </th>
                          <th class="col" >Nombre</th>
                          <th class="col" >Cantidad </th>
                          <th class="col" >Cantidad surtida</th>
                          <th class="col" > Encontrado </th>

                      </tr>
                  </thead  >
                  <tbody id="partidas" class="text-center tableBody"></tbody>
               

              </table>
            </div>
        </diV>
        
        </div>

    `;

    tabla_partidas(order,current_status);
    document.getElementById('status').innerHTML = elementsHTML;
    

};
// En esta  variable se almacena el id de las partidas de cada uno de los pedidos  
let idPartidas = [];
const tabla_partidas  = (id_pedido , status, checkbox = false ) =>{
    
    $.ajax({type: "POST",url: "/almacen/partidas",data: {pedido:id_pedido},success: function (response) {
            idPartidas = [];
            idPartidas =     response.map(n => n.id_partidas_productos);  
            let   partidasOp  = 0,cont = 0,numero = 0 ,tipo_status = `` , noSurtida  = 0;   
            let   tabla_partidas   = ``, numero_partidas = 0;
            response.forEach(response => {
                numero++; 
                if(partidasOp < response.idPartida)partidasOp = response.idPartida;
                cont++; 
                tabla_partidas+= `
                <tr >
                    <td class="col" >${cont}</td>
                    <td class="col" >${response.clave}</td>
                    <td class="col" >${response.nombre}</td>
                    <td class="col"  >${response.cantidad}</td>
                    ${ status == "Surtiendo" ? `<td class="col"  ><input type='text' maxlength="11" onkeypress=" return justNumbers(event ,'numero${numero}','${response.cantidad}')"    value="${response.cantidad_surtida == null?0:response.cantidad_surtida}"  name='numero' id='numero${numero}' ></td>`:`<td class="col"><input type="numbre"  maxlength="5"  min="1" max="5" disabled value="${response.cantidad_surtida == null? 0 :response.cantidad_surtida}" </td>` }
                    ${ status == "Surtiendo" ?`<td class="col" ><input type="checkbox" onclick="cantidadProducto(${response.cantidad},${response.id_partidas_productos},${numero},'${id_pedido}','${status}')"   ${response.cantidad_surtida == response.cantidad?"checked":" "} name="completo${cont}" id="completo${cont}"></td>`:`<td class="col"><input type="checkbox" name="competo${cont}"  disabled id="completo${cont}"></td>`}
                </tr>`;
                if(response.cantidad_surtida == response.cantidad)  numero_partidas++; 
                if(response.cantidad_surtida  ==  0  ) noSurtida++; 

            });
            if(status == "Surtiendo"){

                document.getElementById('button').innerHTML = `
                <div class="modal-footer">
                    <button onclick="guardarPartidas('${id_pedido}', '${status}')" class="btn btn-primary" >Guardar</button>
                </div>
                `;
                
            }
            document.getElementById("numero_partidas").innerHTML = `
            
                <div class="row" >
                     <div class="col" >
                     <strong> Número de partidas:</strong> ${cont}
                     </div>
                     <div class="col" >
                     <strong>Entregas parcial: </strong>${response[0].prioridadE == 0 ? " Sí " : "No"  }
                     </div>
                     <div class="col" >
                        <strong>Estado del pedido:</strong> ${response.length == numero_partidas?'Partidas completas':'Hay partidas incompletas' }
                     </div>
                     <div class="col" >   
                        <strong>Pedidos completo:</strong>   <input type="checkbox" ${status == 'Surtiendo'?'':'disabled'}   ${checkbox || response.length == numero_partidas ?"checked":''}  id="partida_completa" onclick="completarListga('${id_pedido}','${status}')"  > 
                    </div>
                </div>
             `;
            document.getElementById('partidas').innerHTML = tabla_partidas;
            
            if(status == "Nuevo") document.getElementById('estado_nuevo').innerHTML = `<option value="2" > Surtiendo </option>`;  
            if(status == "Surtiendo" && response[0].prioridadE == 0  ){
                if(noSurtida == response.length)  document.getElementById('estado_nuevo').innerHTML = ` <option value="5" >Requerir  </option>`;
                if(noSurtida != response.length) document.getElementById('estado_nuevo').innerHTML = `<option value="4" >Requerir y facturar  </option>`;
                if(numero_partidas == response.length)document.getElementById('estado_nuevo').innerHTML = ` <option value="3">Facturable </option>`;
            }

            if(status == "Surtiendo" && response[0].prioridadE == 1){

                if(numero_partidas == response.length){

                     document.getElementById('estado_nuevo').innerHTML = ` <option value="3"> Facturable </option>`;
                } else{

                     document.getElementById('estado_nuevo').innerHTML = ` <option value="5" > Requerir  </option>`;
                }
            }

            if(status == "Suspendida" ){
                document.getElementById('estado_nuevo').innerHTML = `
                <option value="1" > Nuevo </option>
                <option value="2" > Surtiendo </option>
                <option value="3" >Facturable </option>
                <option value="4" >Requerir y facturar  </option>
                <option value="5" >Requerir  </option>
            `;
            }
            
        }
    });
    
}; 

let concatenarNumeros= "";
function justNumbers (event , id , cantidad ) {
    var x = event.which || event.keyCode;
    numero   = '0123456789'; 
    concatenarNumeros += String.fromCharCode(x);
    if( parseInt(concatenarNumeros) > parseInt(cantidad)  ){ 
        concatenarNumeros = ""; 
        $(`#${id}`).val('');
        return false ;
    } 
    if( numero.indexOf(String.fromCharCode(x)) == -1  ){
        concatenarNumeros = "";
        return false ;
    }

}



// rellena el checkbox al palomearlo   
const cantidadProducto = (cantidad  , id_partidas_productos, numero ,id , status) => {

    let checkbox =   document.getElementById("completo"+numero).checked;
    let cantidad_entrante = $("#numero"+numero).val();
    if(checkbox) cantidad_entrante =  cantidad; 
    if( $("#numero"+numero).val() > cantidad  ) return notifications("La cantidad que introdujo es mayor a las piezas que se  solicitan ","warning"); 
    if( $("#numero"+numero).val() < 0 ) return notifications("No puede tener valores menores a 0 ","warning");
    // $.ajax({type: "POST",url: "/almacen/cantidad_pedido",data: {op:checkbox,numero: cantidad_entrante,id:id_partidas_productos},success: function (response) {
   
        // se manda la cantidad completa del producto para que se surta 
        if(!checkbox) return $(`#numero${numero}`).val(0);
        $(`#numero${numero}`).val(cantidad_entrante);
        // tabla_partidas(`${id}`,`${status}`);    

    //     }
    // });  
    
}

//  se guardan los elementos del  pedido 
const guardarPartidas =  (id , status) =>{
   
    let  values =  $("input[name='numero']").map(function(){return $(this).val();}).get();
    console.log(values);
    $.ajax({type: "POST",url: "/almacen/cantidad_pedido",data: {cantidad :JSON.stringify(values) , partidas: JSON.stringify(idPartidas) , id:id},success: function (response) {

        tabla_partidas(id , status);
        notifications("Los productos han sido guardados ","success");

        }
    });

};


// este onckick nos sirve paea saber si todos los productos se han encontrado 
const completarListga  = ( id ,status ) => {
                console.log(id);
    let checkbox =   document.getElementById("partida_completa").checked;
        $.ajax({type: "POST",url: "/almacen/pedidos_check",data: {num_pedido : id ,check : checkbox},success: function (response) {

            tabla_partidas(id , status, checkbox);

            }
        });
};

const notifications = (texto_notificacion, tipo_notificacion) => {

    swal({
        title: `${texto_notificacion}`,
        type: `${tipo_notificacion}`,
        showConfirmButton: true
    });

};


const uploadFileTransferencia = (num_pedido) => {

    $('#transferencia').modal('show');

    let elementsHTML = `
        <div class="modal-header">
            <h5 class="modal-title">Transferencia</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
        <form id="uploadForm" enctype="multipart/form-data"   >
        <div  class="row"  >
            <div class="col-4" >
            <label for="" class="col-form-label">Número de  pedido: </label>
            <input type="text" name="num_pedido" id="num_pedido" class ="form-control" value="${num_pedido}" readonly />
            </div>
            <div class="col-6" >
                 <label for="" class=" col-form-label">&squf;Comprobante de Pago:</label>
                 <input type="text" class="form-control valid border border-secondary" minlength="2"  required  id="comp" maxlength="30" minlength="2" name="comp" pattern="[A-Za-z0-9]+" title="Solo se permite letras(mayúsculas y/o minúsculas) y números. Maximo 30 caracteres">
                 <input type="file" class="form-control-file "  required id="comprobante_pago" name="comprobante_pago" style="color: black;">
            </div>
            
        </div>
        <br>
        <div class="modal-footer">  
          <button type="button"  onclick="pagosTrasnsferencia()" class="btn btn-primary" >Aceptar</button>
          <button   class="btn btn-secondary"    data-dismiss="modal">Cancelar</button>
          </div> 
        </div>

        </form>
        
    `;

    document.getElementById('send_trasferencia').innerHTML = elementsHTML;
}; 
    

    let cancel_almacen = (order) => {

        $('#Ventana_Modal_order').modal('show');

        let elementsHTML = `
    
            <div class="modal-header">
                <h5 class="modal-title">Cancelación del Pedido</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <p>
                  Alerta.Está a punto de cancelar el pedido con el número ${order}, Si desea proceder, introduzca un 'Motivo para la Cancelación'
                </p>
                <label>Motivo de cancelación: </label>
                <input type="text"  class="form-control"  name="motivo_cancelacion"    maxlength="85" id="motivo_cancelacion">
            </div>
            <div class="modal-footer">
              <button value="0"  class="btn btn-primary"  id="aceptar"  >Aceptar</button>
              <button value="1" type="button" class="btn btn-danger"  id=""cancelar"  data-dismiss="modal">Cancelar</button>
            </div>
            
        `;

        document.getElementById('cancel_almacenxd').innerHTML = elementsHTML;

    };


const cargar_pedido = () =>{
    let modal  = `
       <div class="modal fade" id="spinnerUpload" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-labelledby="staticBackdropLabel" aria-hidden="true">
         <div class="modal-dialog">
             <div class="modal-content">
                <div class="modal-header">
                     <h5 class="modal-title" id="staticBackdropLabel">Cargar pedido </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                             <span aria-hidden="true">&times;</span>
                        </button>
                        </div>
                         <div class="modal-body">
                            <h5>La orden se esta procesando, esta operación puede tomar unos minutos.</h5>
                            <div class="text-center">
                                <div class="spinner-border" role="status">
                                    <span class="sr-only">Loading...</span>
                                </div>
                            </div>
                         </div>
                        <div class="modal-footer">
                     </div>
            </div>
        </div>
     </div>
        
    `;
    
    document.getElementById('spinnerOrder').innerHTML = modal;
   
} 

function ValidaLongitud(campo, longitudMaxima) {
    try {
        if (campo.value.length > (longitudMaxima - 1))
            return false;
        else
            return true;
    } catch (e) {
        return false;
    }
}