// script.js - reporte de mantenimiento
// todo se arma desde este archivo, en el html solo queda el div app
// el diseño y las posiciones van en el css, aca no

window.addEventListener("load", (event) => {

	// ================= cositas de ayuda =================
	// para no repetir tanto codigo

	// crea un elemento nuevo y le mete lo que le pida
	function createElement(tag, config = {}) {
		const el = document.createElement(tag);
		if (config.className) el.className = config.className;
		if (config.id) el.id = config.id;
		if (config.text) el.textContent = config.text;
		if (config.attributes) {
			for (const [attribute, value] of Object.entries(config.attributes)) {
				el.setAttribute(attribute, value);
			}
		}
		return el;
	}

	// un campo normal, label arriba y el input abajo
	function createTextField(labelText, id, type = "text") {
		const container = createElement("div", { className: "campo" });
		const label = createElement("label", { text: labelText, attributes: { for: id } });
		const input = createElement("input", { id: id, attributes: { type: type, name: id } });
		container.appendChild(label);
		container.appendChild(input);
		return container;
	}

	// lo mismo pero con textarea, para donde toca escribir mas texto
	function createTextareaField(labelText, id, rows = 4) {
		const container = createElement("div", { className: "campo campo-textarea" });
		if (labelText) {
			// en observaciones no se manda label, por eso este if
			const label = createElement("label", { text: labelText, attributes: { for: id } });
			container.appendChild(label);
		}
		const textarea = createElement("textarea", { id: id, attributes: { name: id, rows: rows } });
		container.appendChild(textarea);
		return container;
	}

	// para los radios (tipo de equipo, tipo de mantenimiento)
	function createRadioGroup(groupLabel, name, choices) {
		const container = createElement("div", { className: "grupo-radio" });
		container.appendChild(createElement("span", { className: "etiqueta-grupo", text: groupLabel }));
		choices.forEach((choice) => {
			const label = createElement("label", { className: "opcion-radio" });
			const input = createElement("input", { attributes: { type: "radio", name: name, value: choice } });
			label.appendChild(input);
			label.appendChild(document.createTextNode(" " + choice));
			container.appendChild(label);
		});
		return container;
	}

	// año mes y dia en una fila, se usa para las dos fechas del formulario
	function createDateGroup(groupLabel, idPrefix) {
		const container = createElement("div", { className: "grupo-fecha" });
		container.appendChild(createElement("span", { className: "etiqueta-grupo", text: groupLabel }));
		// se le quita la tilde al año para el id, si no da problemas
		[["Año", "Anio"], ["Mes", "Mes"], ["Día", "Dia"]].forEach(([text, suffix]) => {
			const id = `${idPrefix}${suffix}`;
			container.appendChild(createElement("label", { text: text, attributes: { for: id } }));
			container.appendChild(createElement("input", { id: id, attributes: { type: "number", name: id } }));
		});
		return container;
	}

	// ================= lo que sale del json =================
	// esto se llena solo, aca no toca escribir nada a mano

	// un input para un dato que ya viene en el json
	function createAutoInput(name, value) {
		const container = createElement("div", { className: "campo campo-auto" });
		const label = createElement("label", { text: name, attributes: { for: name } });
		const input = createElement("input", {
			id: name,
			attributes: { type: "text", name: name }
		});
		// si no hay valor se deja vacio, para que no salga "undefined"
		input.value = value === undefined || value === null ? "" : value;
		container.appendChild(label);
		container.appendChild(input);
		return container;
	}

	// como el json todavia es solo una maqueta y no como lo va a votar
	// el sistema de verdad, por ahora no se desarma cada propiedad en
	// su propio input, ni se muestran los nombres de las propiedades,
	// solo los valores separados por comas (y los arreglos con punto y coma)
	function toDisplayString(value) {
		if (value === undefined || value === null) return "";

		if (Array.isArray(value)) {
			return value.map(toDisplayString).join("; ");
		}

		if (typeof value === "object") {
			return Object.values(value)
				.map(toDisplayString)
				.join(", ");
		}

		return String(value);
	}

	// arma todo el formulario automatico, un input por cada propiedad
	// del json (report, network, storage, CPU, RAM, SO, Software, GPU)
	function buildAutoForm(report, form) {
		// limpia primero por si se carga otro json despues
		form.innerHTML = "";
		for (const key in report) {
			if (!Object.prototype.hasOwnProperty.call(report, key)) continue;
			form.appendChild(createAutoInput(key, toDisplayString(report[key])));
		}
	}

	// ================= lo que va a mano =================
	// esto es lo que no sale en el json generado por powershell

	function buildIdentificationSection(container) {
		container.appendChild(createElement("h2", { text: "Información de Identificación" }));
		container.appendChild(createTextField("Código de equipo", "codigoEquipo"));
		container.appendChild(createRadioGroup("Tipo de equipo", "tipoEquipo", ["Portátil", "Todo en uno", "Escritorio"]));
		container.appendChild(createTextField("Número de serie", "numeroSerie"));
		container.appendChild(createTextField("Marca y modelo", "marcaModelo"));
		container.appendChild(createTextField("Usuario / Responsable", "usuarioResponsable"));
		container.appendChild(createTextField("Ubicación / Área", "ubicacionArea"));
	}

	function buildMaintenanceSection(container) {
		container.appendChild(createElement("h2", { text: "Registro de mantenimiento" }));
		container.appendChild(createDateGroup("Fecha del servicio", "fechaServicio"));
		container.appendChild(createRadioGroup("Tipo de mantenimiento", "tipoMantenimiento", ["Preventivo", "Correctivo"]));
		container.appendChild(createTextField("Técnico responsable", "tecnicoResponsable"));
	}

	function buildActivitySection(container) {
		container.appendChild(createElement("h2", { text: "Descripción de la actividad realizada" }));
		// software y hardware
		const grid = createElement("div", { className: "grid-actividad" });
		grid.appendChild(createTextareaField("Software", "descripcionSoftware", 8));
		grid.appendChild(createTextareaField("Hardware", "descripcionHardware", 8));
		container.appendChild(grid);
	}

	function buildStatusSection(container) {
		container.appendChild(createElement("h2", { text: "Estado del equipo" }));
		container.appendChild(createTextareaField("Condición posterior al mantenimiento", "estadoEquipo", 4));
		container.appendChild(createDateGroup("Fecha de entrega", "fechaEntrega"));
	}

	function buildObservationsSection(container) {
		container.appendChild(createElement("h2", { text: "Observaciones" }));
		container.appendChild(createTextareaField("", "observaciones", 4));
	}

	// ======================= arma toda la pagina =================
	// aca se junta todo dentro del div app

	function buildPage() {
		const app = document.getElementById("app");

		// el titulo de arriba
		const header = createElement("header");
		header.appendChild(createElement("h1", { id: "titulo", text: "Reporte PCBogotá" }));
		app.appendChild(header);

		// para elegir el reporte.json 
		const fileSection = createElement("section", { className: "seccion-archivo" });
		const fileInput = createElement("input", { id: "archivo", attributes: { type: "file", accept: "application/json" } });
		fileSection.appendChild(createElement("label", { text: "Cargar reporte.json", attributes: { for: "archivo" } }));
		fileSection.appendChild(fileInput);
		app.appendChild(fileSection);

		// cada bloque en su propia seccion

		const identificationSection = createElement("section", { id: "datosManuales" });
		buildIdentificationSection(identificationSection);
		app.appendChild(identificationSection);

		const maintenanceSection = createElement("section");
		buildMaintenanceSection(maintenanceSection);
		app.appendChild(maintenanceSection);

		// Especificaciones tecnicas (automatico)
		const autoSection = createElement("section", { id: "seccionAutomatica" });
		autoSection.appendChild(createElement("h2", { text: "Especificaciones técnicas (automático)" }));
		const form = createElement("form", { id: "formulario" });
		autoSection.appendChild(form);
		app.appendChild(autoSection);

		const activitySection = createElement("section");
		buildActivitySection(activitySection);
		app.appendChild(activitySection);

		const statusSection = createElement("section");
		buildStatusSection(statusSection);
		app.appendChild(statusSection);

		const observationsSection = createElement("section");
		buildObservationsSection(observationsSection);
		app.appendChild(observationsSection);

		// aca se guarda el json para no tener que volver a subirlo cada rato
		const STORAGE_KEY = "reporteGuardado";

		// si ya habia uno guardado, se carga de una
		try {
			const saved = localStorage.getItem(STORAGE_KEY);
			if (saved) {
				const savedData = JSON.parse(saved);
				buildAutoForm(savedData, form);
			}
		} catch (error) {
			// si no deja guardar nada, no se precarga nada
			console.error("No se pudo leer el reporte guardado:", error);
		}

		// cuando se elige el archivo
		// se usa FileReader porque fetch no funciona abriendo con doble clic
		fileInput.addEventListener("change", (e) => {
			const file = e.target.files[0];
			if (!file) return; // si se cancela no hace nada

			const reader = new FileReader();
			reader.onload = function () {
				try {
					const data = JSON.parse(reader.result);
					buildAutoForm(data, form);
					try {
						localStorage.setItem(STORAGE_KEY, reader.result);
					} catch (saveError) {
						console.error("No se pudo guardar el reporte:", saveError);
					}
				} catch (error) {
					// si el archivo no es un json que sirva, no se rompe nada
					console.error("El archivo seleccionado no es un JSON válido:", error);
				}
			};
			reader.readAsText(file);
		});
	}

	// aca arranca todo
	buildPage();

});