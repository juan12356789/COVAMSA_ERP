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

    if (current_status == "Cancelado") return notifications("Este pedido ha sido cancelado no es posible cambiar  el status", 'warning');
    let opciones_pago = '';
    $('#change_status').modal('show');
    let nuevo_estatus = document.getElementById('estado_nuevo');
    
    let elementsHTML = `
        <div class="modal-header">
            <h5 class="modal-title">Cambio de Estado</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
        </div>
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
            <div class="table table-responsive">
            <table class="table table-striped table-bordered">
                  <thead class="thead-dark" >
                      <tr>
                          <th scope="col" >#</th>
                          <th scope="col" >Clave </th>
                          <th scope="col" >Nombre</th>
                          <th scope="col" >Cantidad </th>
                          <th scope="col" >Cantidad surtida</th>
                          <th scope="col" >  Encontrado</th>

                      </tr>
                  </thead>

                  <tbody id="partidas"></tbody>

              </table>
            </div>
        </diV>
        </div>
        <div class="modal-footer">
         
        </div>
    `;

    tabla_partidas(order,current_status);
    document.getElementById('status').innerHTML = elementsHTML;
    

};

const tabla_partidas  = (id_pedido , status, checkbox = false ) =>{
    
    $.ajax({type: "POST",url: "/almacen/partidas",data: {pedido:id_pedido},success: function (response) {
        
            let   partidasOp  = 0,cont = 0,numero = 0 ,tipo_status = `` ;   
            let   tabla_partidas   = ``, numero_partidas = 0;
            response.forEach(response => {
                numero++; 
                if(partidasOp < response.idPartida)partidasOp = response.idPartida;
                cont++; 
                tabla_partidas+= `
                <tr>
                    <th scope="col" >${cont}</th>
                    <th scope="col" >${response.clave}</th>
                    <th scope="col" >${response.nombre}</th>
                    <th scope="col"  >${response.cantidad}</th>
                    ${ status == "Surtiendo" ? `<th scope='col'  ><input type='number' value="${response.cantidad_surtida == null?0:response.cantidad_surtida}"  maxlength="5"  min="1" max="5" name='numero${numero}' id='numero${numero}' ></th>`:`<th><input type="numbre"  maxlength="5"  min="1" max="5" disabled value="${response.cantidad_surtida == null? 0 :response.cantidad_surtida}" </th>` }
                    ${ status == "Surtiendo" ?`<th><input type="checkbox" onclick="cantidadProducto(${response.cantidad},${response.id_partidas_productos},${numero},'${id_pedido}','${status}')"   ${response.cantidad_surtida == response.cantidad?"checked":" "} name="completo${cont}" id="completo${cont}"></th>`:`<th><input type="checkbox" name="competo${cont}"  disabled id="completo${cont}"></th>`}
                   
                </tr>`;
                if(response.cantidad_surtida == response.cantidad)  numero_partidas++; 

            });
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
            if(status == "Surtiendo" && response[0].prioridadE == 0  ){ document.getElementById('estado_nuevo').innerHTML = `
                <option value="3">Facturable </option>
                <option value="4" >Requerir y facturar  </option>
            `;
            }
            if(status == "Surtiendo" && response[0].prioridadE == 1){
                document.getElementById('estado_nuevo').innerHTML = `
                <option value="3" >Facturable </option>
                <option value="5" >Requerir  </option>
            `;
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

// rellena el checkbox al palomearlo   
const cantidadProducto = (cantidad  , id_partidas_productos, numero ,id , status) => {

    let checkbox =   document.getElementById("completo"+numero).checked;
    let cantidad_entrante = $("#numero"+numero).val();
    if(checkbox) cantidad_entrante =  cantidad; 
    if( $("#numero"+numero).val() > cantidad  ) return notifications("La cantidad que introdujo es mayor a las piezas que se  solicitan ","warning"); 
    if( $("#numero"+numero).val() < 0 ) return notifications("No puede tener valores menores a 0 ","warning");
    $.ajax({type: "POST",url: "/almacen/cantidad_pedido",data: {op:checkbox,numero: cantidad_entrante,id:id_partidas_productos},success: function (response) {
        // se manda la cantidad completa del producto para que se surta 
        $(`#numero${numero}`).val(cantidad_entrante);
        // tabla_partidas(`${id}`,`${status}`);    

        }
    });
    
}

// este onckick nos sirve paea saber si todos los productos se han encontrado 
const completarListga  = ( id ,status ) => {
    
    let checkbox =   document.getElementById("partida_completa").checked;
        $.ajax({type: "POST",url: "/almacen/pedidos_check",data: {num_pedido : id ,check : checkbox},success: function (response) {

            tabla_partidas(id , status, checkbox);

            }
        });
}

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