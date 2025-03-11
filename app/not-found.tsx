"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="relative">
        <h1 className="text-6xl md:text-9xl font-extrabold tracking-widest ">
          404
        </h1>
        <div className="absolute top-0 left-0 w-full h-full bg-red-500 mix-blend-overlay animate-glitch" />
      </div>

      <p className="text-2xl mt-6 font-semibold">Oups ! Page introuvable</p>
      <p className="text-gray-500 mt-2">
        Il semblerait que cette page n'existe pas ou ait été déplacée.
      </p>

      <Button size="lg" asChild className="my-4">
        <Link href="/">Retour à l'accueil</Link>
      </Button>

      <style jsx>{`
        @keyframes glitch {
          0% {
            transform: translate(0);
          }
          20% {
            transform: translate(-2px, 2px);
          }
          40% {
            transform: translate(2px, -2px);
          }
          60% {
            transform: translate(-2px, -2px);
          }
          80% {
            transform: translate(2px, 2px);
          }
          100% {
            transform: translate(0);
          }
        }
        .glitch {
          position: relative;
          animation: glitch 0.8s infinite linear alternate;
        }
        .animate-glitch {
          animation: glitch 0.8s infinite linear alternate;
          opacity: 0.6;
        }
      `}</style>
    </div>
  );
}
