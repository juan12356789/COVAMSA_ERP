function closeAlert() {
    swal({
        title: "Mensaje con cierre automático",
        text: "Esta ventana se cerrará en 5 segundos.",
        timer: 5000,
        showConfirmButton: false,

    });
}