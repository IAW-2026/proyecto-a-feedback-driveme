import { prisma } from "../lib/prisma";

const ADMIN_ID   = "user_3Dp94h0LRN0QcAdHruTQnGMepbY";
const RIDER_ID   = "user_3EN4ryxKuPXsenrJOSiSrB9fT7E";
const DRIVER_ID  = "user_3EXJs5F9g5k7hfVnNrSJpHjlsUg";
const CONDUCTOR_A = "user_fakedriver001";
const CONDUCTOR_B = "user_fakedriver002";
const CONDUCTOR_C = "user_fakedriver003";
const PASAJERO_A  = "user_fakepassenger001";
const PASAJERO_B  = "user_fakepassenger002";
const PASAJERO_C  = "user_fakepassenger003";

// Viajes de ADMIN_ID
const VIAJE_1 = "viaje-uuid-0001";
const VIAJE_2 = "viaje-uuid-0002";
const VIAJE_3 = "viaje-uuid-0003";
const VIAJE_4 = "viaje-uuid-0004";
const VIAJE_5 = "viaje-uuid-0005";
const VIAJE_6 = "viaje-uuid-0006";

// Viajes de RIDER_ID
const VIAJE_7  = "viaje-uuid-0007";
const VIAJE_8  = "viaje-uuid-0008";
const VIAJE_9  = "viaje-uuid-0009";
const VIAJE_10 = "viaje-uuid-0010";
const VIAJE_11 = "viaje-uuid-0011";
const VIAJE_12 = "viaje-uuid-0012";
const VIAJE_13 = "viaje-uuid-0013";
const VIAJE_14 = "viaje-uuid-0014";
const VIAJE_15 = "viaje-uuid-0015";

// Viajes de DRIVER_ID
const VIAJE_17 = "viaje-uuid-0017";
const VIAJE_18 = "viaje-uuid-0018";
const VIAJE_19 = "viaje-uuid-0019";
const VIAJE_20 = "viaje-uuid-0020";
const VIAJE_21 = "viaje-uuid-0021";
const VIAJE_22 = "viaje-uuid-0022";
const VIAJE_23 = "viaje-uuid-0023";
const VIAJE_24 = "viaje-uuid-0024";
const VIAJE_25 = "viaje-uuid-0025";
const VIAJE_26 = "viaje-uuid-0026";

