/**
 * Edge function race-profile-image.
 *
 * Lee con Gemini la imagen de un perfil de carrera (la gráfica de altitud que publica la
 * organización) y devuelve los puntos de la línea. Los tramos se calculan en la web igual que
 * con un gpx; aquí solo se lee la gráfica. NO guarda nada.
 *
 * POST { "image": "<base64>", "mime_type": "image/png" }
 * Respuesta: { name, distance_km, elevation_gain, points: [{ km, altitude }] }
 */
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');
const GOOGLE_AI_API_KEY = Deno.env.get('GOOGLE_AI_API_KEY');

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !GOOGLE_AI_API_KEY) {
  throw new Error('Missing SUPABASE_URL, SUPABASE_ANON_KEY or GOOGLE_AI_API_KEY environment variables');
}

const GEMINI_MODEL = 'gemini-3.8-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// Formatos de imagen que acepta Gemini
const MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/heic', 'image/heif'];
// ~6 MB de imagen en base64; Gemini admite hasta 20 MB por petición
const MAX_IMAGE_LENGTH = 8_000_000;

const PROMPT = `This image should be the elevation profile of a race or route: a chart with distance on the x axis and altitude on the y axis.

Trace the profile line from start to finish and return points along it:
- km: distance from the start in kilometres, read from the x axis.
- altitude: altitude in metres, read from the y axis, interpolating between the axis labels.
- Include every peak and every valley of the line, plus enough points in between that the line can be redrawn faithfully (usually between 100 and 250 points, never more than 1% of the total distance apart).
- Points must be ordered by km, starting at the start of the route.
- If the axes are in miles or feet, convert them to kilometres and metres.
- Ignore everything drawn over the chart: markers, callouts, labels, products, icons, legends.

Also return, only if they are written on the image (otherwise null):
- name: the name of the race or route.
- distance_km: the total distance, in kilometres.
- elevation_gain: the total positive elevation (D+, ascent), in metres.

If the image is not an elevation profile, return an empty points list.`;

const RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    name: { type: 'STRING', nullable: true },
    distance_km: { type: 'NUMBER', nullable: true },
    elevation_gain: { type: 'NUMBER', nullable: true },
    points: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          km: { type: 'NUMBER' },
          altitude: { type: 'NUMBER' },
        },
        required: ['km', 'altitude'],
      },
    },
  },
  required: ['name', 'distance_km', 'elevation_gain', 'points'],
};

type ProfilePoint = { km: number; altitude: number };

type ImageProfile = {
  name: string | null;
  distance_km: number | null;
  elevation_gain: number | null;
  points: ProfilePoint[];
};

const json = (body: unknown, status = 200) => {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
};

const positiveOrNull = (value: unknown) =>
  typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : null;

/** Lo que devuelve el modelo no se da por bueno: solo números finitos y km no negativos. */
const toImageProfile = (raw: Partial<ImageProfile>): ImageProfile => ({
  name: typeof raw.name === 'string' && raw.name.trim() ? raw.name.trim() : null,
  distance_km: positiveOrNull(raw.distance_km),
  elevation_gain: positiveOrNull(raw.elevation_gain),
  points: (Array.isArray(raw.points) ? raw.points : []).filter(
    (point) =>
      Number.isFinite(point?.km) && Number.isFinite(point?.altitude) && point.km >= 0,
  ),
});

const readProfile = async (image: string, mimeType: string) => {
  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': GOOGLE_AI_API_KEY },
    body: JSON.stringify({
      contents: [{ parts: [{ inline_data: { mime_type: mimeType, data: image } }, { text: PROMPT }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: RESPONSE_SCHEMA,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini ${response.status}: ${await response.text()}`);
  }

  const result = await response.json();
  const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
  if (typeof text !== 'string') throw new Error('Gemini returned no content');

  return toImageProfile(JSON.parse(text));
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const authorization = req.headers.get('Authorization');
  if (!authorization) return json({ error: 'Missing Authorization header' }, 401);

  // La clave anon también es un JWT válido: se exige un usuario para no gastar Gemini en balde
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authorization } },
  });
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return json({ error: 'Unauthorized' }, 401);

  let image: string;
  let mimeType: string;

  try {
    ({ image, mime_type: mimeType } = await req.json());
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  if (typeof image !== 'string' || image === '') return json({ error: 'image is required' }, 400);
  if (!MIME_TYPES.includes(mimeType)) return json({ error: 'Unsupported image type' }, 415);
  if (image.length > MAX_IMAGE_LENGTH) return json({ error: 'Image too large' }, 413);

  try {
    return json(await readProfile(image, mimeType));
  } catch (e) {
    console.error(e);
    return json({ error: 'Could not read the profile' }, 502);
  }
});
