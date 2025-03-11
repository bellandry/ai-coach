"use client";

import { resendVerificationEmail } from "@/app/(auth)/actions";
import { updateUserProfile } from "@/app/(root)/dashboard/profile/actions";
import { UserType } from "@/components/app-sidebar";
import { Badge } from "@/components/ui/badge";
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
import { Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { ProfileEmailVerification } from "./email-verification";
import { ProfileImageUpload } from "./profile-image-upload";

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  email: z.string().email({
    message: "Veuillez entrer une adresse email valide.",
  }),
  profileImage: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  user: UserType & {
    emailVerified?: boolean;
    oAuthAccounts?: { provider: string }[];
  };
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const hasProvider = user.oAuthAccounts && user.oAuthAccounts.length > 0;

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      profileImage: user.profile || "",
    },
  });

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true);
    try {
      const result = await updateUserProfile({
        name: data.name,
        email: data.email,
        profile: data.profileImage,
      });

      if (result.emailVerificationRequired) {
        toast.info(
          "Un code de vérification a été envoyé à votre nouvelle adresse email"
        );
        setShowVerification(true);
      } else {
        toast.success("Profil mis à jour avec succès");
      }
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du profil");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      {!user.emailVerified && !hasProvider && (
        <div className="w-full p-2 flex items-center text-yellow-800 bg-amber-50/60">
          Votre adresse mail n&apos;est pas encore vérifiée
        </div>
      )}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        <div className="grid gap-4">
          <ProfileImageUpload
            user={user}
            onChange={(url) => form.setValue("profileImage", url)}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input placeholder="Votre nom" {...field} />
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
                <div className="flex justify-between items-center">
                  <FormLabel>Email</FormLabel>
                  {user.emailVerified ? (
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      Vérifié
                    </Badge>
                  ) : (
                    <Badge
                      variant={hasProvider ? "outline" : "destructive"}
                      className={
                        hasProvider
                          ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                          : ""
                      }
                    >
                      Non vérifié
                    </Badge>
                  )}
                </div>
                <FormControl>
                  <div className="flex gap-2">
                    <Input placeholder="votre@email.com" {...field} />
                    {!user.emailVerified && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="w-fit px-2"
                        onClick={() => {
                          if (field.value) {
                            resendVerificationEmail(field.value);
                            setShowVerification(true);
                            toast.success(
                              "Un code de vérification a été envoyé à votre adresse email"
                            );
                          }
                        }}
                      >
                        <Mail className="h-4 w-4" />{" "}
                        <span className="hidden md:block">Vérifier</span>
                      </Button>
                    )}
                  </div>
                </FormControl>
                <FormDescription>
                  Cet email sera utilisé pour vous connecter.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enregistrer les modifications
          </Button>
        </div>
      </form>

      <ProfileEmailVerification
        email={form.getValues().email}
        open={showVerification}
        onClose={() => setShowVerification(false)}
        onSuccess={() => {
          window.location.reload();
        }}
      />
    </Form>
  );
}
