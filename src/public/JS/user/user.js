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
$(document).ready(function () {
    
    tu_usuario();

});


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
    
    

