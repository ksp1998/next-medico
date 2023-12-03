import { Metadata } from "next";
import ForgotPassword from "./ForgotPassword";

export const metadata: Metadata = {
  title: "Forgot Password | Medico",
};

const ForgotPasswordPage = () => {
  return <ForgotPassword />;
};

export default ForgotPasswordPage;
