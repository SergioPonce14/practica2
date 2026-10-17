import type { Equipo, RespuestaTheSportsDB } from "./tipos";

const URL_THE_SPORTS_DB = "https://www.thesportsdb.com/api/v1/json/123/search_all_teams.php?l=Spanish%20La%20Liga";

export async function obtenerEquiposLaLiga(): Promise<Equipo[]> {
    const respuesta = await fetch(URL_THE_SPORTS_DB);

    if (!respuesta.ok) {
        throw new Error(`Error HTTP ${respuesta.status} al consultar TheSportsDB`);
    }

    const datos = (await respuesta.json()) as RespuestaTheSportsDB;

    if (!datos.teams || datos.teams.length === 0) {
        return [];
    }

    
    return datos.teams.map((t) => ({
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
}