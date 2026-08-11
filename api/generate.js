export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { input } = req.body;

  if (!input) {
    return res.status(400).json({ error: 'El texto es requerido' });
  }

  // Vercel lee la clave secreta desde el servidor, NUNCA desde el navegador
  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: 'Falta la clave API en Vercel' });
  }

  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${API_KEY}`;
  const promptText = `Actúa como un experto en comunicación corporativa. Transforma el siguiente texto o idea informal en un correo electrónico profesional, diplomático y asertivo en español. Incluye una línea de asunto sugerida al inicio:\n\nIdea del usuario: "${input}"`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }]
      })
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Error de servidor' });
  }
}
