import { UserType } from "@/components/app-sidebar";
import { Feature } from "@/components/feature";
import Hero from "@/components/hero";
import { Navbar } from "@/components/navbar";
import { Testimonials } from "@/components/testimonials";
import { getCurrentUser } from "@/core/current-user";

export default async function Home() {
  const fullUser = (await getCurrentUser({ withFullUser: true })) as UserType;

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center container mx-auto">
      <Navbar user={fullUser} />
      <Hero />
      <Feature />
      <Testimonials />
    </div>
  );
}
