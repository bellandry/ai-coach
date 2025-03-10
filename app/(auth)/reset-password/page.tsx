/* eslint-disable */

import ResetPasswordForm from "@/components/auth/reset-password-form";
import { redirect } from "next/navigation";

interface ResetPasswordPageProps {
  params: {};
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const token = searchParams.token as string | undefined;

  if (!token) {
    redirect("/forgot-password");
  }

  return (
    <div>
      <ResetPasswordForm token={token} />
    </div>
  );
}
