"use client";

import { signUp } from "@/app/(auth)/actions";
import { signUpSchema } from "@/lib/definitions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { OtpVerificationForm } from "./otp-verification-form";
import SocialForm from "./social-form";

const SignUpForm = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [requiresVerification, setRequiresVerification] = useState(false);
  const [email, setEmail] = useState("");

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      terms: false,
    },
  });

  async function onSubmit(data: z.infer<typeof signUpSchema>) {
    setLoading(true);
    try {
      const result = await signUp(data);

      if (result.success && result.requiresVerification) {
        setEmail(data.email);
        setRequiresVerification(true);
        toast.info(result.error || "Vérification d'email requise");
      }
    } catch (error) {
      console.error(error);
      toast.error("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }

  // Afficher le formulaire de vérification OTP si nécessaire
  if (requiresVerification) {
    return <OtpVerificationForm email={email} />;
  }

  return (
    <div className="grid gap-4">
      <h2 className="text-3xl font-bold tracking-tight">Créer un compte</h2>
      <p className="mb-6 max-w-sm text-muted-foreground">
        Rejoignez AI Coach pour faire passer votre carrière au niveau supérieur.
      </p>
      <SocialForm />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom complet</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    placeholder="Ex: Bella Landry"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                  <div>
                    <Input
                      type="password"
                      {...field}
                      placeholder="••••••••"
                      autoComplete="new-password"
                    />
                    <p className="text-muted-foreground text-xs mt-1.5">
                      Minimum 8 caractères avec lettres, chiffres et caractères
                      spéciaux
                    </p>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem className="flex items-center">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="ml-2 text-sm font-normal leading-snug">
                  <p>
                    J&apos;accepte les{" "}
                    <Link href="/terms" className="text-primary underline">
                      conditions d&apos;utilisation
                    </Link>{" "}
                    et la{" "}
                    <Link href="/privacy" className="text-primary underline">
                      politique de confidentialité
                    </Link>
                  </p>
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="size-4 animate-spin" />}
              Créer mon compte
            </Button>
            <div className="flex text-sm text-muted-foreground items-center justify-center">
              Vous avez déjà un compte ?{" "}
              <Button asChild variant="link">
                <Link href="/sign-in">Se connecter</Link>
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SignUpForm;
