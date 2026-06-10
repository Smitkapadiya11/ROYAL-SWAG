import Link from "next/link";
import { Container, Section } from "@/components/layout";

export default function NotFoundPage() {
  return (
    <Section bg="cream" className="flex min-h-[70vh] items-center">
      <Container className="text-center">
        <p className="font-body text-sm uppercase tracking-widest text-on-surface-variant">
          404
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-primary">
          Page not found
        </h1>
        <p className="mx-auto mt-3 max-w-md font-body text-on-surface-variant">
          The page you are looking for does not exist or may have been moved.
        </p>
        <Link href="/" className="btn-primary mt-8 inline-flex">
          Back to home
        </Link>
      </Container>
    </Section>
  );
}
