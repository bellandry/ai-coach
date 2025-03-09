import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export function Cta() {
  return (
    <section id="cta" className="container space-y-6 py-8 md:py-12 lg:py-24">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center gap-4 text-center mb-16">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-10 text-center">
          Prêt à commencer ?
        </h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          Rejoignez des milliers de personnes qui profitent déjà de nos services
          et maximisez vos chances
        </p>
        <Button size="lg" className="mt-4" asChild>
          <Link href="/sign-in">
            Commencer maintenant <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
