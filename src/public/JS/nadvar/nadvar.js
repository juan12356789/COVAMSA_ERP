const usuario = () =>{

    $.ajax({type: "POST",url: "/nadvar/usuario",success: function (response) {
        console.log(response);
        document.getElementById('usuario').innerHTML = `<p> ${response[0].nombre} ${response[0].apellido_paterno} (${response[0].correo}) </p>`;
        }
    });

}; 
usuario(); 