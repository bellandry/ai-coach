"use client";

import {
  connectProvider,
  disconnectProvider,
} from "@/app/(root)/dashboard/profile/actions";
import { UserType } from "@/components/app-sidebar";
import { OAuthProvider } from "@prisma/client";
import { Github } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { ProviderCard } from "./provider-card";

interface ProfileProvidersProps {
  user: UserType & { oAuthAccounts?: { provider: OAuthProvider }[] };
}

export function ProfileProviders({ user }: ProfileProvidersProps) {
  const [isLoading, setIsLoading] = useState<OAuthProvider | null>(null);

  const connectedProviders = user.oAuthAccounts?.map((a) => a.provider) || [];

  const handleConnect = async (provider: OAuthProvider) => {
    setIsLoading(provider);
    try {
      await connectProvider(provider);
    } catch (error) {
      toast.error(`Erreur lors de la connexion à ${provider}`);
      console.error(error);
      setIsLoading(null);
    }
  };

  const handleDisconnect = async (provider: OAuthProvider) => {
    setIsLoading(provider);
    try {
      await disconnectProvider(provider);
      toast.success(`${provider} déconnecté avec succès`);
      setIsLoading(null);
    } catch (error) {
      toast.error(`Erreur lors de la déconnexion de ${provider}`);
      console.error(error);
      setIsLoading(null);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <ProviderCard
        provider="github"
        title="GitHub"
        description="Connectez-vous avec votre compte GitHub"
        icon={<Github className="h-6 w-6" />}
        isConnected={connectedProviders.includes("github")}
        isLoading={isLoading === "github"}
        onConnect={() => handleConnect("github")}
        onDisconnect={() => handleDisconnect("github")}
      />

      <ProviderCard
        provider="google"
        title="Google"
        description="Connectez-vous avec votre compte Google"
        icon={
          <Image src="/google.svg" alt="Google Logo" width={24} height={24} />
        }
        isConnected={connectedProviders.includes("google")}
        isLoading={isLoading === "google"}
        onConnect={() => handleConnect("google")}
        onDisconnect={() => handleDisconnect("google")}
      />

      <ProviderCard
        provider="discord"
        title="Discord"
        description="Connectez-vous avec votre compte Discord"
        icon={
          <Image src="/discord.svg" alt="Discord Logo" width={24} height={24} />
        }
        isConnected={connectedProviders.includes("discord")}
        isLoading={isLoading === "discord"}
        onConnect={() => handleConnect("discord")}
        onDisconnect={() => handleDisconnect("discord")}
      />
    </div>
  );
}
