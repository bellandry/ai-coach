import { PasswordForm } from "@/components/profile/password-form";
import { ProfileForm } from "@/components/profile/profile-form";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileProviders } from "@/components/profile/profile-providers";
import { TwoFactorAuth } from "@/components/profile/two-factor-auth";
import { Separator } from "@/components/ui/separator";
import { getCurrentUser } from "@/core/current-user";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const user = await getCurrentUser({
    redirectIfNotFound: true,
    withFullUser: true,
  });

  if (!user) {
    redirect("/sign-in");
  }

  // Vérifier si l'utilisateur a déjà un mot de passe
  const userWithPassword = await db.user.findUnique({
    where: { id: user.id },
    select: { password: true },
  });

  const hasPassword = !!userWithPassword?.password;

  // Vérifier si l'utilisateur a déjà activé l'authentification à deux facteurs
  const userWithTwoFactor = await db.user.findUnique({
    where: { id: user.id },
    select: { twoFactorEnabled: true },
  });

  const twoFactorEnabled = !!userWithTwoFactor?.twoFactorEnabled;

  return (
    <div className="container mx-auto px-4 md:px-8 pb-4">
      <ProfileHeader user={user} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-8">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Informations personnelles
          </h2>
          <p className="text-muted-foreground">
            Mettez à jour vos informations personnelles et votre photo de
            profil.
          </p>
          <Separator className="my-6" />
          <ProfileForm user={user} />
        </div>

        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Sécurité du compte
          </h2>
          <p className="text-muted-foreground">
            {hasPassword
              ? "Modifiez votre mot de passe pour sécuriser votre compte."
              : "Définissez un mot de passe pour pouvoir vous connecter sans fournisseur d'authentification."}
          </p>
          <Separator className="my-6" />
          <PasswordForm hasPassword={hasPassword} />
        </div>

        <div className="md:col-span-2">
          <h2 className="text-2xl font-semibold tracking-tight">
            Sécurité avancée
          </h2>
          <p className="text-muted-foreground">
            Configurez des options de sécurité supplémentaires pour protéger
            votre compte.
          </p>
          <Separator className="my-6" />
          <TwoFactorAuth enabled={twoFactorEnabled} />
        </div>

        <div className="md:col-span-2">
          <h2 className="text-2xl font-semibold tracking-tight">
            Fournisseurs d&apos;authentification
          </h2>
          <p className="text-muted-foreground">
            Gérez les services connectés à votre compte.
          </p>
          <Separator className="my-6" />
          <ProfileProviders user={user} />
        </div>
      </div>
    </div>
  );
}
