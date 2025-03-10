"use client";

import {
  disableTwoFactorAuth,
  enableTwoFactorAuth,
  verifyTwoFactorCode,
} from "@/app/(root)/dashboard/profile/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

interface TwoFactorAuthProps {
  enabled: boolean;
}

export function TwoFactorAuth({ enabled: initialEnabled }: TwoFactorAuthProps) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [isLoading, setIsLoading] = useState(false);
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | undefined>();
  const [secret, setSecret] = useState<string | undefined>();
  const [verificationCode, setVerificationCode] = useState("");

  const handleToggle = async (checked: boolean) => {
    if (checked === enabled) return;

    setIsLoading(true);
    try {
      if (checked) {
        // Activer 2FA
        const result = await enableTwoFactorAuth();
        if (result.success) {
          setQrCodeUrl(result.qrCodeUrl);
          setSecret(result.secret);
          setShowVerifyDialog(true);
        } else {
          toast.error(
            "Erreur lors de l'activation de l'authentification à deux facteurs"
          );
        }
      } else {
        // Désactiver 2FA
        const result = await disableTwoFactorAuth();
        if (result.success) {
          setEnabled(false);
          toast.success("Authentification à deux facteurs désactivée");
        } else {
          toast.error(
            "Erreur lors de la désactivation de l'authentification à deux facteurs"
          );
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!secret) return;

    setIsLoading(true);
    try {
      const result = await verifyTwoFactorCode({
        secret,
        token: verificationCode,
      });

      if (result.success) {
        setEnabled(true);
        setShowVerifyDialog(false);
        toast.success("Authentification à deux facteurs activée");
      } else {
        toast.error("Code de vérification incorrect");
      }
    } catch (error) {
      console.error(error);
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    if (showVerifyDialog) {
      // Annuler l'activation en cours
      await disableTwoFactorAuth();
    }
    setShowVerifyDialog(false);
  };

  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="space-y-0.5">
        <Label className="text-base">Authentification à deux facteurs</Label>
        <p className="text-sm text-muted-foreground">
          Ajoutez une couche de sécurité supplémentaire à votre compte en
          exigeant un code à usage unique à chaque connexion.
        </p>
      </div>
      <Switch
        checked={enabled}
        onCheckedChange={handleToggle}
        disabled={isLoading}
      />

      <Dialog open={showVerifyDialog} onOpenChange={setShowVerifyDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Configurer l'authentification à deux facteurs
            </DialogTitle>
            <DialogDescription>
              Scannez le code QR ci-dessous avec votre application
              d'authentification (Google Authenticator, Authy, etc.) puis entrez
              le code à 6 chiffres généré.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center py-4">
            {qrCodeUrl && (
              <div className="mb-4 p-2 border rounded-lg bg-white">
                <Image
                  src={qrCodeUrl}
                  alt="QR Code pour l'authentification à deux facteurs"
                  width={200}
                  height={200}
                />
              </div>
            )}
            {secret && (
              <div className="mb-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">
                  Si vous ne pouvez pas scanner le code QR, entrez ce code
                  secret dans votre application:
                </p>
                <code className="bg-muted p-2 rounded text-sm font-mono">
                  {secret}
                </code>
              </div>
            )}
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="verification-code">Code de vérification</Label>
              <Input
                id="verification-code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                placeholder="123456"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="flex space-x-2 sm:justify-end">
            <Button variant="outline" onClick={handleCancel}>
              Annuler
            </Button>
            <Button
              type="submit"
              onClick={handleVerify}
              disabled={isLoading || verificationCode.length !== 6}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Vérifier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
