-- CreateEnum
CREATE TYPE "EstadoReporte" AS ENUM ('PENDIENTE', 'APROBADO', 'RECHAZADO');

-- CreateTable
CREATE TABLE "Calificacion" (
    "id_calificacion" TEXT NOT NULL,
    "id_viaje" TEXT NOT NULL,
    "id_emisor" TEXT NOT NULL,
    "id_receptor" TEXT NOT NULL,
    "puntaje" INTEGER NOT NULL,
    "comentario" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Calificacion_pkey" PRIMARY KEY ("id_calificacion")
);

-- CreateTable
CREATE TABLE "Reporte" (
    "id_reporte" TEXT NOT NULL,
    "id_calificacion" TEXT NOT NULL,
    "id_reportante" TEXT NOT NULL,
    "id_reportado" TEXT NOT NULL,
    "motivo" TEXT NOT NULL,
    "estado" "EstadoReporte" NOT NULL DEFAULT 'PENDIENTE',
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Reporte_pkey" PRIMARY KEY ("id_reporte")
);

-- AddForeignKey
ALTER TABLE "Reporte" ADD CONSTRAINT "Reporte_id_calificacion_fkey" FOREIGN KEY ("id_calificacion") REFERENCES "Calificacion"("id_calificacion") ON DELETE RESTRICT ON UPDATE CASCADE;
