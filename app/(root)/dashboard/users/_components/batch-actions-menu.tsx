"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { deleteUser } from "../actions";
import { ConfirmBatchStatusDialog } from "./confirm-batch-status-dialog";

export type User = {
  id: string;
  name: string;
  email: string;
  disabled: boolean;
};

interface BatchActionsMenuProps {
  selectedUsers: User[];
  onActionComplete: () => void;
  disabled?: boolean;
}

export function BatchActionsMenu({
  selectedUsers,
  onActionComplete,
  disabled = false,
}: BatchActionsMenuProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [disable, setDisable] = useState(false);
  const [showConfirmStatus, setShowConfirmStatus] = useState(false);

  const handleBatchDelete = async () => {
    if (!selectedUsers.length) return;

    if (
      !confirm(
        `Êtes-vous sûr de vouloir supprimer ${selectedUsers.length} utilisateur(s) ? Cette action est irréversible.`
      )
    ) {
      return;
    }

    setIsLoading(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const user of selectedUsers) {
        const result = await deleteUser(user.id);
        if (result.success) {
          successCount++;
        } else {
          errorCount++;
          console.error(`Failed to delete user ${user.email}: ${result.error}`);
        }
      }

      if (successCount > 0) {
        toast.success(`${successCount} utilisateur(s) supprimé(s) avec succès`);
      }

      if (errorCount > 0) {
        toast.error(`Échec de la suppression de ${errorCount} utilisateur(s)`);
      }

      onActionComplete();
    } catch (error) {
      console.error(error);
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBatchStatusChange = async (disable: boolean) => {
    if (!selectedUsers.length) return;
    setDisable(disable);
    setShowConfirmStatus(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="ml-2"
            disabled={disabled || isLoading || selectedUsers.length < 2}
          >
            Actions
            <ChevronDown className="ml-2 w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => handleBatchStatusChange(true)}
            disabled={isLoading}
          >
            Désactiver {selectedUsers.length} comptes
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleBatchStatusChange(false)}
            disabled={isLoading}
          >
            Activer {selectedUsers.length} comptes
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleBatchDelete}
            disabled={isLoading}
            className="text-destructive"
          >
            <Trash className="mr-2 w-4 h-4" />
            Supprimer les utilisateurs
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {showConfirmStatus && (
        <ConfirmBatchStatusDialog
          isOpen={showConfirmStatus}
          disable={disable}
          onActionComplete={onActionComplete}
          onClose={() => setShowConfirmStatus(false)}
          selectedUsers={selectedUsers}
        />
      )}
    </>
  );
}
