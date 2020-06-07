const excelInfo  = []; 

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
          
          if(msg == "null")  return  notifications(`No se en cuentra ese cliente en la base de datos`,'warning');
          let info = JSON.parse(msg);
          excelInfo.push(msg);
          notifications("Ha sido importado de manera correcta",'success'); 
          $("#imgct").show();
          $("#infoPedido").val(info.Sheet1[info.Sheet1.length - 1 ].cotizacion);
          $("#fecha_pedido").val(info.Sheet1[info.Sheet1.length - 1 ].fecha.split('/').reverse().join('-'));
          $("#importe").val(info.Sheet1[info.Sheet1.length - 1 ].total.replace(',',''));
          $("#numero_partidas").val(info.Sheet1[info.Sheet1.length - 1 ].numero_partidas);
          $("#nombre_cliente").val(info.Sheet1[info.Sheet1.length - 1 ].cliente);
          
          cliente(info.cliente);
        });

        request.fail(function( jqXHR, textStatus )
        {
            alert( "Hubo un error: " + textStatus );
        });

      }; 