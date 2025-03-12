"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserRole } from "@prisma/client";
import { format } from "date-fns";
import { Check, MoreHorizontal, Shield, X } from "lucide-react";
import { useState } from "react";
import { UpdateUserRoleDialog } from "./update-user-role-dialog";
import { UpdateUserStatusDialog } from "./update-user-status-dialog";
import { CreateUserDialog } from "./create-user-dialog";

type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role: UserRole;
  disabled: boolean;
  createdAt: Date;
};

interface UsersTableProps {
  users: User[];
}

export function UsersTable({ users }: UsersTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <input
          type="text"
          placeholder="Rechercher un utilisateur..."
          className="px-3 py-2 border rounded-md w-full max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button
          onClick={() => setShowCreateDialog(true)}
          className="ml-4"
        >
          Créer un utilisateur
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Vérifié</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date de création</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6">
                  Aucun utilisateur trouvé
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.emailVerified ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <X className="h-5 w-5 text-red-500" />
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {user.role === "ADMIN" ? (
                        <Shield className="h-4 w-4 text-primary" />
                      ) : null}
                      {user.role}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${user.disabled ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}
                    >
                      {user.disabled ? "Désactivé" : "Actif"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {format(new Date(user.createdAt), "dd MMMM yyyy")}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Ouvrir le menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedUser(user);
                            setShowRoleDialog(true);
                          }}
                        >
                          Modifier le rôle
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedUser(user);
                            setShowStatusDialog(true);
                          }}
                        >
                          {user.disabled ? "Activer" : "Désactiver"} le compte
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedUser && (
        <>
          <UpdateUserRoleDialog
            user={selectedUser}
            open={showRoleDialog}
            onClose={() => {
              setShowRoleDialog(false);
              setSelectedUser(null);
            }}
          />
          <UpdateUserStatusDialog
            user={selectedUser}
            open={showStatusDialog}
            onClose={() => {
              setShowStatusDialog(false);
              setSelectedUser(null);
            }}
          />
        </>
      )}
      
      <CreateUserDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
      />
    </div>
  );
}
