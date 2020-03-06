$('#clientesPorBusqueda').hide();
// busca los  clientes 
$("#clientes").click(function(e) {
<<<<<<< HEAD

=======
  
>>>>>>> 6843d3557c793294e402710171e6cbedd7d250ae
    $('.col-sm-8').val('');
    $("#ocultar").show();
    $("#clientesPorBusqueda").hide();
    $('#inputBusqueda').keyup(function(e) {

        if ($('#inputBusqueda').val()) {
            $.post("/ventas", { busqueda: $("#inputBusqueda").val() }, function(data) {
                $("#ocultar").hide();

                let tabla = `<table class="table table-bordered-responsive-sm">
             <thead class="thead-light">f
         <tr>
<<<<<<< HEAD
             <th scope="col">NOMBRE</th>
             <th scope="col">ID</th>
             <th scope="col">BUSCAR</th>
          </tr>
          </thead>`;
                console.log(data);

                data.forEach(data => {
                    tabla += `
                 <tr>
                   <td>${data.nombre}</td>
                   <td>${data.numero_interno}</td>
                 <td> <button type="button" onclick="clientes('${data.nombre}')" class="btn btn-success" data-dismiss="modal">Seleccionar</button></td>
                 </tr> 
               `;

=======
           <th scope="col">NOMBRE</th>
           <th scope="col">ID</th>
           <th scope="col">BUSCAR</th>
         </tr>
       </thead>`;
                    console.log(data);
                    
                data.forEach(data => {
                    tabla += `
                <tr>
                  <td>${data.nombre}</td>
                  <td>${data.numero_interno}</td>
                <td> <button type="button" onclick="cliente('${data.nombre}')" class="btn btn-success" data-dismiss="modal">Seleccionar</button></td>
                </tr> 
              `;
>>>>>>> 6843d3557c793294e402710171e6cbedd7d250ae
                });
                tabla += "</table>";
                $("#clientesPorBusqueda").show();
                document.getElementById('clientesPorBusqueda').innerHTML = tabla;
<<<<<<< HEAD

            });

        }

    });

});

//manda el cliente a la tabla 
let clientes = (nombre) => {
    console.log("ola ");
    let mandar = `
         <div class="form-group row justify-content-center ">
         <label for="" class="col-sm-2 col-form-label"></label>
         <div class="col-sm-5">
           <input type="text"  class="form-control valid border border-secondary" value="${nombre}" name="nombre">
         </div>
         </div>
         </div>
      `;
    document.getElementById('inputCliente').innerHTML = mandar;
    pagos(nombre);
=======
              
              });
            }
          });
        });
             
          
//manda el cliente a la tabla 
  let cliente = (nombre)=>{
   
    
    let mandar  = `
      <div class="form-group row justify-content-center ">
      <label for="" class="col-sm-2 col-form-label"></label>
      <div class="col-sm-5">
        <input type="text"  class="form-control valid border border-secondary" value="${nombre}" name="nombre">
      </div>
      </div>
      </div>
   `;
    pagos(nombre); 
    document.getElementById('inputCliente').innerHTML =  mandar;
  }; 

  //Trae los tipos de pago 
  let pagos = (cliente)=>{
 
    $.post("/ventas/pagos",{cliente:cliente},function (data) {
       console.log(data);
       data.forEach(data => {
         $("#prueba").append( data.tipo_pago );
       });

       
      }
    );
  };
>>>>>>> 6843d3557c793294e402710171e6cbedd7d250ae

};

//Trae los tipos de pago 
let pagos = (cliente) => {
    console.log("ola ");

    $.post("/ventas/pagos", { cliente: cliente }, function(data) {

            console.log(data);
            //mandar al fronttend
            // let ver =
            // document.getElementById(data).innerHTML = cliente;
            // pagos(cliente);




        }

    );
};