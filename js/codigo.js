window.fn = {};

window.fn.open = function () {
    var menu = document.getElementById('menu');
    menu.open();
};

window.fn.load = function (page) {
    var content = document.getElementById('content');
    var menu = document.getElementById('menu');
    content.load(page)
            .then(menu.close.bind(menu));
};

var peliculaCorrecta;
var opciones = [];
var nombrePelicula;
var contadorPositivo = 0;
var contadorPreguntas = 0;
var usuario;
var db = window.openDatabase("Ranking", "1.0", "Base de tareas", 1024 * 1024 * 5, crearTablas);

document.addEventListener("init", inicializarPagina);

function inicializarPagina(evt) {
    var destino = evt.target.id;
    switch (destino) {
        case "inicio":
            $("#btnJugar").click(peliculaRandom);
            $("#btnJugar").click(mostrarLoader);
            $("#btnInstrucciones").click(verInstrucciones);
            break;
        case "instrucciones":
            $("#btnVolver").click(volverInicio);
            break;
        case "juego":
            $("#jugar").empty();
            var posicionCorrecta = Math.floor(Math.random() * 4);
            var respuestas = new Array(4);
            respuestas[posicionCorrecta] = peliculaCorrecta.nombre;
            for (i = 0; i < 3; i++) {
                if (i == posicionCorrecta) {
                    respuestas[3] = opciones[i];
                } else {
                    respuestas[i] = opciones[i];
                }
            }
            $("#jugar").append('<img id="imgCorrecta" src="https://image.tmdb.org/t/p/w500' + peliculaCorrecta.imagen + '">' + '<input type="button" id="btnOpcion1" class="button--large--cta" value="' + respuestas[0] + '">' + '<br>' + '<input type="button" id="btnOpcion2" class="button--large--cta" value="' + respuestas[1] + '">' + '<br>' + '<input type="button" id="btnOpcion3" class="button--large--cta" value="' + respuestas[2] + '">' + '<br>' + '<input type="button" id="btnOpcion4" class="button--large--cta" value="' + respuestas[3] + '">' + '<br>' + '<img id="ojo" src="img/ojo.png" alt="logo"/>');
            $("#ojo").click(pista);
            $("#btnOpcion1").click(function () {
                nombrePelicula = $("#btnOpcion1").val();
                if (peliculaCorrecta.nombre === nombrePelicula) {
                    document.getElementById('content').load("pantallaCorrecto");
                    contadorPositivo = contadorPositivo + 2;
                } else {
                    document.getElementById('content').load("pantallaIncorrecto");
                    contadorPositivo--;
                }
            });
            $("#btnOpcion2").click(function () {
                nombrePelicula = $("#btnOpcion2").val();
                if (peliculaCorrecta.nombre === nombrePelicula) {
                    document.getElementById('content').load("pantallaCorrecto");
                    contadorPositivo = contadorPositivo + 2;

                } else {
                    document.getElementById('content').load("pantallaIncorrecto");
                    contadorPositivo--;
                }
            });
            $("#btnOpcion3").click(function () {
                nombrePelicula = $("#btnOpcion3").val();
                if (peliculaCorrecta.nombre === nombrePelicula) {
                    document.getElementById('content').load("pantallaCorrecto");
                    contadorPositivo = contadorPositivo + 2;
                } else {
                    document.getElementById('content').load("pantallaIncorrecto");
                    contadorPositivo--;
                }
            });
            $("#btnOpcion4").click(function () {
                nombrePelicula = $("#btnOpcion4").val();
                if (peliculaCorrecta.nombre === nombrePelicula) {
                    document.getElementById('content').load("pantallaCorrecto");
                    contadorPositivo = contadorPositivo + 2;
                } else {
                    document.getElementById('content').load("pantallaIncorrecto");
                    contadorPositivo--;
                }
            });
            break;
        case "correcto":  
            $("#mensaje").append('<h1>¡Su respuesta es correcta!' + '</h1>' + '<input type="button" id="btnSiguiente" class="button--large--cta" value="Siguiente"' + '>');
            $("#btnSiguiente").click(siguientePregunta);
            $("#btnSiguiente").click(mostrarLoader2);
            opciones.length = 0;
            finalizarJuego();
            break;
        case "incorrecto":
            $("#mensaje2").append('<h1>Su respuesta es incorrecta' + '</h1>' + '<input type="button" id="btnSiguiente" class="button--large--cta" value="Siguiente"' + '>');
            $("#btnSiguiente").click(siguientePregunta);
            $("#btnSiguiente").click(mostrarLoader3);
            opciones.length = 0;
            finalizarJuego();
            break;
        case "ranking":
            listarTareas();
            $("#btnVolver").click(volverInicio);
    }
}

