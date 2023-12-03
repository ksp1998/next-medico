import { Metadata } from "next";
import { redirect } from "next/navigation";
import Admin from "@/models/admin";
import dbConnection from "@/utils/dbConnection";
import { getServerSession } from "next-auth";
import Setup from "./Setup";

export const metadata: Metadata = {
  title: "Setup | Medico",
};

const SetupPage = async () => {
  const session = await getServerSession();
  if (session) {
    redirect("/");
  }

  let adminCount = 0;
  try {
    // const response = await (await fetch(`${siteURL}/api/admins`)).json();
    await dbConnection();
    adminCount = await Admin.find({}).count();
  } catch (error: any | unknown) {
  } finally {
    if (adminCount > 0) {
      redirect("/login");
    }
  }

  return <Setup />;
};

export default SetupPage;
