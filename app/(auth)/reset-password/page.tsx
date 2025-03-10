import ResetPasswordForm from "@/components/auth/reset-password-form";
import { redirect } from "next/navigation";

interface ResetPasswordPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const token =
    typeof searchParams.token === "string" ? searchParams.token : undefined;

  if (!token) {
    redirect("/forgot-password");
  }

  return (
    <div>
      <ResetPasswordForm token={token} />
    </div>
  );
}
