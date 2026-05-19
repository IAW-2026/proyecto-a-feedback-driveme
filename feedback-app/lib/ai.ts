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
