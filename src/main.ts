import { obtenerEquiposLaLiga } from "./api";
import { filtrarEquipos, ordenarEquipos, calcularEstadisticas, cargarFavoritos, alternarFavorito } from "./logica";
import { mostrarCargando, mostrarError, renderizarEquipos, renderizarEstadisticas, abrirModalDetalle } from "./ui";
import type { Equipo, CriterioOrden } from "./tipos";

let listaEquiposOriginales: Equipo[] = [];
let favoritosIds: Set<string> = cargarFavoritos();
let cargandoEnCurso = false;

const contenedorEquipos = document.getElementById("contenedorEquipos") as HTMLElement;
const contenedorStats = document.getElementById("estadisticas") as HTMLElement;
const inputBuscar = document.getElementById("inputBuscar") as HTMLInputElement;
const selectOrden = document.getElementById("selectOrden") as HTMLSelectElement;
const checkFavoritos = document.getElementById("checkFavoritos") as HTMLInputElement;
const btnRecargar = document.getElementById("btnRecargar") as HTMLButtonElement;
const modalDetalle = document.getElementById("modalDetalle") as HTMLElement;
const cuerpoModal = document.getElementById("cuerpoModal") as HTMLElement;
const btnCerrarModal = document.getElementById("btnCerrarModal") as HTMLButtonElement;

async function inicializarApp(forzarRecarga: boolean = false): Promise<void> {
    if (cargandoEnCurso) return;
    cargandoEnCurso = true;
    btnRecargar.disabled = true;

    try {
        mostrarCargando(contenedorEquipos);
        listaEquiposOriginales = await obtenerEquiposLaLiga(forzarRecarga);
        actualizarVista();
    } catch (error) {
        const mensaje = error instanceof Error ? error.message : "Error desconocido al cargar los equipos.";
        mostrarError(contenedorEquipos, mensaje, () => inicializarApp(true));
    } finally {
        cargandoEnCurso = false;
        btnRecargar.disabled = false;
    }
}

function actualizarVista(): void {
    const textoFiltro = inputBuscar.value;
    const criterioOrden = selectOrden.value as CriterioOrden;
    const soloFavoritos = checkFavoritos.checked;

    const filtrados = filtrarEquipos(listaEquiposOriginales, textoFiltro, soloFavoritos, favoritosIds);
    const ordenados = ordenarEquipos(filtrados, criterioOrden);

    const stats = calcularEstadisticas(ordenados);
    renderizarEstadisticas(stats, contenedorStats);

    renderizarEquipos(
        ordenados,
        listaEquiposOriginales.length,
        favoritosIds,
        contenedorEquipos,
        (equipo) => abrirModalDetalle(equipo, modalDetalle, cuerpoModal),
        (idEquipo) => {
            favoritosIds = alternarFavorito(favoritosIds, idEquipo);
            actualizarVista();
        }
    );
}

inputBuscar.addEventListener("input", actualizarVista);
selectOrden.addEventListener("change", actualizarVista);
checkFavoritos.addEventListener("change", actualizarVista);

btnRecargar.addEventListener("click", () => {
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