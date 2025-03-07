import { purposes } from "@/constants";

export const PurposeSection = () => {
  return (
    <section className="py-16 md:py-24 w-full overflow-hidden px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <p className="text-sm md:text-md text-purple-500/70 font-medium mb-2">
              ACCOMPLISSEZ PLUS
            </p>
            <h2 className="text-3xl md:w-4/5 w-full md:text-4xl font-bold">
              Profitez de la puissance de l&apos;IA pour booster votre carrière
            </h2>
          </div>
          <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 justify-between gap-8">
            {purposes.map((purpose, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="w-12 h-12 flex items-center justify-start rounded-lg">
                  {purpose.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    {purpose.title}
                  </h3>
                  <p className="text-muted-foreground">{purpose.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
