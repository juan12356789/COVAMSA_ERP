 let order_priority = ()=>{
    
    $('#Ventana_Modal').modal('show'); 

    let elementsHTML  = `

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

   document.getElementById('elements_of_modal').innerHTML  =   elementsHTML; 
        
}; 

let reson_to_cancel = (order) =>{
    
    $('#Ventana_Modal_order').modal('show'); 

    let elementsHTML  = `

        <div class="modal-header">
            <h5 class="modal-title">Cancelación Del Pedido</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <p>
              Alerta. Esta apunto de cancelar el pedido con el numero ${order}, Si desea proceder, introdusca in 'motivo para la cancelacion'
            </p>
            <label>Motivo de cancelación: </label>
            <input type="text"  class="form-control"  name="motivo_cancelacion"    maxlength="85" id="motivo_cancelacion">
        </div>
        <div class="modal-footer">
          <button value="0"  class="btn btn-primary"  id="aceptar"  >Aceptar</button>
          <button value="1" type="button" class="btn btn-secondary"  id=""cancelar"  data-dismiss="modal">Cancelar</button>
        </div>
        
    `; 

   document.getElementById('cancel_order').innerHTML  =   elementsHTML; 

};
