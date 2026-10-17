import type { Equipo } from "./tipos";

// 1. Mostrar estado de Carga (⏳)
export function mostrarCargando(contenedor: HTMLElement): void {
    contenedor.innerHTML = `
        <div class="estado-carga">
            <p>⏳ Cargando equipos de La Liga...</p>
        </div>
    `;
}

// 2. Mostrar estado de Error con botón de reintentar (⚠️)
export function mostrarError(contenedor: HTMLElement, mensaje: string): void {
    contenedor.innerHTML = `
        <div class="estado-error">
            <p>⚠ ${mensaje}</p>
            <button id="btnReintentar" type="button">Reintentar</button>
        </div>
    `;
}

// 3. Renderizar las tarjetas de los equipos en el DOM
export function renderizarEquipos(equipos: Equipo[], contenedor: HTMLElement, alHacerClic: (equipo: Equipo) => void): void {
    if (equipos.length === 0) {
        contenedor.innerHTML = `
            <div class="estado-vacio">
                <p>📭 No se ha encontrado ningún equipo con esos filtros.</p>
            </div>
        `;
        return;
    }

    contenedor.innerHTML = "";

    equipos.forEach((eq) => {
        const tarjeta = document.createElement("article");
        tarjeta.className = "tarjeta-equipo";
        tarjeta.style.borderTopColor = eq.color || "#13387f";

        // Usamos textContent e innerHTML de forma segura (Bloque M1 y teoría)
        tarjeta.innerHTML = `
            <div class="cabecera-tarjeta">
                <img src="${eq.escudo}" alt="Escudo de ${eq.nombre}" loading="lazy" />
                <div>
                    <h3>${eq.nombre}</h3>
                    <span class="ciudad">${eq.ciudad}</span>
                </div>
            </div>
            <div class="cuerpo-tarjeta">
                <p>🏟 <strong>Estadio:</strong> ${eq.estadio}</p>
                <p>👥 <strong>Capacidad:</strong> ${eq.capacidad.toLocaleString()} espectadores</p>
                <p>🏛 <strong>Fundación:</strong> ${eq.fundacion}</p>
            </div>
        `;

        // Evento para abrir el modal al hacer clic en la tarjeta
        tarjeta.addEventListener("click", () => alHacerClic(eq));

        contenedor.appendChild(tarjeta);
    });
}

// 4. Renderizar el panel de estadísticas calculado con reduce()
export function renderizarEstadisticas(stats: { totalEquipos: number; capacidadTotal: number; capacidadMedia: number }, contenedorStats: HTMLElement): void {
    contenedorStats.innerHTML = `
        <div class="stat-box"><span>Equipos mostrados:</span> <strong>${stats.totalEquipos}</strong></div>
        <div class="stat-box"><span>Aforo total estadios:</span> <strong>${stats.capacidadTotal.toLocaleString()}</strong></div>
        <div class="stat-box"><span>Aforo medio:</span> <strong>${stats.capacidadMedia.toLocaleString()}</strong></div>
    `;
}

// 5. Rellenar y mostrar el modal con la descripción completa
export function abrirModalDetalle(equipo: Equipo, modal: HTMLElement, cuerpoModal: HTMLElement): void {
    cuerpoModal.innerHTML = `
        <div class="detalle-modal">
            <img src="${equipo.escudo}" alt="Escudo ${equipo.nombre}" class="escudo-grande" />
            <h2>${equipo.nombre}</h2>
            <p class="apodo"><em>"${equipo.apodo}"</em></p>
            <hr />
            <p><strong>Ciudad:</strong> ${equipo.ciudad} (${equipo.fundacion})</p>
            <p><strong>Estadio:</strong> ${equipo.estadio} (${equipo.capacidad.toLocaleString()} asientos)</p>
            <p class="descripcion">${equipo.descripcion}</p>
            ${equipo.web ? `<p><a href="${equipo.web}" target="_blank" rel="noopener">Sitio web oficial ↗</a></p>` : ""}
        </div>
    `;
    modal.classList.remove("oculto");
}