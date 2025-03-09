"use client";

import { signIn } from "@/app/(auth)/actions";
import { signInSchema } from "@/lib/definitions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import SocialForm from "./social-form";

type SignInFormValues = z.infer<typeof signInSchema>;

const SignInForm = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: SignInFormValues) {
    setLoading(true);
    const error = await signIn(data);
    toast.error(error);
    setLoading(false);
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
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="size-4 animate-spin" />}
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
};

export default SignInForm;
