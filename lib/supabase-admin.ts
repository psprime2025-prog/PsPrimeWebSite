import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if ((!supabaseUrl || !serviceRoleKey) && process.env.NODE_ENV === "production") {
  console.warn(
    "NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY não configuradas — upload de fotos para o Storage não vai funcionar."
  );
}

// Cliente só de servidor (nunca importar em componentes "use client") — usa a
// service role key, que ignora RLS e tem permissão para escrever no Storage.
export const supabaseAdmin =
  supabaseUrl && serviceRoleKey
    ? createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } })
    : null;

export const SELL_REQUEST_PHOTOS_BUCKET = "sell-request-photos";

let bucketEnsured = false;

async function ensureBucketExists() {
  if (bucketEnsured || !supabaseAdmin) return;

  const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();
  if (listError) {
    console.error("Falha ao listar buckets do Supabase Storage:", listError);
    return;
  }

  if (!buckets.some((b) => b.name === SELL_REQUEST_PHOTOS_BUCKET)) {
    const { error: createError } = await supabaseAdmin.storage.createBucket(
      SELL_REQUEST_PHOTOS_BUCKET,
      { public: true }
    );
    if (createError) {
      console.error("Falha ao criar o bucket do Supabase Storage:", createError);
      return;
    }
  }

  bucketEnsured = true;
}

/** Faz upload de uma foto (buffer original, sem compressão) e devolve o URL público. */
export async function uploadSellRequestPhoto(
  sellRequestId: string,
  filename: string,
  content: Buffer,
  contentType: string
): Promise<string | null> {
  if (!supabaseAdmin) return null;
  await ensureBucketExists();

  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${sellRequestId}/${Date.now()}-${safeName}`;

  const { error } = await supabaseAdmin.storage
    .from(SELL_REQUEST_PHOTOS_BUCKET)
    .upload(path, content, { contentType, upsert: false });

  if (error) {
    console.error("Falha ao guardar foto do pedido de avaliação no Supabase Storage:", error);
    return null;
  }

  const { data } = supabaseAdmin.storage.from(SELL_REQUEST_PHOTOS_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
