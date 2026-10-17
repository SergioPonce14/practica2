import type { Equipo, RespuestaTheSportsDB } from "./tipos";

const URL_THE_SPORTS_DB = "https://www.thesportsdb.com/api/v1/json/123/search_all_teams.php?l=Spanish%20La%20Liga";
const CLAVE_CACHE = "cache_equipos_laliga";

export async function obtenerEquiposLaLiga(forzarRecarga: boolean = false): Promise<Equipo[]> {
    
    if (!forzarRecarga) {
        try {
            const datosGuardados = localStorage.getItem(CLAVE_CACHE);
            if (datosGuardados) {
                console.log(" Caché: Cargando equipos desde localStorage ");
                return JSON.parse(datosGuardados) as Equipo[];
            }
        } catch (e) {
            console.warn(" Error al leer el localStorage", e);
        }
    }

   
    console.log("🌐 [Red]: Solicitando equipos a TheSportsDB...");
    const respuesta = await fetch(URL_THE_SPORTS_DB);

    if (!respuesta.ok) {
        throw new Error(`Error HTTP ${respuesta.status} al consultar TheSportsDB`);
    }

    const datos = (await respuesta.json()) as RespuestaTheSportsDB;

    if (!datos.teams || datos.teams.length === 0) {
        return [];
    }

    
    const equiposMapeados: Equipo[] = datos.teams.map((t) => ({
        id: t.idTeam,
        nombre: t.strTeam,
        fundacion: parseInt(t.intFormedYear) || 1900,
        estadio: t.strStadium || "Estadio no especificado",
        capacidad: parseInt(t.intStadiumCapacity) || 0,
        ciudad: t.strLocation || "España",
        escudo: t.strBadge || "",
        camiseta: t.strEquipment || undefined,
        descripcion: t.strDescriptionES || t.strDescriptionEN || "Sin descripción disponible.",
        web: t.strWebsite ? `https://${t.strWebsite}` : undefined
    }));

    
    try {
        localStorage.setItem(CLAVE_CACHE, JSON.stringify(equiposMapeados));
    } catch (e) {
        console.warn("⚠ No se pudo guardar en localStorage:", e);
    }

    return equiposMapeados;
}