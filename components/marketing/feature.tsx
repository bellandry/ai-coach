import { features } from "@/constants";
import { FeatureSteps } from "./feature-section";

export function Feature() {
  return (
    <section id="feature" className="py-8">
      <FeatureSteps
        features={features}
        title="Commet ça marche ?"
        autoPlayInterval={4000}
        imageHeight="h-[600px]"
      />
    </section>
  );
}
