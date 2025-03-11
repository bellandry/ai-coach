"use client";

import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 text-white px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.09)_0%,_rgba(0,0,0,0.9)_100%)] pointer-events-none"></div>

      <div className="relative text-center">
        <h1 className="text-9xl font-extrabold tracking-widest relative text-gray-100 glitch">
          404
        </h1>
        <div className="glitch-layer glitch-blue">404</div>
        <div className="glitch-layer glitch-red">404</div>
      </div>

      <p className="text-2xl mt-6 font-semibold text-gray-300">
        Oups ! Page introuvable
      </p>
      <p className="text-gray-500 mt-2 text-center">
        Il semblerait que cette page n&apos;existe pas ou ait été déplacée.
      </p>

      <Link href="/">
        <button className="mt-8 px-6 py-3 bg-neutral-100 hover:bg-neutral-50 text-neutral-800 font-semibold rounded-lg transition-all hover:scale-105">
          Retour à l&apos;accueil
        </button>
      </Link>

      <style jsx>{`
        /* Création de l'effet glitch avec des calques décalés */
        .glitch {
          position: relative;
          display: inline-block;
        }

        .glitch-layer {
          position: absolute;
          top: 0;
          left: 0;
          opacity: 0.7;
          filter: blur(0.8px);
          animation: glitch-animation 1.5s infinite alternate ease-in-out;
        }

        .glitch-red {
          color: #ff0000;
          transform: translate(-4px, 2px);
        }

        .glitch-blue {
          color: #00ffff;
          transform: translateX(2px);
        }

        @keyframes glitch-animation {
          0% {
            transform: translate(0);
          }
          25% {
            transform: translateX(-1px);
          }
          50% {
            transform: translateX(1px);
          }
          75% {
            transform: translateX(-1px);
          }
          100% {
            transform: translate(0);
          }
        }
      `}</style>
    </div>
  );
}
