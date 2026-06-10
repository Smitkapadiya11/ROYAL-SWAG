import Link from "next/link";
import { Container, Section } from "@/components/layout";

export default function NotFound() {
  return (
    <Section bg="cream" className="flex min-h-[70vh] items-center">
      <Container className="text-center">
        <p className="font-body text-sm uppercase tracking-widest text-on-surface-variant">
          404
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-primary md:text-4xl">
          Page Not Found
        </h1>
        <p className="mx-auto mt-3 max-w-md font-body text-lg text-on-surface-variant">
          Breathe Easy — Let&apos;s find what you&apos;re looking for
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn-primary inline-flex min-w-[140px] justify-center px-6 py-3">
            Home
          </Link>
          <Link
            href="/product"
            className="inline-flex min-w-[140px] justify-center rounded-xl border border-primary/20 bg-white/50 px-6 py-3 font-body text-sm font-semibold text-primary hover:bg-white/80"
          >
            Product
          </Link>
          <Link
            href="/lung-test"
            className="inline-flex min-w-[140px] justify-center rounded-xl border border-primary/20 bg-white/50 px-6 py-3 font-body text-sm font-semibold text-primary hover:bg-white/80"
          >
            Lung Test
          </Link>
        </div>
      </Container>
    </Section>
  );
}
