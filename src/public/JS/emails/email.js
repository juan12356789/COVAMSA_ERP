function enviarCorreo(insTextoComp) {
    var sEmail = prompt("Destinatario:", "");
    if (sEmail != null) {
        var sLink = "mailto:" + escape(sEmail) +
            "?subject=" + escape("Comunicado de Pedido Urgente:") +
            "&body=" + insTextoComp;
        window.location.href = sLink;
    }
}