import { UserType } from "@/components/app-sidebar";
import { Hero } from "@/components/hero";
import { Cta } from "@/components/marketing/cta";
import { Feature } from "@/components/marketing/feature";
import { Footer } from "@/components/marketing/footer-section";
import { Pricing } from "@/components/marketing/pricing";
import { PurposeSection } from "@/components/marketing/purpose-section";
import { Navbar } from "@/components/navbar";
import { getCurrentUser } from "@/core/current-user";

export default async function Home() {
  const fullUser = (await getCurrentUser({ withFullUser: true })) as UserType;

  return (
    <div className="min-h-screen w-full relative mx-0 flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute -top-60 -left-25 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-500/10 to-pink-500/10 rounded-full blur-[80px]" />
      <Navbar user={fullUser} />
      <Hero />
      <PurposeSection />
      <Feature />
      {/* <Testimonials /> */}
      <Pricing />
      <Cta />
      <Footer />
    </div>
  );
}
