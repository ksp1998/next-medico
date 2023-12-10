import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import Header from "@/components/Header";
import { Metadata } from "next";
import FormAdminProfile from "@/components/profile/FormAdminProfile";
import FormChangePassword from "@/components/profile/FormChangePassword";
import { siteURL } from "@/utils/defaults";
import { getServerSession } from "next-auth";
import { AdminProfileProps } from "@/utils/props";
import { apiFetch } from "@/utils/functions";

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
  };
  const session = await getServerSession();

  const { data, notice } = await apiFetch(
    `${siteURL}/api/admins?email=${session?.user?.email}`,
    admin
  );

  admin = data.admins[0];

  return (
    <>
      <Header
        icon={<ManageAccountsIcon sx={{ fontSize: 64 }} />}
        heading="Admin Profile"
        subHeading="Edit Profile"
      />

      <FormAdminProfile currentAdmin={admin} initialNotice={notice} />
      <FormChangePassword currentAdmin={admin} initialNotice={notice} />
    </>
  );
};

export default ProfilePage;