async function main() {
  await prisma.reporte.deleteMany();
  await prisma.calificacion.deleteMany();

  // ─── Calificaciones de ADMIN_ID ─────────────────────────────────────────────

  // Recibidas por ADMIN_ID
  await prisma.calificacion.create({
    data: {
      id_viaje: VIAJE_1,
      id_emisor: CONDUCTOR_A,
      id_receptor: ADMIN_ID,
      puntaje: 5,
      comentario: "Excelente pasajero, muy puntual.",
    },
  });

  const cal2 = await prisma.calificacion.create({
    data: {
      id_viaje: VIAJE_2,
      id_emisor: CONDUCTOR_B,
      id_receptor: ADMIN_ID,
      puntaje: 3,
      comentario: "Bien, aunque tardó en bajar del auto.",
    },
  });

  await prisma.calificacion.create({
    data: {
      id_viaje: VIAJE_5,
      id_emisor: CONDUCTOR_A,
      id_receptor: ADMIN_ID,
      puntaje: 1,
      comentario: "Imbécil, me hizo esperar 20 minutos y ni pidió disculpas.",
      isInappropriate: true,
    },
  });

  const cal5 = await prisma.calificacion.create({
    data: {
      id_viaje: VIAJE_6,
      id_emisor: CONDUCTOR_B,
      id_receptor: ADMIN_ID,
      puntaje: 2,
      comentario: "Pésimo pasajero, grita y es una basura de persona.",
      isInappropriate: true,
    },
  });

  // Enviadas por ADMIN_ID
  await prisma.calificacion.create({
    data: {
      id_viaje: VIAJE_3,
      id_emisor: ADMIN_ID,
      id_receptor: CONDUCTOR_A,
      puntaje: 4,
      comentario: "Buen conductor, llegamos a tiempo.",
    },
  });

  const cal4 = await prisma.calificacion.create({
    data: {
      id_viaje: VIAJE_4,
      id_emisor: ADMIN_ID,
      id_receptor: CONDUCTOR_B,
      puntaje: 2,
      comentario: "Manejo agresivo y ruta incorrecta.",
    },
  });

  // ─── Calificaciones de RIDER_ID ─────────────────────────────────────────────

  // Recibidas por RIDER_ID (POV del conductor evaluando al pasajero, 7 recibidas visibles + 1 inapropiada, 2 enviadas, 1 reporte PENDIENTE pre-cargado")
  await prisma.calificacion.create({
    data: {
      id_viaje: VIAJE_7,
      id_emisor: ADMIN_ID,
      id_receptor: RIDER_ID,
      puntaje: 5,
      comentario: "Pasajero excelente, muy educado y siempre puntual.",
    },
  });

  await prisma.calificacion.create({
    data: {
      id_viaje: VIAJE_8,
      id_emisor: CONDUCTOR_A,
      id_receptor: RIDER_ID,
      puntaje: 4,
      comentario: "Buen viaje, sin inconvenientes. Lo volvería a llevar.",
    },
  });

  const cal9 = await prisma.calificacion.create({
    data: {
      id_viaje: VIAJE_9,
      id_emisor: CONDUCTOR_B,
      id_receptor: RIDER_ID,
      puntaje: 2,
      comentario: "Se quejó todo el viaje por la ruta elegida.",
    },
  });

  await prisma.calificacion.create({
    data: {
      id_viaje: VIAJE_10,
      id_emisor: ADMIN_ID,
      id_receptor: RIDER_ID,
      puntaje: 1,
      comentario: "Tardó 15 minutos en aparecer y no avisó nada.",
    },
  });

  // Sin comentario
  await prisma.calificacion.create({
    data: {
      id_viaje: VIAJE_11,
      id_emisor: CONDUCTOR_A,
      id_receptor: RIDER_ID,
      puntaje: 3,
      comentario: null,
    },
  });

  await prisma.calificacion.create({
    data: {
      id_viaje: VIAJE_12,
      id_emisor: CONDUCTOR_C,
      id_receptor: RIDER_ID,
      puntaje: 5,
      comentario: "Excelente trato, amable y respetuoso durante todo el viaje.",
    },
  });

  await prisma.calificacion.create({
    data: {
      id_viaje: VIAJE_13,
      id_emisor: CONDUCTOR_B,
      id_receptor: RIDER_ID,
      puntaje: 4,
      comentario: null,
    },
  });

  // Inapropiada (no visible para el usuario, solo para el admin)
  await prisma.calificacion.create({
    data: {
      id_viaje: VIAJE_14,
      id_emisor: CONDUCTOR_C,
      id_receptor: RIDER_ID,
      puntaje: 1,
      comentario: "Horrible, un completo idiota que no sabe comportarse.",
      isInappropriate: true,
    },
  });

  // Enviadas por RIDER_ID (POV del pasajero evaluando al conductor)
  await prisma.calificacion.create({
    data: {
      id_viaje: VIAJE_15,
      id_emisor: RIDER_ID,
      id_receptor: CONDUCTOR_A,
      puntaje: 5,
      comentario: "Conductor muy seguro y amable, excelente viaje.",
    },
  });

  await prisma.calificacion.create({
    data: {
      id_viaje: "viaje-uuid-0016",
      id_emisor: RIDER_ID,
      id_receptor: CONDUCTOR_C,
      puntaje: 3,
      comentario: "Viaje normal, sin problemas pero tampoco destacó.",
    },
  });

  // ─── Calificaciones de DRIVER_ID ────────────────────────────────────────────

  // Recibidas por DRIVER_ID (POV del rider/pasajero evaluando al conductor, 7 recibidas visibles + 1 inapropiada, 2 enviadas, 1 reporte PENDIENTE pre-cargado")
  await prisma.calificacion.create({
    data: {
      id_viaje: VIAJE_17,
      id_emisor: PASAJERO_A,
      id_receptor: DRIVER_ID,
      puntaje: 5,
      comentario: "Llegó puntual, el auto estaba limpio y el manejo fue muy tranquilo.",
    },
  });

  await prisma.calificacion.create({
    data: {
      id_viaje: VIAJE_18,
      id_emisor: PASAJERO_B,
      id_receptor: DRIVER_ID,
      puntaje: 4,
      comentario: "Buen conductor, conocía bien la ruta y llegamos rápido.",
    },
  });

  const calD3 = await prisma.calificacion.create({
    data: {
      id_viaje: VIAJE_19,
      id_emisor: PASAJERO_C,
      id_receptor: DRIVER_ID,
      puntaje: 2,
      comentario: "Frenó brusco varias veces y no avisó los cambios de ruta.",
    },
  });

  await prisma.calificacion.create({
    data: {
      id_viaje: VIAJE_20,
      id_emisor: PASAJERO_A,
      id_receptor: DRIVER_ID,
      puntaje: 1,
      comentario: "El conductor llegó tarde y no se disculpó en ningún momento.",
    },
  });

  // Sin comentario
  await prisma.calificacion.create({
    data: {
      id_viaje: VIAJE_21,
      id_emisor: PASAJERO_B,
      id_receptor: DRIVER_ID,
      puntaje: 3,
      comentario: null,
    },
  });

  await prisma.calificacion.create({
    data: {
      id_viaje: VIAJE_22,
      id_emisor: PASAJERO_C,
      id_receptor: DRIVER_ID,
      puntaje: 5,
      comentario: "Conductor muy profesional, el viaje fue rápido y me sentí seguro.",
    },
  });

  await prisma.calificacion.create({
    data: {
      id_viaje: VIAJE_23,
      id_emisor: PASAJERO_A,
      id_receptor: DRIVER_ID,
      puntaje: 4,
      comentario: null,
    },
  });

  // Inapropiada
  await prisma.calificacion.create({
    data: {
      id_viaje: VIAJE_24,
      id_emisor: PASAJERO_B,
      id_receptor: DRIVER_ID,
      puntaje: 1,
      comentario: "Conductor de mierda, casi nos chocamos por su culpa.",
      isInappropriate: true,
    },
  });

  // Enviadas por DRIVER_ID (POV del conductor evaluando al pasajero/rider)
  await prisma.calificacion.create({
    data: {
      id_viaje: VIAJE_25,
      id_emisor: DRIVER_ID,
      id_receptor: PASAJERO_C,
      puntaje: 5,
      comentario: "Pasajero ideal, esperó en el lugar exacto y fue muy respetuoso.",
    },
  });

  await prisma.calificacion.create({
    data: {
      id_viaje: VIAJE_26,
      id_emisor: DRIVER_ID,
      id_receptor: PASAJERO_A,
      puntaje: 3,
      comentario: "Sin mayores problemas, aunque no confirmó la dirección a tiempo.",
    },
  });

  // ─── Reportes ───────────────────────────────────────────────────────────────

  // Reportes de ADMIN_ID
  await prisma.reporte.create({
    data: {
      id_calificacion: cal2.id_calificacion,
      id_reportante: ADMIN_ID,
      id_reportado: CONDUCTOR_B,
      motivo: "COMENTARIO_INAPROPIADO",
      descripcion: "El comentario me parece injusto y no refleja lo que pasó.",
    },
  });

  await prisma.reporte.create({
    data: {
      id_calificacion: cal4.id_calificacion,
      id_reportante: CONDUCTOR_B,
      id_reportado: ADMIN_ID,
      motivo: "INFORMACION_FALSA",
      descripcion: "El pasajero miente, la ruta fue la correcta.",
    },
  });

  await prisma.reporte.create({
    data: {
      id_calificacion: cal5.id_calificacion,
      id_reportante: ADMIN_ID,
      id_reportado: CONDUCTOR_B,
      motivo: "COMENTARIO_INAPROPIADO",
      descripcion: "Lenguaje completamente inapropiado.",
    },
  });

  // Reporte de RIDER_ID (PENDIENTE)
  await prisma.reporte.create({
    data: {
      id_calificacion: cal9.id_calificacion,
      id_reportante: RIDER_ID,
      id_reportado: CONDUCTOR_B,
      motivo: "INFORMACION_FALSA",
      descripcion: "La ruta estuvo bien, no me quejé en ningún momento.",
    },
  });

  // Reporte de DRIVER_ID (PENDIENTE)
  await prisma.reporte.create({
    data: {
      id_calificacion: calD3.id_calificacion,
      id_reportante: DRIVER_ID,
      id_reportado: PASAJERO_C,
      motivo: "INFORMACION_FALSA",
      descripcion: "El manejo fue correcto, el pasajero no tiene razón en su queja.",
    },
  });

  console.log("Seed completado.");
  console.log("  ADMIN_ID   → 4 recibidas (2 inapropiadas), 2 enviadas, 3 reportes");
  console.log("  RIDER_ID   → 7 recibidas visibles + 1 inapropiada, 2 enviadas, 1 reporte PENDIENTE pre-cargado");
  console.log("  DRIVER_ID  → 7 recibidas visibles + 1 inapropiada, 2 enviadas, 1 reporte PENDIENTE pre-cargado");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
