const dni = document.getElementById("dni");
const nombre = document.getElementById("nombre");
const password = document.getElementById("password");
const password2 = document.getElementById("password2");

function validar() {
    if (nombre.value == password.value) {
        password.setCustomValidity("Usuario y contraseña no pueden coincidir");
    } else {
        password.setCustomValidity("");
    }

    if (password.value !== password2.value) {
        password2.setCustomValidity("Las contraseñas no coinciden");
    } else {
        password2.setCustomValidity("");
    }
}

function validarDNI() {
    const dniInput = dni.value;
    console.log('DNI introducido: ', dniInput);
    const letras = 'TRWAGMYFPDXBNJZSQVHLCKE';

    // 2. Extraer número y letra
    const numero = parseInt(dniInput.substring(0, 8));
    const letraIntroducida = dniInput.substring(8);

    // 3. Calcular la letra correcta
    const resto = numero % 23;
    const letraCorrecta = letras[resto];

    // 4. Comparar y mostrar resultado
    if (dniInput.length < 9) {
        dni.setCustomValidity("DNI incompleto. 8 números y una letra mayúscula.");
        return;
    }
    if ((letraIntroducida == letraCorrecta) || (letraIntroducida == "indefined")) {
        dni.setCustomValidity("");
    } else {
        dni.setCustomValidity("DNI inválido. La letra correcta sería " + letraCorrecta + " mayúscula.");
    }
}

dni.addEventListener("input", validarDNI);
nombre.addEventListener("input", validar);
password.addEventListener("input", validar);
password2.addEventListener("input", validar); 