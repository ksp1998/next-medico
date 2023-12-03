import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import Login from "./Login";

export const metadata: Metadata = {
  title: "Login | Medico",
};

const LoginPage = async () => {
  const session = await getServerSession();
  if (session) {
    redirect("/");
  }

  return <Login />;
};

export default LoginPage;
