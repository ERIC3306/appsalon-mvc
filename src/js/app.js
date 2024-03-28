let paso = 1;
const pasoInicial = 1;
const pasoFinal = 3;

const cita = {
    id: '',
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
});

function iniciarApp() {
    mostrarSeccion();   // Muestra y oculta las secciones (de las citas)
    tabs();             // Cambia la sección cuando se presionen los tabs
    botonesPaginador(); // Agrega o quita los botones del paginador
    paginaSiguiente(); 
    paginaAnterior();

    consultarAPI();     // Consulta la API en el backend de PHP

    idCliente();
    nombreCliente();    // Añade el nombre del cliente al objeto de cita
    seleccionarFecha(); // Añade la fecha de la cita en el objeto
    seleccionarHora();  // Añade la hora de la cita en el objeto

    mostrarResumen();   // Muestra el resumen de la cita
}

function mostrarSeccion() { 
    /* SELECCION DE CADA SECCION DEL TAB */
    // Ocultar la sección que tenga la clase de mostrar
       const seccionAnterior = document.querySelector('.mostrar');
       if(seccionAnterior) {
           seccionAnterior.classList.remove('mostrar');
       }
    // Seleccionar la sección con el paso...
        const pasoSelector = `#paso-${paso}`;               //Busca el paso que esta actualmente activo
        const seccion = document.querySelector(pasoSelector);
        seccion.classList.add('mostrar');                   //Agrega ka calse de mostrar

    /* RESALTAR TAB */
    // Quita la clase de actual al tab anterior
    const tabAnterior = document.querySelector('.actual');
    if(tabAnterior) {
        tabAnterior.classList.remove('actual');
    }
    // Resalta el tab actual
    const tab = document.querySelector(`[data-paso="${paso}"]`);
    tab.classList.add('actual');
}

function tabs() {
   // Agrega y cambia la variable de paso según el tab seleccionado
    const botones = document.querySelectorAll('.tabs button');
    console.log(botones);
        botones.forEach( boton => {
        boton.addEventListener('click', function(e) {
            e.preventDefault();

            paso = parseInt( e.target.dataset.paso );           //Asocia el valor del atributo personalizado dentro de la variable de paso
            
            mostrarSeccion();
            botonesPaginador(); 
        });
    });
}

function botonesPaginador() {                   //Muestra y oculta los bontones anterior y siguiente en base al paso del tab
    const paginaAnterior = document.querySelector('#anterior');
    const paginaSiguiente = document.querySelector('#siguiente');

    if(paso === 1) {
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    } else if (paso === 3) {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.add('ocultar');
        mostrarResumen();
    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }
    mostrarSeccion();
}

function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', function() {

        if(paso <= pasoInicial) return;         //Si paso es menor al paso inicial entonces retorna el mismo valor (cuentaMin=PasoInicial)
        paso--;       
        botonesPaginador();
    })
}
function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', function() {

        if(paso >= pasoFinal) return;
        paso++;  
        botonesPaginador();
    })
}


//Consultar y obtener datos de una base de datos por medio de una API(Capa abstracta)
async function consultarAPI() {         //async, permite ejecutar varias funciones a la vez
    try {
        //const url = `${location.origin}/api/servicios`;        //Consultamos la base de datos
                                                                //${location.origin} = https:localhost:3000, es una funcion que tiene cualquier navegador, para poder llevarlo a cualquier dominio/servidor
                                                                //cambiamos las comillas(' ') por un template string(` `)
        const url = '/api/servicios';           //2da opcion, funciona bien si el backend y los archivos dejs del proyecto queden hospedado en el mismo dominio 

        const resultado = await fetch(url);                     //Consultamos la API con fetch
        //await, solo se utiliza en funciones asincronas, detiene la ejecucion por un momento hasta cumplir su funcion
        const servicios = await resultado.json();               //Obtenemos los resultados con .json
        mostrarServicios(servicios);
    
    } catch (error) {
        console.log(error);
    } 
}

