import { Metadata } from "next";
import ForgotPassword from "./ForgotPassword";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Forgot Password | Medico",
};

const ForgotPasswordPage = async () => {
  const session = await getServerSession();
  if (session) {
    redirect("/profile#change-password");
  }
  return <ForgotPassword />;
};

export default ForgotPasswordPage;