function volverInicio() {
    document.getElementById('content').load("home");
    contadorPreguntas = 0;
    usuario = null;
}

function pista() {
    document.getElementById("imgCorrecta").style.filter = "blur(5px)";
    contadorPositivo--;
}

function siguientePregunta() {
    peliculaRandom();
    contadorPreguntas++;
}

function finalizarJuego() {
    if (contadorPreguntas === 9) {
        db.transaction(agregarTareaSql, errorTns, agregarTareaFinalizado);
        document.getElementById('content').load("pantallaRanking");
    }
}

function verInstrucciones() {
    document.getElementById('content').load("pantallaInstrucciones");
}

function peliculaRandom() {
    if (!usuario) {
        usuario = $("#nombreJugador").val();
    }
    obtenerCorrecto();
}

function obtenerCorrecto() {
    var idPelicula = Math.ceil(Math.random() * 2000);
    $.ajax({
        url: "https://api.themoviedb.org/3/movie/" + idPelicula,
        dataType: "JSON",
        type: "GET",
        data: {
            api_key: "0d13cbb13af31d53ca30550020660e13",
            language: "es",
            append_to_response: "videos,images"
        },
        success: mostrarCorrecto,
        error: mostrarErrorCorrecto
    });
}

function mostrarCorrecto(infoCorrecto) {
    if (infoCorrecto.images.posters.length === 0) {
        obtenerCorrecto();
    } else {
        peliculaCorrecta = {
            imagen: infoCorrecto.images.posters[0].file_path,
            nombre: infoCorrecto.title
        };
        obtenerOpciones();
    }
}

function mostrarErrorCorrecto() {
    obtenerCorrecto();
}

function obtenerOpciones() {
    for (var p = 0; p < 3; p++) {
        getOpcion();
    }
}

function getOpcion() {
    var idPelicula = Math.ceil(Math.random() * 2000);

    $.ajax({
        url: "https://api.themoviedb.org/3/movie/" + idPelicula,
        dataType: "JSON",
        type: "GET",
        data: {
            api_key: "0d13cbb13af31d53ca30550020660e13",
            language: "es",
            append_to_response: "videos,images"
        },
        success: mostrarOpciones,
        error: mostrarError
    });
}

function mostrarLoader () {
    $("#inicio").append('<div class="progress-bar progress-bar--indeterminate">' + '</div>');
}

function mostrarLoader2 () {
    $("#correcto").append('<div class="progress-bar progress-bar--indeterminate">' + '</div>');
}

function mostrarLoader3 () {
    $("#incorrecto").append('<div class="progress-bar progress-bar--indeterminate">' + '</div>');
}

function mostrarOpciones(infoOpciones) {
    opciones.push(infoOpciones.title);

    if (opciones.length === 3) {
        document.getElementById('content').load("pantallaJuego");
    }
}

function mostrarError() {
    getOpcion();
}

function crearTablas() {
    db.transaction(crearTablasSql, errorTns, exitoCrearTablas);
}

function crearTablasSql(tx) {
    tx.executeSql("CREATE TABLE IF NOT EXISTS Ranking (id INTEGER PRIMARY KEY, nombre VARCHAR(255), puntaje INTEGER)");
}

function errorTns(e) {
    
}

function exitoCrearTablas() {
    
}

function agregarTareaSql(tx) {
    tx.executeSql("INSERT INTO Ranking (nombre, puntaje) VALUES (?, ?)", [usuario, contadorPositivo]);
}

function agregarTareaFinalizado() {
    
}

function listarTareas() {
    db.transaction(listarTareasSql, errorTns, tareasListadas);
}

function listarTareasSql(tx) {
    tx.executeSql("SELECT * FROM Ranking", [], armarListaTareas);
}

function tareasListadas() {
    
}

function armarListaTareas(tx, resultados) {
    console.log(resultados);
    for (var i = 0; i < resultados.rows.length; i++) {
        $("#listaRanking").prepend("<div>" + '<strong id="nombreLista">' + resultados.rows.item(i).nombre + '</strong>' + ' | ' + resultados.rows.item(i).puntaje + ' puntos' + '</div>');
    }
}
