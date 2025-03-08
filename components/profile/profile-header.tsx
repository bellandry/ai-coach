"use client";

import { UserType } from "@/components/app-sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { initials } from "@/lib/user-helper";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ProfileHeaderProps {
  user: UserType;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col gap-6">
      <Button variant="ghost" size="sm" asChild className="w-fit">
        <Link href="/dashboard" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Retour au tableau de bord
        </Link>
      </Button>

      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user.profile || ""} alt={user.name} />
          <AvatarFallback className="text-lg">
            {initials(user.name)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
      </div>
    </div>
  );
}
