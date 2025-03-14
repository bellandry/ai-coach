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
import { deleteUser } from "../actions";

interface DeleteUserDialogProps {
  user: {
    id: string;
    name: string;
    email: string;
  };
  open: boolean;
  onClose: () => void;
}

export function DeleteUserDialog({
  user,
  open,
  onClose,
}: DeleteUserDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const result = await deleteUser(user.id);
      if (result.success) {
        toast.success("Utilisateur supprimé avec succès");
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
          <DialogTitle>Supprimer l&apos;utilisateur</DialogTitle>
          <DialogDescription>
            Vous êtes sur le point de supprimer définitivement l&apos;utilisateur{" "}
            {user.name} ({user.email}).
            <p className="mt-2 font-semibold text-destructive">
              Cette action est irréversible.
            </p>
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
            variant="destructive"
            className="sm:w-auto w-full"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Supprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}