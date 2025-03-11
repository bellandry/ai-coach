"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ChevronRight, StarsIcon } from "lucide-react";
import Link from "next/link";
import { AnimatedGradientText } from "./magicui/animated-gradient-text";
import { Button } from "./ui/button";
import { SplineScene } from "./ui/splite";

export const Hero = () => {
  return (
    <section className="h-[calc(100vh-100px)] mt-[100px] max-h-[800px] overflow-hidden container mx-auto">
      <div className="flex h-full w-full flex-col md:flex-row gap-6">
        <motion.div
          initial={{ opacity: 0.0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="px-4 flex-1 gap-6 p-8 relative z-10 flex flex-col justify-center"
        >
          <div className="group relative w-fit flex items-center justify-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f] ">
            <span
              className={cn(
                "absolute inset-0 block h-full w-full animate-gradient rounded-[inherit] bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:300%_100%] p-[1px]"
              )}
              style={{
                WebkitMask:
                  "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "destination-out",
                mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                maskComposite: "subtract",
                WebkitClipPath: "padding-box",
              }}
            />
            🤖 <hr className="mx-2 h-4 w-px shrink-0 bg-neutral-500" />
            <AnimatedGradientText className="text-sm font-medium">
              Bienvenu sur Ai Coach
            </AnimatedGradientText>
            <ChevronRight
              className="ml-1 size-4 stroke-neutral-500 transition-transform
 duration-300 ease-in-out group-hover:translate-x-0.5"
            />
          </div>
          <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-bl from-neutral-900 dark:from-neutral-50 to-neutral-600 dark:to-neutral-500">
            Votre allié intelligent pour booster votre carrière
          </h1>
          <p className="text-neutral-800 dark:text-neutral-300 max-w-lg text-sm md:text-md lg:text-lg">
            Optimisez votre CV, entraînez-vous aux entretiens et gérez vos
            tâches efficacement. AI Coach vous accompagne à chaque étape du
            recrutement et de l&apos;apprentissage.
          </p>
          <Button size="lg" asChild>
            <Link href="/sign-up" className="w-fit gap-2">
              <StarsIcon className="size-4 mr-2" /> Commencer gratuitement
            </Link>
          </Button>
        </motion.div>

        <div className="flex-1 relative">
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full drop-shadow-[0_0_30px_rgba(75,0,130,0.4)]"
          />
        </div>
      </div>
    </section>
  );
};
