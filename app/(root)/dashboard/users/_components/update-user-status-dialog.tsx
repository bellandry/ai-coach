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
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { updateUserStatus } from "../actions";

interface UpdateUserStatusDialogProps {
  user: {
    id: string;
    name: string;
    email: string;
    disabled: boolean;
  };
  open: boolean;
  onClose: () => void;
}

export function UpdateUserStatusDialog({
  user,
  open,
  onClose,
}: UpdateUserStatusDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const result = await updateUserStatus(user.id, !user.disabled);
      if (result.success) {
        toast.success(
          `Compte ${user.disabled ? "activé" : "désactivé"} avec succès`
        );
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
          <DialogTitle>
            {user.disabled ? "Activer" : "Désactiver"} le compte utilisateur
          </DialogTitle>
          <DialogDescription>
            Vous êtes sur le point de {user.disabled ? "activer" : "désactiver"}{" "}
            le compte de {user.name} ({user.email}).
            {!user.disabled &&
              " L'utilisateur ne pourra plus se connecter à la plateforme."}
          </DialogDescription>
        </DialogHeader>
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
            variant={user.disabled ? "default" : "destructive"}
            className="sm:w-auto w-full"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {user.disabled ? "Activer" : "Désactiver"} le compte
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
