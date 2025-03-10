"use client";

import { signIn } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { OtpVerificationForm } from "./otp-verification-form";
import SocialForm from "./social-form";
import { TwoFactorVerificationForm } from "./two-factor-verification-form";

const formSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

export default function SignInForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [requiresVerification, setRequiresVerification] = useState(false);
  const [requires2FA, setRequires2FA] = useState(false);
  const [email, setEmail] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const result = await signIn(values);

      if (result.success) {
        toast.success("Connexion réussie");
        window.location.href = "/dashboard";
      } else if (result.requiresVerification) {
        setEmail(values.email);
        setRequiresVerification(true);
        toast.info(result.error || "Vérification d'email requise");
      } else if (result.requires2FA) {
        setRequires2FA(true);
        toast.info("Authentification à deux facteurs requise");
      } else {
        toast.error(result.error || "Échec de la connexion");
      }
    } catch (error) {
      console.error(error);
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  }

  // Afficher le formulaire de vérification OTP si nécessaire
  if (requiresVerification) {
    return <OtpVerificationForm email={email} />;
  }

  // Afficher le formulaire de vérification 2FA si nécessaire
  if (requires2FA) {
    return <TwoFactorVerificationForm />;
  }

  return (
    <div className="grid gap-4">
      <h2 className="text-3xl font-bold tracking-tight">Connexion</h2>
      <p className="mb-6 max-w-sm text-muted-foreground">
        Bienvenue sur AI Coach. Veuillez vous connecter pour continuer.
      </p>
      <SocialForm />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    {...field}
                    placeholder="Ex: landry@laclass.dev"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mot de passe</FormLabel>
                <FormControl>
                  <Input type="password" {...field} placeholder="••••••••" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid gap-2">
            <div className="flex justify-end">
              <Button asChild variant="link" size="sm">
                <Link href="/forgot-password">Mot de passe oublié ?</Link>
              </Button>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="size-4 animate-spin" />}
              Me Connecter
            </Button>
            <div className="flex items-center justify-center text-sm text-muted-foreground">
              Vous n&apos;avez pas de compte?
              <Button asChild variant="link">
                <Link href="/sign-up">S&apos;inscrire</Link>
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
