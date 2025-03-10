import ResetPasswordForm from "@/components/auth/reset-password-form";
import { redirect } from "next/navigation";

interface ResetPasswordPageProps {
  searchParams: {
    token?: string;
  };
}

export default function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const { token } = searchParams;

  if (!token) {
    redirect("/forgot-password");
  }

  return (
    <div>
      <ResetPasswordForm token={token} />
    </div>
  );
}
