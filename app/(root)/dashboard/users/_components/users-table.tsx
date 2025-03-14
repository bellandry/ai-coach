"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Check, MoreHorizontal, Shield, Trash, X } from "lucide-react";
import { useState } from "react";
import { BatchActionsMenu } from "./batch-actions-menu";
import { CreateUserDialog } from "./create-user-dialog";
import { DeleteUserDialog } from "./delete-user-dialog";
import { UpdateUserRoleDialog } from "./update-user-role-dialog";
import { UpdateUserStatusDialog } from "./update-user-status-dialog";

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
  // const [isLoading, setIsLoading] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  // Function to handle checkbox selection
  const toggleUserSelection = (user: User) => {
    if (selectedUsers.some((u) => u.id === user.id)) {
      setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  // Function to handle "select all" checkbox
  const toggleAllSelection = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers([...filteredUsers]);
    }
  };

  // Reset selections after batch actions
  const resetSelections = () => {
    setSelectedUsers([]);
    window.location.reload();
  };

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Rechercher un utilisateur..."
            className="px-3 py-2 w-full max-w-sm rounded-md border"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <BatchActionsMenu
            selectedUsers={selectedUsers}
            onActionComplete={resetSelections}
            // disabled={isLoading}
          />
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="ml-4">
          Créer un utilisateur
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={
                    selectedUsers.length === filteredUsers.length &&
                    filteredUsers.length > 0
                  }
                  onCheckedChange={toggleAllSelection}
                  aria-label="Select all users"
                />
              </TableHead>
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
                <TableCell colSpan={7} className="py-6 text-center">
                  Aucun utilisateur trouvé
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedUsers.some((u) => u.id === user.id)}
                      onCheckedChange={() => toggleUserSelection(user)}
                      aria-label={`Select ${user.name}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.emailVerified ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <X className="w-5 h-5 text-red-500" />
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 items-center">
                      {user.role === "ADMIN" ? (
                        <Shield className="w-4 h-4 text-primary" />
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
                        <Button variant="ghost" className="p-0 w-8 h-8">
                          <span className="sr-only">Ouvrir le menu</span>
                          <MoreHorizontal className="w-4 h-4" />
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
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedUser(user);
                            setShowDeleteDialog(true);
                          }}
                          className="text-destructive"
                        >
                          <Trash className="mr-2 w-4 h-4" />
                          Supprimer l&apos;utilisateur
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
          <DeleteUserDialog
            user={selectedUser}
            open={showDeleteDialog}
            onClose={() => {
              setShowDeleteDialog(false);
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
