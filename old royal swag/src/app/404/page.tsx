import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center bg-parchment px-6 text-center">
      <p className="font-body text-sm uppercase tracking-widest text-on-surface-variant">
        404
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold text-primary">
        Page not found
      </h1>
      <p className="mt-3 max-w-md font-body text-on-surface-variant">
        The page you are looking for does not exist or may have been moved.
      </p>
      <Link href="/" className="btn-primary mt-8">
        Back to home
      </Link>
    </main>
  );
}
