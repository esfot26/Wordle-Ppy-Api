let intentos = 5;
let palabra;

function iniciarJuego() {
    fetch('https://random-word.ryanrk.com/api/en/word/random/?Length=5')
        .then(response => response.json())
        .then(response => {
            console.log(response[0].toUpperCase());
            palabra = response[0].toUpperCase();
            prepararJuego();
        })
        .catch(error => {
            console.log('Sucedió un error, inténtelo más tarde', error);
            const palabras = ["LIMON", "MANGO", "FRESA", "PERAS", "HIGOS", "MELON", "PELON", "ANANA", "MORAS"];
            palabra = palabras[Math.floor(Math.random() * palabras.length)];
            console.log(palabra);
            prepararJuego();
        });
}

function prepararJuego() {
    const input = document.getElementById('guess-input');
    const btnIntentar = document.getElementById('guess-button');
    const botonesTeclado = document.querySelectorAll('.keyboard-button');
    const GRID = document.getElementById("grid");

    btnIntentar.addEventListener('click', function() {
        let intento = input.value.toUpperCase();
        console.log('Intentar:', intento);
        intentar(intento);
    });

    botonesTeclado.forEach(button => {
        button.addEventListener('click', () => {
            let buttonText = button.textContent.trim();
            if (buttonText === 'Borrar') {
                input.value = input.value.slice(0, -1);
            } else if (buttonText === 'Enter') {
                intentar(input.value.toUpperCase());
            } else {
                input.value += buttonText;
            }
        });
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            intentar(input.value.toUpperCase());
        } else {
            const tagName = event.target.tagName.toLowerCase();
            if (tagName !== 'input' && tagName !== 'textarea') {
                input.focus();
            }
        }
    });

    generarGrid(palabra);
}

function generarGrid(palabra) {
    const GRID = document.getElementById("grid");
    const ROW = document.createElement('div');
    ROW.className = 'row';

    for (let i = 0; i < palabra.length; i++) {
        const SPAN = document.createElement('span');
        SPAN.className = 'letter';
        ROW.appendChild(SPAN);
    }

    GRID.appendChild(ROW);
}

function intentar(intento) {
    console.log(`Intento: ${intento}, intentos restantes: ${intentos}`);

    if (!intento || intento.trim().length === 0) {
        document.getElementById("notificacion").innerHTML = "<h1>Ingrese una palabra primero 🙏</h1>";
        return;
    }

    if (!/^[a-zA-Z]+$/.test(intento)) {
        document.getElementById("notificacion").innerHTML = "<h1>La palabra solo debe contener letras</h1>";
        return;
    }

    if (intento.length !== 5) {
        document.getElementById("notificacion").innerHTML = "<h1>La palabra debe tener 5 letras</h1>";
        return;
    }

    if (intento === palabra) {
        cambiarColor(palabra, intento, true); 
    } else {
        intentos--;
        if (intentos > 0) {
            document.getElementById("notificacion").innerHTML = "<h1>Incorrecto</h1>";
            cambiarColor(palabra, intento, false);
        } else {
            document.getElementById("notificacion").innerHTML = "<h1>PERDISTE 🥶</h1>";
            intentos = 0;
        }

        generarGrid(palabra);
    }
}

function cambiarColor(palabra, intento, mostrarGanaste) {
    const letrasSpan = document.querySelectorAll('#grid .row:last-child .letter');
    for (let i = 0; i < palabra.length; i++) {
        let letraPalabra = palabra[i];
        let letraIntento = intento[i];
        let colorClass = '';

        if (letraPalabra === letraIntento) {
            colorClass = 'green';
        } else if (palabra.includes(letraIntento)) {
            colorClass = 'yellow';
        } else {
            colorClass = 'grey';
        }

        letrasSpan[i].textContent = letraIntento;
        letrasSpan[i].className = `letter ${colorClass}`;
    }

    if (intentos > 0 && mostrarGanaste && intento === palabra) {
        document.getElementById("notificacion").innerHTML = "<h1>Ganaste 😎</h1>";
    } else if (intentos === 0) {
        document.getElementById("notificacion").innerHTML = "<h1>PERDISTE 🥶</h1>";
    } else {
        document.getElementById("notificacion").innerHTML = "<h1>Intenta de nuevo</h1>";
    }
}

document.addEventListener('DOMContentLoaded', iniciarJuego);
