"use client";

import { signIn } from "@/app/(auth)/actions";
import { signInSchema } from "@/lib/definitions";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
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

const SignInForm = () => {
  const [error, setError] = useState<string>();
  const form = useForm<z.infer<typeof signInSchema>>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof signInSchema>) {
    const error = await signIn(data);
    setError(error);
  }

  return (
    <div className="grid gap-4">
      <SocialForm />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {error && <p className="text-destructive">{error}</p>}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid gap-4">
            <Button type="submit" className="w-full">
              Me Connecter
            </Button>
            <div className="flex gap-2 items-center justify-end">
              Pas encore de compte ?
              <Button asChild variant="link">
                <Link href="/sign-up">Créer mon compte</Link>
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SignInForm;
