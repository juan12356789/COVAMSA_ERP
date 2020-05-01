function validar() {
    var validado = true;
    elementos = document.getElementsByClassName("inputFormu");
    for (i = 0; i < elementos.length; i++) {
        if (elementos[i].value == "" || elementos[i].value == null) {
            validado = false
        }
    }
    if (validado) {
        document.getElementById("boton").disabled = false;

    } else {
        document.getElementById("boton").disabled = true;
        //Salta un alert cada vez que escribes y hay un campo vacio
        // alert("Hay campos vacios")
    }
}

function validarEmail(elemento) {

    var texto = document.getElementById(elemento.id).value;
    var regex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;

    if (!regex.test(texto)) {
        document.getElementById("resultado").innerHTML = "Correo invalido";
    } else {
        document.getElementById("resultado").innerHTML = "";
    }

}