function mostrarServicios(servicios) {
    servicios.forEach( servicio => {
       const { id, nombre, precio } = servicio;                 //Desconstruccion del objeto cita, para tomar los elementos especificados por separado

       const nombreServicio = document.createElement('P');     //crea un parrafo
       nombreServicio.classList.add('nombre-servicio');        //Le aniade una clase
       nombreServicio.textContent = nombre;                    //Aniade el nombre de la BD al contenido del texto

        const precioServicio = document.createElement('P');
        precioServicio.classList.add('precio-servicio');
        precioServicio.textContent = `$${precio}`;

        const servicioDiv = document.createElement('DIV');
        servicioDiv.classList.add('servicio');
        servicioDiv.dataset.idServicio = id;
        servicioDiv.onclick = function() {              //onlick, se acciona al dar click
            seleccionarServicio(servicio);              //Pasa un dato de una funcion a otra, gracias a este callback
        }

        servicioDiv.appendChild(nombreServicio);        //appendChild, Coloca el parrafo(hijo) dentro del div(padre)
        servicioDiv.appendChild(precioServicio);

        document.querySelector('#servicios').appendChild(servicioDiv);
    });
}

function seleccionarServicio(servicio) {
    const { id } = servicio;            //Extrae el id del arreglo de servicio
    const { servicios } = cita;         //Extrae los servicios del arreglo de cita

    // Identificar el elemento al que se le da click
    const divServicio = document.querySelector(`[data-id-servicio="${id}"]`);

    // Comprobar si un servicio ya fue agregado 
    if( servicios.some( agregado => agregado.id === id ) ) {        //.some, itera en el arreglo y retorna true en caso de que un elemento(id) exita en el arreglo
        // Eliminarlo
        cita.servicios = servicios.filter( agregado => agregado.id !== id );    //.filter, nos permite sacar un elemento basado en una condicion(que el id exista)
        divServicio.classList.remove('seleccionado');
    } else {
        // Agregarlo
        cita.servicios = [...servicios, servicio];          //...servicios (toma una copia del arreglo de servicios), servicio (agrega el servicio a la copia) y rescribe en servicios
        divServicio.classList.add('seleccionado');
    }
}

function idCliente() {
    cita.id = document.querySelector('#id').value;
}
function nombreCliente() {
    cita.nombre = document.querySelector('#nombre').value;      //asignamos el valor de la variable en donde se encuentra el id en una variable de java
}

function seleccionarFecha() {
    const inputFecha = document.querySelector('#fecha');
    inputFecha.addEventListener('input', function(e) {

        const dia = new Date(e.target.value).getUTCDay();       //.getITCDay, toma el dia en q se selecciona en numero(Domingo-0,Sabado-6)

        if( [6, 0].includes(dia) ) {                //Si el valor seleccionado del dia es sabado o domingo se muestra una alerta y no se seleccioa el valor
            e.target.value = '';                    
            mostrarAlerta('Fines de semana no permitidos', 'error', '.formulario');
        } else {
            cita.fecha = e.target.value;            //El valor del dia seleccionado se asigna a la fecha del arreglo cita
        }
        
    });
}

function seleccionarHora() {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', function(e) {

        const horaCita = e.target.value;
        const hora = horaCita.split(":")[0];        //split, Separa un string y los separa en valores de un arreglo. [0]posicion del valor que retorna del arreglo(hora)
        if(hora < 10 || hora > 18) {
            e.target.value = '';
            mostrarAlerta('Hora No Válida', 'error', '.formulario');
        } else {
            cita.hora = e.target.value;
        }
    })
}

function mostrarAlerta(mensaje, tipo, elemento, desaparece = true) {

    // Previene que se generen más de 1 alerta
    const alertaPrevia = document.querySelector('.alerta');
    if(alertaPrevia) {              //Si exite una alerta previa la elimina para poder generar mas
        alertaPrevia.remove();
    }

    // Scripting para crear la alerta
    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');
    alerta.classList.add(tipo);

    const referencia = document.querySelector(elemento);
    referencia.appendChild(alerta);

    if(desaparece) {   
        // Eliminar la alerta si desaparece = TRUE
        setTimeout(() => {          //Despues de tres segundos se elimina este mensaje de alerta
            alerta.remove();
        }, 3000);
    } 
}


