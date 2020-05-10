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
                Se ha seleccionado el  pedido como urgente, el administrador debe aprobar la solicitud para que el cambio en el estado tenga efecto en el reporte de almacen,  
                informe a su administrador para que apruebe el cambio de prioridad. 
            </p>
            <label>  Desea notificar la urgencia por e-mail  </label>
            <input type="checkbox"  name="enviar_correo"  id="enviar_correo">  
        </div>
        <div class="modal-footer">
          <button  type="submit"  class="btn btn-primary"   >Aceptar</button>
          <button type="button" class="btn btn-secondary"  data-dismiss="modal">Cancelar</button>

        </div>
        
    `;

    document.getElementById('elements_of_modal').innerHTML = elementsHTML;

};

let reson_to_cancel = (order) => {

    $('#Ventana_Modal_order').modal('show');

    let elementsHTML = `

        <div class="modal-header">
            <h5 class="modal-title">Cancelación Del Pedido</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <p>
              Alerta. Esta a punto de cancelar el pedido con el numero ${order}, Si desea proceder, introduzca un 'motivo para la cancelacion'
            </p>
            <label>Motivo de cancelación: </label>
            <input type="text"  class="form-control"  name="motivo_cancelacion"    maxlength="85" id="motivo_cancelacion">
        </div>
        <div class="modal-footer">
          <button value="0"  class="btn btn-primary"  id="aceptar"  >Aceptar</button>
          <button value="1" type="button" class="btn btn-secondary"  id=""cancelar"  data-dismiss="modal">Cancelar</button>
        </div>
        
    `;

    document.getElementById('cancel_order').innerHTML = elementsHTML;

};

let cambios_status_pedidos = (current_status, order) => {

    if (current_status == "CANCELADO") return alert("Este pedido ha sido cancelado no es posible cambias el status");
    $('#change_status').modal('show');
    let nuevo_estatus = document.getElementById('estado_nuevo');
    let elementsHTML = `
        <div class="modal-header">
            <h5 class="modal-title">Cambio de Status</h5>
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
                 <select  id="estado_nuevo"   class="form-control">
                 <option value="2">En Proceso</option>
                 <option value="3">Parcial</option>
                 <option value="4">Completo</option>
                 <option value="5">Ruta</option>
                 </select>

            </div>       
        </div>
        </div>
        <div class="modal-footer">
          <button value="0"  class="btn btn-primary"  onclick="chanche_estatus_almacen('${order}' )" >Aceptar</button>
          <button value="1" type="button" class="btn btn-secondary"  id=""cancelar"  data-dismiss="modal">Cancelar</button>
        </div>
        
    `;

    document.getElementById('status').innerHTML = elementsHTML;
    //modal para avisar que un pedido fue cancelado y se den cuenta en almacen.
    let cancel_almacen = (order) => {

        $('#Ventana_Modal_cancelarPedido').modal('show');

        let elementsHTML = `
    
        <div class="modal" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Modal title</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <p>El pedido # ${order}, ha sido Cancelado, Si el surtido esta en progreso devolver los productos.</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary">Confirmado-Enterado</button>
            </div>
          </div>
        </div>
      </div
        `;

        document.getElementById('cancel_pedido').innerHTML = elementsHTML;


        //     <<
        //     << << < HEAD
        // }; ===
        // === =
        // }; >>>
        // >>> > est

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
    }
}