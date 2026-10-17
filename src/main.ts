import { obtenerEquiposLaLiga } from "./api";

async function probarApi(): Promise<void> {
    try {
        const equipos = await obtenerEquiposLaLiga();
        console.log("Equipos de La Liga recibidos:", equipos.length, equipos);
    } catch (error) {
        console.error("Error en la prueba:", error);
    }
}
console.log("Probando Api")
probarApi();