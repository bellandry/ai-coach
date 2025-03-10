"use client";

import { forgotPassword } from "@/app/(auth)/actions";
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

const formSchema = z.object({
  email: z.string().email("Adresse email invalide"),
});

export default function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await forgotPassword(values.email);
      setIsSubmitted(true);
      toast.success(
        "Si votre email existe dans notre base de données, vous recevrez un lien de réinitialisation"
      );
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
          Vérifiez votre email
        </h2>
        <p className="mb-6 max-w-sm text-muted-foreground">
          Si votre adresse email est associée à un compte, vous recevrez un lien
          pour réinitialiser votre mot de passe.
        </p>
        <Button asChild>
          <Link href="/sign-in">Retour à la connexion</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <h2 className="text-3xl font-bold tracking-tight">Mot de passe oublié</h2>
      <p className="mb-6 max-w-sm text-muted-foreground">
        Entrez votre adresse email et nous vous enverrons un lien pour
        réinitialiser votre mot de passe.
      </p>
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
          <div className="grid gap-2">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="size-4 animate-spin mr-2" />}
              Envoyer le lien de réinitialisation
            </Button>
            <div className="flex items-center justify-center text-sm text-muted-foreground">
              <Button asChild variant="link">
                <Link href="/sign-in">Retour à la connexion</Link>
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
