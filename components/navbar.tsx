"use client";

import { logOut } from "@/app/(auth)/actions";
import { getRoleBasedRedirectPath } from "@/lib/role-redirection";
import { UserRole } from "@prisma/client";
import { CircuitBoardIcon, LogOut, User2 } from "lucide-react";
import Link from "next/link";
import { UserType } from "./app-sidebar";
import { Logo } from "./logo";
import { ToggleTheme } from "./toggle-theme";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export const Navbar = ({ user }: { user: UserType | undefined }) => {
  return (
    <div className="w-full fixed z-50 top-0 items-center backdrop-blur-sm border-b dark:border-slate-900 flex py-1 px-4">
      <nav className="container mx-auto flex items-center justify-between">
        <Logo />
        <div className="flex gap-2 items-center">
          <ToggleTheme />
          {!user ? (
            <Button variant={"outline"} asChild>
              <Link href="/sign-in">
                <LogOut className="size-4 mr-2" />
                Me connecter
              </Link>
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex gap-2 cursor-pointer text-white items-center">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.profile!} alt={user.name} />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="min-w-44 z-50">
                <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link
                    href={getRoleBasedRedirectPath(user.role as UserRole)}
                    className="flex gap-2 items-center"
                  >
                    <CircuitBoardIcon />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href={`${getRoleBasedRedirectPath(
                      user.role as UserRole
                    )}/profile`}
                    className="flex gap-2 items-center"
                  >
                    <User2 />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={async () => logOut()}>
                  <LogOut className="rotate-180" />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </nav>
    </div>
  );
};
