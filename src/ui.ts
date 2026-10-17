import type { Equipo, EstadisticasLiga } from "./tipos";

export function mostrarCargando(contenedor: HTMLElement): void {
    const caja = document.createElement("div");
    caja.className = "estado-carga";
    
    const texto = document.createElement("p");
    texto.textContent = " Cargando equipos de La Liga...";
    
    caja.appendChild(texto);
    contenedor.replaceChildren(caja);
}

export function mostrarError(contenedor: HTMLElement, mensaje: string, alReintentar: () => void): void {
    const caja = document.createElement("div");
    caja.className = "estado-error";

    const parrafo = document.createElement("p");
    parrafo.textContent = ` ${mensaje}`;

    const boton = document.createElement("button");
    boton.type = "button";
    boton.textContent = "Reintentar";
    boton.addEventListener("click", alReintentar);

    caja.append(parrafo, boton);
    contenedor.replaceChildren(caja);
}

export function renderizarEquipos(
    equipos: Equipo[],
    totalOriginales: number,
    favoritosIds: Set<string>,
    contenedor: HTMLElement,
    alSeleccionarEquipo: (equipo: Equipo) => void,
    alAlternarFavorito: (idEquipo: string) => void
): void {
    if (equipos.length === 0) {
        const cajaVacia = document.createElement("div");
        cajaVacia.className = "estado-vacio";
        const mensaje = document.createElement("p");

        mensaje.textContent = totalOriginales === 0
            ? " La API no devolvió ningún equipo en este momento."
            : " Ningún equipo coincide con los filtros de búsqueda actuales.";

        cajaVacia.appendChild(mensaje);
        contenedor.replaceChildren(cajaVacia);
        return;
    }

    const nodosTarjetas = equipos.map((eq) => {
        const tarjeta = document.createElement("article");
        tarjeta.className = "tarjeta-equipo";
        tarjeta.style.borderTopColor = eq.color;

        const cabecera = document.createElement("div");
        cabecera.className = "cabecera-tarjeta";

        const img = document.createElement("img");
        img.src = eq.escudo;
        img.alt = `Escudo de ${eq.nombre}`;
        img.loading = "lazy";

        const infoTitulo = document.createElement("div");
        infoTitulo.className = "titulo-tarjeta";

        const h3 = document.createElement("h3");
        h3.textContent = eq.nombre;

        const spanCiudad = document.createElement("span");
        spanCiudad.className = "ciudad";
        spanCiudad.textContent = eq.ciudad;

        infoTitulo.append(h3, spanCiudad);

        const btnFav = document.createElement("button");
        btnFav.type = "button";
        btnFav.className = "btn-favorito";
        const esFav = favoritosIds.has(eq.id);
        btnFav.textContent = esFav ? "⭐" : "☆";
        btnFav.title = esFav ? "Quitar de favoritos" : "Añadir a favoritos";
        
        btnFav.addEventListener("click", (evento) => {
            evento.stopPropagation();
            alAlternarFavorito(eq.id);
        });

        cabecera.append(img, infoTitulo, btnFav);

        const cuerpo = document.createElement("div");
        cuerpo.className = "cuerpo-tarjeta";

        const pEstadio = document.createElement("p");
        pEstadio.textContent = `🏟 Estadio: ${eq.estadio}`;

        const pFundacion = document.createElement("p");
        pFundacion.textContent = `🏛 Fundación: ${eq.fundacion !== undefined ? eq.fundacion : "Desconocida"}`;

        cuerpo.append(pEstadio, pFundacion);
        tarjeta.append(cabecera, cuerpo);
        
        tarjeta.addEventListener("click", () => alSeleccionarEquipo(eq));

        return tarjeta;
    });

    contenedor.replaceChildren(...nodosTarjetas);
}

export function renderizarEstadisticas(stats: EstadisticasLiga, contenedorStats: HTMLElement): void {
    const metricas: Array<[string, string]> = [
        ["Equipos mostrados:", String(stats.totalEquipos)],
        ["Ciudades diferentes:", String(stats.totalCiudades)]
    ];

    const cajas = metricas.map(([etiqueta, valor]) => {
        const div = document.createElement("div");
        div.className = "stat-box";
        
        const span = document.createElement("span");
        span.textContent = `${etiqueta} `;
        
        const strong = document.createElement("strong");
        strong.textContent = valor;
        
        div.append(span, strong);
        return div;
    });

    contenedorStats.replaceChildren(...cajas);
}

export function abrirModalDetalle(equipo: Equipo, modal: HTMLElement, cuerpoModal: HTMLElement): void {
    const contenedor = document.createElement("div");
    contenedor.className = "detalle-modal";

    const img = document.createElement("img");
    img.src = equipo.escudo;
    img.alt = `Escudo de ${equipo.nombre}`;
    img.className = "escudo-grande";

    const h2 = document.createElement("h2");
    h2.textContent = equipo.nombre;

    const pApodo = document.createElement("p");

    const separador = document.createElement("hr");

    const pCiudad = document.createElement("p");
    const textoFundacion = equipo.fundacion !== undefined ? String(equipo.fundacion) : "Año desconocido";
    pCiudad.textContent = `📍 Ciudad: ${equipo.ciudad} (${textoFundacion})`;

    const pEstadio = document.createElement("p");
    pEstadio.textContent = `🏟 Estadio: ${equipo.estadio}`;

    const pDesc = document.createElement("p");
    pDesc.className = "descripcion";
    pDesc.textContent = equipo.descripcion;

    contenedor.append(img, h2, pApodo, separador, pCiudad, pEstadio, pDesc);

    if (equipo.camiseta) {
        const imgCamiseta = document.createElement("img");
        imgCamiseta.src = equipo.camiseta;
        imgCamiseta.alt = `Equipación de ${equipo.nombre}`;
        imgCamiseta.className = "equipacion-modal";
        contenedor.appendChild(imgCamiseta);
    }

    if (equipo.web) {
        const pWeb = document.createElement("p");
        const enlace = document.createElement("a");
        enlace.href = equipo.web;
        enlace.target = "_blank";
        enlace.rel = "noopener noreferrer";
        enlace.textContent = "Visitar sitio web oficial ↗";
        pWeb.appendChild(enlace);
        contenedor.appendChild(pWeb);
    }

    cuerpoModal.replaceChildren(contenedor);
    modal.classList.remove("oculto");
}