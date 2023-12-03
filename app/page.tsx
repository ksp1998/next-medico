import { Metadata } from "next";
import Header from "@/components/Header";
import DashboardStats from "@/components/dashboard/DashboardStats";
import DashboardCards from "@/components/dashboard/DashboardCards";
import { Dashboard } from "@mui/icons-material";

export const metadata: Metadata = {
  title: "Dashboard | Medico",
};

export default function Page() {
  return (
    <>
      <Header
        icon={<Dashboard sx={{ fontSize: 64 }} />}
        heading="Dashboard"
        subHeading="Home"
      />

      <DashboardStats />
      <DashboardCards />
    </>
  );
}
