// Este archivo NO trae datos escritos a mano. Los datos salen del
// reporte.json real

//	Se utiliza esta funcion para que cargue los modulos desde el inicio del proyecto.

window.addEventListener("load", (event) => {

	// Referencias principales
	const tituloPrincipal = document.getElementById("titulo");
	const formulario = document.querySelector("form");
	const selector = document.getElementById("archivo");

	// Crea un input de los atributos name/placeholder/value
	function crearInput(nombre, valor) {
		const input = document.createElement("input");
		input.type = "text";
		input.name = nombre;
		input.placeholder = nombre;
		input.value = valor === undefined || valor === null ? "" : valor;
		return input;
	}

	// Recorre un objeto/array recursivamente y agrega un input por cada
	// valor final, conservando la ruta completa.
	function generarInputs(datos, contenedor, prefijo = "") {
		for (const clave in datos) {
			if (!Object.prototype.hasOwnProperty.call(datos, clave)) continue;

			const valor = datos[clave];
			const ruta = prefijo ? `${prefijo}.${clave}` : clave;

			if (Array.isArray(valor)) {
				valor.forEach((item, indice) => {
					const rutaItem = `${ruta}[${indice}]`;
					if (item !== null && typeof item === "object") {
						generarInputs(item, contenedor, rutaItem);
					} else {
						contenedor.appendChild(crearInput(rutaItem, item));
					}
				});
			} else if (valor !== null && typeof valor === "object") {
				generarInputs(valor, contenedor, ruta);
			} else {
				contenedor.appendChild(crearInput(ruta, valor));
			}
		}
	}

	function agregarGPU(contenedor, gpu) {
		contenedor.appendChild(crearInput("GPU", gpu));
	}

	// Arma el formulario sección por sección a partir del objeto ya
	// parseado (lo que salió de JSON.parse). El orden de las llamadas
	// define el orden en pantalla.
	function construirFormulario(reporte) {
		if (!formulario) return;

		// Limpia inputs de una selección anterior, por si el usuario
		// elige otro archivo sin recargar la página
		formulario.innerHTML = "";

		generarInputs(reporte.report, formulario, "report");
		generarInputs(reporte.network, formulario, "network");
		generarInputs(reporte.storage, formulario, "storage");
		generarInputs(reporte.CPU, formulario, "CPU");
		generarInputs(reporte.RAM, formulario, "RAM");
		generarInputs(reporte.SO, formulario, "SO");
		generarInputs(reporte.Software, formulario, "Software");
		agregarGPU(formulario, reporte.GPU);
	}

	// Cuando el usuario selecciona un archivo en el <input type="file">
	selector.addEventListener("change", (e) => {
		const archivo = e.target.files[0];
		if (!archivo) return;

		const lector = new FileReader();

		lector.onload = function () {
			try {
				const datos = JSON.parse(lector.result);
				construirFormulario(datos);
			} catch (error) {
				console.error("El archivo seleccionado no es un JSON válido:", error);
			}
		};

		lector.readAsText(archivo);
	});

	

});