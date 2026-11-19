import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-rose-50 p-8 text-center">
      <h1 className="font-serif text-4xl font-bold text-rose-700">Beloved</h1>
      <p className="text-rose-500">Your destination for romantic gifts.</p>
      <Link
        href="/romantic"
        className="rounded-full bg-rose-500 px-8 py-3 font-semibold text-white shadow hover:bg-rose-600 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
      >
        Shop Romantic Collection ♥
      </Link>
    </main>
  );
}
