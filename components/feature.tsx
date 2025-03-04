import { features } from "@/constants";
import { FeatureSteps } from "./feature-section";

export function Feature() {
  return (
    <div className="py-8">
      <FeatureSteps
        features={features}
        title="Your Journey Starts Here"
        autoPlayInterval={4000}
        imageHeight="h-[500px]"
      />
    </div>
  );
}
