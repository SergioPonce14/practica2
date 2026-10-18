export interface EquipoApiCrudo {
    readonly idTeam: string;
    strTeam: string;
    strTeamShort?: string | null;
    strKeywords?: string | null;
    intFormedYear?: string | null;
    strStadium?: string | null;
    strLocation?: string | null;
    strBadge?: string | null;
    strEquipment?: string | null;
    strColour1?: string | null;
    strDescriptionES?: string | null;
    strDescriptionEN?: string | null;
    strWebsite?: string | null;
}

export interface RespuestaTheSportsDB {
    readonly teams: EquipoApiCrudo[] | null;
}

export interface Equipo {
    readonly id: string;
    nombre: string;
    color: string;
    fundacion?: number;
    estadio: string;
    ciudad: string;
    escudo: string;
    camiseta?: string;
    descripcion: string;
    web?: string;
}

export type CriterioOrden = "nombre" | "fundacion";

export interface EstadisticasLiga {
    totalEquipos: number;
    totalCiudades: number;
}

export interface EstructuraCache {
    timestamp: number;
    equipos: Equipo[];
}