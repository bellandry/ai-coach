"use client";

import { Button } from "@/components/ui/button";
import { OAuthProvider } from "@prisma/client";
import { Loader2 } from "lucide-react";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface ProviderCardProps {
  provider: OAuthProvider;
  title: string;
  description: string;
  icon: React.ReactNode;
  isConnected: boolean;
  isLoading: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function ProviderCard({
  title,
  description,
  icon,
  isConnected,
  isLoading,
  onConnect,
  onDisconnect,
}: ProviderCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border">
          {icon}
        </div>
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          {isConnected
            ? `Votre compte est connecté à ${title}`
            : `Connectez votre compte à ${title} pour vous connecter plus facilement`}
        </p>
      </CardContent>
      <CardFooter>
        {isConnected ? (
          <Button
            variant="outline"
            className="w-full"
            onClick={onDisconnect}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Déconnecter
          </Button>
        ) : (
          <Button className="w-full" onClick={onConnect} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Connecter
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
