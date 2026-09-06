import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { prisma } from "@/lib/prisma";
import { sendSellRequestEmail } from "@/lib/email";
import { uploadSellRequestPhoto } from "@/lib/supabase-admin";

const MAX_PHOTOS = 5;
const MAX_PHOTO_SIZE = 8 * 1024 * 1024; // 8MB por foto — tamanho original aceite do cliente

// Cópia comprimida só para o anexo do email (nunca afeta o que fica guardado
// no Storage nem o que o cliente enviou) — o Resend recusa emails com mais de
// ~40MB de anexos (em base64, ~33% maior que os bytes originais).
const EMAIL_ATTACHMENT_MAX_DIMENSION = 1600;
const EMAIL_ATTACHMENT_JPEG_QUALITY = 75;

async function compressForEmail(content: Buffer): Promise<Buffer> {
  try {
    return await sharp(content)
      .rotate() // respeita a orientação EXIF antes de redimensionar
      .resize({
        width: EMAIL_ATTACHMENT_MAX_DIMENSION,
        height: EMAIL_ATTACHMENT_MAX_DIMENSION,
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: EMAIL_ATTACHMENT_JPEG_QUALITY })
      .toBuffer();
  } catch (err) {
    // Se a compressão falhar por algum formato inesperado, anexa a foto
    // original em vez de perder o anexo por completo.
    console.error("Falha ao comprimir foto para o email, a anexar original:", err);
    return content;
  }
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const nome = String(formData.get("nome") ?? "").trim();
  const whatsapp = String(formData.get("whatsapp") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const modelo = String(formData.get("modelo") ?? "").trim();
  const estado = String(formData.get("estado") ?? "").trim();
  const mensagem = String(formData.get("mensagem") ?? "").trim();

  if (!nome || !whatsapp || !modelo || !estado) {
    return NextResponse.json({ error: "Preenche todos os campos obrigatórios." }, { status: 400 });
  }

  const fotoFiles = formData.getAll("fotos").filter((f): f is File => f instanceof File && f.size > 0);

  if (fotoFiles.length > MAX_PHOTOS) {
    return NextResponse.json({ error: `Envia no máximo ${MAX_PHOTOS} fotos.` }, { status: 400 });
  }
  if (fotoFiles.some((f) => f.size > MAX_PHOTO_SIZE)) {
    return NextResponse.json(
      { error: `Cada foto deve ter no máximo ${MAX_PHOTO_SIZE / (1024 * 1024)}MB.` },
      { status: 400 }
    );
  }

  const fotos = await Promise.all(
    fotoFiles.map(async (file) => ({
      filename: file.name,
      content: Buffer.from(await file.arrayBuffer()),
      contentType: file.type || "application/octet-stream",
    }))
  );

  let sellRequestId: string;
  try {
    const sellRequest = await prisma.sellRequest.create({
      data: {
        name: nome,
        phone: whatsapp,
        email: email || null,
        consoleModel: modelo,
        condition: estado,
        message: mensagem || null,
      },
    });
    sellRequestId = sellRequest.id;
  } catch (err) {
    console.error("Falha ao guardar pedido de avaliação:", err);
    return NextResponse.json(
      { error: "Não foi possível enviar o pedido. Tenta novamente ou contacta-nos diretamente." },
      { status: 500 }
    );
  }

  // Fallback fiável: guarda as fotos originais (qualidade completa) no
  // Supabase Storage, associadas ao pedido — visíveis no admin mesmo que o
  // email de notificação abaixo falhe.
  if (fotos.length > 0) {
    try {
      const urls = await Promise.all(
        fotos.map((f) => uploadSellRequestPhoto(sellRequestId, f.filename, f.content, f.contentType))
      );
      const photos = urls.filter((u): u is string => !!u);
      if (photos.length > 0) {
        await prisma.sellRequest.update({ where: { id: sellRequestId }, data: { photos } });
      }
    } catch (err) {
      // As fotos no Storage são o fallback do email, não o inverso — se isto
      // falhar, o pedido de texto já está guardado, não bloqueia o cliente.
      console.error("Falha ao guardar fotos do pedido de avaliação no Storage:", err);
    }
  }

  try {
    const fotosParaEmail = await Promise.all(
      fotos.map(async (f) => ({
        filename: f.filename,
        content: await compressForEmail(f.content),
        contentType: "image/jpeg",
      }))
    );
    await sendSellRequestEmail({ nome, whatsapp, email, modelo, estado, mensagem, fotos: fotosParaEmail });
  } catch (err) {
    // O pedido já ficou registado (visível no admin, fotos incluídas) mesmo
    // que o email falhe — não bloqueia a resposta ao cliente por uma falha
    // só de notificação.
    console.error("Falha ao enviar email de notificação do pedido de avaliação:", err);
  }

  return NextResponse.json({ success: true });
}
