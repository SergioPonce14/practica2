export interface EquipoApi {
    readonly idTeam: string;
    strTeam: string;
    intFormedYear: string;
    strStadium: string;
    intStadiumCapacity: string;
    strLocation: string;
    strBadge: string;
    strEquipment?: string | null;
    strDescriptionES?: string | null;
    strDescriptionEN?: string | null;
    strWebsite?: string | null;
}

export interface RespuestaTheSportsDB {
    readonly teams: EquipoApi[] | null;
}

export interface Equipo {
    readonly id: string;
    nombre: string;
    fundacion: number;
    estadio: string;
    capacidad: number;
    ciudad: string;
    escudo: string;
    camiseta?: string;
    descripcion: string;
    web?: string;
}

export type CriterioOrden = "nombre" | "capacidad" | "fundacion";