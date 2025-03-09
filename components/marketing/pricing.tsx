import { plans } from "@/constants";
import { PricingCard } from "./pricing-card";

export function Pricing() {
  return (
    <section
      id="pricing"
      className="container space-y-6 py-8 md:py-12 lg:py-24"
    >
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center mb-16">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-center">
          Plans tarifaires
        </h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          Choisissez le plan qui correspond à vos besoins
        </p>
      </div>
      <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
        {plans.map((plan, index) => (
          <PricingCard key={index} plan={plan} popular={index === 1} />
        ))}
      </div>
    </section>
  );
}
