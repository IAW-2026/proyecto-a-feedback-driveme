import { prisma } from "../lib/prisma";

const MI_ID = "user_3Dp94h0LRN0QcAdHruTQnGMepbY";
const CONDUCTOR_A = "user_fakedriver001";
const CONDUCTOR_B = "user_fakedriver002";
const VIAJE_1 = "viaje-uuid-0001";
const VIAJE_2 = "viaje-uuid-0002";
const VIAJE_3 = "viaje-uuid-0003";
const VIAJE_4 = "viaje-uuid-0004";
const VIAJE_5 = "viaje-uuid-0005";
const VIAJE_6 = "viaje-uuid-0006";

async function main() {
  // Limpiar datos anteriores
  await prisma.reporte.deleteMany();
  await prisma.calificacion.deleteMany();

  // --- Calificaciones recibidas por mí (id_receptor = MI_ID) ---

  const cal1 = await prisma.calificacion.create({
    data: {
      id_viaje: VIAJE_1,
      id_emisor: CONDUCTOR_A,
      id_receptor: MI_ID,
      puntaje: 5,
      comentario: "Excelente pasajero, muy puntual.",
    },
  });

  const cal2 = await prisma.calificacion.create({
    data: {
      id_viaje: VIAJE_2,
      id_emisor: CONDUCTOR_B,
      id_receptor: MI_ID,
      puntaje: 3,
      comentario: "Bien, aunque tardó en bajar del auto.",
    },
  });

  // --- Calificaciones enviadas por mí (id_emisor = MI_ID) ---

  await prisma.calificacion.create({
    data: {
      id_viaje: VIAJE_3,
      id_emisor: MI_ID,
      id_receptor: CONDUCTOR_A,
      puntaje: 4,
      comentario: "Buen conductor, llegamos a tiempo.",
    },
  });

  const cal4 = await prisma.calificacion.create({
    data: {
      id_viaje: VIAJE_4,
      id_emisor: MI_ID,
      id_receptor: CONDUCTOR_B,
      puntaje: 2,
      comentario: "Manejo agresivo y ruta incorrecta.",
    },
  });

  // --- Calificaciones con comentario inapropiado (isInappropriate: true) ---
  // Simulan lo que haría la IA cuando detecta lenguaje ofensivo

  const cal5 = await prisma.calificacion.create({
    data: {
      id_viaje: VIAJE_5,
      id_emisor: CONDUCTOR_A,
      id_receptor: MI_ID,
      puntaje: 1,
      comentario: "Imbécil, me hizo esperar 20 minutos y ni pidió disculpas.",
      isInappropriate: true,
    },
  });

  await prisma.calificacion.create({
    data: {
      id_viaje: VIAJE_6,
      id_emisor: CONDUCTOR_B,
      id_receptor: MI_ID,
      puntaje: 2,
      comentario: "Pésimo pasajero, grita y es una basura de persona.",
      isInappropriate: true,
    },
  });

  // --- Reportes pendientes ---

  await prisma.reporte.create({
    data: {
      id_calificacion: cal2.id_calificacion,
      id_reportante: MI_ID,
      id_reportado: CONDUCTOR_B,
      motivo: "COMENTARIO_INAPROPIADO",
      descripcion: "El comentario me parece injusto y no refleja lo que pasó.",
    },
  });

  await prisma.reporte.create({
    data: {
      id_calificacion: cal4.id_calificacion,
      id_reportante: CONDUCTOR_B,
      id_reportado: MI_ID,
      motivo: "INFORMACION_FALSA",
      descripcion: "El pasajero miente, la ruta fue la correcta.",
    },
  });

  await prisma.reporte.create({
    data: {
      id_calificacion: cal5.id_calificacion,
      id_reportante: MI_ID,
      id_reportado: CONDUCTOR_A,
      motivo: "COMENTARIO_INAPROPIADO",
      descripcion: "Lenguaje completamente inapropiado.",
    },
  });

  console.log("Seed completado.");
  console.log("  6 calificaciones (4 normales, 2 inapropiadas)");
  console.log("  3 reportes pendientes");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
