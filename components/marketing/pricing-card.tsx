"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import Link from "next/link";

interface PricingCardProps {
  plan: {
    name: string;
    price: string;
    description: string;
    features: string[];
  };
  popular?: boolean;
  className?: string;
}

export function PricingCard({ plan, popular, className }: PricingCardProps) {
  return (
    <Card
      className={cn(
        "relative flex flex-col transition-all hover:border-2 hover:border-primary",
        popular && "border-primary shadow-lg",
        className
      )}
    >
      {popular && (
        <div className="absolute -top-3 left-0 right-0 mx-auto w-fit rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground">
          Most Popular
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-xl">{plan.name}</CardTitle>
      </CardHeader>
      <CardContent className="grid flex-1 gap-4">
        <div className="space-y-2">
          <p className="text-2xl md:text-3xl font-bold">{plan.price}</p>
          <p className="text-sm text-muted-foreground">{plan.description}</p>
        </div>
        <ul className="grid gap-2 text-sm">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button className="w-full" size="lg" asChild>
          <Link href="/sign-up">Get Started</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
