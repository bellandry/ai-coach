"use client";

import { updateUserPassword } from "@/app/(root)/dashboard/profile/actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const passwordFormSchema = z
  .object({
    currentPassword: z.string().optional(),
    newPassword: z.string().min(8, {
      message: "Le mot de passe doit contenir au moins 8 caractères.",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

interface PasswordFormProps {
  hasPassword: boolean;
}

export function PasswordForm({ hasPassword }: PasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: PasswordFormValues) {
    setIsLoading(true);
    try {
      const result = await updateUserPassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      if (result.success) {
        toast.success(
          hasPassword
            ? "Mot de passe mis à jour avec succès"
            : "Mot de passe défini avec succès"
        );
        form.reset();
      } else {
        toast.error(
          result.error || "Erreur lors de la mise à jour du mot de passe"
        );
      }
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du mot de passe");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
        {hasPassword && (
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mot de passe actuel</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Votre mot de passe actuel"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {hasPassword ? "Nouveau mot de passe" : "Mot de passe"}
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Minimum 8 caractères"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Utilisez au moins 8 caractères avec un mélange de lettres,
                chiffres et symboles.
              </FormDescription>
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
                <Input
                  type="password"
                  placeholder="Confirmez votre mot de passe"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {hasPassword
              ? "Mettre à jour le mot de passe"
              : "Définir un mot de passe"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
