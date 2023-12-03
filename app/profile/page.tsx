import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import Header from "@/components/Header";
import { Metadata } from "next";
import FormAdminProfile from "@/components/profile/FormAdminProfile";
import FormChangePassword from "@/components/profile/FormChangePassword";
import { siteURL } from "@/utils/defaults";
import { getServerSession } from "next-auth";
import { AdminProfileProps } from "@/utils/props";

export const metadata: Metadata = {
  title: "Admin Profile | Medico",
};

const ProfilePage = async () => {
  let admin: AdminProfileProps = {
      name: "",
      username: "",
      email: "",
      number: "",
      password: "",
      address: "",
    },
    errorMessage = "";
  const session = await getServerSession();

  try {
    const url = `${siteURL}/api/admins?email=${session?.user?.email}`;
    const response = await fetch(url);
    const json = await response.json();
    if (!json?.error) {
      admin = json?.admins[0];
    } else {
      errorMessage = json?.error;
    }
  } catch (error: any | unknown) {
    errorMessage = error.message;
  }

  return (
    <>
      <Header
        icon={<ManageAccountsIcon sx={{ fontSize: 64 }} />}
        heading="Admin Profile"
        subHeading="Edit Profile"
      />

      <FormAdminProfile currentAdmin={admin} errorMessage={errorMessage} />
      <FormChangePassword currentAdmin={admin} errorMessage={errorMessage} />
    </>
  );
};

export default ProfilePage;
