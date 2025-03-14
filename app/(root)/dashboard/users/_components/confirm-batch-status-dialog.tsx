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
import { User } from "./batch-actions-menu";

interface ConfirmationDialogProps {
  isOpen: boolean;
  disable: boolean;
  onActionComplete: () => void;
  onClose: () => void;
  selectedUsers: User[];
}

export const ConfirmBatchStatusDialog = ({
  isOpen,
  onActionComplete,
  selectedUsers,
  onClose,
  disable,
}: ConfirmationDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  if (!isOpen) return null;

  const handleBatchStatusChangeConfirmed = async () => {
    setIsLoading(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const user of selectedUsers) {
        if (user.disabled === disable) continue;

        const result = await updateUserStatus(user.id, disable);
        if (result.success) {
          successCount++;
        } else {
          errorCount++;
          console.error(
            `Failed to ${disable ? "désactiver" : "activer"} user ${user.email}: ${result.error}`
          );
        }
      }

      if (successCount > 0) {
        toast.success(
          `${successCount} utilisateur(s) ${disable ? "désactivé(s)" : "activé(s)"} avec succès`
        );
      }

      if (errorCount > 0) {
        toast.error(
          `Échec de ${disable ? "désactiver" : "activer"} ${errorCount} utilisateur(s)`
        );
      }

      onActionComplete();
    } catch (error) {
      console.error(error);
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  const action = disable ? "désactiver" : "activer";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Supprimer l&apos;utilisateur</DialogTitle>
          <DialogDescription>
            Cous êtes dur le point de vouloir {action} {selectedUsers.length}{" "}
            utilisateur(s) ?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={onClose}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            className="w-full sm:w-auto"
            onClick={handleBatchStatusChangeConfirmed}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Confirmer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
