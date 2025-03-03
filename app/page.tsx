import { UserType } from "@/components/app-sidebar";
import Hero from "@/components/hero";
import { Navbar } from "@/components/navbar";
import { getCurrentUser } from "@/core/current-user";

export default async function Home() {
  const fullUser = (await getCurrentUser({ withFullUser: true })) as UserType;

  return (
    <div className="flex flex-col items-center justify-center container mx-auto">
      <div className="min-h-screen relative flex flex-col items-center justify-center bg-black/[0.96] w-screen">
        <Navbar user={fullUser} />
        <Hero />
      </div>
    </div>
  );
}
