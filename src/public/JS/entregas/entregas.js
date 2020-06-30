
let tablaRepartidor = () =>{
    $.ajax({type: "POST",url: "/entregas/informacion_envios",success: function (response) {

             sendData(response); 
            

        }
    });
}; 

tablaRepartidor(); 

let sendData = (data) => {
    console.log(data);
    
    let table = '';
    ruta = ["Norte", "Sur"];
    let estatus = ['Nuevo', 'Surtiendo', 'Facturable', 'Requerir y facturar ', 'Requerir', 'Cancelado', 'Detenido','Facturando','Facturado','Ruta','Entregado'];
    prioridad_info = ["Normal", "Normal", "Urgente"];
    colores = ["#C6AED8", "#A1DEDB ", "#DECAA1 ", "#C1DEA1 ", "#DBE09A", "#E0A09A", "#817E7E","#B4EFED","#98F290","#F2FE9C","#D4FEA8"];
    let numeracion_pedidos = 1 , numero_de_pedidos_urgentes = 0;
    data.forEach(data => {
        if (data.prioridad == 2) numero_de_pedidos_urgentes++;
        table += `<tr>

                  <th scope="row">${numeracion_pedidos++}</th>
                  <td> <button  class="btn btn-primary" onclick="cambioStatus('${data.num_pedido}')" >Entregado</button> </td>
                  <td> <i class="fas fa-file-invoice" onclick="cambios_status_pedidos('${estatus[data.estatus - 1]}','${data.num_pedido}')"></i> </td>
                  <td><a  href="/almacen/pdf/${data.ruta_pdf_pedido}">${data.num_pedido}</a></td>
                  <td  style="background-color:${data.ruta ==  1 ? "#DFBC92" : "#92C1DF"} " >${ruta[data.ruta - 1]}</td>
                  <td id="userinput" >${data.importe}</td> 
                  <td style="background-color:${colores[data.estatus - 1]}" >${estatus[data.estatus - 1]}</td>
                  <td >${prioridad_info[data.prioridad]}</td>
                  <td>${data.fecha_facturas}</td>

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
    </div>`;

};


// Se cambia el status y se sube  una foto del comprobante 
const cambioStatus  = id  =>{
    $.ajax({type: "POST",url: "/entregas/archivo",data: {id:id}, success: function (response) {
            console.log(response);
            
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

        if(msg) notifications("El  comprobante  ha sido guardado",'success'); 
        tablaRepartidor(); 
        $("#entregasPedidos").modal('hide');

        });

        request.fail(function( jqXHR, textStatus )
        {
            alert( "Hubo un error: " + textStatus );
        });

      }; 

const deleteFile = id =>{

    $.ajax({type: "POST",url: "/entregas/eliminarArchivo",data:{id:id},success: function (response) {
                
        if(response == true ) notifications("El  comprobante ha sido eliminado",'success'); 
        tablaRepartidor(); 
        $("#entregasPedidos").modal('hide');

        }
    });
   
}; 