"use client";

import { oAuthSignIn } from "@/app/(auth)/actions";
import { Github } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "../ui/button";

const SocialForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const loginWithGithub = async () => {
    setIsLoading(true);
  };

  const loginWithGoogle = async () => {};

  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          type="button"
          disabled={isLoading}
          onClick={async () => await oAuthSignIn("GITHUB")}
        >
          {isLoading ? (
            <span className="h-5 w-5 animate-spin" />
          ) : (
            <Github className="mr-2 h-4 w-4" />
          )}
          GitHub
        </Button>
        <Button
          variant="outline"
          type="button"
          disabled={isLoading}
          onClick={loginWithGoogle}
        >
          {isLoading ? (
            <span className="h-5 w-5 animate-spin" />
          ) : (
            <Image
              src="/google.svg"
              alt="Google"
              width={35}
              height={35}
              className="mr-2"
            />
          )}
          Google
        </Button>
      </div>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Ou continuer avec
          </span>
        </div>
      </div>
    </div>
  );
};

export default SocialForm;
