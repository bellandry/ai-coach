import { UserType } from "@/components/app-sidebar";
import { Navbar } from "@/components/navbar";
import { getCurrentUser } from "@/core/current-user";

export default async function Home() {
  const fullUser = (await getCurrentUser({ withFullUser: true })) as UserType;

  return (
    <div className="min-h-screen relative w-full bg-black flex flex-col items-center justify-center">
      <Navbar user={fullUser} />
    </div>
  );
}
