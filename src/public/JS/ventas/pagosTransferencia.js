
const  pagosTrasnsferencia  = () =>{

    let num_pedido  = document.getElementById('num_pedido').value; 
    let comprobante_pago = document.getElementById('comp').value; 

      var csvFile=$('#comprobante_pago')[0].files[0];
      
      var data = new FormData(); 
      data.append('num_pedido',num_pedido);
      data.append('comprobante_pago',comprobante_pago);  
      data.append('comprobante_pago', csvFile);
      var request = $.ajax
          ({
              url: '/ventas/updateTrasferencia',
              method: 'POST',
              contentType: false,
              processData: false,
              data: data,
              dataType: "html"
          });
  
          request.done(function( msg )
          {
            $('#Ventana_Modal_order').modal('hide');
            pedidos_vendedores(); 
            console.log("hecho: "+msg);
  
          });
  
          request.fail(function( jqXHR, textStatus )
          {
              alert( "Hubo un error: " + textStatus );
          });
  
        }; 
