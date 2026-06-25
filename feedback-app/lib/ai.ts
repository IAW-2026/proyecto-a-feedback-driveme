import Groq from "groq-sdk";

function getClient() {
  return new Groq({ apiKey: process.env.GROQ_API_KEY });
}

export async function moderarComentario(comentario: string): Promise<boolean> { 
  const response = await getClient().chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "user",
        content: `Analizá el siguiente comentario de una app de transporte y determiná si contiene lenguaje ofensivo, insultos, discriminación o contenido inapropiado.
Respondé únicamente con "SI" si es inapropiado, o "NO" si es adecuado. Sin explicación.

Comentario: "${comentario}"`,
      },
    ],
    max_tokens: 5,
  });

  const respuesta = response.choices[0].message.content?.trim().toUpperCase() ?? "";
  return respuesta.startsWith("SI");
}

export type AnalisisComentarios = {
  tendenciasPositivas: string;
  puntosAMejorar: string;
  recurrenciaDeTemas: string;
  resumenGeneral: string;
};

export async function analizarComentarios(comentarios: string[]): Promise<AnalisisComentarios> {
  const lista = comentarios.map((c, i) => `${i + 1}. "${c}"`).join("\n");

  const response = await getClient().chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "user",
        content: `Analizá los siguientes comentarios que otros usuarios dejaron sobre UNA SOLA persona en una app de transporte. Todos los comentarios se refieren a la misma persona. Redactá el análisis en singular, hablando siempre de "esta persona" o "el usuario".
Respondé siempre en español correcto, sin errores ortográficos ni tipográficos.
Devolvé ÚNICAMENTE un objeto JSON con estos 4 campos:
- "tendenciasPositivas": 1 oración que destaque lo mejor mencionado en los comentarios.
- "puntosAMejorar": 1 oración con las críticas más comunes o áreas de oportunidad.
- "recurrenciaDeTemas": 3 a 5 palabras clave separadas por comas que más se repiten.
- "resumenGeneral": párrafo de 2 a 3 oraciones que sintetice el análisis completo de forma objetiva.

Comentarios:
${lista}`,
      },
    ],
    response_format: { type: "json_object" },
    max_tokens: 500,
  });

  const raw = response.choices[0].message.content ?? "{}";
  return JSON.parse(raw) as AnalisisComentarios;
}

export async function generarResumen(comentarios: string[]): Promise<string> {
  const lista = comentarios.map((c, i) => `${i + 1}. "${c}"`).join("\n");

  const response = await getClient().chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "user",
        content: `Tenés los siguientes comentarios de usuarios sobre un conductor o pasajero de una app de transporte:

${lista}

Escribí un párrafo breve (2-3 oraciones) que resuma en general lo que dicen los comentarios sobre esta persona. Usá un tono objetivo y neutral.`,
      },
    ],
    max_tokens: 200,
  });

  return response.choices[0].message.content?.trim() ?? "";
}

export async function generarResumenGlobal(comentarios: string[]): Promise<string> {
  const lista = comentarios.map((c, i) => `${i + 1}. "${c}"`).join("\n");

  const response = await getClient().chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "user",
        content: `Tenés los siguientes comentarios de usuarios de una app de transporte:

${lista}

Escribí un párrafo breve (2-3 oraciones) que resuma la experiencia general de los usuarios: qué valoran más y cuáles son las críticas más frecuentes. No menciones roles ni cargos específicos (como conductor, pasajero, chofer o cliente), hablá de "los usuarios" en términos generales. Usá un tono objetivo y neutral. Respondé solo el párrafo, sin título ni introducción.`,
      },
    ],
    max_tokens: 200,
  });

  return response.choices[0].message.content?.trim() ?? "";
}
