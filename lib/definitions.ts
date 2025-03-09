import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string()
    .email({ message: "Veuillez entrer une adresse mail valide" }),
  password: z.string().min(8, {
    message: "Votre mot de passe doit contenir au moins 8 caractères",
  }),
});

export const signUpSchema = z.object({
  name: z.string().min(1, { message: "Veuillez entrer un nom" }),
  email: z
    .string()
    .email({ message: "Veuillez entrer une adresse mail valide" }),
  password: z.string().min(8, {
    message: "Votre mot de passe doit contenir au moins 8 caractères",
  }),
  terms: z.boolean().refine((value) => value === true, ""),
});
