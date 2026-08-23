import { NextRequest, NextResponse } from "next/server";
import { sendSellRequestEmail } from "@/lib/email";

const MAX_PHOTOS = 5;
const MAX_PHOTO_SIZE = 8 * 1024 * 1024; // 8MB

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const nome = String(formData.get("nome") ?? "").trim();
  const contacto = String(formData.get("contacto") ?? "").trim();
  const modelo = String(formData.get("modelo") ?? "").trim();
  const estado = String(formData.get("estado") ?? "").trim();
  const mensagem = String(formData.get("mensagem") ?? "").trim();

  if (!nome || !contacto || !modelo || !estado) {
    return NextResponse.json({ error: "Preenche todos os campos obrigatórios." }, { status: 400 });
  }

  const fotoFiles = formData.getAll("fotos").filter((f): f is File => f instanceof File && f.size > 0);

  if (fotoFiles.length > MAX_PHOTOS) {
    return NextResponse.json({ error: `Envia no máximo ${MAX_PHOTOS} fotos.` }, { status: 400 });
  }
  if (fotoFiles.some((f) => f.size > MAX_PHOTO_SIZE)) {
    return NextResponse.json({ error: "Cada foto deve ter no máximo 8MB." }, { status: 400 });
  }

  const fotos = await Promise.all(
    fotoFiles.map(async (file) => ({
      filename: file.name,
      content: Buffer.from(await file.arrayBuffer()),
      contentType: file.type || "application/octet-stream",
    }))
  );

  try {
    await sendSellRequestEmail({ nome, contacto, modelo, estado, mensagem, fotos });
  } catch (err) {
    console.error("Falha ao enviar pedido de avaliação:", err);
    return NextResponse.json(
      { error: "Não foi possível enviar o pedido. Tenta novamente ou contacta-nos diretamente." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
