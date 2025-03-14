"use client";

import { sendMagicLink } from "@/app/(auth)/actions";
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

export function MagicLinkForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const result = await sendMagicLink(values.email);

      if (result.success) {
        setEmailSent(true);
        toast.success(
          "Un lien de connexion a été envoyé à votre adresse email"
        );
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

  if (emailSent) {
    return (
      <div className="grid gap-4">
        <h2 className="text-3xl font-bold tracking-tight">
          Vérifiez votre email
        </h2>
        <p className="max-w-sm mb-6 text-muted-foreground">
          Un lien de connexion a été envoyé à votre adresse email. Veuillez
          vérifier votre boîte de réception et cliquer sur le lien pour vous
          connecter.
        </p>
        <Button
          className="w-full"
          onClick={() => setEmailSent(false)}
          variant="outline"
        >
          Renvoyer un lien
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <h2 className="text-3xl font-bold tracking-tight">
        Connexion sans mot de passe
      </h2>
      <p className="max-w-sm mb-6 text-muted-foreground">
        Entrez votre adresse email pour recevoir un lien de connexion.
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
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Recevoir un lien de connexion
          </Button>
        </form>
      </Form>
      <Button asChild variant="link">
        <Link href="/sign-in">Retour à la connexion</Link>
      </Button>
    </div>
  );
}
