import type { Equipo, CriterioOrden } from "./tipos";


export function filtrarEquipos(equipos: Equipo[], textoBusqueda: string): Equipo[] {
    const texto = textoBusqueda.toLowerCase().trim();
    if (!texto) return equipos;

    return equipos.filter((eq) => 
        eq.nombre.toLowerCase().includes(texto) ||
        eq.ciudad.toLowerCase().includes(texto) ||
        eq.estadio.toLowerCase().includes(texto)
    );
}

// 2. Ordenar inmutabilidad con toSorted() (Bloque 1 de la teoría)
export function ordenarEquipos(equipos: Equipo[], criterio: CriterioOrden): Equipo[] {
    // Usamos toSorted en lugar de sort para NO mutar el array original
    return equipos.toSorted((a, b) => {
        if (criterio === "nombre") {
            return a.nombre.localeCompare(b.nombre);
        }
        if (criterio === "capacidad") {
            return b.capacidad - a.capacidad; // De mayor a menor aforo
        }
        if (criterio === "fundacion") {
            return a.fundacion - b.fundacion; // Del más antiguo al más moderno
        }
        return 0;
    });
}


export function calcularEstadisticas(equipos: Equipo[]) {
    if (equipos.length === 0) {
        return { totalEquipos: 0, capacidadTotal: 0, capacidadMedia: 0 };
    }

    const capacidadTotal = equipos.reduce((acumulador, eq) => acumulador + eq.capacidad, 0);
    const capacidadMedia = Math.round(capacidadTotal / equipos.length);

    return {
        totalEquipos: equipos.length,
        capacidadTotal,
        capacidadMedia
    };
}