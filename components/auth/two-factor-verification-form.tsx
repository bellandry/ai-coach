"use client";

import { verify2FA } from "@/app/(auth)/actions";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";

export function TwoFactorVerificationForm() {
  const [token, setToken] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    if (token.length !== 6) return;

    setIsVerifying(true);
    try {
      const result = await verify2FA(token);
      if (result.success) {
        toast.success("Authentification réussie");
        window.location.href = "/dashboard";
      } else {
        toast.error(result.error || "Code invalide");
      }
    } catch (error) {
      console.error(error);
      toast.error("Une erreur est survenue");
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    if (token.length === 6) {
      handleVerify();
    }
  }, [token]);

  return (
    <div className="grid gap-4">
      <h2 className="text-3xl font-bold tracking-tight">
        Authentification à deux facteurs
      </h2>
      <p className="mb-6 max-w-sm text-muted-foreground">
        Veuillez entrer le code généré par votre application
        d&apos;authentification.
      </p>
      <div className="grid gap-4 w-full">
        <InputOTP
          maxLength={6}
          disabled={isVerifying}
          pattern={REGEXP_ONLY_DIGITS}
          onChange={(value) => {
            setToken(value);
          }}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        <Button
          className="w-full"
          onClick={handleVerify}
          disabled={token.length !== 6 || isVerifying}
        >
          {isVerifying && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
          Vérifier
        </Button>
      </div>
    </div>
  );
}
