"use client";

import { testimonials } from "@/constants";
import { useState } from "react";
import { TestimonialCard } from "./ui/testimonial-cards";

export function Testimonials() {
  const [positions, setPositions] = useState(["front", "middle", "back"]);

  const handleShuffle = () => {
    const newPositions = [...positions];
    const lastElement = newPositions.pop();
    if (lastElement) {
      newPositions.unshift(lastElement);
    }
    setPositions(newPositions);
  };

  return (
    <div className="relative -ml-[100px] h-[450px] w-[350px] md:-ml-[175px]">
      {testimonials.map((testimonial, index) => (
        <TestimonialCard
          key={testimonial.id}
          {...testimonial}
          handleShuffle={handleShuffle}
          position={positions[index]}
        />
      ))}
    </div>
  );
}
