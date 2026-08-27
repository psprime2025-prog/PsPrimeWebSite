import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendSellRequestEmail } from "@/lib/email";

const MAX_PHOTOS = 5;
// O Resend recusa emails com mais de ~40MB de anexos; os anexos vão em
// base64 (~33% maior que o ficheiro original), por isso o limite aqui tem de
// ficar bem abaixo disso. 5 fotos × 4MB = 20MB brutos ≈ 27MB em base64.
const MAX_PHOTO_SIZE = 4 * 1024 * 1024; // 4MB por foto

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

  // O formulário só tem um campo de contacto único (email OU telemóvel) — guarda
  // no campo certo consoante o formato, para ficar visível e útil no admin.
  const isEmail = contacto.includes("@");

  try {
    await prisma.sellRequest.create({
      data: {
        name: nome,
        email: isEmail ? contacto : null,
        phone: isEmail ? null : contacto,
        consoleModel: modelo,
        condition: estado,
        message: mensagem || null,
      },
    });
  } catch (err) {
    console.error("Falha ao guardar pedido de avaliação:", err);
    return NextResponse.json(
      { error: "Não foi possível enviar o pedido. Tenta novamente ou contacta-nos diretamente." },
      { status: 500 }
    );
  }

  try {
    await sendSellRequestEmail({ nome, contacto, modelo, estado, mensagem, fotos });
  } catch (err) {
    // O pedido já ficou registado (visível no admin) mesmo que o email falhe —
    // não bloqueia a resposta ao cliente por uma falha só de notificação.
    console.error("Falha ao enviar email de notificação do pedido de avaliação:", err);
  }

  return NextResponse.json({ success: true });
}
