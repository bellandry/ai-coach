"use client";

import { verifyMagicLink } from "@/app/(auth)/actions";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export const ConfirmMagicLink = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      router.push("/sign-in");
      return;
    }
    const confirmLink = async () => {
      try {
        const result = await verifyMagicLink(token);
        if (result.success) {
          router.push("/dashboard");
        } else {
          toast.error("Lien invalide ou expiré");
          router.push("/sign-in/magic-link?error=invalid-magic-link");
        }
      } catch (error) {
        toast.error(`Error verifying magic link: ${error}`);
        router.push("/sign-in?error=server-error");
      }
    };
    confirmLink();
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <Loader2 className="animate-spin size-8" />
      <p className="text-muted-foreground">Connexion en cours</p>
    </div>
  );
};
