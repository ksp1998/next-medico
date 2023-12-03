import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import Login from "./Login";
import dbConnection from "@/utils/dbConnection";
import Admin from "@/models/admin";

export const metadata: Metadata = {
  title: "Login | Medico",
};

const LoginPage = async () => {
  const session = await getServerSession();
  if (session) {
    redirect("/");
  }

  let adminCount = 0;
  try {
    await dbConnection();
    adminCount = await Admin.find({}).count();
  } catch (error: any | unknown) {
  } finally {
    if (adminCount === 0) {
      redirect("/setup");
    }
  }

  return <Login />;
};

export default LoginPage;
