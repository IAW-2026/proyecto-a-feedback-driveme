import "dotenv/config";
import { moderarComentario, generarResumen } from "../lib/ai";

// Esto es para que yo sepa que comentarios son ofensivos y no, la IA no los va a ver de esta manera. Le voy a pasar todos estos comentarios a la IA y ella me los va a clasificar.
const comentariosOfensivos = [
  "Imbécil, me hizo esperar 20 minutos.",
  "Pésimo, una basura de persona.",
  "Ojalá te cancelen la cuenta, inútil.",
  "Sos un estúpido, no tenés idea de manejar.",
];

const comentariosNormales = [
  "Muy buen conductor, llegamos a tiempo.",
  "Puntual y amable, lo recomiendo.",
  "El auto estaba limpio y el viaje fue tranquilo.",
  "Buen trato, aunque tardó un poco en llegar.",
];


async function main() {
  console.log("=== TEST MODERACIÓN ===\n");

  for (const comentario of [...comentariosOfensivos, ...comentariosNormales]) { // Itera sobre ambos conjuntos de comentarios
    const esInapropiado = await moderarComentario(comentario); // Llama a la función de moderación para cada comentario
    const etiqueta = esInapropiado ? "🔴 INAPROPIADO" : "🟢 APROPIADO"; 
    console.log(`${etiqueta} — "${comentario}"`);
  }

  console.log("\n=== TEST RESUMEN ===\n");
  console.log("Comentarios de entrada:");
  comentariosNormales.forEach((c, i) => console.log(`  ${i + 1}. "${c}"`));

  const resumen = await generarResumen(comentariosNormales);
  console.log("\nResumen generado por IA:");
  console.log(resumen);
}

main().catch(console.error);
