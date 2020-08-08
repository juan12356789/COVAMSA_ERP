let excelInfo  = []; 

const  uploadExcel  = () =>{

    var csvFile = $('#excel')[0].files[0];
    if( csvFile == undefined ) return notifications(`Seleccione algún archivo `,'warning');
    if(csvFile.name.substring(csvFile.name.lastIndexOf("."))  != ".xlsx" )   return notifications(`Sólo se adminten archivos .xlsx`,'warning'); 
   
    
    var data = new FormData(); 
    data.append('excel', csvFile);
    
    var request = $.ajax
        ({
            url: '/excel',
            method: 'POST',
            contentType: false,
            processData: false,
            data: data,
            dataType: "html"
        });

        request.done(function( msg )
        {
         
          if(msg == "false" ) return notifications(`Este cliente pertenece a  otro vendedor, favor de notificarlo con en administrador`,'warning');
          if(msg == "null") return notifications(`No se en cuentra ese cliente en la base de datos`,'warning');
          if(msg == "enProceso")  return  notifications(`Este  número  de orden ya se encunetra en proceso`,'warning');
          $("#ocultar_excel").hide();
          excelInfo  = []; // se vacia la info para la siguinte orden 
          let info = JSON.parse(msg), n =  false ,pedido = ``,cont  = 0 ; 
          info.Hoja1.forEach(element => {
            if(n) cont++; 
            if(element.B == "CODIGO")  n = true ; 
           
          });
          excelInfo.push(msg);
          notifications("Ha sido importado de manera correcta",'success'); 
          $("#imgct").show();
          $("#infoPedido").val(info.Hoja1[info.Hoja1.length - 1 ].cotizacion);
          $("#fecha_pedido").val(info.Hoja1[info.Hoja1.length - 1 ].fecha.split('/').reverse().join('-'));
          $("#importe").val(info.Hoja1[info.Hoja1.length - 1 ].total);
          $("#numero_partidas").val(cont);
          $("#nombre_cliente").val(info.Hoja1[info.Hoja1.length - 1 ].cliente);
          $("#tipo_entre").val(info.Hoja1[info.Hoja1.length - 1 ].prioridadE == 0 ? "Entrega parcial" : "Entrega  completo" );
          $(info.Hoja1[info.Hoja1.length - 1 ].prioridadE == 0 ? "#parcial" : "#completo").attr('checked', true);
          cliente(info.cliente);

        });

        request.fail(function( jqXHR, textStatus )
        {
            alert( "Hubo un error: " + textStatus );
        });

      }; 

const orderDetail  =  () =>{
        
      let info  = JSON.parse(excelInfo), n =  false ,pedido = ``,cont  = 1 ;  
      
      
      info.Hoja1.forEach(element => {
          // if(element.K == "Subtotal")  n = false;  
          if(n ==  true  && element.B != undefined){
            pedido  +=  `
              <tr>
               <td>${cont++}</td>
               <td>${element.B}</td>
               <td>${element.D}</td>
               <td>${element.A}</td>
              </tr>
            `; 
          }
          if(element.B == "CODIGO")  n = true ; 
         
      });
         let ventana  = `
         <div class="modal fade" id="orden" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-labelledby="staticBackdropLabel" aria-hidden="true">
         <div class="modal-dialog  modal-dialog-scrollable modal-lg"  >
           <div class="modal-content">
             <div class="modal-header">
               <h5 class="modal-title" id="staticBackdropLabel"> Detalles de la  partida </h5>
               <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                 <span aria-hidden="true">&times;</span>
               </button>
             </div>
             <div class="modal-body">
                  <table  class="table" >
                  <thead  class="thead-dark" >
                      <th></th>
                      <th>Clave</th>
                      <th>Nombre</th>
                      <th>Cantidad</th>
                  </thead>
                  <tbody id="cuerpo" >
                   ${pedido}
                  </tbody>
                </table>
             </div>
             <div class="modal-footer">
               <button type="button" class="btn btn-secondary" data-dismiss="modal">Aceptar</button>
             </div>
           </div>
         </div>
       </div>
      `;
      document.getElementById('detallesPedido').innerHTML = ventana; 
      $('#orden').modal('show');

      }; 

    const  orderDatailMisPedidos =  id  =>{
      console.log(id);
      $.ajax({ type: "POST",url: "/excel/excelDetail",data: {pedido: id},   success: function (response) {
          let pedido  = `` , cont  = 1 ; 
          response.forEach(element => {
  
            pedido  +=  `
              <tr>
               <td>${cont++}</td>  
               <td>${element.clave}</td>
               <td>${element.cantidad}</td>
               <td>${element.nombre}</td>
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
      
   }