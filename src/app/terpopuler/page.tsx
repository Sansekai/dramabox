import { Suspense } from "react";
import TerpopulerContent from "./content";

export const dynamic = "force-dynamic";

export default function TerpopulerPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-24 flex items-center justify-center"><div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
      <TerpopulerContent />
    </Suspense>
  );
}
