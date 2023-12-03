import Header from "@/components/Header";
import { Metadata } from "next";
import { Analytics } from "@mui/icons-material";
import ManagePurchases from "@/components/purchase/ManagePurchases";

export const metadata: Metadata = {
  title: "Purchases | Medico",
};

const ManagePurchasesPage = () => {
  return (
    <>
      <Header
        icon={<Analytics sx={{ fontSize: 64 }} />}
        heading="Purchases"
        subHeading="Manage Purchases"
      />

      <ManagePurchases />
    </>
  );
};

export default ManagePurchasesPage;
