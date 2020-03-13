const  socket = io ();  
let classText = () => {
    $(".orden_compra").addClass("col-sm-2 col-form-label");
    $(".numero_pedido").addClass("col-sm-2 col-form-label");
    $(".comprobante_pago").addClass("col-sm-2 col-form-label");
    $(".observaciones").addClass("col-sm-2 col-form-label");


};
classText();

$("#clientes").click(function(e) {

    $('#clientesPorBusqueda').hide();
    $("#inputCliente").hide();
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
                 <td> <button type="button" onclick="cliente('${data.nombre}')" class="btn btn-success" data-dismiss="modal">Seleccionar</button></td>
                  </tr> 
                `

                });
                tabla += "</table>";
                $("#clientesPorBusqueda").show();
                document.getElementById('clientesPorBusqueda').innerHTML = tabla;
            });

        }

    });
});

 let cliente = (nombre) => {
     let mandar = `
       <div class="form-group row justify-content-center ">
       <label for="" class="col-sm-2 col-form-label"></label>
       <div class="col-sm-5">
         <input type="text"  class="form-control valid border border-secondary" value="${nombre}" name="nombre">
       </div>
       </div>
       </div>
    `;
     pagos(nombre);
     $("#inputCliente").show();
     document.getElementById('inputCliente').innerHTML = mandar;

 };
 //Trae los tipos de pago 
 let pagos = (cliente) => {
   
     $.post("/ventas/pagos", { cliente: cliente }, function(data,campos) {
        data[data.length - 1].forEach(data => {
            $("." + data.tipo_pago).removeClass("col-sm-2 col-form-label text-danger");
        });
        classText();
        data.forEach(data => {
            $("." + data.tipo_pago).addClass("col-sm-2 col-form-label text-danger");

        });
    });
};
var x = document.getElementById("imgct");
//action="/ventas/add"
$("#nvig").click(function (e) { 
  e.preventDefault();

  let data = [], nuevo = []; 
  for (let i = 0; i < x.elements.length - 1; i++) {
    nuevo.push(x.elements.item(i).value)
  }
  if (nuevo.filter(Boolean).length < 10)  return  alert('Ingrese todo los campos requeridos');
  else{
    data = nuevo.filter(Boolean);
     let info = {
       orden: data[0],
       fileOrden: data[1],
       noPedido: data[2],
       filePedido: data[3],
       comprobante: data[4],
       comprobanteFile: data[5],
       cliente:data[6],
       ruta: data[7],
       importe: data[8],
       observaciones: data[9]
     };
     $.ajax({type: "POST",url: "/ventas/add",data:info  ,
       success: function (response) {
         
         socket.emit('chat:message',response); 
         
        
                 
       }
     });
  }
});