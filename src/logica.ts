import type { Equipo, CriterioOrden, EstadisticasLiga } from "./tipos";

const CLAVE_FAVORITOS = "favoritos_laliga_ids";

export function filtrarEquipos(
    equipos: Equipo[],
    textoBusqueda: string,
    soloFavoritos: boolean,
    favoritosIds: Set<string>
): Equipo[] {
    const texto = textoBusqueda.toLowerCase().trim();

    return equipos.filter((eq) => {
        if (soloFavoritos && !favoritosIds.has(eq.id)) {
            return false;
        }
        if (!texto) return true;

        return (
            eq.nombre.toLowerCase().includes(texto) ||
            eq.ciudad.toLowerCase().includes(texto) ||
            eq.estadio.toLowerCase().includes(texto) 
        );
    });
}

const COMPARADORES: Record<CriterioOrden, (a: Equipo, b: Equipo) => number> = {
    nombre: (a, b) => a.nombre.localeCompare(b.nombre, "es"),
    fundacion: (a, b) => {
        const anioA = a.fundacion ?? Number.MAX_SAFE_INTEGER;// Si no tiene fundación, lo consideramos "más reciente" que cualquier otro
        const anioB = b.fundacion ?? Number.MAX_SAFE_INTEGER;
        return anioA - anioB;
    }
};

export function ordenarEquipos(equipos: Equipo[], criterio: CriterioOrden): Equipo[] {
    const comparador = COMPARADORES[criterio];
    return equipos.toSorted(comparador);
}

export function calcularEstadisticas(equipos: Equipo[]): EstadisticasLiga {
    if (equipos.length === 0) {
        return {
            totalEquipos: 0,
            totalCiudades: 0
        };
    }

    const ciudadesUnicas = new Set(equipos.map((eq) => eq.ciudad));
    const totalCiudades = ciudadesUnicas.size;

    return {
        totalEquipos: equipos.length,
        totalCiudades
    };
}

export function cargarFavoritos(): Set<string> {
    try {
        const guardado = localStorage.getItem(CLAVE_FAVORITOS);
        if (!guardado) return new Set<string>();// Si no hay nada guardado, devolvemos un Set vacío
        const lista: unknown = JSON.parse(guardado);// Intentamos parsear el contenido del localStorage
        if (Array.isArray(lista) && lista.every((id) => typeof id === "string")) {
            return new Set<string>(lista);
        }
        return new Set<string>();// Si el contenido no es un array de strings, devolvemos un Set vacío
    } catch {
        return new Set<string>();
    }
}

export function alternarFavorito(favoritosActuales: Set<string>, idEquipo: string): Set<string> {
    const nuevoSet = new Set<string>(favoritosActuales);
    if (nuevoSet.has(idEquipo)) {
        nuevoSet.delete(idEquipo);
    } else {
        nuevoSet.add(idEquipo);
    }

    try {
        localStorage.setItem(CLAVE_FAVORITOS, JSON.stringify([...nuevoSet]));
    } catch {
        // Ignorar errores de almacenamiento
    }

    return nuevoSet;
}