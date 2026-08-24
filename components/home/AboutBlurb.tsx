import Link from "next/link";

export function AboutBlurb() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="card mx-auto max-w-2xl p-8 text-center">
        <h2 className="text-2xl font-bold">PsPrime</h2>
        <p className="mt-3 text-text-muted">
          A PsPrime nasceu porque acreditamos que uma boa PlayStation não precisa ser nova para
          continuar a ser incrível.
          <br />
          <span className="font-medium text-text">Testamos. Limpamos. Preparamos.</span>
          <br />E colocamos novamente nas mãos de quem vai jogar.
        </p>
        <Link href="/sobre" className="mt-4 inline-block text-sm text-primary-light hover:underline">
          Sobre nós →
        </Link>
      </div>
    </section>
  );
}
