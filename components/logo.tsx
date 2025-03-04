"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export const Logo = ({
  className,
  size,
}: {
  className?: string;
  size?: string;
}) => {
  return (
    <Link
      href="/"
      className={cn(
        "rounded-md py-3 px-1 font-normal w-fit flex space-x-2 items-center relative z-20",
        className && `${className}`
      )}
    >
      <div
        className={cn(
          "h-8 w-10 font-bold text-xl flex items-center justify-center bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0",
          size && `${size}`
        )}
      >
        AI.
      </div>
      <span className={cn(`font-semibold text-xl`, size && `${size}`)}>
        Coach
      </span>
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      href="/"
      className="font-normal flex space-x-2 items-center text-sm text-slate-900 py-1 relative z-20 w-full"
    >
      <Image
        src="/web-app-manifest-192x192.png"
        alt="logo AI coach"
        width={50}
        height={50}
        className="rounded-full"
      />
      <div className="h-8 w-full max-w-10 font-bold text-md flex items-center justify-center bg-slate-900 text-white dark:bg-white dark:text-black rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0">
        AI.
      </div>
    </Link>
  );
};
