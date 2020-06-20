$(document).ready(function() {
    tu_usuario();
    userId();
    dataTable = $("#orders").DataTable({
        "order": [
            [0, "desc"]
        ],
        columns: [
            { data: 'nombre' },
            { data: 'apellido_paterno' },
            { data: 'apellido_materno' },
            { data: 'correo' },
            {
                sortable: false,
                "render": function(data, type, full, meta) {
                    return `<input type="password" style="border: 0;"  id="password" readonly  value=${full.password} >`;
                }
            },
            { data: 'tipo_usuario' },
            {
                sortable: false,
                "render": function(data, type, full, meta) {
                    return `${ full.estado == 0 ? "Inactivo" : "Activo" }`;
                }
            },
            {
                sortable: false,
                "render": function(data, type, full, meta) {
                    return `<button  class="btn btn-success" onclick="selectUserc(${full.idacceso})" >Editar</button>`;
                }
            }
        ]
    });
    users();
});

const tu_usuario = () => {

    $.ajax({
        type: "POST",
        url: "/user",
        success: function(response) {

            let info_profile = `
                ID:  <input type="text"  id="acceso"  style=" border: 0;" readonly value="${response.idacceso}" ><br><br>
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

const userId = () => {

    $.ajax({
        type: "POST",
        url: "/user/id",
        success: function(response) {
            let buttons = '';
            if (response == "Administrador") {
                buttons = `
                
                
                <button class="btn btn-secondary btn-lg" type="button" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                  Mi perfil
                </button>
                <button class="btn btn-secondary btn-lg" type="button" data-toggle="collapse" id="empleadosControl" data-target="#collapseExampletwo" aria-expanded="false" aria-controls="collapseExample">
                  Empleados
                </button>
               
                `;
            } else {
                buttons = `
                <button class="btn btn-secondary btn-lg" type="button" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                 Mi perfil
                </button>`;
            }

            document.getElementById("buttons").innerHTML = buttons;

        }
    });

};


const users = (option) => {

    $.ajax({type: "POST",url: "/user/selectUser",success: function (response) {
     
            dataTable.rows().remove();
            dataTable.rows.add(response).draw();
        }
    });

};




const selectUserc = id => {

    

    $.ajax({type: "POST",url:"/user/selectIdUser",data:{id} ,success: function (response) {
            console.log(response);
                    
            let form_usuario = `
            <div class="container" >
                <div class="row" >
                    <div class="col" >
                        <label>Id:</label>
                        <input type="text" value="${response[0].idacceso}" id="id"    class="form-control"  required    style=" border: 0;" readonly   name="id" ><br>
                    </div>

                    <div class="col">
                        <label>Nombre:</label>
                        <input type="text"   class="form-control"  value="${response[0].nombre}"  pattern="[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,48}"  required  id="nombre"    name="nombre" ><br>
                    </div>
                </div>
                <div class="row" >
                    <div class="col">
                        <label> Apellido paterno: </label>
                        <input type="text" value="${response[0].apellido_paterno}" pattern="[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,48}"  required class="form-control"  id="apellidoP" name="apellidoP" ><br>
                    </div>
                    <div class="col">
                        <label>Apellido Materno:</label>
                        <input type="text" value="${response[0].apellido_materno}"  pattern="[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,48}"  required  class="form-control"  id="apellidoM" name="apellidoM" ><br>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <label>Correo:</label>
                        <input type="text" value="${response[0].correo}"  required  id="correo" class="form-control"  name="correo" ><br>
                    </div>
                    <div class="col">
                        <label>Contraseña:</label>
                        <input type="password" value="${response[0].password}"  required   pattern="[A-Za-z0-9!?-]{8,12}"   id="contra" class="form-control"   name="contra" ><br>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <label>Tipo de usuario:</label>
                        <input type="text"  value="${response[0].tipo_usuario}"  name="tipo_usuario" id="tipo_usuario" class="form-control"  required    style=" border: 0;" readonly  >
                        <br>
                        <select name="usuario" id="usuarios"  onchange="option();" class="form-control" >
                            <option  value="Ventas" >Ventas</option>
                            <option  value="Almacen" >Almacén</option>
                            <option  value="Administrador" >Administrador</option>
                        </select>
                    </div>
                    <div class="col-2">
                            <label>Activo</label>
                            <input type="radio"   required  name="estado_usuario" id="activo" value="1"  ${response[0].estado == 1? "checked" :"" }  >
                    </div>
                    <div class="col-2">
                            <label>Inactivo</label>
                            <input type="radio"   required  name="estado_usuario" id="inactivo" value="0" ${response[0].estado == 0? "checked" :"" }>
                    </div>
                </div>
            </div>
            `;

            $('#updateUser').modal('show');

            document.getElementById("update").innerHTML = form_usuario;

        }
    });

}; 

let  option = () => $("#tipo_usuario").val($("#usuarios").val());
 

const insertUser  = () =>{
    let form_usuario = `
    <div class="container" >
        <div class="row" >


            <div class="col">
                <label>Nombre:</label>
                <input type="text"   class="form-control"  pattern="[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,48}"  required  id="nombre"    name="nombre" ><br>
            </div>
        </div>
        <div class="row" >
            <div class="col">
                <label> Apellido paterno: </label>
                <input type="text"   required class="form-control" pattern="[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,48}"  id="apellidoP" name="apellidoP" ><br>
            </div>
            <div class="col">
                <label>Apellido Materno:</label>
                <input type="text"   required  class="form-control" pattern="[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,48}" id="apellidoM" name="apellidoM" ><br>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <label>Correo:</label>
                <input type="text"   required      id="correo" class="form-control"  name="correo" ><br>
            </div>
            <div class="col">
                <label>Contraseña:</label>
                <input type="text"  required   pattern="[A-Za-z0-9!?-]{8,12}"   id="contra" class="form-control"   name="contra" ><br>
            </div>
        </div>
        <div class="row">
            <div class="col-6">
                <label>Tipo de usuario:</label>
                <select name="tipo_usuario" id="tipo_usuario" class="form-control" >
                    <option value="Ventas" >Ventas</option>
                    <option value="Almacen" >Almacén</option>
                    <option value="Administrador" >Administrador</option>
                </select>
            </div>
            <div class="col-2">
                    <label>Activo</label>
                    <input type="radio"   required  name="estado_usuario" id="activo" value="1"  >
            </div>
            <div class="col-2">
                    <label>Inactivo</label>
                    <input type="radio"   required  name="estado_usuario" id="inactivo" value="0" >
            </div>
        </div>
    </div>
    `;

    $('#insertUser').modal('show');

    document.getElementById("insert").innerHTML = form_usuario;
};
$(function() {
    $("#user_insert").submit(function(e) {
        e.preventDefault();
        let formData = {
            nombre: $("#nombre").val(),
            apellidoP: $("#apellidoP").val(),
            apellidoM: $("#apellidoM").val(),
            correo: $("#correo").val(),
            password: $("#contra").val(),
            tipo_usuario: $("#tipo_usuario").val(),
            actividad: $('input:radio[name=estado_usuario]:checked').val()
        };

        $.ajax({
            type: "POST",
            url: "/user/insert",
            data: formData,
            success: function(response) {
                
                if(response == "null") return notifications("Ese correo ya está en la base de datos  ", 'warning');
                users();
                notifications("Se ha guardado con éxito ", 'success');
                $('#insertUser').modal('hide');
            }
        });

    });
});

$(function() {
    $("#user_update").submit(function(e) {
        e.preventDefault();
        let formData = {
            id: $("#id").val(),
            nombre: $("#nombre").val(),
            apellidoP: $("#apellidoP").val(),
            apellidoM: $("#apellidoM").val(),
            correo: $("#correo").val(),
            password: $("#contra").val(),
            tipo_usuario: $("#tipo_usuario").val(),
            actividad: $('input:radio[name=estado_usuario]:checked').val()
        };

        $.ajax({
            type: "POST",
            url: "/user/updateInfoUsers",
            data: formData,
            success: function(response) {
                users();
                notifications("La actualización ha sido exitosa ", 'success');
                $('#updateUser').modal('hide');
            }
        });

    });
});


$(function() {
    $("#sendContra").submit(function(e) {
        e.preventDefault();
        if ($("#nuevaContra").val() != $("#confirmarContra").val()) return notifications("Favor de checar los campos", 'warning');
        $.ajax({
            type: "POST",
            url: "/user/updatePassword",
            data: { id: $("#acceso").val(), nuevContra: $("#nuevaContra").val(), conf: $("#confirmarContra").val(), aContra: $("#aContra").val() },
            success: function(response) {

                if (response == true) {

                    notifications("Su contraseña ha sido actualizada correctamente ", 'success');
                    return $('#exampleModal').modal('hide');

                }
                notifications("El cambio de contraseña no ha sido exitoso favor de verificar los campos ", 'warning');

            }
        });

    });
})