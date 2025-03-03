"use client";

import { motion } from "framer-motion";
import { StarsIcon } from "lucide-react";
import { Spotlight } from "./spotlight";
import { Button } from "./ui/button";
import { SplineScene } from "./ui/splite";

const Hero = () => {
  return (
    <div className="w-full h-[calc(100vh-100px)] mt-[100px] relative overflow-hidden container mx-auto">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20 z-20"
        size={200}
      />
      <div className="flex h-full flex-col md:flex-row gap-6">
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
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-bl from-neutral-900 dark:from-neutral-50 to-neutral-600 dark:to-neutral-500">
            AI Coach – Votre allié intelligent pour décrocher le job de vos
            rêves !
          </h1>
          <p className="text-neutral-800 dark:text-neutral-300 max-w-lg text-sm md:text-md">
            Optimisez votre CV, entraînez-vous aux entretiens et gérez vos
            tâches efficacement. AI Coach vous accompagne à chaque étape du
            recrutement et de l’apprentissage.
          </p>
          <Button className="w-fit">
            <StarsIcon className="size-4 mr-2" /> Essayez gratuitement
          </Button>
        </motion.div>

        <div className="flex-1 relative">
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full drop-shadow-[0_0_20px_rgba(0,0,0,245)] dark:drop-shadow-[0_0_20px_rgba(245,245,245,245)]"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
