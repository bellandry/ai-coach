"use client";

import { resetPassword } from "@/app/(auth)/actions";
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
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export default function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  if (!token) {
    router.push("/forgot-password");
    return;
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const result = await resetPassword({
        token: token as string,
        password: values.password,
      });

      if (result.success) {
        setIsSubmitted(true);
        toast.success("Votre mot de passe a été réinitialisé avec succès");
      } else {
        toast.error(result.error || "Une erreur est survenue");
      }
    } catch (error) {
      console.error(error);
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="grid gap-4">
        <h2 className="text-3xl font-bold tracking-tight">
          Mot de passe réinitialisé
        </h2>
        <p className="mb-6 max-w-sm text-muted-foreground">
          Votre mot de passe a été réinitialisé avec succès. Vous pouvez
          maintenant vous connecter avec votre nouveau mot de passe.
        </p>
        <Button asChild>
          <Link href="/sign-in">Se connecter</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <h2 className="text-3xl font-bold tracking-tight">
        Réinitialiser votre mot de passe
      </h2>
      <p className="mb-6 max-w-sm text-muted-foreground">
        Veuillez entrer votre nouveau mot de passe ci-dessous.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nouveau mot de passe</FormLabel>
                <FormControl>
                  <Input type="password" {...field} placeholder="••••••••" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmer le mot de passe</FormLabel>
                <FormControl>
                  <Input type="password" {...field} placeholder="••••••••" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid gap-2">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="size-4 animate-spin mr-2" />}
              Réinitialiser le mot de passe
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
