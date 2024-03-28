document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
});

function iniciarApp() {
    buscarPorFecha();
}

function buscarPorFecha() {
    const fechaInput = document.querySelector('#fecha');
    fechaInput.addEventListener('input', function(e) {          //input, una vez que se selecciona algo(fecha)
        const fechaSeleccionada = e.target.value;

        window.location = `?fecha=${fechaSeleccionada}`;        //?, queryString, se coloca al final de la url
    });
}