"use client";

import { signUp } from "@/app/(auth)/actions";
import { signUpSchema } from "@/lib/definitions";
import { Loader2 } from "lucide-react";
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

const SignUpForm = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof signUpSchema>>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof signUpSchema>) {
    setLoading(true);
    const error = await signUp(data);
    setError(error);
    setLoading(false);
  }

  return (
    <div className="grid gap-4">
      <SocialForm />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {error && <p className="text-destructive">{error}</p>}
          {/* <div className="flex gap-4">
          <Button
            type="button"
            onClick={async () => await oAuthSignIn("discord")}
          >
            Discord
          </Button>
          <Button
            type="button"
            onClick={async () => await oAuthSignIn("github")}
          >
            GitHub
          </Button>
        </div> */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
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
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="size-4 animate-spin" />}
              Créer mon compte
            </Button>
            <div className="flex gap-2 items-center justify-end">
              Vous avez déjà un compte ?
              <Button asChild variant="link">
                <Link href="/sign-up">Se connecter</Link>
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SignUpForm;
