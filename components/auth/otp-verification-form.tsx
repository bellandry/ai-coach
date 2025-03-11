"use client";

import { resendVerificationEmail, verifyEmail } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";

interface OtpVerificationFormProps {
  email: string;
}

export function OtpVerificationForm({ email }: OtpVerificationFormProps) {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleVerify = async () => {
    if (otp.length !== 6) return;

    setIsVerifying(true);
    try {
      const result = await verifyEmail(otp, email);
      if (result.success) {
        toast.success("Email vérifié avec succès");
        window.location.href = "/dashboard";
      } else {
        toast.error(result.error || "Code OTP invalide");
      }
    } catch (error) {
      console.error(error);
      toast.error("Une erreur est survenue");
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    if (otp.length === 6) {
      handleVerify();
    }
  }, [otp]);

  const handleResend = async () => {
    setIsResending(true);
    try {
      const result = await resendVerificationEmail(email);
      if (result.success) {
        toast.success("Un nouveau code a été envoyé à votre adresse email");
      } else {
        toast.error(result.error || "Erreur lors de l'envoi du code");
      }
    } catch (error) {
      console.error(error);
      toast.error("Une erreur est survenue");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="grid gap-4">
      <h2 className="text-3xl font-bold tracking-tight">
        Vérification de votre email
      </h2>
      <p className="mb-6 max-w-sm text-muted-foreground">
        Un code de vérification a été envoyé à{" "}
        <span className="font-semibold">{email}</span>. Veuillez entrer ce code
        pour vérifier votre compte.
      </p>
      <div className="w-full grid gap-4">
        <InputOTP
          maxLength={6}
          disabled={isVerifying}
          pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
          onChange={(value) => {
            setOtp(value);
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
          disabled={otp.length !== 6 || isVerifying}
        >
          {isVerifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Vérifier
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={handleResend}
          disabled={isResending}
        >
          {isResending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Renvoyer le code
        </Button>
      </div>
    </div>
  );
}
