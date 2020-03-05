$('#clientesPorBusqueda').hide();

$("#prueba").click(function(e) {
    $('.col-sm-8').val('');
    $("#ocultar").show();
    $("#clientesPorBusqueda").hide();
    $('#inputBusqueda').keyup(function(e) {
        if ($('#inputBusqueda').val()) {
            $.post("/ventas", { busqueda: $("#inputBusqueda").val() }, function(data) {
                $("#ocultar").hide();
                let tabla = `<table class="table table-bordered-responsive-sm">
              <thead class="thead-light">
         <tr>
           <th scope="col">NOMBRE</th>
           <th scope="col">ID</th>
           <th scope="col">BUSCAR</th>
         </tr>
       </thead>`;
                data.forEach(data => {
                    tabla += `
                <tr>
                  <td>${data.nombre}</td>
                  <td>${data.numero_interno}</td>
                  <td><button type="button" onclick="clientes('${data.nombre}')" class="btn btn-success" data-dismiss="modal">Seleccionar</button></td>
                </tr> 
              `;
                });
                tabla += "</table>";
                $("#clientesPorBusqueda").show();
                document.getElementById('clientesPorBusqueda').innerHTML = tabla;
              
              });

  let clientes = (nombre)=>{
    let mandar  = `
      <div class="form-group row justify-content-center ">
      <label for="" class="col-sm-2 col-form-label"></label>
      <div class="col-sm-5">
        <input type="text"  class="form-control valid border border-secondary" value="${nombre}" name="nombre">
      </div>
      </div>
      </div>
   `;
    document.getElementById('inputCliente').innerHTML =  mandar;
    pagos(nombre); 
  }; 

  let pagos = (cliente)=>{
    $.post("/ventas/pagos",{cliente:cliente},function (data) {
        console.log(data);
      }
    );

  };

