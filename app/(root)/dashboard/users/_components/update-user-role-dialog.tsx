"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRole } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { updateUserRole } from "../actions";

interface UpdateUserRoleDialogProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
  open: boolean;
  onClose: () => void;
}

export function UpdateUserRoleDialog({
  user,
  open,
  onClose,
}: UpdateUserRoleDialogProps) {
  const [role, setRole] = useState<UserRole>(user.role);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (role === user.role) {
      onClose();
      return;
    }

    setIsLoading(true);
    try {
      const result = await updateUserRole(user.id, role);
      if (result.success) {
        toast.success("Rôle mis à jour avec succès");
        // Refresh the page to show updated data
        window.location.reload();
      } else {
        toast.error(result.error || "Une erreur est survenue");
      }
    } catch (error) {
      console.error(error);
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier le rôle de l'utilisateur</DialogTitle>
          <DialogDescription>
            Vous êtes sur le point de modifier le rôle de {user.name} (
            {user.email}).
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Select
            value={role}
            onValueChange={(value) => setRole(value as UserRole)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un rôle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USER">Utilisateur</SelectItem>
              <SelectItem value="ADMIN">Administrateur</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            className="sm:w-auto w-full"
            onClick={onClose}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button
            className="sm:w-auto w-full"
            onClick={handleSubmit}
            disabled={isLoading || role === user.role}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirmer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
