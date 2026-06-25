import "dotenv/config";
import { prisma } from "../lib/prisma";

// mar03andres@gmail.com (pasajera)
const MAR_ID      = "user_3Dh1RWC44dLWK4QpqZ2ubY2Ecdr";
const CONDUCTOR_A = "user_fakedriver001";
const CONDUCTOR_B = "user_fakedriver002";
const CONDUCTOR_C = "user_fakedriver003";

async function main() {
  // ── 4 calificaciones RECIBIDAS por MAR (conductores calificándola como pasajera) ──
  await prisma.calificacion.create({
    data: {
      id_viaje:    "viaje-mar-0001",
      id_emisor:   CONDUCTOR_A,
      id_receptor: MAR_ID,
      puntaje:     5,
      comentario:  "Excelente pasajera, muy amable y puntual.",
    },
  });

  await prisma.calificacion.create({
    data: {
      id_viaje:    "viaje-mar-0002",
      id_emisor:   CONDUCTOR_B,
      id_receptor: MAR_ID,
      puntaje:     4,
      comentario:  "Buen viaje, sin inconvenientes.",
    },
  });

  await prisma.calificacion.create({
    data: {
      id_viaje:    "viaje-mar-0003",
      id_emisor:   CONDUCTOR_C,
      id_receptor: MAR_ID,
      puntaje:     3,
      comentario:  "Normal, nada para destacar.",
    },
  });

  await prisma.calificacion.create({
    data: {
      id_viaje:    "viaje-mar-0004",
      id_emisor:   CONDUCTOR_A,
      id_receptor: MAR_ID,
      puntaje:     5,
      comentario:  "Muy respetuosa, esperó en el lugar exacto.",
    },
  });

  // ── 2 calificaciones ENVIADAS por MAR (ella califica a conductores) ──
  await prisma.calificacion.create({
    data: {
      id_viaje:    "viaje-mar-0005",
      id_emisor:   MAR_ID,
      id_receptor: CONDUCTOR_A,
      puntaje:     5,
      comentario:  "Conductor muy profesional, llegamos rápido.",
    },
  });

  await prisma.calificacion.create({
    data: {
      id_viaje:    "viaje-mar-0006",
      id_emisor:   MAR_ID,
      id_receptor: CONDUCTOR_C,
      puntaje:     3,
      comentario:  "Viaje ok, aunque el auto estaba algo sucio.",
    },
  });

  console.log("Listo: 4 recibidas + 2 enviadas para mar03andres@gmail.com");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
