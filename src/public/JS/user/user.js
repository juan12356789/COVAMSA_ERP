$(document).ready(function () {
    
    tu_usuario();
    
   dataTable = $("#orders").DataTable({
        "order": [
            [0, "desc"]
        ],
        columns: [
            {data:'nombre'},
            {data:'apellido_paterno'},
            {data:'apellido_materno'},
            {data:'correo'},
            { sortable: false,
                "render": function(data, type, full, meta) {
                    return  `<input type="password" style="border: 0;"  id="password" readonly  value=${full.password} >`;
                }},
            {data: 'tipo_usuario'},
            { sortable: false,
                "render": function(data, type, full, meta) {
                    return  `<button  class="btn btn-success" onclick="selectUserc(${full.idacceso})" >Editar</button>`;
                }},
            ]
    });
    users(); 
});

const tu_usuario  = () =>{

    $.ajax({type: "POST",url: "/user",success: function (response) {
            
        let info_profile =  `
                id:  <input type="text"  id="acceso"  style=" border: 0;" readonly value="${response.idacceso}" ><br>
                Nombre: ${response.nombre}<br><br>
                Apellido Paterno: ${response.apellido_paterno}<br><br>
                Apellido Materno: ${response.apellido_materno}<br><br>
                Correo: ${response.correo}<br><br>
                Contraseña: <input type="password" name="pasword"  value="${response.password}" readonly   id="password"><br><br>
            `;

            document.getElementById('profile').innerHTML = info_profile;

        }
    });

}; 


const users = (option) =>{

    $.ajax({type: "POST",url: "/user/selectUser",success: function (response) {
            
            dataTable.rows().remove();
            dataTable.rows.add(response).draw();
        }
    });

}; 

const selectUserc=  id  => {

    $.ajax({type: "POST",url:"/user/selectIdUser",data:{id} ,success: function (response) {
        
            let form_usuario = `
            <div class="container" >
                <label>Id:</label>
                <input type="text" value="${response[0].idacceso}" id="id"      style=" border: 0;" readonly   name="id" ><br>
                <label>Nombre:</label>
                <input type="text" value="${response[0].nombre}" id="nombre"    name="nombre" ><br>
                <label> Apellido paterno: </label>
                <input type="text" value="${response[0].apellido_paterno}"   id="apellidoP" name="apellidoP" ><br>
                <label>Apellido Materno:</label>
                <input type="text" value="${response[0].apellido_materno}"   id="apellidoM" name="apellidoM" ><br>
                <label>Correo:</label>
                <input type="text" value="${response[0].correo}" id="correo"   name="correo" ><br>
                <label>Contraseña:</label>
                <input type="text" value="${response[0].password}" id="password"   name="password" ><br>
                <label>Tipo de usuario:</label>
                <input type="text" value="${response[0].tipo_usuario}" id="usuario"   name="usuario" ><br>
            </div>
            `; 

            $('#updateUser').modal('show');

            document.getElementById("update").innerHTML =  form_usuario; 

        }
    });

}; 

$(function () { 
    $("#sendContra").submit(function (e) { 
        e.preventDefault();
        if ($("#nuevaContra").val() != $("#confirmarContra").val() ) return notifications("Favor de checar los campos",'warning'); 
        $.ajax({type: "POST",url: "/user/updatePassword",data: { id:$("#acceso").val(),nuevContra:$("#nuevaContra").val() ,conf:$("#confirmarContra").val() },success: function (response) {
            
            if(response == true) {

            notifications("Su contraseña ha sido actualizada correctamente ",'success'); 
            return $('#exampleModal').modal('hide');

            }

            notifications("El cambio de contraseña no ha sido exitoso favor de verificar los campos ",'warning');
            
        }
    });
        
    });
 })
    
    

