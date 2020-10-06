const socket = io();


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
                      <td><i class="fas fa-list-ul" id="modalFaltantes${data.idPartida}" onclick="modalFaltantes('${data.idPartida}',${ data.num_subpedido == null ? `'${data.num_pedido}'` : `'${data.num_subpedido}'` }) "></i></td>
                    </tr>`;
        });
        document.getElementById('pedidos').innerHTML = table;
            
        }
    });

};

socket.on('data:compras', function(data) {

    partidas(data);

});
// Se manda a llamar los faltantes que se tienen por cada una da las   partidas 
let arregloIdcheck = [] , idFaltante = [],selectFalse = []; 
const modalFaltantes  = ( id , num_pedido ) =>{
    $("#logFaltantes").modal('hide'); 
    console.log('hola');
    $("#referenciaProveedores").modal('hide');
    $.ajax({type: "POST",url: "/compras/faltantes_partida",data: {id:id},success: function (response) {
        console.log(response);
        let table = ``,cont = 1 ,estatus = ["Faltante","Incompleto","Completo"] ,contFaltanteProveedor = 0;
        proveedores();
        arregloIdcheck = []; 
            response.forEach(element => {
                arregloIdcheck.push(element.idFaltantePartida);
                table += `
                <tr>
                    <td>${cont++}</td>
                    <td ><input type="checkbox"  ${element.nombre_proveedor == null ? '' : 'checked'} id="seleccion${element.idFaltantePartida}" onclick="selectProveedor('${element.idFaltantePartida}')" >  </td>
                    <td><i class="fas fa-list-ul" id="log_faltantes${element.idFaltantePartida}"  onclick="log_faltantes('${element.idFaltantePartida}','${id}','${num_pedido}')"  ></i></td>
                    <td>${element.clave}</td>
                    <td>${element.nombre}</td>
                    <td>${element.cantidad}</td>
                    <td> <input type="text"  readonly value="${element.cantidad_surtida == null ? 0 : element.cantidad_surtida}" id="cantidadSurtida">  </td>
                    <td>${ estatus[element.estatus ]}</td>
                    <td>${element.nombre_proveedor == null ? '' : element.nombre_proveedor }</td>
                    <td>${element.referencia == null ? '' : element.referencia }</td>
                    <td><input type="text" value="${element.fechaF == null ? '' : element.fechaF}" readonly  id="fechaPedido${element.idFaltantePartida}" > </td>
                    <td>${element.fechaL == null ? '' : element.fechaL}</td>
                </tr>
                `; 
                if(element.nombre_proveedor != null) contFaltanteProveedor++; 
            }); 
            idFaltante = [];  
            selectFalse = []; 
           let modal  = `
           <div class="modal fade" id="modalFaltantes" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
           <div class="modal-dialog modal-dialog-scrollable  modal-xl">
             <div class="modal-content">
               <div class="modal-header">
                 <h5 class="modal-title" id="exampleModalLabel"> Faltantes #${num_pedido} </h5>
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
                        <input type="checkbox" ${response.length == contFaltanteProveedor? 'checked':''} onclick="selectAllsupplier('${id}')" id="selectAll">   
                    </div>
                </div>

                <br>
                <div class="table-responsive">
                 <table class="table table-bordered table-striped" >
                     <thead class="thead-dark" >
                         <tr>
                             <th>#</th>
                             <th></th>
                             <th>Info</th>
                             <th>Nombre</th>
                             <th>Descripción</th>
                             <th  >Cantidad requerida</th>
                             <th>Cantidad Surtida</th>
                             <th>Estatus</th>
                             <th>Proveedor</th>
                             <th>Referencia</th>
                             <th>Fecha de requiscion</th>
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
                 <button type="button" class="btn btn-secondary" id="Cerrar" data-dismiss="modal">Cerrar</button>
                 <button type="button" class="btn btn-primary" id="Guardar" onclick="modalRefefrencia(${id},'${num_pedido}')"  data-toggle="modal" data-target="#referenciaProvreedor" >Guardar</button>
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

const modalRefefrencia  = (id , num_pedido) =>{
    if(idFaltante.length == 0 & selectFalse.length !=0) return saveChanges(`${id}`,`${num_pedido}`); 
    if($("#browser").val() == '')return notifications("Para realizar esta acción seleccione algún proveedor","warning");
    let table =`
       <div class="modal fade" id="referenciaProveedores" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
       <div class="modal-dialog">
         <div class="modal-content">
           <div class="modal-header">
             <h5 class="modal-title" id="exampleModalLabel">Referencia del faltante</h5>
             <button type="button" class="close" data-dismiss="modal" aria-label="Close">
               <span aria-hidden="true">&times;</span>
             </button>
           </div>
           <div class="modal-body">
             <label>Ingrese el número de referencia </label>
             <input type="text" maxlength="50" id="referencia" class="form-control" onkeypress="return justLetters(event)" id="referencia" placeholder="Numero de refenrencia">
           </div>
           <div class="modal-footer">
             <button type="button" class="btn btn-secondary" id="Cerrar" data-dismiss="modal">Cerrar</button>
             <button type="button" id="saveChanges" onclick="saveChanges('${id}','${num_pedido}')" class="btn btn-primary">Guardar</button>
           </div>
         </div>
       </div>
     </div>`;    
     $("#modalFaltantes").modal('hide');
     document.getElementById('refProveedores').innerHTML = table;
    $("#referenciaProveedores").modal('show');
}
let justLetters = event =>{
    let  x = event.which || event.keyCode;
    let validas  = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM123456789-'; 
    concatenarNumeros += String.fromCharCode(x);
    if( validas.indexOf(String.fromCharCode(x)) == -1  ){
      return false ;
    }
  
  }

