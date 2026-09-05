# Guía de despliegue — integración Stripe ↔ Supabase

> Estado: **nada de esto está desplegado todavía.** El código web ya está
> terminado y asume estos cambios. Hasta que se apliquen, el paywall y el
> portal de cliente siguen con los bugs descritos abajo.

- Proyecto Supabase: `iivsjutltecehnnhmjok` (sports-nutrition)
- Dominio de producción: `https://ezfood.fit`
- Precio de Stripe: `price_1TvvnXQaPHvpmMJozQR2tjGo`

---

## 0. Qué arregla cada fichero

| Fichero | Sustituye a | Problema que resuelve |
|---|---|---|
| `create-stripe-checkout.ts` | `intagration/create-stripe-checkout.js` | `customer_email` crea un **Customer nuevo en cada checkout** y no deja fijar metadata. Ahora reutiliza/crea el Customer con `metadata.supabase_user_id`, bloquea suscripciones duplicadas y valida las redirect URLs. |
| `create-stripe-portal.ts` | `intagration/create-stripe-portal.js` | La búsqueda por `metadata` nunca acertaba (ver arriba) y el `return_url` por defecto era `http://localhost:5173`. Ahora hace *self-healing* de la metadata y deriva la URL del `Origin`. |
| `update-stripe-amount.ts` | `intagration/update-stripe-amount.js` (**vacío, 0 bytes**) | La función no existe pero el trigger la llama → los asientos facturados **nunca se actualizan**. |
| `01_seats_trigger.sql` | trigger de `intagration/view.sql` | `net.http_post` no manda cabecera de auth → 401 silencioso. Además disparaba en cualquier `UPDATE` de `all_users`. |
| `02_subscription.sql` | función de `intagration/view.sql` | `has_active_subscription()` enlazaba por `subscriptions.metadata`, que no existe en suscripciones creadas fuera del checkout. |

> La vista `nutri_payment` de `intagration/view.sql` **no se llega a crear** y se
> descarta a propósito. Conviene borrarla de ese fichero.

---

## 1. Antes de tocar nada: comprobar el precio en Stripe

El frontend ya no ofrece dos planes, sino uno solo cuyo importe deriva de
`quantity` (= número de clientes). La landing anuncia:

- 5 €/mes hasta 5 clientes
- a partir de ahí, 25 €/mes + 2 € por cliente

Eso tiene que estar configurado **en el propio Price de Stripe** como precio
escalonado (`billing_scheme: tiered`), no en el código. Verificar en el
dashboard de Stripe que `price_1TvvnXQaPHvpmMJozQR2tjGo` tiene esos tramos.
Si no los tiene, el importe que se cobra no coincidirá con lo que dice la web.

```bash
stripe prices retrieve price_1TvvnXQaPHvpmMJozQR2tjGo --expand tiers
```

También hay que **activar el Customer Portal** y decidir si permite cancelar
(`https://dashboard.stripe.com/settings/billing/portal`). La landing dice
"Gestiona tu suscripción desde el portal de Stripe"; si el portal no está
configurado, `create-stripe-portal` devolverá error de Stripe.

---

## 2. Secretos

### 2.1 Secretos de las Edge Functions

```bash
# Ya debería existir
supabase secrets set STRIPE_SECRET_KEY="sk_test_..." --project-ref iivsjutltecehnnhmjok

# Nuevo: allowlist de orígenes para success_url / cancel_url / return_url.
# Sin esto, cualquiera puede pedir un checkout que redirija a su dominio.
npx --yes supabase secrets set ALLOWED_ORIGINS="https://ezfood.fit,http://localhost:5173" \
  --project-ref iivsjutltecehnnhmjok


# Nuevo: secreto compartido que protege update-stripe-amount, que se despliega
# sin verificación de JWT porque la llama Postgres.
# Genéralo en una variable e imprímelo ANTES de enviarlo: una vez guardado,
# Supabase solo devuelve su digest y el valor ya no se puede recuperar.
SEAT_SECRET=$(openssl rand -hex 32)
echo "$SEAT_SECRET"   # cópialo, hace falta en el paso 2.2

npx --yes supabase secrets set SEAT_SYNC_SECRET="$SEAT_SECRET" \
  --project-ref iivsjutltecehnnhmjok
```

c8ed6ffc7c9aaefca6f47dc649c0e1ea08c937cfac0f6b490b0e53b809a900b9

> Guarda el valor de `SEAT_SYNC_SECRET`: hace falta en el paso 2.2. Si lo
> pierdes no hay forma de consultarlo (`secrets list` y el dashboard solo
> muestran el digest); genera uno nuevo y actualiza también Vault.

### 2.2 Secretos en Vault (los lee el trigger)

En el SQL Editor. El trigger los saca de Vault en vez de llevarlos incrustados
en la definición de la función, que es legible por cualquiera con acceso a
`pg_catalog`.

```sql
select vault.create_secret('<el mismo valor de SEAT_SYNC_SECRET>', 'seat_sync_secret');
select vault.create_secret('<service role key del proyecto>',      'seat_sync_apikey');
```

Si el secreto ya existe (por ejemplo porque regeneraste `SEAT_SYNC_SECRET`),
`create_secret` falla por nombre duplicado. Actualízalo en su lugar:

```sql
select vault.update_secret(
  (select id from vault.secrets where name = 'seat_sync_secret'),
  '<el valor nuevo>'
);
```

---

## 3. Backfill de metadata en Stripe

**Este paso va antes de sustituir `has_active_subscription()`**, o dejarás
fuera del panel a los nutricionistas que ya estén pagando.

Los Customers creados por la versión antigua del checkout no tienen
`metadata.supabase_user_id`. Ver a cuántos afecta:

```sql
select c.id, c.email, u.id as supabase_user_id
  from stripe.customers c
  join auth.users u on u.email = c.email
 where c.metadata->>'supabase_user_id' is null;
```

La copia en `stripe.customers` es solo un espejo: hay que escribir la metadata
**en Stripe**, y el sync engine la replicará. Para cada fila del resultado:

```bash
# metadata es un parametro anidado: va con -d, no como flag.
# El CLI opera en modo test por defecto; si el proyecto usa sk_live_, anade --live.
stripe customers update cus_XXXX \
  -d "metadata[supabase_user_id]=<uuid>"
```

Si son pocos, a mano. Si son muchos, un script. La nueva
`has_active_subscription()` mantiene el respaldo por `subscriptions.metadata`,
así que quien se suscribió por el checkout antiguo **no** pierde el acceso
aunque olvides este paso — pero el portal de cliente sí le fallará hasta que
entre una vez (se auto-repara).

---

## 4. Aplicar el SQL

En orden, desde el SQL Editor:

```
1. supabase/solution/02_subscription.sql   -- has_active_subscription()
2. supabase/solution/01_seats_trigger.sql  -- trigger de asientos
```

> Sí, primero el 02. El trigger del 01 llama a `update-stripe-amount`, que
> todavía no existe; aplicarlo antes no rompe nada (pg_net es asíncrono) pero
> genera 404 inútiles en `net._http_response`.

Antes de ejecutar `01`, confirma que el nombre de la función coincide con lo
que hay desplegado y que no queda el trigger viejo:

```sql
select tgname from pg_trigger where tgrelid = 'public.all_users'::regclass;
-- debe quedar solo: tr_sync_stripe_seats_ins / _upd / _del
```

---

## 5. Desplegar las Edge Functions

Copiar los `.ts` a `supabase/functions/<nombre>/index.ts` y desplegar:

```bash
supabase functions deploy create-stripe-checkout --project-ref iivsjutltecehnnhmjok
supabase functions deploy create-stripe-portal   --project-ref iivsjutltecehnnhmjok

# --no-verify-jwt porque la llama Postgres, no un usuario.
# Su protección es la cabecera X-Sync-Secret.
supabase functions deploy update-stripe-amount --no-verify-jwt \
  --project-ref iivsjutltecehnnhmjok
```

> **No tocar** `stripe-setup`, `stripe-webhook` ni `stripe-worker`: los genera
> la integración Stripe↔Supabase y se regeneran solos.

---

## 6. Regenerar tipos y desplegar la web

```bash
npm run supabase-types
npm run build
npm run deploy
```

---

## 7. Verificación

### 7.1 Alta completa
1. Registrarse con un email nuevo → recibir OTP → introducir el código.
   **Debe entrar al panel** (antes fallaba siempre aquí).
2. Completar el perfil de nutricionista.
3. Debe aparecer el **paywall** (ya no se puede invitar clientes gratis).
4. Pulsar "Activar suscripción" → pagar con `4242 4242 4242 4242`.
5. Al volver, el panel debe desbloquearse solo en unos segundos (hay polling
   de hasta 60 s mientras llega el webhook).

```sql
-- El Customer debe tener la metadata:
select id, email, metadata->>'supabase_user_id'
  from stripe.customers order by created desc limit 5;
```

### 7.2 Cancelar el checkout
Pulsar "Activar suscripción" y volver atrás en Stripe → debe caer en la página
"Pago cancelado", **no** en una pantalla en blanco.

### 7.3 Portal de cliente
Config → Gestión de cuenta → "Gestionar suscripción" → debe abrir Stripe.
Si falla, ahora sale una notificación de error en vez de fallar en silencio.

### 7.4 Sincronización de asientos (lo más frágil)
Invitar a un cliente y aceptar la invitación, luego:

```sql
-- ¿Salió la llamada y con qué código?
select id, status_code, content, created
  from net._http_response
 order by created desc limit 10;
```

`status_code` debe ser **200**. Si es 401 → el `seat_sync_apikey` de Vault está
mal o la función no se desplegó con `--no-verify-jwt`. Si es 403 → el
`seat_sync_secret` de Vault no coincide con `SEAT_SYNC_SECRET`.

Luego, en Stripe, la `quantity` del item debe reflejar el nº de clientes:

```bash
stripe subscriptions retrieve sub_XXXX
```

Y los logs: `supabase functions logs update-stripe-amount --project-ref iivsjutltecehnnhmjok`

---

## 8. Rollback

Todo es reversible sin perder datos:

- **Funciones**: volver a desplegar las versiones de `supabase/intagration/`.
- **`has_active_subscription()`**: reejecutar el `CREATE OR REPLACE` de
  `intagration/view.sql`.
- **Trigger**: `drop trigger tr_sync_stripe_seats_ins/_upd/_del on public.all_users;`
  y reejecutar el bloque original.

El único paso **no reversible** es el backfill de metadata del paso 3, pero es
aditivo: añade un campo que estaba vacío, no pisa nada.

---

## 9. Cabos sueltos conocidos

- `create-stripe-checkout.ts` usa `stripe.customers.search`, que en Stripe
  tiene ~1 min de latencia de indexado tras crear un Customer. Da igual aquí
  (entre dos checkouts del mismo usuario pasa mucho más), pero conviene saberlo.
- El `proration_behavior: "create_prorations"` de `update-stripe-amount.ts`
  prorratea en la factura siguiente en vez de cobrar al instante. Si prefieres
  cobrar al momento al añadir un cliente, cambiarlo por `always_invoice`.
- `SEAT_SYNC_SECRET` es opcional en el código: si no está definido, la función
  **no valida nada** y queda abierta. Definirlo siempre.
