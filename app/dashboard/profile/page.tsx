import { ProfileForm } from "@/components/profile/profile-form";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileProviders } from "@/components/profile/profile-providers";
import { Separator } from "@/components/ui/separator";
import { getCurrentUser } from "@/core/current-user";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const user = await getCurrentUser({
    redirectIfNotFound: true,
    withFullUser: true,
  });

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="container max-w-4xl py-10">
      <ProfileHeader user={user} />

      <div className="grid gap-10 mt-8">
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
            Fournisseurs d'authentification
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
