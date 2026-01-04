import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-6xl font-bold font-display gradient-text mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-foreground mb-2">Halaman Tidak Ditemukan</h2>
      <p className="text-muted-foreground mb-8 text-center max-w-md">
        Maaf, halaman yang kamu cari tidak ada atau telah dipindahkan.
      </p>
      <Link
        href="/"
        className="px-8 py-3 rounded-full font-semibold text-primary-foreground transition-all hover:scale-105 shadow-lg"
        style={{ background: "var(--gradient-primary)" }}
      >
        Kembali ke Beranda
      </Link>
    </main>
  );
}
