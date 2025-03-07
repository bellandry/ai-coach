"use client";

import { oAuthSignIn } from "@/app/(auth)/actions";
import { Github } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "../ui/button";

const SocialForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-3 gap-4">
        <Button
          variant="outline"
          type="button"
          disabled={isLoading}
          onClick={async () => {
            setIsLoading(true);
            await oAuthSignIn("github");
            setIsLoading(false);
          }}
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
          onClick={async () => {
            setIsLoading(true);
            await oAuthSignIn("google");
            setIsLoading(false);
          }}
        >
          {isLoading ? (
            <span className="h-5 w-5 animate-spin" />
          ) : (
            <Image src="/google.svg" alt="Google Logo" width={35} height={35} />
          )}
          Google
        </Button>
        <Button
          variant="outline"
          type="button"
          disabled={isLoading}
          onClick={async () => {
            setIsLoading(true);
            await oAuthSignIn("discord");
            setIsLoading(false);
          }}
        >
          {isLoading ? (
            <span className="h-5 w-5 animate-spin" />
          ) : (
            <Image
              src="/discord.svg"
              alt="Discord Logo"
              width={16}
              height={16}
              className="mr-2"
            />
          )}
          Discord
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
