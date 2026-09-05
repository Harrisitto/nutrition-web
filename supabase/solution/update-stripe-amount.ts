// NUEVA / FALTANTE: supabase/functions/update-stripe-amount
//
// supabase/intagration/update-stripe-amount.js está VACÍO (0 bytes), pero el
// trigger `tr_sync_stripe_seats` de view.sql la invoca en cada alta/baja de
// all_users. Resultado hoy: el nutricionista paga siempre el nº de clientes que
// tenía el día que se suscribió; añadir o quitar clientes no cambia la factura.
//
// Esta función recalcula la `quantity` del item de la suscripción activa.
//
// Despliegue:
//   supabase functions deploy update-stripe-amount --no-verify-jwt
// (el trigger la llama desde Postgres, no lleva JWT de usuario; el acceso se
// protege con la cabecera compartida X-Sync-Secret que se valida abajo).
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import Stripe from "npm:stripe@^17";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "");

// supabase secrets set SEAT_SYNC_SECRET="<cadena larga aleatoria>"
const SYNC_SECRET = Deno.env.get("SEAT_SYNC_SECRET") ?? "";

interface WebhookPayload {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  schema: string;
  record: { user_id?: string; nutri_id?: string | null } | null;
  old_record: { user_id?: string; nutri_id?: string | null } | null;
}

const admin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
);

/** Recalcula los asientos facturados de un nutricionista. */
async function syncSeats(nutriId: string) {
  const { count, error } = await admin
    .from("all_users")
    .select("*", { count: "exact", head: true })
    .eq("nutri_id", nutriId);

  if (error) throw new Error(`count failed: ${error.message}`);

  const quantity = count && count > 0 ? count : 1;

  const { data: customer } = await admin
    .schema("stripe")
    .from("customers")
    .select("id")
    .eq("metadata->>supabase_user_id", nutriId)
    .maybeSingle();

  if (!customer?.id) {
    console.log(`[skip] ${nutriId} no tiene Customer de Stripe todavía`);
    return { nutriId, skipped: "no_customer" };
  }

  const subs = await stripe.subscriptions.list({
    customer: customer.id,
    status: "active",
    limit: 10,
  });
  const subscription = subs.data[0];

  if (!subscription) {
    console.log(`[skip] ${nutriId} no tiene suscripción activa`);
    return { nutriId, skipped: "no_subscription" };
  }

  const item = subscription.items.data[0];
  if (!item) return { nutriId, skipped: "no_item" };
  if (item.quantity === quantity) return { nutriId, unchanged: quantity };

  await stripe.subscriptions.update(
    subscription.id,
    {
      items: [{ id: item.id, quantity }],
      // Prorratea el cambio en la factura siguiente en vez de cobrar al
      // instante cada vez que se añade un cliente.
      proration_behavior: "create_prorations",
    },
    // El trigger puede dispararse varias veces seguidas (altas en lote): la
    // clave de idempotencia evita updates duplicados con el mismo resultado.
    { idempotencyKey: `seats:${subscription.id}:${quantity}` },
  );

  return { nutriId, updatedTo: quantity };
}

Deno.serve(async (req) => {
  if (SYNC_SECRET && req.headers.get("x-sync-secret") !== SYNC_SECRET) {
    return new Response("forbidden", { status: 403 });
  }

  try {
    const payload: WebhookPayload = await req.json();

    // En un UPDATE que reasigna un cliente hay DOS nutricionistas afectados:
    // el que lo pierde y el que lo gana. La versión ingenua (solo NEW) deja al
    // antiguo pagando un asiento de más.
    const affected = new Set<string>();
    if (payload.record?.nutri_id) affected.add(payload.record.nutri_id);
    if (payload.old_record?.nutri_id) affected.add(payload.old_record.nutri_id);

    if (affected.size === 0) {
      return Response.json({ ok: true, affected: [] });
    }

    const results = await Promise.all(
      [...affected].map(async (id) => {
        try {
          return await syncSeats(id);
        } catch (e) {
          console.error(`[error] sync ${id}:`, e);
          return { nutriId: id, error: (e as Error).message };
        }
      }),
    );

    return Response.json({ ok: true, results });
  } catch (err) {
    console.error("[update-stripe-amount]", err);
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
});
