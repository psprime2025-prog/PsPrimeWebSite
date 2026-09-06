import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatDate, SELL_REQUEST_STATUS_LABELS } from "@/lib/format";
import { updateSellRequestStatus } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function AdminAvaliacaoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sellRequest = await prisma.sellRequest.findUnique({ where: { id } });

  if (!sellRequest) notFound();

  const updateStatusWithId = updateSellRequestStatus.bind(null, sellRequest.id);

  return (
    <div>
      <h1 className="text-2xl font-bold">Pedido de avaliação — {sellRequest.name}</h1>
      <p className="text-sm text-text-muted">{formatDate(sellRequest.createdAt)}</p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="mb-3 font-semibold">Cliente</h2>
            <p className="text-sm">{sellRequest.name}</p>
            {sellRequest.phone && <p className="text-sm text-text-muted">{sellRequest.phone}</p>}
            {sellRequest.email && <p className="text-sm text-text-muted">{sellRequest.email}</p>}
          </div>

          <div className="card p-6">
            <h2 className="mb-3 font-semibold">Consola</h2>
            <p className="text-sm">Modelo: {sellRequest.consoleModel}</p>
            {sellRequest.storageCapacity && (
              <p className="text-sm text-text-muted">Armazenamento: {sellRequest.storageCapacity}</p>
            )}
            <p className="text-sm text-text-muted">Estado: {sellRequest.condition}</p>
          </div>

          {sellRequest.message && (
            <div className="card p-6">
              <h2 className="mb-3 font-semibold">Mensagem do cliente</h2>
              <p className="whitespace-pre-line text-sm text-text-muted">{sellRequest.message}</p>
            </div>
          )}

          {sellRequest.photos.length > 0 && (
            <div className="card p-6">
              <h2 className="mb-3 font-semibold">Fotos ({sellRequest.photos.length})</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {sellRequest.photos.map((url) => (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative block aspect-square overflow-hidden rounded-card border border-border"
                  >
                    <Image src={url} alt="Foto enviada pelo cliente" fill className="object-cover" sizes="200px" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="card h-fit space-y-4 p-6">
          <h2 className="font-semibold">Status do pedido</h2>
          <form action={updateStatusWithId} className="space-y-3">
            <select name="status" defaultValue={sellRequest.status} className="input">
              {Object.entries(SELL_REQUEST_STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <Button type="submit" variant="primary" className="w-full">
              Atualizar status
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
