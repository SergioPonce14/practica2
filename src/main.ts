import { obtenerEquiposLaLiga } from "./api";
import { filtrarEquipos, ordenarEquipos, calcularEstadisticas } from "./logica";
import { mostrarCargando, mostrarError, renderizarEquipos, renderizarEstadisticas, abrirModalDetalle } from "./ui";
import type { Equipo, CriterioOrden } from "./tipos";

let listaEquiposOriginales: Equipo[] = [];

// DOM
const contenedorEquipos = document.getElementById("contenedorEquipos") as HTMLElement;
const contenedorStats = document.getElementById("estadisticas") as HTMLElement;
const inputBuscar = document.getElementById("inputBuscar") as HTMLInputElement;
const selectOrden = document.getElementById("selectOrden") as HTMLSelectElement;
const btnRecargar = document.getElementById("btnRecargar") as HTMLButtonElement;
const modalDetalle = document.getElementById("modalDetalle") as HTMLElement;
const cuerpoModal = document.getElementById("cuerpoModal") as HTMLElement;
const btnCerrarModal = document.getElementById("btnCerrarModal") as HTMLButtonElement;

// Función principal para cargar y pintar los datos
async function inicializarApp(forzarRecarga: boolean = false): Promise<void> {
    try {
        mostrarCargando(contenedorEquipos);
        
        // Petición asíncrona 
        listaEquiposOriginales = await obtenerEquiposLaLiga(forzarRecarga);
        
        actualizarVista();
    } catch (error) {
        const mensaje = error instanceof Error ? error.message : "Error desconocido al cargar los datos.";
        mostrarError(contenedorEquipos, mensaje);

        // Permitir reintentar si falla la red
        const btnReintentar = document.getElementById("btnReintentar");
        if (btnReintentar) {
            btnReintentar.onclick = () => inicializarApp(true);
        }
    }
}

// Aplica filtro, orden y redibuja la interfaz
function actualizarVista(): void {
    const textoFiltro = inputBuscar.value;
    const criterioOrden = selectOrden.value as CriterioOrden;

    //  Filtrar (con .filter())
    const filtrados = filtrarEquipos(listaEquiposOriginales, textoFiltro);

    //  Ordenar  (con .toSorted())
    const ordenados = ordenarEquipos(filtrados, criterioOrden);

    //  Calcular estadísticas (con .reduce())
    const stats = calcularEstadisticas(ordenados);
    renderizarEstadisticas(stats, contenedorStats);

    //  Renderizar tarjetas
    renderizarEquipos(ordenados, contenedorEquipos, (equipo) => {
        abrirModalDetalle(equipo, modalDetalle, cuerpoModal);
    });
}


inputBuscar.addEventListener("input", actualizarVista);
selectOrden.addEventListener("change", actualizarVista);

btnRecargar.addEventListener("click", () => {
    localStorage.removeItem("cache_equipos_laliga");
    inicializarApp(true);
});

btnCerrarModal.addEventListener("click", () => {
    modalDetalle.classList.add("oculto");
});

modalDetalle.addEventListener("click", (e) => {
    if (e.target === modalDetalle) {
        modalDetalle.classList.add("oculto");
    }
});

inicializarApp();