function mostrarResumen() {
    const resumen = document.querySelector('.contenido-resumen');

    // Limpiar el Contenido de Resumen
    while(resumen.firstChild) {
        resumen.removeChild(resumen.firstChild);
    }

    if(Object.values(cita).includes('') || cita.servicios.length === 0 ) {              //Si el objeto(cita) esta vacia o si no se ha seleccionado ningun servicio muestra una alerta
        mostrarAlerta('Faltan datos de Servicios, Fecha u Hora', 'error', '.contenido-resumen', false);
        return;                     //Detiene la ejecucion del codigo y ahorrarnos un else
    } 

    // Formatear el div de resumen
    const { nombre, fecha, hora, servicios } = cita;

    // Heading para Servicios en Resumen
    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de Servicios';
    resumen.appendChild(headingServicios);

    // Iterando y mostrando los servicios
    servicios.forEach(servicio => {
        const { id, precio, nombre } = servicio;
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.innerHTML = `<span>Precio:</span> $${precio}`;

        //Los muestra dentro de un div
        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        //Lo muestra en el resumen
        resumen.appendChild(contenedorServicio);
    });

    // Heading para Cita en Resumen
    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de Cita';
    resumen.appendChild(headingCita);

    const nombreCliente = document.createElement('P');
    nombreCliente.innerHTML = `<span>Nombre:</span> ${nombre}`;

    // Formatear la fecha en español,  para colocar una fecha mas amigable para el usuario
    const fechaObj = new Date(fecha);
    const mes = fechaObj.getMonth();        //Obtiene el valor numerico del mes
    const dia = fechaObj.getDate() + 2;     //+2, Cada vez que se utiliza new Date se tiene un desfase de un dia
    const year = fechaObj.getFullYear();

    const fechaUTC = new Date( Date.UTC(year, mes, dia));
    
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}     //Configuracion del formato de la fecha
    const fechaFormateada = fechaUTC.toLocaleDateString('es-MX', opciones);                 //toLocaleDateString, te regresa una fecha(objeto) formateada en un idioma especifico
    //...........................................

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fechaFormateada}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora} Horas`;

    // Boton para Crear una cita
    const botonReservar = document.createElement('BUTTON');
    botonReservar.classList.add('boton');
    botonReservar.textContent = 'Reservar Cita';
    botonReservar.onclick = reservarCita;           //se asocia una funcion(reservarCita) a un evento(.onlick)
                                                    //Se colocan parentesis a la funcion para mandarla a llamar
                                                    //Si se quiere pasar un paramtro a la funcion se recomienda usar un callback (function() { reservarcita(id) })

    // Muestra en pantalla del resumen los datos
    resumen.appendChild(nombreCliente);     
    resumen.appendChild(fechaCita);
    resumen.appendChild(horaCita);

    resumen.appendChild(botonReservar);
}



async function reservarCita() {
    
    const { nombre, fecha, hora, servicios, id } = cita;

    const idServicios = servicios.map( servicio => servicio.id );       //foreach, itera
                                                                        //map, itera y almacena las coincidencias en la variable

    const datos = new FormData();       //Es la forma de crear el submit pero con Js, ahi se colocan en un objeto todos los datos que se envian al servidor     
    // console.log([...datos]);         //Muy util para consultar datos amyes de enviarlos al navegador, crea una copia del objeto

    datos.append('fecha', fecha);
    datos.append('hora', hora );
    datos.append('usuarioId', id);
    datos.append('servicios', idServicios);

    try {
        // Petición hacia la api
        const url = '/api/citas'
        const respuesta = await fetch(url, {
            method: 'POST',
            body: datos
        });

        const resultado = await respuesta.json();
        console.log(resultado);

        //Alarma de CITA CREADA importada de SweetAlarm
        if(resultado.resultado) {
            Swal.fire({
                icon: 'success',
                title: 'Cita Creada',
                text: 'Tu cita fue creada correctamente',
                button: 'OK'
            }).then( () => {                
                setTimeout(() => {
                    window.location.reload();           //Recarga la pagina despues de 3seg al mandar los datos al servidor
                }, 500);
            })
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al guardar la cita'
        })
    } 
}