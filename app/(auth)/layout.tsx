import { Logo } from "@/components/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full min-h-screen items-center justify-between">
      <div className="h-screen sticky left-0 top-0 bottom-0 hidden md:w-1/2 md:block bg-muted lg:w-3/5">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1625314887424-9f190599bd56")',
            backgroundSize: "cover",
            opacity: 0.9,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
        <Logo className="relative top-2 left-2 text-neutral-100" />
        <div className="flex flex-col gap-2 p-12 justify-end absolute bottom-0 left-0">
          <h2 className="text-4xl font-semibold">AI Coach</h2>
          <p className="text-muted-foreground text-md lg:text-lg">
            Visualisez, analysez automatiquement et améliorez votre carrière
            dans la tech.
          </p>
        </div>
      </div>
      <div className="w-full md:w-1/2 lg:w-2/5 flex flex-col items-center py-4 px-4 justify-center">
        {children}
      </div>
    </div>
  );
}
