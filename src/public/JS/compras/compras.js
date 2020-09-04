
const partidas = () =>{
    
    $.ajax({type: "POST",url: "/compras/partidas",data: "data",success: function (response) {
        let table = '';
        ruta = ["Norte", "Sur"];
        let estatus = ['Nuevo', 'Surtiendo', 'Facturable', 'Requerir y facturar ', 'Requerir', 'Cancelado', 'Detenido','Facturando','Facturado','Ruta','Entregado','Suspendida'];
        prioridad_info = ["Normal", "Normal", "Urgente"];
        let statusFaltante = ['Nuevo','Incompleto-compra','completo-compra','Solventado']; 
        colores = ["#C6AED8", "#A1DEDB ", "#DECAA1 ", "#C1DEA1 ", "#DBE09A", "#E0A09A", "#817E7E","#B4EFED","#98F290","#F2FE9C","#D4FEA8","#F1C078"];
        let numeracion_pedidos = 1 , numero_de_pedidos_urgentes = 0;
        console.log(response);
        response.forEach(data => {
            if (data.prioridad == 2) numero_de_pedidos_urgentes++;
            table += `<tr>
                      <th scope="row">${numeracion_pedidos++}</th>
                      <td>${ data.num_subpedido == null ? data.num_pedido : data.num_subpedido }</td>
                      <td>${data.fecha}</td>
                      <td>${data.prioridad}</td>
                      <td style="background-color:${colores[data.estatus]}" >${statusFaltante[data.estatus]}</td>
                      <td> ${ data.numero_factura == null ? '' : data.numero_factura } </td>
                      <td><i class="fas fa-list-ul"onclick="modalFaltantes('${data.idPartida}')"></i></td>
                    </tr>`;
        });
        document.getElementById('pedidos').innerHTML = table;
            
        }
    });

};

// Se manda a llamar los faltantes que se tienen por cada una da las   partidas 
let arregloIdcheck = [] , idFaltante = []; ;
const modalFaltantes  = id =>{

    $.ajax({type: "POST",url: "/compras/faltantes_partida",data: {id:id},success: function (response) {
        let table = ``,cont = 1 ,estatus = ["Faltante","Incompleto","Completo"] ;
        proveedores();
        arregloIdcheck = []; 
            response.forEach(element => {
                arregloIdcheck.push(element.idFaltantePartida);
                table += `
                <tr>
                    <td>${cont++}</td>
                    <td ><input type="checkbox"  ${element.nombre_proveedor == null ? '' : 'checked'} id="seleccion${element.idFaltantePartida}" onclick="selectProveedor('${element.idFaltantePartida}')" >  </td>
                    <td>${element.clave}</td>
                    <td>${element.nombre}</td>
                    <td>${element.cantidad}</td>
                    <td> <input type="text"  readonly value="${element.cantidad_surtida == null ? 0 : element.cantidad_surtida}" id="cantidadSurtida">  </td>
                    <td>${ estatus[element.estatus ]}</td>
                    <td>${element.nombre_proveedor == null ? '' : element.nombre_proveedor }</td>
                    <td><input type="text" value="${element.fechaF == null ? '' : element.fechaF}" readonly  id="fechaPedido${element.idFaltantePartida}" > </td>
                    <td>${element.fechaL == null ? '' : element.fechaL}</td>
                </tr>
                `; 
            }); 
            idFaltante = [];  
           let modal  = `
           <div class="modal fade" id="modalFaltantes" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
           <div class="modal-dialog modal-dialog-scrollable  modal-xl">
             <div class="modal-content">
               <div class="modal-header">
                 <h5 class="modal-title" id="exampleModalLabel"> Faltantes </h5>
                 <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                   <span aria-hidden="true">&times;</span>
                 </button>
               </div>
               <div class="modal-body">
                <div class="row" >
                    <div class="col-6" >
                        <div id="lista_proveedores" ></div>
                    </div>
                    <div  class="col-6" >
                        <lable>Todos los faltantes </label>
                        <input type="checkbox" onclick="selectAllsupplier('${id}')" id="selectAll">   
                    </div>
                </div>

                <br>
                <div class="table-responsive">
                 <table class="table table-bordered table-striped" >
                     <thead class="thead-dark" >
                         <tr>
                             <th>#</th>
                             <th></th>
                             <th>Nombre</th>
                             <th>Descripción</th>
                             <th  >Cantidad requerida</th>
                             <th>Cantidad Surtida</th>
                             <th>Estatus</th>
                             <th>Proveedor</th>
                             <th>Fecha  requerida  </th>
                             <th>llegada </th>
                         </tr>
                     </thead>
                     <tbody>
                     ${table}
                     </tbody>
                 </table>
                </div>
               </div>
               <div class="modal-footer">
                 <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                 <button type="button" class="btn btn-primary" onclick="saveChanges('${id}')"  >Guardar</button>
               </div>
             </div>
           </div>
         </div>
         `;
      
         document.getElementById('faltantesPorPartida').innerHTML = modal; 
         $("#modalFaltantes").modal('show'); 

        }
    });
};  

const proveedores = () =>{

    $.ajax({type: "POST",url: "/compras/proveedores",success: function (response) {
            let optionsSuppliers = ``; 
            response.forEach(element => optionsSuppliers +=`<option value="${element.nombre}">`);
            document.getElementById('lista_proveedores').innerHTML = `
                    <input list="browsers" class="form-control" placeholder="Proveedores"  name="browser" id="browser">
                    <datalist id="browsers"> ${optionsSuppliers} </datalist>
           
            `;
        }
    });

}; 
 
// SE SELECCIONA UNO POR UNO AL PROVEEDOR 
const selectProveedor  = id => {
    console.log(document.getElementById("seleccion"+id).checked);
    if( document.getElementById("seleccion"+id).checked == false &&  arregloIdcheck.length != 0 ){
        arregloIdcheck.splice(arregloIdcheck.indexOf(parseInt(id)) , 1 );
        // console.log(parseInt(id));
        // console.log(arregloIdcheck);
    }  
    if( document.getElementById("seleccion"+id).checked == false) return idFaltante.splice(idFaltante.indexOf(id) , 1 );
    idFaltante.push(id);

}

// SE SELECCIONA TODOS LOS PROVEEDORES AL MISMO TIEMPO 
const selectAllsupplier = id  =>{
//    console.log(document.getElementById("selectAll").checked); 
    $.ajax({type: "POST",url: "/compras/selectAllSupplier",data: { id : id },success: function (response) {
             
             for (let i = 0; i < response.length; i++) {
                 
                  $("#seleccion"+response[i].idFaltantePartida).attr('checked',document.getElementById("selectAll").checked);
                
             }
        }
    });

}; 
 
const saveChanges  =  id =>{
    if($("#browser").val() == '')  return notifications("Para realizar esta acción seleccione algún proveedor","warning");
    let  allFaltantes  =  document.getElementById("selectAll").checked ? arregloIdcheck : false ; 
    console.log(arregloIdcheck.length);
    $.ajax({type: "POST",
            url: "/compras/guardar",
            data:
            {proveedor:$("#browser").val(),
            idPartidas: JSON.stringify(idFaltante),
            select :  JSON.stringify(allFaltantes)}, 
            success: function (response) {
            $("#modalFaltantes").modal('hide');
            idFaltante = [];
            notifications("Las partidas  vhan sido guardadas de manera correcta","success");
            modalFaltantes(id);
        } 
    });

};

partidas(); 