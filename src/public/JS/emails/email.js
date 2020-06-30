function enviarCorreo(insTextoComp) {
    let checkbox =   document.getElementById("enviar_correo").checked;
    if(checkbox == false)  return; 
    var sEmail = prompt("Destinatario:", "");
    if (sEmail != null) {
        var sLink = "mailto:" + escape(sEmail) +
            "?subject=" + escape("Comunicado de Pedido Urgente:") +
            "&body=" + insTextoComp;
        window.location.href = sLink;
    }
}