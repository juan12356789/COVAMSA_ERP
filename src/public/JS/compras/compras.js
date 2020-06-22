const partidas = () => {

    $.ajax({
        type: "POST",
        url: "/compras/partidas",
        data: "data",
        success: function(response) {
            console.log(response);

        }
    });

};

partidas();