const log_faltantes  = (id , idFaltantes , num) =>{
  console.log('hola');
    $.ajax({type: "POST", url: "/compras/log_faltante",data: {id : id},success: function (response) {
        let table = ``,cont = 1 ,estatus = ["Faltante","Incompleto","Completo"] ;
            response.forEach(element => {
                table += `
                <tr>
                    <td>${cont++}</td>
                    <td >${element.nombre}  </td>
                    <td>${estatus[element.estado]}</td>
                    <td>${element.descripcion}</td>
                    <td>${element.fecha}</td>
                    
                </tr>
                `; 
            }); 
           let modal  = `
           <div class="modal fade" id="logFaltantes" tabindex="-1" data-backdrop="static" aria-labelledby="exampleModalLabel" aria-hidden="true">
           <div class="modal-dialog   modal-lg">
             <div class="modal-content">
               <div class="modal-header">
                 <h5 class="modal-title" id="exampleModalLabel">Bitacora de  Faltantes </h5>
                 <button type="button" id="close" onclick="modalFaltantes('${idFaltantes}','${num}')" class="close" data-dismiss="modal" aria-label="Close">
                   <span aria-hidden="true">&times;</span>
                 </button>
               </div>
               <div class="modal-body">
                <div class="table-responsive">
                 <table class="table table-bordered table-striped" >
                     <thead class="thead-dark" >
                         <tr>
                             <th>#</th>
                             <th>Usuario</th>
                             <th>Estado</th>
                             <th>Descripción</th>
                             <th>Fecha y Hora </th>
                         </tr>
                     </thead>
                     <tbody>
                     ${table}
                     </tbody>
                 </table>
                </div>
               </div>
               <div class="modal-footer">
                 <button type="button" id="aceptar" onclick="modalFaltantes('${idFaltantes}','${num}')" class="btn btn-primary" data-dismiss="modal">Aceptar</button>
               </div>
             </div>
           </div>
         </div>
         `;
         $("#modalFaltantes").modal('hide'); 
         document.getElementById('FaltantesL').innerHTML = modal; 
         $("#logFaltantes").modal('show'); 
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
const selectProveedor  = (id ) => {
    console.log(document.getElementById("seleccion"+id).checked);
    if( document.getElementById("seleccion"+id).checked == false &&  arregloIdcheck.length != 0 )arregloIdcheck.splice(arregloIdcheck.indexOf(parseInt(id)) , 1 );
    
    if( document.getElementById("seleccion"+id).checked == false){
      if(idFaltante.indexOf(id) != -1) idFaltante.splice(idFaltante.indexOf(id) , 1 );
      selectFalse.push(id); 
      return ;
    } 
 
    if(selectFalse.indexOf(id) != -1)  selectFalse.splice(selectFalse.indexOf(id) , 1 );
    idFaltante.push(id);

}

// SE SELECCIONA TODOS LOS PROVEEDORES AL MISMO TIEMPO 
const selectAllsupplier = id  =>{
//    console.log(document.getElementById("selectAll").checked); 
    $.ajax({type: "POST",url: "/compras/selectAllSupplier",data: { id : id },success: function (response) {
             console.log(document.getElementById("selectAll").checked);
             for (let i = 0; i < response.length; i++) {
                 
                  $("#seleccion"+response[i].idFaltantePartida).attr('checked',document.getElementById("selectAll").checked);
                
             }
        }
    });

}; 
 
const saveChanges  =  (id , num )=>{
  $("#referenciaProveedores").modal('hide');
    if($("#referencia").val() == '') return notifications("Para realizar esta acción ingrese alguna referencia","warning");
    let  allFaltantes  =  document.getElementById("selectAll").checked ? arregloIdcheck : false ; 
    console.log(arregloIdcheck.length);
    $.ajax({type: "POST",
            url: "/compras/guardar",
            data:
            {proveedor:$("#browser").val(),
            idPartidas: JSON.stringify(idFaltante),
            select :  JSON.stringify(allFaltantes),
            referencia: $("#referencia").val(),
            cancelar_proveedor: JSON.stringify(selectFalse)}, 
            success: function (response) {
            $("#modalFaltantes").modal('hide');
            idFaltante = [];
            notifications("Las partidas  vhan sido guardadas de manera correcta","success");
            modalFaltantes(id, num );
        } 
    });

};

partidas(); 